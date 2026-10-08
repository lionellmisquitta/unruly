#!/usr/bin/env python3
import argparse,csv,datetime as dt,hashlib,json,subprocess,sys,zipfile
from pathlib import Path
from xml.sax.saxutils import escape,quoteattr

def now(): return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00','Z')
def read_jsonl(path):
    if not path.exists(): return []
    return [json.loads(x) for x in path.read_text(encoding='utf-8').splitlines() if x.strip()]
def content_hash(root):
    h=hashlib.sha256()
    for p in sorted(x for x in root.rglob('*') if x.is_file() and x.name!='manifest.json'):
        h.update(p.relative_to(root).as_posix().encode());h.update(b'\0');h.update(p.read_bytes());h.update(b'\0')
    return h.hexdigest()
def tool(root,name):
    p=root/'tools'/name
    return p if p.exists() else Path(__file__).resolve().with_name(name)
def run_tool(root,name,*args,allow_warn=False):
    p=tool(root,name)
    if not p.exists(): raise SystemExit(f'Required tool missing: {name}')
    r=subprocess.run([sys.executable,str(p),*map(str,args)],text=True,capture_output=True)
    if r.stdout: sys.stdout.write(r.stdout)
    if r.stderr: sys.stderr.write(r.stderr)
    if r.returncode!=0 and not allow_warn: raise SystemExit(f'{name} failed')
    return r
def build_basic_exports(root):
    entities=read_jsonl(root/'graph/entities.jsonl'); rels=read_jsonl(root/'graph/relationships.jsonl'); exp=root/'exports';exp.mkdir(exist_ok=True)
    with (exp/'nodes.csv').open('w',encoding='utf-8',newline='') as f:
        w=csv.DictWriter(f,fieldnames=['id','entity_type','name','status']);w.writeheader();[w.writerow({k:r.get(k,'') for k in w.fieldnames}) for r in entities]
    with (exp/'relationships.csv').open('w',encoding='utf-8',newline='') as f:
        w=csv.DictWriter(f,fieldnames=['id','from','relationship_type','to','status']);w.writeheader();[w.writerow({k:r.get(k,'') for k in w.fieldnames}) for r in rels]
    lines=['<?xml version="1.0" encoding="UTF-8"?>','<graphml xmlns="http://graphml.graphdrawing.org/xmlns">','<graph id="G" edgedefault="directed">']
    for e in entities: lines.append(f'<node id={quoteattr(str(e.get("id","")))}><data key="type">{escape(str(e.get("entity_type","")))}</data><data key="name">{escape(str(e.get("name","")))}</data></node>')
    for r in rels: lines.append(f'<edge id={quoteattr(str(r.get("id","")))} source={quoteattr(str(r.get("from","")))} target={quoteattr(str(r.get("to","")))}><data key="type">{escape(str(r.get("relationship_type","")))}</data></edge>')
    lines+=['</graph>','</graphml>'];(exp/'graph.graphml').write_text('\n'.join(lines)+'\n',encoding='utf-8')
def main():
    ap=argparse.ArgumentParser(description='Validate, visualize and package a KGP as .kgp.zip.')
    ap.add_argument('package_dir');ap.add_argument('--output',required=True);ap.add_argument('--strict-scope',action='store_true');args=ap.parse_args()
    root=Path(args.package_dir).resolve();out=Path(args.output).resolve()
    if not out.name.endswith('.kgp.zip'): raise SystemExit('output filename must end with .kgp.zip')
    run_tool(root,'validate_kgp.py',root)
    sg=[str(root)]+(['--strict'] if args.strict_scope else [])
    run_tool(root,'scope_guard.py',*sg)
    build_basic_exports(root)
    run_tool(root,'generate_visualization.py',root)
    run_tool(root,'build_onair.py',root)
    manifest_path=root/'manifest.json';manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
    expected=[root/'exports/graph-explorer.html',root/'exports/graph-data.json',root/f"exports/OnAir - {manifest.get('name') or root.name}.html",root/'exports/onair-visualization-summary.json']
    # OnAir filename may be sanitized; find it if the exact unsanitized name differs.
    if not expected[2].exists():
        cand=sorted((root/'exports').glob('OnAir - *.html'))
        if cand: expected[2]=cand[0]
    missing=[str(p) for p in expected if not p.exists() or p.stat().st_size==0]
    if missing: raise SystemExit('Visualization completion invariant failed; missing/empty: '+', '.join(missing))
    run_tool(root,'validate_visualizations.py',expected[0],expected[2])
    counts={}
    for rel in ['graph/entities.jsonl','graph/relationships.jsonl','knowledge/confirmed.jsonl','knowledge/tribal_knowledge.jsonl','knowledge/tactical.jsonl','knowledge/decisions.jsonl','knowledge/ideas.jsonl','knowledge/contradictions.jsonl','knowledge/unknowns.jsonl','evidence/evidence.jsonl','evidence/source_inventory.jsonl','conversations/index.jsonl']:
        counts[rel]=len(read_jsonl(root/rel))
    conv_index=read_jsonl(root/'conversations/index.jsonl')
    counts['conversations/active']=sum(1 for r in conv_index if r.get('storage_state')=='active')
    counts['conversations/archived']=sum(1 for r in conv_index if r.get('storage_state')=='archived')
    summary=json.loads((root/'exports/onair-visualization-summary.json').read_text(encoding='utf-8'))
    manifest['counts']=counts;manifest['updated_at']=now();manifest['validation']={'status':'valid','validated_at':now()};manifest['visualization']={'status':'complete','overview_mode':summary.get('overview_mode'),'concept_count':summary.get('concept_count'),'lenses':summary.get('lenses')};manifest['content_sha256']=content_hash(root)
    manifest_path.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
    run_tool(root,'validate_kgp.py',root)
    out.parent.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED) as z:
        for f in sorted(x for x in root.rglob('*') if x.is_file()): z.write(f,arcname=f'{root.name}/{f.relative_to(root).as_posix()}')
    print(json.dumps({'output':str(out),'content_sha256':manifest['content_sha256'],'counts':counts,'visualizations':[str(p) for p in expected]},indent=2))
if __name__=='__main__': main()
