#!/usr/bin/env python3
import argparse
import datetime as dt
import hashlib
import json
import re
import zipfile
from pathlib import Path


def now_dt():
    return dt.datetime.now(dt.timezone.utc)


def now():
    return now_dt().replace(microsecond=0).isoformat().replace('+00:00', 'Z')


def parse_ts(value):
    if not value:
        return None
    s = str(value).strip()
    if s.endswith('Z'):
        s = s[:-1] + '+00:00'
    try:
        d = dt.datetime.fromisoformat(s)
        if d.tzinfo is None:
            d = d.replace(tzinfo=dt.timezone.utc)
        return d.astimezone(dt.timezone.utc)
    except Exception:
        return None


def sha256_file(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def read_jsonl(path):
    if not path.exists():
        return []
    return [json.loads(x) for x in path.read_text(encoding='utf-8').splitlines() if x.strip()]


def write_jsonl(path, records):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(''.join(json.dumps(r, ensure_ascii=False, sort_keys=True) + '\n' for r in records), encoding='utf-8')


def quarter_name(d):
    q = (d.month - 1) // 3 + 1
    return f'{d.year}-Q{q}'


def next_archive_path(archive_dir, quarter):
    pat = re.compile(re.escape(quarter) + r'-part-(\d{3})\.zip$')
    nums = []
    for p in archive_dir.glob(f'{quarter}-part-*.zip'):
        m = pat.match(p.name)
        if m:
            nums.append(int(m.group(1)))
    return archive_dir / f'{quarter}-part-{(max(nums) + 1) if nums else 1:03d}.zip'


def main():
    p = argparse.ArgumentParser(description='Move old raw conversation sessions into verified append-only archive ZIPs.')
    p.add_argument('package_dir')
    p.add_argument('--days', type=int, default=90)
    p.add_argument('--as-of', help='ISO timestamp for deterministic testing; defaults to now')
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()

    root = Path(args.package_dir).resolve()
    conv = root / 'conversations'
    index_path = conv / 'index.jsonl'
    archive_dir = conv / 'archive'
    archive_dir.mkdir(parents=True, exist_ok=True)
    records = read_jsonl(index_path)
    as_of = parse_ts(args.as_of) if args.as_of else now_dt()
    if as_of is None:
        raise SystemExit('invalid --as-of timestamp')
    cutoff = as_of - dt.timedelta(days=args.days)

    eligible = []
    for i, rec in enumerate(records):
        if rec.get('storage_state') != 'active':
            continue
        age_ts = parse_ts(rec.get('ended_at')) or parse_ts(rec.get('started_at')) or parse_ts(rec.get('captured_at'))
        if age_ts is None or age_ts >= cutoff:
            continue
        sid = rec.get('session_id')
        session_dir = conv / 'active' / str(sid)
        raw_path = session_dir / 'raw.md'
        session_json = session_dir / 'session.json'
        if not raw_path.exists() or not session_json.exists():
            raise SystemExit(f'cannot archive {sid}: active raw/session file missing')
        actual_raw_hash = sha256_file(raw_path)
        if rec.get('raw_sha256') and actual_raw_hash != rec.get('raw_sha256'):
            raise SystemExit(f'cannot archive {sid}: raw hash mismatch')
        eligible.append((i, rec, age_ts, session_dir, raw_path, session_json))

    if args.dry_run:
        print(json.dumps({'eligible': [x[1].get('session_id') for x in eligible], 'count': len(eligible), 'cutoff': cutoff.isoformat()}, indent=2))
        return

    by_quarter = {}
    for item in eligible:
        by_quarter.setdefault(quarter_name(item[2]), []).append(item)

    changelog_path = root / 'history' / 'changelog.jsonl'
    changelog = read_jsonl(changelog_path)
    archived = []

    for quarter, items in sorted(by_quarter.items()):
        archive_path = next_archive_path(archive_dir, quarter)
        with zipfile.ZipFile(archive_path, 'w', compression=zipfile.ZIP_DEFLATED) as z:
            for _, rec, _, session_dir, _, _ in items:
                sid = rec['session_id']
                for f in sorted(x for x in session_dir.rglob('*') if x.is_file()):
                    z.write(f, arcname=f'{sid}/{f.relative_to(session_dir).as_posix()}')
        archive_hash = sha256_file(archive_path)
        with zipfile.ZipFile(archive_path, 'r') as z:
            names = set(z.namelist())
            for _, rec, _, _, _, _ in items:
                sid = rec['session_id']
                if f'{sid}/raw.md' not in names or f'{sid}/session.json' not in names:
                    raise SystemExit(f'archive verification failed for {sid}')

        rel_archive = archive_path.relative_to(root).as_posix()
        for idx, rec, _, session_dir, _, _ in items:
            updated = dict(rec)
            updated['storage_state'] = 'archived'
            updated['archive_path'] = rel_archive
            updated['archive_sha256'] = archive_hash
            updated['active_path'] = None
            updated['archived_at'] = now()
            records[idx] = updated
            for f in sorted((x for x in session_dir.rglob('*') if x.is_file()), reverse=True):
                f.unlink()
            for d in sorted((x for x in session_dir.rglob('*') if x.is_dir()), reverse=True):
                d.rmdir()
            session_dir.rmdir()
            changelog.append({
                'id': f'urn:kgp:change:{len(changelog)+1:08d}',
                'timestamp': now(),
                'operation': 'archive_conversation',
                'target_file': 'conversations/index.jsonl',
                'target_id': rec.get('id'),
                'reason': f'Raw conversation exceeded {args.days}-day active retention; moved to verified archive, not deleted',
                'archive_path': rel_archive,
                'archive_sha256': archive_hash,
                'raw_sha256': rec.get('raw_sha256'),
            })
            archived.append(rec['session_id'])

    write_jsonl(index_path, records)
    write_jsonl(changelog_path, changelog)
    print(json.dumps({'archived': archived, 'count': len(archived), 'retention_days': args.days}, indent=2))


if __name__ == '__main__':
    main()
