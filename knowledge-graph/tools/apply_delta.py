#!/usr/bin/env python3
import argparse
import datetime as dt
import hashlib
import json
from pathlib import Path

ALLOWED_PREFIXES = ('graph/', 'knowledge/', 'evidence/')
PROTECTED = {'knowledge/confirmed.jsonl', 'evidence/evidence.jsonl', 'evidence/source_inventory.jsonl'}


def now():
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')


def obj_hash(obj):
    return hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def read_jsonl(path):
    if not path.exists():
        return []
    return [json.loads(x) for x in path.read_text(encoding='utf-8').splitlines() if x.strip()]


def write_jsonl(path, records):
    path.parent.mkdir(parents=True, exist_ok=True)
    text = ''.join(json.dumps(r, ensure_ascii=False, sort_keys=True) + '\n' for r in records)
    path.write_text(text, encoding='utf-8')


def main():
    p = argparse.ArgumentParser(description='Apply deterministic KGP deltas and append changelog events.')
    p.add_argument('package_dir')
    p.add_argument('delta_jsonl')
    p.add_argument('--allow-delete', action='store_true')
    p.add_argument('--allow-protected-delete', action='store_true')
    args = p.parse_args()

    root = Path(args.package_dir).resolve()
    deltas = read_jsonl(Path(args.delta_jsonl))
    changelog_path = root / 'history/changelog.jsonl'
    changelog = read_jsonl(changelog_path)

    for d in deltas:
        op = d.get('op')
        target = d.get('target', '')
        reason = d.get('reason')
        if not reason:
            raise SystemExit(f'delta missing reason: {d}')
        if not target.endswith('.jsonl') or not target.startswith(ALLOWED_PREFIXES):
            raise SystemExit(f'disallowed target: {target}')
        path = root / target
        records = read_jsonl(path)
        idx = {r.get('id'): i for i, r in enumerate(records) if r.get('id')}
        before = None
        after = None
        target_id = d.get('id') or (d.get('record') or {}).get('id')

        if op == 'upsert':
            rec = dict(d.get('record') or {})
            if not rec.get('id'):
                raise SystemExit('upsert requires record.id')
            rec.setdefault('created_at', now())
            rec['updated_at'] = now()
            if rec['id'] in idx:
                before = records[idx[rec['id']]]
                rec['created_at'] = before.get('created_at', rec['created_at'])
                records[idx[rec['id']]] = rec
            else:
                records.append(rec)
            after = rec
        elif op == 'update':
            rid = d.get('id')
            if rid not in idx:
                raise SystemExit(f'update target not found: {rid}')
            before = dict(records[idx[rid]])
            rec = dict(before)
            rec.update(d.get('set') or {})
            rec['updated_at'] = now()
            records[idx[rid]] = rec
            after = rec
        elif op == 'delete':
            rid = d.get('id')
            if not args.allow_delete:
                raise SystemExit('hard delete requires --allow-delete')
            if target in PROTECTED and not args.allow_protected_delete:
                raise SystemExit(f'protected hard delete requires --allow-protected-delete: {target}')
            if rid not in idx:
                raise SystemExit(f'delete target not found: {rid}')
            before = records[idx[rid]]
            del records[idx[rid]]
        else:
            raise SystemExit(f'unsupported op: {op}')

        write_jsonl(path, records)
        event = {
            'id': f'urn:kgp:change:{len(changelog)+1:08d}',
            'timestamp': now(),
            'operation': op,
            'target_file': target,
            'target_id': target_id,
            'reason': reason,
            'before_sha256': obj_hash(before) if before is not None else None,
            'after_sha256': obj_hash(after) if after is not None else None,
            'tombstone': before if op == 'delete' else None
        }
        changelog.append(event)

    write_jsonl(changelog_path, changelog)
    print(json.dumps({'applied': len(deltas), 'changelog_entries': len(changelog)}, indent=2))


if __name__ == '__main__':
    main()
