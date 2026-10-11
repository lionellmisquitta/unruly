#!/usr/bin/env python3
import argparse
import datetime as dt
import hashlib
import json
import shutil
from pathlib import Path


def now():
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')


def slug(s):
    s = ''.join(c.lower() if c.isalnum() else '-' for c in str(s))
    while '--' in s:
        s = s.replace('--', '-')
    return s.strip('-') or 'item'


def write_jsonl(path: Path, rows, append=False):
    path.parent.mkdir(parents=True, exist_ok=True)
    mode = 'a' if append else 'w'
    with path.open(mode, encoding='utf-8') as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + '\n')


def load_jsonl(path: Path):
    if not path.exists():
        return []
    return [json.loads(x) for x in path.read_text(encoding='utf-8').splitlines() if x.strip()]


def map_relation(rel):
    r = (rel or '').strip().lower()
    mapping = {
        'calls': 'CALLS',
        'imports': 'IMPORTS',
        'imports_from': 'IMPORTS_FROM',
        'contains': 'CONTAINS',
        'method': 'HAS_METHOD',
        'uses': 'USES',
        'inherits': 'INHERITS_FROM',
        'implements': 'IMPLEMENTS',
        'reads': 'READS_FROM',
        'writes': 'WRITES_TO',
    }
    return mapping.get(r, r.upper().replace(' ', '_') or 'RELATES_TO')


def classify_node(n):
    label = str(n.get('label', ''))
    src = str(n.get('source_file', ''))
    if label.endswith(('.py','.js','.ts','.tsx','.jsx','.java','.cs','.cpp','.c','.go','.rs','.php','.rb','.swift','.kt','.scala','.sh','.ps1','.sql')):
        return 'SourceFile'
    if src and label == Path(src).name:
        return 'SourceFile'
    return 'CodeArtifact'


def main():
    ap = argparse.ArgumentParser(description='Import Graphify graph.json into an existing KGP workspace.')
    ap.add_argument('graph_json')
    ap.add_argument('kgp_dir')
    ap.add_argument('--copy-raw', action='store_true', default=True)
    ap.add_argument('--no-copy-raw', dest='copy_raw', action='store_false')
    ap.add_argument('--append', action='store_true', help='Append instead of replacing graph entities/relationships')
    args = ap.parse_args()

    graph_path = Path(args.graph_json).resolve()
    root = Path(args.kgp_dir).resolve()
    data = json.loads(graph_path.read_text(encoding='utf-8'))
    ts = now()

    raw_dir = root / 'derived' / 'graphify'
    raw_dir.mkdir(parents=True, exist_ok=True)
    if args.copy_raw:
        shutil.copy2(graph_path, raw_dir / 'graph.json')

    source_hash = hashlib.sha256(graph_path.read_bytes()).hexdigest()
    metadata = {
        'adapter': 'graph-generator/import_graphify.py',
        'imported_at': ts,
        'source_file': graph_path.name,
        'source_sha256': source_hash,
        'node_count': len(data.get('nodes', [])),
        'relationship_count': len(data.get('links', [])),
        'directed': data.get('directed'),
        'multigraph': data.get('multigraph'),
        'trust_rule': 'Graphify EXTRACTED structural edges are deterministic source evidence; INFERRED edges remain inferred and are never promoted to confirmed solely by this import.'
    }
    (raw_dir / 'metadata.json').write_text(json.dumps(metadata, indent=2) + '\n', encoding='utf-8')

    entities = []
    evidence = []
    id_map = {}
    for n in data.get('nodes', []):
        src_id = str(n.get('id'))
        kid = f'urn:kgp:graphify:{slug(src_id)}'
        id_map[src_id] = kid
        locator = ':'.join(x for x in [str(n.get('source_file') or ''), str(n.get('source_location') or '')] if x)
        evid = f'urn:kgp:evidence:graphify-node:{slug(src_id)}'
        evidence.append({
            'id': evid,
            'source_id': 'urn:kgp:source:graphify-import',
            'locator': locator or f'graphify node {src_id}',
            'extraction_method': 'graphify_ast' if n.get('_origin') == 'ast' else 'graphify',
            'created_at': ts,
            'supports': [kid],
            'notes': 'Imported from Graphify graph.json; source file/line locator preserved when supplied.'
        })
        attrs = {k:v for k,v in n.items() if k not in {'id','label','source_file','source_location'}}
        attrs['graphify_id'] = src_id
        attrs['graphify_source_file'] = n.get('source_file')
        attrs['graphify_source_location'] = n.get('source_location')
        entities.append({
            'id': kid,
            'entity_type': classify_node(n),
            'name': n.get('label') or src_id,
            'created_at': ts,
            'updated_at': ts,
            'status': 'active',
            'attributes': attrs,
            'evidence_refs': [evid]
        })

    rels = []
    confirmed = []
    ideas = []
    for i, r in enumerate(data.get('links', []), 1):
        src = id_map.get(str(r.get('source')))
        tgt = id_map.get(str(r.get('target')))
        if not src or not tgt:
            continue
        conf = str(r.get('confidence') or 'UNKNOWN').upper()
        rid = f'urn:kgp:graphify-rel:{i:05d}:{slug(r.get("source"))}:{slug(r.get("relation"))}:{slug(r.get("target"))}'
        evid = f'urn:kgp:evidence:graphify-rel:{i:05d}'
        locator = ':'.join(x for x in [str(r.get('source_file') or ''), str(r.get('source_location') or '')] if x)
        evidence.append({
            'id': evid,
            'source_id': 'urn:kgp:source:graphify-import',
            'locator': locator or f'graphify relationship {i}',
            'extraction_method': 'graphify_ast' if r.get('_origin') == 'ast' else 'graphify',
            'created_at': ts,
            'supports': [rid],
            'notes': f'Graphify confidence={conf}; score={r.get("confidence_score")}'
        })
        attrs = {k:v for k,v in r.items() if k not in {'source','target','relation'}}
        attrs['source_confidence'] = conf
        rel = {
            'id': rid,
            'from': src,
            'relationship_type': map_relation(r.get('relation')),
            'to': tgt,
            'created_at': ts,
            'updated_at': ts,
            'status': 'active',
            'epistemic_status': 'observed' if conf == 'EXTRACTED' else 'inferred',
            'attributes': attrs,
            'evidence_refs': [evid]
        }
        rels.append(rel)
        statement = f'{r.get("source")} {map_relation(r.get("relation"))} {r.get("target")}'
        if conf == 'EXTRACTED':
            confirmed.append({
                'id': f'urn:kgp:confirmed:graphify-rel:{i:05d}',
                'kind': 'structural_relationship',
                'statement': statement,
                'subject_refs': [src, tgt, rid],
                'epistemic_status': 'observed',
                'evidence_refs': [evid],
                'created_at': ts,
                'updated_at': ts
            })
        else:
            ideas.append({
                'id': f'urn:kgp:idea:graphify-rel:{i:05d}',
                'kind': 'structural_inference',
                'statement': statement,
                'subject_refs': [src, tgt, rid],
                'idea_status': 'inferred',
                'hypothesis': f'Graphify classified this edge as {conf}; preserve as inference until separately verified.',
                'created_at': ts,
                'updated_at': ts
            })

    source_inventory = {
        'id': 'urn:kgp:source:graphify-import',
        'original_name': graph_path.name,
        'origin': 'graphify',
        'included': bool(args.copy_raw),
        'created_at': ts,
        'package_path': 'derived/graphify/graph.json' if args.copy_raw else None,
        'sha256': source_hash,
        'size_bytes': graph_path.stat().st_size,
        'media_type': 'application/json',
        'locator': str(graph_path)
    }

    write_jsonl(root/'graph/entities.jsonl', entities, append=args.append)
    write_jsonl(root/'graph/relationships.jsonl', rels, append=args.append)
    write_jsonl(root/'evidence/evidence.jsonl', evidence, append=True)
    write_jsonl(root/'evidence/source_inventory.jsonl', [source_inventory], append=True)
    write_jsonl(root/'knowledge/confirmed.jsonl', confirmed, append=True)
    write_jsonl(root/'knowledge/ideas.jsonl', ideas, append=True)
    write_jsonl(root/'history/changelog.jsonl', [{
        'timestamp': ts,
        'operation': 'IMPORT_GRAPHIFY',
        'target': 'graph/*',
        'reason': f'Imported {len(entities)} Graphify nodes and {len(rels)} relationships from {graph_path.name}',
        'actor': 'graph-generator/import_graphify.py'
    }], append=True)

    print(json.dumps({
        'kgp_dir': str(root),
        'entities_imported': len(entities),
        'relationships_imported': len(rels),
        'confirmed_structural_relationships': len(confirmed),
        'inferred_relationships_preserved_as_ideas': len(ideas),
        'raw_graphify_copy': str(raw_dir/'graph.json') if args.copy_raw else None
    }, indent=2))


if __name__ == '__main__':
    main()
