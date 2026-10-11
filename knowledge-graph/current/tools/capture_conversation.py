#!/usr/bin/env python3
import argparse
import datetime as dt
import hashlib
import json
import shutil
from pathlib import Path


def now():
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')


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


def main():
    p = argparse.ArgumentParser(description='Append an immutable raw conversation session to a KGP workspace.')
    p.add_argument('package_dir')
    p.add_argument('--session-id', required=True)
    p.add_argument('--raw-file', required=True, help='Exact exported/raw conversation text file')
    p.add_argument('--topic')
    p.add_argument('--provider')
    p.add_argument('--model')
    p.add_argument('--participants', nargs='*', default=[])
    p.add_argument('--started-at')
    p.add_argument('--ended-at')
    p.add_argument('--previous-kgp-version')
    p.add_argument('--source-locator')
    args = p.parse_args()

    root = Path(args.package_dir).resolve()
    raw = Path(args.raw_file).resolve()
    if not raw.exists() or not raw.is_file():
        raise SystemExit(f'raw conversation file not found: {raw}')

    sid = args.session_id.strip()
    if not sid or '/' in sid or '\\' in sid or sid in {'.', '..'}:
        raise SystemExit('session-id must be a simple path-safe identifier')

    conv_root = root / 'conversations'
    active_dir = conv_root / 'active' / sid
    index_path = conv_root / 'index.jsonl'
    extraction_path = conv_root / 'extractions' / f'{sid}.jsonl'
    session_path = active_dir / 'session.json'
    raw_path = active_dir / 'raw.md'

    conv_root.mkdir(parents=True, exist_ok=True)
    (conv_root / 'active').mkdir(parents=True, exist_ok=True)
    (conv_root / 'archive').mkdir(parents=True, exist_ok=True)
    (conv_root / 'extractions').mkdir(parents=True, exist_ok=True)
    if not index_path.exists():
        index_path.write_text('', encoding='utf-8')

    records = read_jsonl(index_path)
    existing = next((r for r in records if r.get('session_id') == sid), None)
    incoming_hash = sha256_file(raw)
    if existing:
        if existing.get('raw_sha256') == incoming_hash:
            print(json.dumps({'status': 'already_captured', 'session_id': sid, 'raw_sha256': incoming_hash}, indent=2))
            return
        raise SystemExit(f'append-only protection: session {sid} already exists with a different raw hash')

    active_dir.mkdir(parents=True, exist_ok=False)
    shutil.copyfile(raw, raw_path)
    captured = now()
    session = {
        'session_id': sid,
        'topic': args.topic,
        'provider': args.provider,
        'model': args.model,
        'participants': args.participants,
        'started_at': args.started_at,
        'ended_at': args.ended_at,
        'captured_at': captured,
        'source_locator': args.source_locator,
        'raw_file': 'raw.md',
        'raw_sha256': incoming_hash,
        'trust': 'supporting_conversation_only_not_canonical_truth',
        'immutable': True,
    }
    session_path.write_text(json.dumps(session, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    if not extraction_path.exists():
        extraction_path.write_text('', encoding='utf-8')

    record = {
        'id': f'urn:kgp:conversation:{sid}',
        'session_id': sid,
        'topic': args.topic,
        'provider': args.provider,
        'model': args.model,
        'participants': args.participants,
        'started_at': args.started_at,
        'ended_at': args.ended_at,
        'captured_at': captured,
        'storage_state': 'active',
        'active_path': f'conversations/active/{sid}/raw.md',
        'archive_path': None,
        'raw_sha256': incoming_hash,
        'archive_sha256': None,
        'extraction_status': 'pending',
        'previous_kgp_version': args.previous_kgp_version,
        'resulting_kgp_version': None,
        'derived_record_refs': [],
        'source_locator': args.source_locator,
        'raw_available': True,
        'trust': 'supporting_conversation_only_not_canonical_truth',
    }
    records.append(record)
    write_jsonl(index_path, records)

    changelog_path = root / 'history' / 'changelog.jsonl'
    changelog = read_jsonl(changelog_path)
    changelog.append({
        'id': f'urn:kgp:change:{len(changelog)+1:08d}',
        'timestamp': captured,
        'operation': 'capture_conversation',
        'target_file': 'conversations/index.jsonl',
        'target_id': record['id'],
        'reason': 'Append-only raw conversation capture; not a canonical truth promotion',
        'raw_sha256': incoming_hash,
    })
    write_jsonl(changelog_path, changelog)
    print(json.dumps({'status': 'captured', 'session_id': sid, 'raw_sha256': incoming_hash, 'path': str(raw_path)}, indent=2))


if __name__ == '__main__':
    main()
