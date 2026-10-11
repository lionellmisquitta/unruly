#!/usr/bin/env python3
"""Build a standalone concept-first OnAir 3D viewer from a KGP directory.

Canonical truth remains graph/entities.jsonl + graph/relationships.jsonl. The viewer
contains synthetic overview clusters only for presentation when business concepts are absent.
"""
import argparse
import json
import re
from pathlib import Path

from generate_visualization import make_data


def safe_name(s):
    s = re.sub(r"[\\/:*?\"<>|]+", "-", str(s)).strip().strip(".")
    return s or "Knowledge Graph"


HTML = r'''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>OnAir Knowledge Graph</title>
<style>
:root{color-scheme:dark;--bg:#02070b;--glass:rgba(12,28,38,.72);--border:rgba(255,255,255,.14);--text:#effaff;--muted:#99afbc;--accent:#78d8ff;--warn:#ffd28a}*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#02070b;font-family:Inter,system-ui,sans-serif;color:var(--text)}#cam,#stage{position:absolute;inset:0;width:100%;height:100%}#cam{object-fit:cover;transform:scaleX(-1);filter:saturate(.72) brightness(.25);opacity:.52;background:radial-gradient(circle at 30% 30%,#173348,#02070b 70%)}#stage{touch-action:none}.glass{background:var(--glass);border:1px solid var(--border);backdrop-filter:blur(18px);box-shadow:0 18px 55px rgba(0,0,0,.28)}#hud{position:absolute;left:16px;right:16px;top:16px;z-index:5;padding:10px 12px;border-radius:18px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}#hud strong{letter-spacing:.08em}#stats,#gesture{font-size:11px;color:var(--muted)}button,input,select{border:1px solid var(--border);background:rgba(255,255,255,.07);color:var(--text);border-radius:11px;padding:9px 10px}button{cursor:pointer}button.active{background:rgba(120,216,255,.2);border-color:rgba(120,216,255,.55)}input{flex:1;min-width:190px;outline:none}#results{position:absolute;top:72px;left:190px;width:min(520px,calc(100vw - 220px));z-index:7;border-radius:16px;max-height:55vh;overflow:auto;display:none}.result{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.07);cursor:pointer}.result:hover{background:rgba(255,255,255,.07)}.result small{display:block;color:var(--muted);margin-top:3px}#inspector{position:absolute;right:16px;top:82px;bottom:16px;width:min(420px,calc(100vw - 32px));overflow:auto;padding:16px;border-radius:18px;z-index:6}#inspector h2{margin:0 0 4px;font-size:20px}.meta{font-size:12px;color:var(--muted);margin-bottom:14px}.section{margin:14px 0}.section h3{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:0 0 6px}.section p{margin:0;line-height:1.45}.chips{display:flex;gap:6px;flex-wrap:wrap}.chip{padding:5px 8px;border:1px solid var(--border);border-radius:999px;font-size:11px;background:rgba(255,255,255,.05)}.linkrow{padding:7px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:12px}.linkrow button{padding:3px 7px;font-size:10px;margin-left:5px}.hidden{display:none!important}details{margin-top:14px}pre{white-space:pre-wrap;word-break:break-word;background:rgba(0,0,0,.23);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px;font-size:11px}#notice{position:absolute;left:16px;top:82px;z-index:4;max-width:520px;padding:10px 12px;border-radius:15px;color:var(--warn);font-size:12px;display:none}#cover{position:absolute;inset:0;display:grid;place-items:center;z-index:10;background:radial-gradient(circle at 50% 45%,rgba(24,53,70,.94),rgba(2,7,10,.99) 70%)}#cover .card{width:min(650px,calc(100vw - 36px));padding:28px;border-radius:24px;text-align:center}#cover h1{font-size:28px;margin:0 0 8px}#cover p{margin:0 auto 18px;color:var(--muted);line-height:1.55;max-width:560px}.actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}#cameraState{margin-top:12px;font-size:11px;color:var(--muted)}#credit{position:absolute;left:16px;bottom:10px;z-index:3;color:rgba(239,250,255,.58);font-size:11px}@media(max-width:760px){#inspector{top:auto;max-height:48vh}#results{left:16px;right:16px;width:auto;top:128px}.lensLabel{display:none}}
</style></head><body><video id="cam" autoplay muted playsinline></video><canvas id="stage"></canvas><div id="hud" class="glass"><strong>ONAIR</strong><span id="stats"></span><span class="lensLabel">View:</span><button data-lens="overview" class="active">Overview</button><button data-lens="business">Business</button><button data-lens="functional">Functional</button><button data-lens="technical">Technical</button><button data-lens="evidence">Evidence</button><input id="search" placeholder="Search the complete graph…"><span id="gesture">Touch/mouse ready</span><button id="back">Back</button><button id="reset">Reset</button></div><div id="results" class="glass"></div><div id="notice" class="glass"></div><aside id="inspector" class="glass"><h2>Explore the graph</h2><div class="meta">Start with concepts. Drill toward functions and methods only when you need them.</div><div id="content"></div></aside><div id="credit">lionellmisquitta.com</div><div id="cover"><div class="card glass"><h1>__TITLE__ · OnAir</h1><p>A concept-first 3D knowledge graph. Business meaning is shown before implementation detail. Mouse, touch and trackpad always work; camera gestures are optional.</p><div class="actions"><button id="play">▶ Play with camera</button><button id="noCam">▶ Play without camera</button></div><div id="cameraState">The viewer is read-only. Canonical JSONL remains the source of truth.</div></div></div>
<script>const DATA=__DATA__;const canvas=document.getElementById('stage'),ctx=canvas.getContext('2d'),video=document.getElementById('cam'),cover=document.getElementById('cover'),content=document.getElementById('content'),notice=document.getElementById('notice'),results=document.getElementById('results'),search=document.getElementById('search'),gestureEl=document.getElementById('gesture');let W=0,H=0,dpr=1,rx=-.18,ry=.35,zoom=.82,lens='overview',selected=null,stack=[],drag=null,pointers=new Map(),pinch=null,holdTimer=null,lastDraw=0;let handLandmarker=null,lastVideoTime=-1,lastHandTs=0,lastHandPos=null,lastPinch=null;const canonical=new Map(DATA.nodes.map(n=>[n.id,n]));const edgesByNode=new Map();for(const e of DATA.edges){if(!edgesByNode.has(e.from))edgesByNode.set(e.from,[]);if(!edgesByNode.has(e.to))edgesByNode.set(e.to,[]);edgesByNode.get(e.from).push(e);edgesByNode.get(e.to).push(e)}const positions=new Map();
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function arr(v){if(v==null||v==='')return[];return Array.isArray(v)?v:[v]}function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}function allVisible(){if(lens==='overview')return DATA.overview_nodes;return DATA.nodes.filter(n=>n.layers.includes(lens))}function visibleEdges(ids){const set=new Set(ids);if(lens==='overview')return DATA.overview_edges.filter(e=>set.has(e.from)&&set.has(e.to));return DATA.edges.filter(e=>set.has(e.from)&&set.has(e.to))}
function initLayout(){const ns=allVisible(),spread=Math.max(260,Math.min(1800,240+Math.sqrt(ns.length)*14));for(const n of ns){const a=(hash(n.id)%100000)/100000*Math.PI*2,b=((hash(n.id+'b')%100000)/100000-.5)*Math.PI,r=spread*.45+(hash(n.id+'r')%220);positions.set(n.id,{x:Math.cos(a)*Math.cos(b)*r,y:Math.sin(b)*r,z:Math.sin(a)*Math.cos(b)*r})}const ids=ns.map(n=>n.id),es=visibleEdges(ids),ticks=ns.length<650?35:6;for(let t=0;t<ticks;t++)for(const e of es){const a=positions.get(e.from),b=positions.get(e.to);if(!a||!b)continue;let dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,d=Math.hypot(dx,dy,dz)||1,k=(d-150)*.0028;a.x+=dx/d*k;a.y+=dy/d*k;a.z+=dz/d*k;b.x-=dx/d*k;b.y-=dy/d*k;b.z-=dz/d*k}}
function project(n){const p=positions.get(n.id)||{x:0,y:0,z:0},cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry);let x=p.x*cy-p.z*sy,z=p.x*sy+p.z*cy,y=p.y*cx-z*sx;z=p.y*sx+z*cx;const sc=zoom*760/(760+z+600);return{x:W/2+x*sc,y:H/2+y*sc,sc,z}}function nodeColor(n){const t=String(n.type||'').toLowerCase();if(t.includes('process')||t.includes('capability'))return'#72e5d1';if(t.includes('role')||t.includes('team')||t.includes('person'))return'#a99cff';if(t.includes('rule')||t.includes('state'))return'#ffd28a';if(t.includes('page')||t.includes('screen')||t.includes('report'))return'#74b9ff';if(t.includes('code')||t.includes('source')||t.includes('service')||t.includes('function')||t.includes('method'))return'#ff9bd2';if(t.includes('database')||t.includes('table')||t.includes('procedure'))return'#ff9a8d';if(t.includes('requirement')||t.includes('document')||t.includes('evidence'))return'#c8d3dc';return'#78d8ff'}
function activeIds(){if(!selected)return null;const s=new Set([selected]);const n=canonical.get(selected);if(!n)return s;for(const e of edgesByNode.get(selected)||[]){s.add(e.from);s.add(e.to)}return s}function draw(ts){if(ts-lastDraw<32){requestAnimationFrame(draw);return}lastDraw=ts;ctx.clearRect(0,0,W,H);let ns=allVisible(),ids=new Set(ns.map(n=>n.id)),es=visibleEdges(ids);const active=activeIds();if(active&&canonical.has(selected)){for(const id of active){if(!ids.has(id)&&canonical.has(id)){ns=ns.concat([canonical.get(id)]);ids.add(id);if(!positions.has(id)){const h=hash(id);positions.set(id,{x:(h%300)-150,y:((h>>8)%300)-150,z:((h>>16)%300)-150})}}}es=DATA.edges.filter(e=>ids.has(e.from)&&ids.has(e.to)&&active.has(e.from)&&active.has(e.to))}const pmap=new Map(ns.map(n=>[n.id,project(n)]));const step=es.length>18000?Math.ceil(es.length/18000):1;for(let i=0;i<es.length;i+=step){const e=es[i],a=pmap.get(e.from),b=pmap.get(e.to);if(!a||!b)continue;ctx.globalAlpha=active?.45:.14;ctx.strokeStyle=e.epistemic_status==='inferred'?'#ad9cff':'#78d8ff';ctx.lineWidth=active?1.2:.55;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}const sorted=[...ns].sort((a,b)=>(pmap.get(a.id)?.z||0)-(pmap.get(b.id)?.z||0));for(const n of sorted){const p=pmap.get(n.id),on=!active||active.has(n.id)||n.id===selected;if(active&&!on&&canonical.has(n.id))continue;const sel=selected===n.id,r=Math.max(1.2,Math.min(9,(sel?6.5:2.5)*p.sc));ctx.globalAlpha=on?1:.08;ctx.beginPath();ctx.fillStyle=sel?'#fff':nodeColor(n);ctx.shadowColor=sel?'#78d8ff':'transparent';ctx.shadowBlur=sel?24:0;ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;if(sel||(lens==='overview'&&p.sc>.32)||(active&&on&&p.sc>.4)){ctx.font=sel?'13px system-ui':'10px system-ui';ctx.fillStyle='rgba(239,250,255,.9)';ctx.fillText(n.name||n.id,p.x+r+4,p.y-r-2)}}ctx.globalAlpha=1;requestAnimationFrame(draw)}
function renderSynthetic(n){const members=n.member_ids||[];content.innerHTML=`<h2>${esc(n.name)}</h2><div class="meta">Viewer-generated technical cluster · ${members.length} items</div><div class="section"><h3>What is this?</h3><p>This cluster groups implementation items so the graph stays readable. It is not a canonical business concept.</p></div><div class="section"><h3>Why you are seeing this</h3><p>The package currently lacks enough business or functional concepts for a concept-first overview. Add process, role, rule, requirement or application-context evidence to unlock richer views.</p></div><div class="section"><h3>Technical items</h3><div class="chips">${members.slice(0,35).map(id=>`<span class="chip">${esc(canonical.get(id)?.name||id)}</span>`).join('')}${members.length>35?`<span class="chip">+${members.length-35} more</span>`:''}</div></div><button onclick="setLens('technical')">Open technical view</button>`}
function goNode(id){const n=canonical.get(id);if(!n)return;const preferred=n.layers.includes('business')?'business':n.layers.includes('functional')?'functional':n.layers.includes('technical')?'technical':'evidence';if(!n.layers.includes(lens))setLens(preferred,false);showNode(n,true)}function renderNode(n){const links=(edgesByNode.get(n.id)||[]).slice(0,50);const connected=links.map(e=>{const oid=e.from===n.id?e.to:e.from,o=canonical.get(oid);if(!o)return'';const phrase=e.from===n.id?e.label:`${e.label} ←`;return`<div class="linkrow"><b>${esc(phrase)}</b> ${esc(o.name)} <span class="meta">(${esc(o.type)})</span><button onclick="goNode('${String(o.id).replace(/'/g,"\\'")}')">open</button></div>`}).join('');const desc=n.description||'Meaning not yet documented in the available evidence.';const impl=links.filter(e=>{const o=canonical.get(e.from===n.id?e.to:e.from);return o&&o.layers.includes('technical')});content.innerHTML=`<h2>${esc(n.name)}</h2><div class="meta">${esc(n.type)} · ${n.layers.map(esc).join(' / ')}</div><div class="section"><h3>What is this?</h3><p>${esc(desc)}</p></div>${n.purpose?`<div class="section"><h3>Why it matters</h3><p>${esc(n.purpose)}</p></div>`:''}${arr(n.used_by).length?`<div class="section"><h3>Used by</h3><div class="chips">${arr(n.used_by).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div></div>`:''}${arr(n.before).length||arr(n.after).length?`<div class="section"><h3>What happens around it</h3>${arr(n.before).length?`<p><b>Before:</b> ${arr(n.before).map(esc).join(', ')}</p>`:''}${arr(n.after).length?`<p><b>After:</b> ${arr(n.after).map(esc).join(', ')}</p>`:''}</div>`:''}${arr(n.rules).length?`<div class="section"><h3>Rules</h3><div class="chips">${arr(n.rules).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div></div>`:''}${arr(n.state_effect).length?`<div class="section"><h3>State effect</h3><p>${arr(n.state_effect).map(esc).join(', ')}</p></div>`:''}<div class="section"><h3>Connected concepts</h3>${connected||'<p>No direct connections are currently recorded.</p>'}</div>${n.evidence_refs.length?`<div class="section"><h3>Evidence</h3><div class="chips">${n.evidence_refs.slice(0,14).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div></div>`:''}${impl.length?`<div class="section"><button onclick="setLens('technical')">Show technical implementation</button></div>`:''}<details><summary>Developer details</summary><pre>${esc(JSON.stringify(n.raw,null,2))}</pre></details>`}
function showNode(n,fromSearch=false){if(!n)return;if(n.synthetic){selected=n.id;stack.push(n.id);renderSynthetic(n)}else{if(n.id!==selected)stack.push(n.id);selected=n.id;renderNode(n)}results.style.display='none';gestureEl.textContent='Selected '+(n.name||n.id)}function back(){if(stack.length>1){stack.pop();const id=stack[stack.length-1],n=canonical.get(id)||DATA.overview_nodes.find(x=>x.id===id);selected=id;if(n?.synthetic)renderSynthetic(n);else if(n)renderNode(n)}else{stack=[];selected=null;content.innerHTML='<h2>Explore the graph</h2><div class="meta">Start with concepts. Drill toward functions and methods only when you need them.</div>'}}
function nearest(x,y,max=28){let best=null,bd=max;let ns=allVisible();const active=activeIds();if(active)ns=ns.concat([...active].filter(id=>canonical.has(id)&&!ns.some(n=>n.id===id)).map(id=>canonical.get(id)));for(const n of ns){const p=project(n),d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;best=n}}return best}
function updateNotice(){if(lens==='overview'&&DATA.meta.overview_mode==='technical_clusters'){notice.style.display='block';notice.textContent='Technical structure only: business meaning has not yet been captured. Showing implementation communities as a temporary overview.'}else if(lens==='business'&&!DATA.nodes.some(n=>n.layers.includes('business'))){notice.style.display='block';notice.textContent='No business concepts are currently recorded in this graph.'}else notice.style.display='none'}function setLens(v,clear=true){lens=v;if(clear){selected=null;stack=[];content.innerHTML='<h2>Explore the graph</h2><div class="meta">Start with concepts. Drill toward functions and methods only when you need them.</div>'}document.querySelectorAll('[data-lens]').forEach(b=>b.classList.toggle('active',b.dataset.lens===v));initLayout();updateNotice()}window.setLens=setLens;window.goNode=goNode;document.querySelectorAll('[data-lens]').forEach(b=>b.onclick=()=>setLens(b.dataset.lens));
function doSearch(){const q=search.value.trim().toLowerCase();if(!q){results.style.display='none';return}const found=[];for(const n of DATA.nodes){const hay=`${n.name} ${n.type} ${n.description||''} ${n.purpose||''} ${n.business_area||''}`.toLowerCase();if(hay.includes(q))found.push(n);if(found.length>=40)break}results.innerHTML='';for(const n of found){const d=document.createElement('div');d.className='result';d.innerHTML=`<b>${esc(n.name)}</b><small>${esc(n.type)} · ${n.layers.map(esc).join(' / ')}</small>`;d.onclick=()=>goNode(n.id);results.appendChild(d)}if(!found.length)results.innerHTML='<div class="result">No matches</div>';results.style.display='block'}search.addEventListener('input',doSearch);search.addEventListener('keydown',e=>{if(e.key==='Escape')results.style.display='none'});
function resize(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}addEventListener('resize',resize);canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1)drag={x:e.clientX,y:e.clientY,rx,ry,moved:false};if(pointers.size===2){const a=[...pointers.values()],mx=(a[0].x+a[1].x)/2,my=(a[0].y+a[1].y)/2;pinch={d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),z:zoom};clearTimeout(holdTimer);holdTimer=setTimeout(()=>{const n=nearest(mx,my,34);if(n)showNode(n)},700)}});canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2&&pinch){const a=[...pointers.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);zoom=Math.max(.08,Math.min(5,pinch.z*d/Math.max(20,pinch.d)));return}if(drag){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>4)drag.moved=true;ry=drag.ry+(e.clientX-drag.x)*.006;rx=drag.rx+(e.clientY-drag.y)*.006}});function pointerUp(e){const d=drag;clearTimeout(holdTimer);pointers.delete(e.pointerId);if(pointers.size<2)pinch=null;if(pointers.size===0){drag=null;if(d&&!d.moved){const n=nearest(e.clientX,e.clientY,24);if(n)showNode(n)}}}canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointercancel',pointerUp);canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.08,Math.min(5,zoom*Math.exp(-e.deltaY*.001)))},{passive:false});document.getElementById('back').onclick=back;document.getElementById('reset').onclick=()=>{rx=-.18;ry=.35;zoom=.82;setLens('overview')};addEventListener('keydown',e=>{if((e.key==='Escape'||e.key==='Backspace')&&document.activeElement!==search)back()});
function fingerExtended(lm,tip,pip){return lm[tip].y<lm[pip].y}
function handPoint(lm){return{x:(1-lm[8].x)*W,y:lm[8].y*H}}
function handLoop(){
  if(handLandmarker&&video.readyState>=2&&video.currentTime!==lastVideoTime){
    lastVideoTime=video.currentTime;
    const now=performance.now();
    if(now-lastHandTs>75){
      lastHandTs=now;
      const r=handLandmarker.detectForVideo(video,now),hands=r.landmarks||[];
      if(hands.length){
        const lm=hands[0],pt=handPoint(lm),idx=fingerExtended(lm,8,6),mid=fingerExtended(lm,12,10),ring=fingerExtended(lm,16,14),pinky=fingerExtended(lm,20,18),pinchDist=Math.hypot(lm[4].x-lm[8].x,lm[4].y-lm[8].y);
        if(idx&&mid&&!ring&&!pinky){
          gestureEl.textContent='Two-finger drill';
          const key=nearest(pt.x,pt.y,55)?.id;
          if(key){
            if(!window.__twoKey||window.__twoKey!==key){window.__twoKey=key;window.__twoStart=now}
            else if(now-window.__twoStart>650){
              const n=canonical.get(key)||DATA.overview_nodes.find(x=>x.id===key);
              if(n)showNode(n);
              window.__twoStart=now+100000;
            }
          }
        }else{
          window.__twoKey=null;
          if(pinchDist<.07){
            gestureEl.textContent='Pinch zoom';
            if(lastPinch!=null)zoom=Math.max(.08,Math.min(5,zoom*(1+(pinchDist-lastPinch)*7)));
            lastPinch=pinchDist;
          }else{
            lastPinch=null;
            const open=[idx,mid,ring,pinky].filter(Boolean).length>=3;
            if(open&&lastHandPos){
              ry+=(pt.x-lastHandPos.x)*.0035;
              rx+=(pt.y-lastHandPos.y)*.0035;
              gestureEl.textContent='Hand rotate';
            }
            lastHandPos=pt;
          }
        }
      }else{
        lastHandPos=null;
        lastPinch=null;
        gestureEl.textContent='Camera gestures ready';
      }
    }
  }
  requestAnimationFrame(handLoop);
}
async function startCamera(){const state=document.getElementById('cameraState');try{const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});video.srcObject=stream;await video.play();state.textContent='Camera on. Loading hand tracking…';try{const mp=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm');const vision=await mp.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');handLandmarker=await mp.HandLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',delegate:'GPU'},runningMode:'VIDEO',numHands:1});gestureEl.textContent='Camera gestures ready';handLoop()}catch(err){gestureEl.textContent='Camera on · gestures unavailable';console.warn(err)}cover.style.display='none'}catch(err){state.textContent='Camera unavailable. Starting touch/mouse mode.';gestureEl.textContent='Touch/mouse mode';setTimeout(()=>cover.style.display='none',450)}}document.getElementById('play').onclick=startCamera;document.getElementById('noCam').onclick=()=>{gestureEl.textContent='Touch/mouse mode';cover.style.display='none'};
document.getElementById('stats').textContent=`${DATA.meta.nodes.toLocaleString()} nodes · ${DATA.meta.edges.toLocaleString()} relationships`;initLayout();resize();updateNotice();requestAnimationFrame(draw);</script></body></html>'''


def main():
    ap = argparse.ArgumentParser(description="Generate a concept-first standalone OnAir 3D HTML viewer from a KGP directory.")
    ap.add_argument("package_dir")
    ap.add_argument("--output")
    args = ap.parse_args()
    root = Path(args.package_dir).resolve()
    manifest_path = root / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {}
    title = manifest.get("name") or root.name
    data = make_data(root)
    encoded = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</script", "<\\/script")
    out = Path(args.output).resolve() if args.output else root / "exports" / f"OnAir - {safe_name(title)}.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(HTML.replace("__TITLE__", str(title).replace("<", "&lt;").replace(">", "&gt;")).replace("__DATA__", encoded), encoding="utf-8")
    summary = {
        "viewer": "OnAir concept-first 3D",
        "output": out.name,
        "nodes": data["meta"]["nodes"],
        "relationships": data["meta"]["edges"],
        "overview_mode": data["meta"]["overview_mode"],
        "concept_count": data["meta"]["concept_count"],
        "technical_count": data["meta"]["technical_count"],
        "lenses": ["overview", "business", "functional", "technical", "evidence"],
        "raw_json_default": False,
        "developer_details_collapsed": True,
        "camera_gestures_optional": True,
    }
    summary_path = root / "exports" / "onair-visualization-summary.json"
    summary_path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(out), "summary": str(summary_path), **summary}, indent=2))


if __name__ == "__main__": main()
