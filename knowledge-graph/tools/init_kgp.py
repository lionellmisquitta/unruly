#!/usr/bin/env python3
import argparse
import datetime as dt
import json
import re
import shutil
from pathlib import Path

def now():
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')

def slugify(value):
    value = re.sub(r'[^A-Za-z0-9._-]+', '-', value.strip()).strip('-')
    return value or 'knowledge-graph'

def main():
    p = argparse.ArgumentParser(description='Initialize a portable Knowledge Graph Package workspace.')
    p.add_argument('--name', required=True, help='Human-readable graph/package name')
    p.add_argument('--output-dir', required=True)
    args = p.parse_args()
    skill_root = Path(__file__).resolve().parents[1]
    template = skill_root / 'assets' / 'kgp-template'
    out_root = Path(args.output_dir).resolve()
    package_dir = out_root / slugify(args.name)
    if package_dir.exists() and any(package_dir.iterdir()):
        raise SystemExit(f'Refusing to initialize non-empty directory: {package_dir}')
    package_dir.mkdir(parents=True, exist_ok=True)
    for item in template.iterdir():
        dst = package_dir / item.name
        if item.is_dir(): shutil.copytree(item, dst)
        else: shutil.copy2(item, dst)
    dirs = ['graph','knowledge','evidence/originals/spreadsheets','evidence/originals/documents','evidence/originals/code','evidence/originals/images','evidence/originals/other','conversations/active','conversations/extractions','conversations/archive','derived/extracted_tables','derived/normalized_data','derived/summaries','derived/graphify','history','exports','tools']
    for d in dirs: (package_dir / d).mkdir(parents=True, exist_ok=True)
    jsonl_files = ['graph/entities.jsonl','graph/relationships.jsonl','knowledge/confirmed.jsonl','knowledge/tribal_knowledge.jsonl','knowledge/tactical.jsonl','knowledge/decisions.jsonl','knowledge/ideas.jsonl','knowledge/contradictions.jsonl','knowledge/unknowns.jsonl','evidence/evidence.jsonl','evidence/source_inventory.jsonl','conversations/index.jsonl','history/changelog.jsonl']
    for rel in jsonl_files: (package_dir / rel).write_text('', encoding='utf-8')
    (package_dir / 'exports/nodes.csv').write_text('id,entity_type,name,status\n', encoding='utf-8')
    (package_dir / 'exports/relationships.csv').write_text('id,from,relationship_type,to,status\n', encoding='utf-8')
    (package_dir / 'exports/graph.graphml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<graphml xmlns="http://graphml.graphdrawing.org/xmlns"><graph id="G" edgedefault="directed"/></graphml>\n', encoding='utf-8')
    timestamp=now()
    manifest={'format':'KGP','format_version':2,'name':args.name,'package_id':f'urn:kgp:package:{slugify(args.name).lower()}','created_at':timestamp,'updated_at':timestamp,'canonical_format':'jsonl','content_sha256':None,'validation':{'status':'unvalidated','validated_at':None},'counts':{},'source_policy':'include accessible originals after sensitivity/confidentiality warning and user acknowledgement','conversation_policy':{'raw_trust':'supporting_only','active_retention_days':90,'archive_delete_policy':'never_automatic','default_retrieval':'canonical_first'},'notes':[]}
    (package_dir/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
    for name in ['validate_kgp.py','apply_delta.py','package_kgp.py','cost_guard.py','inventory_sources.py','scope_guard.py','generate_visualization.py','build_onair.py','import_graphify.py','capture_conversation.py','archive_conversations.py','validate_visualizations.py']:
        src=skill_root/'scripts'/name
        if src.exists(): shutil.copy2(src, package_dir/'tools'/name)
    print(str(package_dir))
if __name__=='__main__': main()
