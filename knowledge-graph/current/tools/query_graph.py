#!/usr/bin/env python3
"""Bounded canonical lookup, excludes raw conversation/source scans."""
import argparse,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--anchor',required=True);p.add_argument('--depth',type=int,default=1,choices=[0,1,2]);p.add_argument('--limit',type=int,default=40);a=p.parse_args();root=Path(__file__).resolve().parents[1]
def read(f):return [json.loads(x) for x in (root/f).read_text().splitlines() if x.strip()]
nodes=read('graph/entities.jsonl');rels=read('graph/relationships.jsonl');ids={a.anchor}
if a.anchor not in {n['id'] for n in nodes}:raise SystemExit('Unknown anchor; inspect INDEX.json or search entity names.')
for _ in range(a.depth):ids|={r[k] for r in rels if r['from'] in ids or r['to'] in ids for k in ['from','to']}
selected=[n for n in nodes if n['id'] in ids];truncated=len(selected)>a.limit;selected=sorted(selected,key=lambda n:(n['id']!=a.anchor,n['id']))[:a.limit];ids={n['id'] for n in selected}
knowledge=[]
for f in (root/'knowledge').glob('*.jsonl'):
 for line in f.read_text().splitlines():
  n=json.loads(line)
  if ids.intersection(n.get('subject_refs',[])):knowledge.append(n)
print(json.dumps({'revision_id':json.loads((root/'manifest.json').read_text())['revision_id'],'anchor':a.anchor,'truncated':truncated,'entities':selected,'relationships':[r for r in rels if r['from'] in ids and r['to'] in ids],'knowledge':knowledge},ensure_ascii=False,indent=2))
