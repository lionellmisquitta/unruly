import {getPreset,presetCompatible,replayWork} from './brushes.js';
// UNRULY original vector workspace model. MIT. Pure operations, no browser storage.
export const limits=Object.freeze({layers:32,strokes:2000,points:100000,bytes:8*1024*1024,boards:100,history:100,historyBytes:16*1024*1024,eraseSamples:20000,comparisons:200000});
const copy=x=>structuredClone(x), bytes=x=>new TextEncoder().encode(JSON.stringify(x)).length;
const fail=m=>{throw Error(m);}, idOK=x=>typeof x==='string'&&x.length>0&&x.length<=128;
const num=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b;
export const blends=Object.freeze(['normal','multiply','screen','overlay','darken','lighten','difference','exclusion']);
const rejectPreset=x=>{if(Object.keys(x).some(k=>/^preset/i.test(k)))fail('Brush presets are not supported in legacy documents');};
const color=x=>typeof x==='string'&&/^#[0-9a-f]{6}$/i.test(x);
function validateVersion(b,version){
 if(!b||b.version!==version||!idOK(b.id)||typeof b.title!=='string'||b.title.length>128||!Number.isSafeInteger(b.revision)||b.revision<0)fail('Invalid board');
 if(!Array.isArray(b.layers)||b.layers.length<1||b.layers.length>limits.layers)fail('Layer limit or invalid layers');
 rejectPreset(b);const p=b.paper;if(!p||!['plain','dotted','grid','ruled','textured'].includes(p.kind)||!color(p.color)||!num(p.spacing,10,100)||!Number.isInteger(p.seed)||p.seed<0||p.seed>4294967295)fail('Invalid paper');
 const ids=new Set([b.id]);let ns=0,np=0;
 for(const l of b.layers){if(!idOK(l.id)||ids.has(l.id)||typeof l.name!=='string'||l.name.length>64||typeof l.visible!=='boolean'||typeof l.locked!=='boolean'||!num(l.opacity,0,1)||!Array.isArray(l.strokes))fail('Invalid layer');rejectPreset(l);if(version===3&&!blends.includes(l.blend))fail('Invalid layer blend');if(version===2&&Object.hasOwn(l,'blend'))fail('Invalid legacy layer blend');ids.add(l.id);
 for(const s of l.strokes){if(!idOK(s.id)||ids.has(s.id)||!['ink','pencil','marker','airbrush'].includes(s.brush)||!color(s.color)||!num(s.size,1,40)||!num(s.opacity,0,1)||!Array.isArray(s.points)||!s.points.length)fail('Invalid stroke');if(version===2)rejectPreset(s);else{if(Object.keys(s).some(k=>/^preset/i.test(k)&&k!=='preset'))fail('Invalid brush preset field');if(Object.hasOwn(s,'preset')&&(!idOK(s.preset)||!getPreset(s.preset)||!presetCompatible(s.brush,s.preset)))fail('Invalid brush preset');}ids.add(s.id);ns++;np+=s.points.length;
 if(version===3&&s.preset){const work=replayWork(s);if(work.dabs>20000)fail('Brush replay limit reached');if(work.particles>600000)fail('Brush particle limit reached');}else if(s.brush!=='ink'){const step=Math.max(.5,s.size*(s.brush==='pencil'?.22:s.brush==='airbrush'?.3:.2));let dabs=0;for(let i=1;i<s.points.length;i++){dabs+=Math.max(1,Math.ceil(Math.hypot(s.points[i].x-s.points[i-1].x,s.points[i].y-s.points[i-1].y)/step));if(dabs>20000)fail('Brush replay limit reached');}}
 for(const q of s.points)if(!q||!num(q.x,-1e7,1e7)||!num(q.y,-1e7,1e7)||!(q.pressure===null||num(q.pressure,0,1)))fail('Invalid point/pressure');}}
 if(!b.layers.some(l=>l.id===b.activeLayer)||ns>limits.strokes||np>limits.points||bytes(b)>limits.bytes)fail('Document limit or invalid active layer');
 if(b.lineage&&(!['unruly-foundation'].includes(b.lineage.source)||!Number.isSafeInteger(b.lineage.revision)||b.lineage.revision<0||!Number.isSafeInteger(b.lineage.dbRevision)||b.lineage.dbRevision<0))fail('Invalid lineage');return b;
}
export const validateBoard=b=>validateVersion(b,3);
export function migrateV2(v){const b=copy(validateVersion(v,2));b.version=3;for(const l of b.layers)l.blend='normal';return validateBoard(b);}
export const createBoard=(id=crypto.randomUUID(),title='Untitled board')=>{const lid=crypto.randomUUID();return {version:3,id,title,revision:0,activeLayer:lid,layers:[{id:lid,name:'Layer 1',visible:true,locked:false,opacity:1,blend:'normal',strokes:[]}],paper:{kind:'plain',color:'#faf8f3',spacing:24,seed:173}};};
export const createHistory=b=>({board:copy(validateBoard(b)),past:[],future:[],evicted:false});
function bounded(h){let total=h.past.reduce((a,b)=>a+bytes(b),0)+h.future.reduce((a,b)=>a+bytes(b),0);while(h.past.length+h.future.length>limits.history||total>limits.historyBytes){const b=h.past.length?h.past.shift():h.future.shift();total-=bytes(b);h.evicted=true;}return h;}
export function command(h,mutate){const b=copy(h.board);mutate(b);if(JSON.stringify(b)===JSON.stringify(h.board))return h;b.revision=h.board.revision+1;validateBoard(b);return bounded({board:b,past:[...h.past,h.board],future:[],evicted:h.evicted});}
export function undo(h){if(!h.past.length)return h;const b=copy(h.past.at(-1));b.revision=h.board.revision+1;validateBoard(b);return bounded({board:b,past:h.past.slice(0,-1),future:[...h.future,h.board],evicted:h.evicted});}
export function redo(h){if(!h.future.length)return h;const b=copy(h.future.at(-1));b.revision=h.board.revision+1;validateBoard(b);return bounded({board:b,past:[...h.past,h.board],future:h.future.slice(0,-1),evicted:h.evicted});}
export const toDocument=(x,y,v)=>({x:(x-v.x)/v.scale,y:(y-v.y)/v.scale});
export function zoomAt(v,x,y,scale){if(!v||!num(v.x,-1e7,1e7)||!num(v.y,-1e7,1e7)||!num(v.scale,.1,8)||!num(scale,.0000001,1e10)||!num(x,-1e7,1e7)||!num(y,-1e7,1e7))fail('Invalid zoom');scale=Math.max(.1,Math.min(8,scale));const q=toDocument(x,y,v);return {x:x-q.x*scale,y:y-q.y*scale,scale};}
export function migrateV1(v,dbRevision=0){
 if(!v||v.version!==1||!idOK(v.id)||typeof v.title!=='string'||v.title.length>128||!Number.isSafeInteger(v.revision)||v.revision<0||!Array.isArray(v.strokes))fail('Invalid legacy board');
 rejectPreset(v);for(const s of v.strokes)rejectPreset(s);const b=createBoard(v.id,v.title);b.revision=v.revision;b.layers[0].strokes=v.strokes.map(s=>({...copy(s),brush:'ink',opacity:1}));b.lineage={source:'unruly-foundation',revision:v.revision,dbRevision};return validateBoard(b);
}
export function importDocument(text){if(typeof text!=='string'||new TextEncoder().encode(text).length>limits.bytes)fail('Import exceeds 8 MiB');let b=JSON.parse(text);b=b?.version===1?migrateV1(b):b?.version===2?migrateV2(b):copy(validateBoard(b));b.id=crypto.randomUUID();for(const l of b.layers){const old=l.id;l.id=crypto.randomUUID();if(old===b.activeLayer)b.activeLayer=l.id;for(const s of l.strokes)s.id=crypto.randomUUID();}b.revision=0;delete b.lineage;return validateBoard(b);}
export function editable(b){const l=b.layers.find(l=>l.id===b.activeLayer);if(!l.visible||l.locked)fail('Active layer is hidden or locked');return l;}
export function addStroke(h,s){if(s.opacity===0)return h;return command(h,b=>editable(b).strokes.push(copy(s)));}
export function layerCommand(h,action,id,value){return command(h,b=>{
 const i=b.layers.findIndex(l=>l.id===id),l=b.layers[i];
 if(action==='add'){
  if(b.layers.length>=limits.layers)fail('Layer limit reached');
  const at=b.layers.findIndex(l=>l.id===b.activeLayer);
  const n={id:crypto.randomUUID(),name:'Layer '+(b.layers.length+1),visible:true,locked:false,opacity:1,blend:'normal',strokes:[]};
  b.layers.splice(at+1,0,n);b.activeLayer=n.id;return;
 }
 if(!l)fail('Layer missing');
 if(l.locked&&['delete','opacity','blend','clear','content','strokes'].includes(action))fail('Layer is locked');
 if(action==='select')b.activeLayer=id;
 else if(action==='delete'){
  if(b.layers.length===1)fail('Cannot delete the last layer');b.layers.splice(i,1);
  if(b.activeLayer===id)b.activeLayer=b.layers[Math.min(i,b.layers.length-1)].id;
 }else if(action==='duplicate'){
  if(b.layers.length>=limits.layers)fail('Layer limit reached');
  // Validate the entire candidate before allocating any persistent identities.
  const candidate=copy(b),duplicate=copy(l),used=new Set([b.id,...b.layers.flatMap(l=>[l.id,...l.strokes.map(s=>s.id)])]);let serial=0;
  const placeholder=()=>{let id;do{id=('u1-duplicate-'+serial++).padEnd(36,'0');}while(used.has(id));used.add(id);return id;};
  duplicate.id=placeholder();duplicate.locked=false;for(const s of duplicate.strokes)s.id=placeholder();
  candidate.layers.splice(i+1,0,duplicate);candidate.activeLayer=duplicate.id;candidate.revision=b.revision+1;validateBoard(candidate);
  duplicate.id=crypto.randomUUID();for(const s of duplicate.strokes)s.id=crypto.randomUUID();
  b.layers.splice(i+1,0,duplicate);b.activeLayer=duplicate.id;
 }else if(action==='reorder'){
  if(!Number.isInteger(value)||value<0||value>=b.layers.length)fail('Invalid layer position');
  if(value!==i){b.layers.splice(i,1);b.layers.splice(value,0,l);}
 }else if(action==='up'||action==='down'){
  const j=i+(action==='up'?1:-1);if(j>=0&&j<b.layers.length)[b.layers[i],b.layers[j]]=[b.layers[j],b.layers[i]];
 }else if(['name','visible','locked','opacity','blend'].includes(action))l[action]=value;
 else fail('Unknown layer action');
});}

const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,pressure:a.pressure===null||b.pressure===null?null:a.pressure+(b.pressure-a.pressure)*t});
export function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return dist(p,{x:a.x+t*dx,y:a.y+t*dy});}
function crossing(a,b,c,d){const ux=b.x-a.x,uy=b.y-a.y,vx=d.x-c.x,vy=d.y-c.y,den=ux*vy-uy*vx;if(Math.abs(den)<1e-7)return null;const t=((c.x-a.x)*vy-(c.y-a.y)*vx)/den,u=((c.x-a.x)*uy-(c.y-a.y)*ux)/den;return t>=-1e-7&&t<=1+1e-7&&u>=-1e-7&&u<=1+1e-7?Math.max(0,Math.min(1,t)):null;}
const segDistance=(a,b,c,d)=>crossing(a,b,c,d)!==null?0:Math.min(segmentDistance(a,c,d),segmentDistance(b,c,d),segmentDistance(c,a,b),segmentDistance(d,a,b));
const lengths=pts=>{const out=[0];for(let i=1;i<pts.length;i++)out.push(out.at(-1)+dist(pts[i-1],pts[i]));return out;};
function slicePath(pts,ls,start,end){const out=[];for(let i=0;i<pts.length-1;i++){if(ls[i+1]<start||ls[i]>end)continue;const length=ls[i+1]-ls[i];const a=lerp(pts[i],pts[i+1],length?Math.max(0,(start-ls[i])/length):0),z=lerp(pts[i],pts[i+1],length?Math.min(1,(end-ls[i])/length):1);if(!out.length||dist(out.at(-1),a)>1e-8)out.push(a);if(dist(a,z)>1e-8)out.push(z);}return out;}
export function eraseGesture(board,mode,sweeps,radius,options={}){
 const b=copy(validateBoard(board)),layer=editable(b);if(!['whole','partial','intersection'].includes(mode)||!num(radius,.1,1000)||!Array.isArray(sweeps)||sweeps.length>2000)fail('Invalid eraser gesture');
 let work=0;const workLimit=options.comparisons??limits.comparisons;const check=()=>{if(++work>workLimit)fail('Eraser work limit reached; gesture cancelled');};
 const paths=sweeps.map(q=>({a:q.a,b:q.b}));for(const q of paths)for(const p of [q.a,q.b])if(!p||!num(p.x,-1e7,1e7)||!num(p.y,-1e7,1e7))fail('Invalid sweep');
 const original=layer.strokes;let changed=false;
 layer.strokes=original.flatMap(s=>{
 const pts=s.points,ls=lengths(pts),total=ls.at(-1),rr=radius+s.size/2;let hit=false,hitAt=[];
 for(const sw of paths){let best=Infinity,at=0;if(pts.length===1){check();best=segmentDistance(pts[0],sw.a,sw.b);}else for(let i=1;i<pts.length;i++){check();const dd=segDistance(pts[i-1],pts[i],sw.a,sw.b);if(dd<best){best=dd;const a=pts[i-1],z=pts[i],dx=z.x-a.x,dy=z.y-a.y,t=Math.max(0,Math.min(1,((sw.b.x-a.x)*dx+(sw.b.y-a.y)*dy)/(dx*dx+dy*dy||1)));at=ls[i-1]+t*(ls[i]-ls[i-1]);}}if(best<=rr){hit=true;hitAt.push(at);}}
 if(!hit)return [s];changed=true;if(mode==='whole'||pts.length===1||total===0)return [];
 let fragments=[];
 if(mode==='intersection'){
 const cuts=[0,total];for(let i=1;i<pts.length;i++)for(const other of original){if(other.opacity===0)continue;for(let j=1;j<other.points.length;j++){if(other.id===s.id&&Math.abs(i-j)<=1)continue;check();const t=crossing(pts[i-1],pts[i],other.points[j-1],other.points[j]);if(t!==null){const c=other.points[j-1],d=other.points[j],ux=pts[i].x-pts[i-1].x,uy=pts[i].y-pts[i-1].y,side=p=>ux*(p.y-pts[i-1].y)-uy*(p.x-pts[i-1].x);const vertex=Math.abs(side(c))<1e-7?j-1:Math.abs(side(d))<1e-7?j:-1;const tangent=vertex>0&&vertex<other.points.length-1&&side(other.points[vertex-1])*side(other.points[vertex+1])>0;if(!tangent)cuts.push(ls[i-1]+t*(ls[i]-ls[i-1]));}}}
 cuts.sort((a,z)=>a-z);const unique=cuts.filter((x,i)=>!i||x-cuts[i-1]>1e-7);const removed=new Set();for(const at of hitAt){let index=unique.findIndex(x=>x>at+1e-7)-1;if(index<0)index=unique.length-2;removed.add(index);}let start=0;
 for(let i=0;i<unique.length-1;i++){if(removed.has(i)){if(unique[i]>start+1e-7)fragments.push(slicePath(pts,ls,start,unique[i]));start=unique[i+1];}}if(total>start+1e-7)fragments.push(slicePath(pts,ls,start,total));
 }else{
 const step=Math.min(2,radius/2);let samples=1;for(let i=1;i<pts.length;i++)samples+=Math.max(1,Math.ceil((ls[i]-ls[i-1])/step));if(samples>limits.eraseSamples)fail('Partial eraser precision limit; gesture cancelled');
 let fragment=[],prev=null,prevHit=false;
 const inside=p=>paths.some(sw=>{check();return segmentDistance(p,sw.a,sw.b)<=rr;});
 const visit=p=>{const yes=inside(p);if(prev&&yes!==prevHit){let low=0,high=1;for(let k=0;k<12;k++){const mid=(low+high)/2;if(inside(lerp(prev,p,mid))===prevHit)low=mid;else high=mid;}const cut=lerp(prev,p,(low+high)/2);if(yes){fragment.push(cut);if(fragment.length)fragments.push(fragment);fragment=[];}else fragment=[cut];}if(!yes)fragment.push(p);prev=p;prevHit=yes;};
 visit(pts[0]);for(let i=1;i<pts.length;i++){const n=Math.max(1,Math.ceil((ls[i]-ls[i-1])/step));for(let j=1;j<=n;j++)visit(lerp(pts[i-1],pts[i],j/n));}if(fragment.length)fragments.push(fragment);
 }
 return fragments.filter(p=>p.length>0).map(points=>({...s,id:crypto.randomUUID(),points}));});
 validateBoard(b);return changed?b:board;
}
