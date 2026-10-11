#!/usr/bin/env python3
import argparse
import datetime as dt
import hashlib
import json
from pathlib import Path

BASE_REQUIRED = [
    'README-FIRST.md', 'GRAPH_PROTOCOL.md', 'HANDOVER.md', 'manifest.json', 'ontology.yaml',
    'graph/entities.jsonl', 'graph/relationships.jsonl',
    'knowledge/confirmed.jsonl', 'knowledge/tribal_knowledge.jsonl', 'knowledge/tactical.jsonl',
    'knowledge/decisions.jsonl', 'knowledge/ideas.jsonl', 'knowledge/contradictions.jsonl',
    'knowledge/unknowns.jsonl', 'evidence/evidence.jsonl', 'evidence/source_inventory.jsonl',
    'history/changelog.jsonl'
]
CANONICAL_BASE = [p for p in BASE_REQUIRED if p.endswith('.jsonl') and not p.startswith('history/')]


def read_jsonl(path, errors):
    records = []
    if not path.exists():
        return records
    for i, line in enumerate(path.read_text(encoding='utf-8').splitlines(), 1):
        if not line.strip():
            continue
        try:
            obj = json.loads(line)
            if not isinstance(obj, dict):
                errors.append(f'{path}: line {i} is not an object')
            else:
                records.append((i, obj))
        except Exception as e:
            errors.append(f'{path}: line {i} invalid JSON: {e}')
    return records


def sha256_file(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


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


def main():
    p = argparse.ArgumentParser(description='Validate a Knowledge Graph Package.')
    p.add_argument('package_dir')
    args = p.parse_args()
    root = Path(args.package_dir).resolve()
    errors, warnings = [], []

    manifest = {}
    try:
        manifest = json.loads((root / 'manifest.json').read_text(encoding='utf-8')) if (root / 'manifest.json').exists() else {}
        if manifest and manifest.get('format') != 'KGP':
            errors.append('manifest.json: format must be KGP')
    except Exception as e:
        errors.append(f'manifest.json invalid JSON: {e}')

    version = int(manifest.get('format_version') or 1) if manifest else 1
    required = list(BASE_REQUIRED)
    if version >= 2:
        required.append('conversations/index.jsonl')

    for rel in required:
        if not (root / rel).exists():
            errors.append(f'missing required file: {rel}')

    canonical = list(CANONICAL_BASE)
    if version >= 2:
        canonical.append('conversations/index.jsonl')

    records_by_file = {}
    ids = {}
    for rel in canonical:
        recs = read_jsonl(root / rel, errors)
        records_by_file[rel] = recs
        for line, rec in recs:
            rid = rec.get('id')
            if not rid:
                errors.append(f'{rel}: line {line} missing id')
            elif rid in ids:
                errors.append(f'duplicate id {rid}: {ids[rid]} and {rel}:{line}')
            else:
                ids[rid] = f'{rel}:{line}'

    entity_ids = set()
    for line, rec in records_by_file.get('graph/entities.jsonl', []):
        for key in ['id', 'entity_type', 'name', 'created_at', 'updated_at']:
            if not rec.get(key):
                errors.append(f'graph/entities.jsonl:{line} missing {key}')
        if rec.get('id'):
            entity_ids.add(rec['id'])

    for line, rec in records_by_file.get('graph/relationships.jsonl', []):
        for key in ['id', 'from', 'relationship_type', 'to', 'created_at', 'updated_at']:
            if not rec.get(key):
                errors.append(f'graph/relationships.jsonl:{line} missing {key}')
        if rec.get('from') not in entity_ids:
            errors.append(f'graph/relationships.jsonl:{line} unresolved from endpoint: {rec.get("from")}')
        if rec.get('to') not in entity_ids:
            errors.append(f'graph/relationships.jsonl:{line} unresolved to endpoint: {rec.get("to")}')

    evidence_ids = {rec.get('id') for _, rec in records_by_file.get('evidence/evidence.jsonl', []) if rec.get('id')}
    for rel, recs in records_by_file.items():
        if rel == 'conversations/index.jsonl':
            continue
        for line, rec in recs:
            for ev in rec.get('evidence_refs', []) or []:
                if ev not in evidence_ids:
                    errors.append(f'{rel}:{line} unresolved evidence_ref: {ev}')

    for line, rec in records_by_file.get('knowledge/confirmed.jsonl', []):
        for key in ['id', 'kind', 'statement', 'created_at', 'updated_at', 'epistemic_status']:
            if not rec.get(key):
                errors.append(f'knowledge/confirmed.jsonl:{line} missing {key}')
        status = rec.get('epistemic_status')
        if status not in {'observed', 'human_confirmed'}:
            errors.append(f'knowledge/confirmed.jsonl:{line} invalid epistemic_status {status!r}')
        if status == 'observed' and not rec.get('evidence_refs'):
            errors.append(f'knowledge/confirmed.jsonl:{line} observed record requires evidence_refs')
        if status == 'human_confirmed':
            for key in ['confirmed_by', 'confirmed_at', 'confirmation_basis']:
                if not rec.get(key):
                    errors.append(f'knowledge/confirmed.jsonl:{line} human_confirmed requires {key}')

    if version >= 2:
        seen_sessions = set()
        cutoff = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=90)
        for line, rec in records_by_file.get('conversations/index.jsonl', []):
            for key in ['id', 'session_id', 'captured_at', 'storage_state']:
                if not rec.get(key):
                    errors.append(f'conversations/index.jsonl:{line} missing {key}')
            sid = rec.get('session_id')
            if sid in seen_sessions:
                errors.append(f'conversations/index.jsonl:{line} duplicate session_id {sid}')
            seen_sessions.add(sid)
            if rec.get('trust') not in {None, 'supporting_conversation_only_not_canonical_truth'}:
                warnings.append(f'conversations/index.jsonl:{line} unexpected trust marker {rec.get("trust")!r}')
            state = rec.get('storage_state')
            if state == 'active':
                ap = rec.get('active_path')
                if not ap:
                    errors.append(f'conversations/index.jsonl:{line} active session missing active_path')
                else:
                    raw = root / ap
                    if not raw.exists():
                        errors.append(f'conversations/index.jsonl:{line} active raw file missing: {ap}')
                    elif rec.get('raw_sha256') and sha256_file(raw) != rec.get('raw_sha256'):
                        errors.append(f'conversations/index.jsonl:{line} raw hash mismatch: {ap}')
                age = parse_ts(rec.get('ended_at')) or parse_ts(rec.get('started_at')) or parse_ts(rec.get('captured_at'))
                if age and age < cutoff:
                    warnings.append(f'conversation {sid} is older than 90 days and still active; archive during an approved maintenance/update pass')
            elif state == 'archived':
                zp = rec.get('archive_path')
                if not zp:
                    errors.append(f'conversations/index.jsonl:{line} archived session missing archive_path')
                else:
                    zf = root / zp
                    if not zf.exists():
                        errors.append(f'conversations/index.jsonl:{line} archive missing: {zp}')
                    elif rec.get('archive_sha256') and sha256_file(zf) != rec.get('archive_sha256'):
                        errors.append(f'conversations/index.jsonl:{line} archive hash mismatch: {zp}')
                if rec.get('active_path'):
                    warnings.append(f'conversations/index.jsonl:{line} archived session should normally clear active_path')
            else:
                errors.append(f'conversations/index.jsonl:{line} invalid storage_state {state!r}')

    read_jsonl(root / 'history/changelog.jsonl', errors)
    if (root / 'ontology.yaml').exists() and not (root / 'ontology.yaml').read_text(encoding='utf-8').strip():
        errors.append('ontology.yaml is empty')
    if not records_by_file.get('evidence/source_inventory.jsonl'):
        warnings.append('source inventory is empty')
    if version == 1:
        warnings.append('KGP format v1: conversation isolation/retention structure is not present; upgrade lazily when conversation capture is needed')

    result = {
        'valid': not errors,
        'format_version': version,
        'errors': errors,
        'warnings': warnings,
        'record_counts': {rel: len(recs) for rel, recs in records_by_file.items()},
        'unique_ids': len(ids)
    }
    print(json.dumps(result, indent=2))
    raise SystemExit(0 if not errors else 1)


if __name__ == '__main__':
    main()
