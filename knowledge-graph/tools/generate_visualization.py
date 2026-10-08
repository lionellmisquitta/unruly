#!/usr/bin/env python3
import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path

BUSINESS_TYPES = {"businessarea","module","process","capability","role","rule","workflowstate","state","decision","businessobject","project","team","organization"}
FUNCTIONAL_TYPES = {"process","action","capability","page","screen","role","rule","workflowstate","state","businessobject","dataset","report","integration","system","field","dataattribute","notification"}
TECHNICAL_TYPES = {"codeartifact","sourcefile","databaseobject","api","service","controller","class","function","method","storedprocedure","table","view","queue","topic"}
EVIDENCE_TYPES = {"requirement","acceptancecriterion","document","externalreference","sourcefile","claim","decision","testcase","jiraissue","evidence"}

REL_LABELS = {
    "PART_OF":"is part of","OWNS":"owns","USES":"uses","IMPLEMENTS":"implements","IMPLEMENTED_BY":"is implemented by",
    "APPLIES_TO":"applies to","READS_FROM":"reads from","WRITES_TO":"writes to","TRIGGERS":"triggers","DEPENDS_ON":"depends on",
    "VISIBLE_TO":"is visible to","EDITABLE_BY":"can be edited by","HAS_STATE_CAPABILITY":"allows in this state","SOURCED_FROM":"is supported by",
    "CALLS":"calls","HAS_METHOD":"contains method","CONTAINS":"contains","PRODUCES":"produces","FEEDS":"feeds","SUPPORTS":"supports",
    "CONFIRMED_BY":"is confirmed by","ASSIGNED_TO":"is assigned to","DECIDED_BY":"is decided by","ASSOCIATED_WITH":"is associated with"
}


def read_jsonl(path):
    if not path.exists(): return []
    return [json.loads(x) for x in path.read_text(encoding="utf-8").splitlines() if x.strip()]


def layers(entity):
    attrs = entity.get("attributes") or {}
    explicit = attrs.get("visual_layer")
    if explicit:
        vals = explicit if isinstance(explicit, list) else [explicit]
        return sorted({str(x).lower() for x in vals if str(x).strip()})
    t = str(entity.get("entity_type") or "").lower().replace("_", "")
    out = set()
    if t in BUSINESS_TYPES: out.add("business")
    if t in FUNCTIONAL_TYPES: out.add("functional")
    if t in TECHNICAL_TYPES: out.add("technical")
    if t in EVIDENCE_TYPES: out.add("evidence")
    if not out:
        out.add("functional")
    return sorted(out)


def first(entity, *keys):
    attrs = entity.get("attributes") or {}
    for k in keys:
        if entity.get(k) not in (None, "", []): return entity.get(k)
        if attrs.get(k) not in (None, "", []): return attrs.get(k)
    return None


def clean_value(v):
    if v is None: return None
    if isinstance(v, list): return [str(x) for x in v]
    return str(v)


def human_relation(r):
    raw = str(r or "RELATES_TO").upper()
    return REL_LABELS.get(raw, raw.replace("_", " ").lower())


def make_data(root: Path):
    entities = read_jsonl(root / "graph/entities.jsonl")
    rels = read_jsonl(root / "graph/relationships.jsonl")
    nodes = []
    for e in entities:
        attrs = e.get("attributes") or {}
        node_layers = layers(e)
        nodes.append({
            "id": e.get("id"),
            "name": e.get("name") or e.get("id"),
            "type": e.get("entity_type") or "Entity",
            "layers": node_layers,
            "description": clean_value(first(e, "description", "plain_language_summary", "summary")),
            "purpose": clean_value(first(e, "business_purpose", "purpose", "why_it_matters")),
            "used_by": clean_value(first(e, "used_by", "roles")),
            "before": clean_value(first(e, "before")),
            "after": clean_value(first(e, "after")),
            "rules": clean_value(first(e, "business_rules", "rules")),
            "state_effect": clean_value(first(e, "state_effect")),
            "business_area": clean_value(first(e, "business_area", "module", "community_name")),
            "evidence_refs": e.get("evidence_refs") or [],
            "implementation_refs": attrs.get("implementation_refs") or [],
            "confidence_label": clean_value(first(e, "confidence_label", "epistemic_status")),
            "raw": e,
        })
    edges = []
    for r in rels:
        edges.append({
            "id": r.get("id"), "from": r.get("from"), "to": r.get("to"),
            "type": r.get("relationship_type") or "RELATES_TO",
            "label": human_relation(r.get("relationship_type")),
            "epistemic_status": r.get("epistemic_status"), "raw": r
        })

    idmap = {n["id"]: n for n in nodes}
    conceptual = [n for n in nodes if ("business" in n["layers"] or "functional" in n["layers"]) and "technical" not in n["layers"]]
    communities = defaultdict(list)
    for n in nodes:
        raw_attrs = n["raw"].get("attributes") or {}
        c = raw_attrs.get("community_name") or raw_attrs.get("module") or raw_attrs.get("business_area")
        if c and "technical" in n["layers"]:
            communities[str(c)].append(n)

    overview_nodes = []
    overview_edges = []
    overview_mode = "concepts"
    if conceptual:
        overview_nodes = [{"id": n["id"], "name": n["name"], "type": n["type"], "synthetic": False} for n in conceptual]
        cids = {n["id"] for n in conceptual}
        overview_edges = [e for e in edges if e["from"] in cids and e["to"] in cids]
    elif communities:
        overview_mode = "technical_clusters"
        node_to_cluster = {}
        for idx, (name, members) in enumerate(sorted(communities.items())):
            cid = f"__cluster__:{idx}"
            for m in members: node_to_cluster[m["id"]] = cid
            overview_nodes.append({"id": cid, "name": name, "type": "Technical cluster", "synthetic": True, "member_ids": [m["id"] for m in members], "count": len(members)})
        counts = Counter()
        for e in edges:
            a, b = node_to_cluster.get(e["from"]), node_to_cluster.get(e["to"])
            if a and b and a != b: counts[(a,b)] += 1
        for i, ((a,b), count) in enumerate(counts.items()):
            overview_edges.append({"id": f"__cluster_edge__:{i}", "from": a, "to": b, "label": f"{count} technical links", "type": "CLUSTER_LINK"})
    else:
        overview_mode = "technical_only"
        overview_nodes = [{"id": n["id"], "name": n["name"], "type": n["type"], "synthetic": False} for n in nodes[:500]]
        ids = {x["id"] for x in overview_nodes}
        overview_edges = [e for e in edges if e["from"] in ids and e["to"] in ids][:2000]

    meta = {
        "name": root.name, "nodes": len(nodes), "edges": len(edges), "overview_mode": overview_mode,
        "concept_count": len(conceptual), "technical_count": sum("technical" in n["layers"] for n in nodes),
        "credit": "lionellmisquitta.com"
    }
    return {"meta": meta, "nodes": nodes, "edges": edges, "overview_nodes": overview_nodes, "overview_edges": overview_edges}


HTML = r'''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Knowledge Graph Explorer</title>
<style>
:root{color-scheme:dark;--bg:#061019;--glass:rgba(16,31,42,.76);--border:rgba(255,255,255,.14);--text:#edf8ff;--muted:#9fb5c3;--accent:#78d8ff;--warn:#ffd28a}*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:radial-gradient(circle at 25% 20%,#173248,#061019 55%,#02070b);font-family:Inter,system-ui,sans-serif;color:var(--text)}canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none}.glass{background:var(--glass);border:1px solid var(--border);backdrop-filter:blur(18px);box-shadow:0 18px 55px rgba(0,0,0,.28)}#top{position:absolute;left:16px;right:16px;top:16px;z-index:4;padding:12px;border-radius:18px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}#top strong{margin-right:4px}button,input{border:1px solid var(--border);background:rgba(255,255,255,.07);color:var(--text);border-radius:11px;padding:9px 11px}button{cursor:pointer}button.active{background:rgba(120,216,255,.2);border-color:rgba(120,216,255,.55)}input{flex:1;min-width:220px;outline:none}#stats{font-size:12px;color:var(--muted)}#notice{position:absolute;left:16px;top:82px;z-index:3;max-width:520px;border-radius:15px;padding:10px 12px;color:var(--warn);font-size:12px;display:none}#side{position:absolute;right:16px;top:82px;bottom:16px;width:min(420px,calc(100vw - 32px));overflow:auto;border-radius:18px;padding:16px;z-index:4}#side h2{font-size:20px;margin:0 0 4px}.meta{font-size:12px;color:var(--muted);margin-bottom:14px}.section{margin:14px 0}.section h3{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:0 0 6px}.section p{margin:0;line-height:1.45}.chips{display:flex;gap:6px;flex-wrap:wrap}.chip{padding:5px 8px;border:1px solid var(--border);border-radius:999px;font-size:11px;background:rgba(255,255,255,.05)}.linkrow{padding:7px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:12px}.linkrow b{font-weight:600}details{margin-top:14px}pre{white-space:pre-wrap;word-break:break-word;background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px;font-size:11px}#credit{position:absolute;left:16px;bottom:12px;color:rgba(237,248,255,.62);font-size:11px;z-index:2}@media(max-width:760px){#side{top:auto;max-height:48vh}#notice{top:132px}.lensLabel{display:none}}
</style></head><body><canvas id="c"></canvas><div id="top" class="glass"><strong>Knowledge Graph</strong><span id="stats"></span><span class="lensLabel">View:</span><button data-lens="overview" class="active">Overview</button><button data-lens="business">Business</button><button data-lens="functional">Functional</button><button data-lens="technical">Technical</button><button data-lens="evidence">Evidence</button><input id="search" placeholder="Search the complete graph…"><button id="reset">Reset</button></div><div id="notice" class="glass"></div><aside id="side" class="glass"><h2>Explore the graph</h2><div class="meta">Select a concept. Plain-language meaning comes first; developer metadata stays collapsed.</div><div id="content"></div></aside><div id="credit">lionellmisquitta.com</div>
<script>const DATA=__DATA__;const canvas=document.getElementById('c'),ctx=canvas.getContext('2d'),side=document.getElementById('content'),search=document.getElementById('search'),notice=document.getElementById('notice');let W=0,H=0,dpr=1,pan={x:0,y:0},zoom=1,drag=null,lens='overview',selected=null;const byId=new Map(DATA.nodes.map(n=>[n.id,n]));const edgesByNode=new Map();for(const e of DATA.edges){if(!edgesByNode.has(e.from))edgesByNode.set(e.from,[]);if(!edgesByNode.has(e.to))edgesByNode.set(e.to,[]);edgesByNode.get(e.from).push(e);edgesByNode.get(e.to).push(e)}const pos=new Map();
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function arr(v){if(v==null||v==='')return[];return Array.isArray(v)?v:[v]}function visible(){if(lens==='overview')return DATA.overview_nodes;return DATA.nodes.filter(n=>n.layers.includes(lens))}function vedges(ids){const set=new Set(ids);if(lens==='overview')return DATA.overview_edges.filter(e=>set.has(e.from)&&set.has(e.to));return DATA.edges.filter(e=>set.has(e.from)&&set.has(e.to))}
function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}function layout(){const ns=visible();const ids=new Set(ns.map(n=>n.id));for(const n of ns){const a=(hash(n.id)%100000)/100000*Math.PI*2,r=120+Math.sqrt(ns.length)*9+(hash(n.id+'r')%180);pos.set(n.id,{x:Math.cos(a)*r,y:Math.sin(a)*r})}const es=vedges(ids);const ticks=ns.length<700?45:8;for(let t=0;t<ticks;t++)for(const e of es){const a=pos.get(e.from),b=pos.get(e.to);if(!a||!b)continue;let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,k=(d-120)*.004;a.x+=dx/d*k;a.y+=dy/d*k;b.x-=dx/d*k;b.y-=dy/d*k}}
function proj(p){return{x:W/2+pan.x+p.x*zoom,y:H/2+pan.y+p.y*zoom}}function color(n){const t=String(n.type||'').toLowerCase();if(t.includes('process')||t.includes('capability'))return'#72e5d1';if(t.includes('role')||t.includes('team')||t.includes('person'))return'#a99cff';if(t.includes('rule')||t.includes('state'))return'#ffd28a';if(t.includes('page')||t.includes('screen')||t.includes('report'))return'#74b9ff';if(t.includes('code')||t.includes('source')||t.includes('service')||t.includes('function')||t.includes('method'))return'#ff9bd2';if(t.includes('database')||t.includes('table')||t.includes('procedure'))return'#ff9a8d';if(t.includes('requirement')||t.includes('document')||t.includes('evidence'))return'#c8d3dc';return'#78d8ff'}
function draw(){ctx.clearRect(0,0,W,H);const ns=visible(),ids=new Set(ns.map(n=>n.id)),es=vedges(ids);const step=es.length>12000?Math.ceil(es.length/12000):1;for(let i=0;i<es.length;i+=step){const e=es[i],a=pos.get(e.from),b=pos.get(e.to);if(!a||!b)continue;const p=proj(a),q=proj(b);ctx.strokeStyle='rgba(120,190,220,.18)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}for(const n of ns){const p0=pos.get(n.id);if(!p0)continue;const p=proj(p0),sel=selected===n.id;ctx.beginPath();ctx.fillStyle=sel?'#fff':color(n);ctx.shadowColor=sel?'#78d8ff':'transparent';ctx.shadowBlur=sel?24:0;ctx.arc(p.x,p.y,sel?7:4.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;if(sel||zoom>1.15||lens==='overview'){ctx.font=sel?'12px system-ui':'10px system-ui';ctx.fillStyle='rgba(237,248,255,.88)';ctx.fillText(n.name||n.id,p.x+8,p.y-7)}}requestAnimationFrame(draw)}
function renderSynthetic(n){const members=n.member_ids||[];side.innerHTML=`<div class="section"><h3>What is this?</h3><p>This is a viewer-generated technical cluster containing <b>${members.length}</b> implementation items. It helps reduce visual clutter; it is not a canonical business concept.</p></div><div class="section"><h3>Why you are seeing this</h3><p>The graph does not yet contain enough business or functional concepts for a concept-first overview. Add process, role, rule, requirement or application-context evidence to unlock richer views.</p></div><div class="section"><h3>Technical items</h3><div class="chips">${members.slice(0,30).map(id=>`<span class="chip">${esc(byId.get(id)?.name||id)}</span>`).join('')}${members.length>30?`<span class="chip">+${members.length-30} more</span>`:''}</div></div>`}
function renderNode(n){const links=(edgesByNode.get(n.id)||[]).slice(0,40);const connected=links.map(e=>{const other=byId.get(e.from===n.id?e.to:e.from);if(!other)return'';const phrase=e.from===n.id?e.label:`${e.label} ←`;return`<div class="linkrow"><b>${esc(phrase)}</b> ${esc(other.name)} <span class="meta">(${esc(other.type)})</span></div>`}).join('');const desc=n.description||'Meaning not yet documented in the available evidence.';const purpose=n.purpose;side.innerHTML=`<h2>${esc(n.name)}</h2><div class="meta">${esc(n.type)} · ${n.layers.map(x=>esc(x)).join(' / ')}</div><div class="section"><h3>What is this?</h3><p>${esc(desc)}</p></div>${purpose?`<div class="section"><h3>Why it matters</h3><p>${esc(purpose)}</p></div>`:''}${arr(n.used_by).length?`<div class="section"><h3>Used by</h3><div class="chips">${arr(n.used_by).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div></div>`:''}${arr(n.before).length||arr(n.after).length?`<div class="section"><h3>What happens around it</h3>${arr(n.before).length?`<p><b>Before:</b> ${arr(n.before).map(esc).join(', ')}</p>`:''}${arr(n.after).length?`<p><b>After:</b> ${arr(n.after).map(esc).join(', ')}</p>`:''}</div>`:''}${arr(n.rules).length?`<div class="section"><h3>Rules</h3><div class="chips">${arr(n.rules).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div></div>`:''}${arr(n.state_effect).length?`<div class="section"><h3>State effect</h3><p>${arr(n.state_effect).map(esc).join(', ')}</p></div>`:''}<div class="section"><h3>Connected concepts</h3>${connected||'<p>No direct connections are currently recorded.</p>'}</div>${n.evidence_refs.length?`<div class="section"><h3>Evidence</h3><div class="chips">${n.evidence_refs.slice(0,12).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div></div>`:''}<details><summary>Developer details</summary><pre>${esc(JSON.stringify(n.raw,null,2))}</pre></details>`}
function inspect(n){selected=n?.id||null;if(!n)return;if(n.synthetic)renderSynthetic(n);else renderNode(n)}function nearest(x,y,max=20){let best=null,bd=max;for(const n of visible()){const p0=pos.get(n.id);if(!p0)continue;const p=proj(p0),d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;best=n}}return best}
function setLens(v){lens=v;selected=null;document.querySelectorAll('[data-lens]').forEach(b=>b.classList.toggle('active',b.dataset.lens===v));pan={x:0,y:0};zoom=1;layout();updateNotice()}function updateNotice(){if(lens==='overview'&&DATA.meta.overview_mode==='technical_clusters'){notice.style.display='block';notice.textContent='Technical structure only: business meaning has not yet been captured. Showing implementation communities as a temporary overview.'}else if(lens==='business'&&!DATA.nodes.some(n=>n.layers.includes('business'))){notice.style.display='block';notice.textContent='No business concepts are currently recorded in this graph.'}else{notice.style.display='none'}}document.querySelectorAll('[data-lens]').forEach(b=>b.onclick=()=>setLens(b.dataset.lens));
function resize(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}addEventListener('resize',resize);canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y,m:false}});canvas.addEventListener('pointermove',e=>{if(!drag)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>3)drag.m=true;pan.x=drag.px+e.clientX-drag.x;pan.y=drag.py+e.clientY-drag.y});canvas.addEventListener('pointerup',e=>{const d=drag;drag=null;if(d&&!d.m){const n=nearest(e.clientX,e.clientY);if(n)inspect(n)}});canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.15,Math.min(5,zoom*Math.exp(-e.deltaY*.001)))},{passive:false});document.getElementById('reset').onclick=()=>setLens('overview');
search.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const q=search.value.trim().toLowerCase();if(!q)return;const n=DATA.nodes.find(n=>`${n.name} ${n.type} ${n.description||''} ${n.business_area||''}`.toLowerCase().includes(q));if(!n){notice.style.display='block';notice.textContent='No matching node found.';return}const preferred=n.layers.includes('business')?'business':n.layers.includes('functional')?'functional':n.layers.includes('technical')?'technical':'evidence';setLens(preferred);inspect(n)});
document.getElementById('stats').textContent=`${DATA.meta.nodes.toLocaleString()} nodes · ${DATA.meta.edges.toLocaleString()} relationships`;layout();resize();updateNotice();requestAnimationFrame(draw);</script></body></html>'''


def main():
    ap = argparse.ArgumentParser(description="Generate a concept-first self-contained 2D graph explorer and graph-data.json from a KGP.")
    ap.add_argument("package_dir")
    args = ap.parse_args()
    root = Path(args.package_dir).resolve()
    data = make_data(root)
    exp = root / "exports"; exp.mkdir(parents=True, exist_ok=True)
    data_path = exp / "graph-data.json"
    data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    encoded = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</script", "<\\/script")
    html_path = exp / "graph-explorer.html"
    html_path.write_text(HTML.replace("__DATA__", encoded), encoding="utf-8")
    print(json.dumps({"html": str(html_path), "data": str(data_path), "nodes": data["meta"]["nodes"], "relationships": data["meta"]["edges"], "overview_mode": data["meta"]["overview_mode"]}, indent=2))

if __name__ == "__main__": main()
