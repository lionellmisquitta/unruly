#!/usr/bin/env python3
import argparse
import datetime as dt
import hashlib
import json
import mimetypes
import re
import shutil
from pathlib import Path

SENSITIVE_NAME = re.compile(r'(password|passwd|secret|credential|token|private[-_ ]?key|api[-_ ]?key)', re.I)
SECRET_TEXT = re.compile(r'(BEGIN [A-Z ]*PRIVATE KEY|api[_-]?key\s*[:=]|secret\s*[:=]|password\s*[:=])', re.I)
SENSITIVE_EXT = {'.pem', '.key', '.pfx', '.p12', '.env', '.kdbx'}
SHEET_EXT = {'.xlsx', '.xls', '.xlsm', '.csv', '.tsv', '.ods'}
DOC_EXT = {'.docx', '.doc', '.pdf', '.pptx', '.ppt', '.txt', '.md', '.rtf'}
CODE_EXT = {'.py', '.js', '.ts', '.tsx', '.jsx', '.java', '.cs', '.cpp', '.c', '.h', '.sql', '.ps1', '.sh', '.yaml', '.yml', '.json', '.xml'}
IMAGE_EXT = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.tif', '.tiff'}


def now():
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')


def sha256(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def category(path):
    ext = path.suffix.lower()
    if ext in SHEET_EXT: return 'spreadsheets'
    if ext in DOC_EXT: return 'documents'
    if ext in CODE_EXT: return 'code'
    if ext in IMAGE_EXT: return 'images'
    return 'other'


def likely_sensitive(path):
    reasons = []
    if path.suffix.lower() in SENSITIVE_EXT:
        reasons.append('sensitive file extension')
    if SENSITIVE_NAME.search(path.name):
        reasons.append('sensitive filename pattern')
    try:
        if path.stat().st_size <= 5 * 1024 * 1024:
            sample = path.read_bytes()[:131072].decode('utf-8', errors='ignore')
            if SECRET_TEXT.search(sample):
                reasons.append('secret-like text pattern')
    except Exception:
        pass
    return reasons


def expand(paths):
    out = []
    for raw in paths:
        p = Path(raw).resolve()
        if p.is_dir():
            out.extend(x for x in p.rglob('*') if x.is_file())
        elif p.is_file():
            out.append(p)
        else:
            raise SystemExit(f'source path not found: {raw}')
    return sorted(set(out))


def read_inventory(path):
    if not path.exists(): return []
    return [json.loads(x) for x in path.read_text(encoding='utf-8').splitlines() if x.strip()]


def write_inventory(path, records):
    path.write_text(''.join(json.dumps(r, ensure_ascii=False, sort_keys=True) + '\n' for r in records), encoding='utf-8')


def main():
    p = argparse.ArgumentParser(description='Inventory and optionally copy source files into a KGP.')
    p.add_argument('package_dir')
    p.add_argument('sources', nargs='+')
    p.add_argument('--dry-run', action='store_true', help='Detect/hash/classify only; do not copy or update inventory')
    p.add_argument('--origin', default='local/runtime')
    args = p.parse_args()

    root = Path(args.package_dir).resolve()
    files = expand(args.sources)
    results = []
    for src in files:
        digest = sha256(src)
        cat = category(src)
        sensitivity = likely_sensitive(src)
        package_path = f'evidence/originals/{cat}/{src.name}'
        dst = root / package_path
        if dst.exists() and sha256(dst) != digest:
            package_path = f'evidence/originals/{cat}/{src.stem}-{digest[:8]}{src.suffix}'
            dst = root / package_path
        rec = {
            'id': f'urn:kgp:source:{digest[:24]}',
            'original_name': src.name,
            'origin': args.origin,
            'source_path': str(src),
            'included': not args.dry_run,
            'package_path': package_path if not args.dry_run else None,
            'sha256': digest,
            'size_bytes': src.stat().st_size,
            'media_type': mimetypes.guess_type(src.name)[0] or 'application/octet-stream',
            'category': cat,
            'likely_sensitive': bool(sensitivity),
            'sensitivity_reasons': sensitivity,
            'created_at': now()
        }
        if not args.dry_run:
            dst.parent.mkdir(parents=True, exist_ok=True)
            if not dst.exists():
                shutil.copy2(src, dst)
        results.append(rec)

    if not args.dry_run:
        inv_path = root / 'evidence/source_inventory.jsonl'
        existing = read_inventory(inv_path)
        by_id = {r['id']: r for r in existing if r.get('id')}
        for r in results:
            by_id[r['id']] = r
        write_inventory(inv_path, list(by_id.values()))

    print(json.dumps({
        'dry_run': args.dry_run,
        'files': len(results),
        'total_bytes': sum(r['size_bytes'] for r in results),
        'likely_sensitive_files': [r['original_name'] for r in results if r['likely_sensitive']],
        'records': results
    }, indent=2))


if __name__ == '__main__':
    main()
