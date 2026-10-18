// Native v18 attachments. Pure geometry; no renderer, model or storage imports.
import {layerState} from './folders.js';
const copy=x=>structuredClone(x),fail=m=>{throw Error(m);};
const id=x=>typeof x==='string'&&x.length>0&&x.length<=128;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function index(board){return new Map(board.layers.flatMap(l=>l.strokes.map(s=>[s.id,{s,l}])));}
function bounds(s){let x=Infinity,y=Infinity,xx=-Infinity,yy=-Infinity;for(const p of s.points){x=Math.min(x,p.x);y=Math.min(y,p.y);xx=Math.max(xx,p.x);yy=Math.max(yy,p.y);}const pad=['text','raster'].includes(s.brush)?0:s.size/2;return{cx:(x+xx)/2,cy:(y+yy)/2,rx:(xx-x)/2+pad,ry:(yy-y)/2+pad};}
function edge(b,t){const dx=t.x-b.cx,dy=t.y-b.cy,k=Math.min(dx?b.rx/Math.abs(dx):Infinity,dy?b.ry/Math.abs(dy):Infinity);return{x:b.cx+dx*(Number.isFinite(k)?k:0),y:b.cy+dy*(Number.isFinite(k)?k:0),pressure:null};}
export function connectorPoints(a,b,kind,size){
 const p=q=>({x:q.x,y:q.y,pressure:null}),points=[p(a),p(b)];
 if(kind==='arrow'){const dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy),ux=n?dx/n:1,uy=n?dy/n:0,len=Math.min(Math.max(8,size*4),Math.max(0,n*.35)),w=len*.5;points.push(p({x:b.x-ux*len-uy*w,y:b.y-uy*len+ux*w}),p(b),p({x:b.x-ux*len+uy*w,y:b.y-uy*len-ux*w}));}
 return points;
}
function shape(s,map,cache=new Map()){
 const c=s.connector,a=s.points[0],b=s.points[1],box=key=>{if(!cache.has(key))cache.set(key,bounds(map.get(key).s));return cache.get(key);},from=c.from?box(c.from):null,to=c.to?box(c.to):null;
 const start=from?edge(from,to?{x:to.cx,y:to.cy}:b):a,end=to?edge(to,from?{x:from.cx,y:from.cy}:a):b;
 return connectorPoints(start,end,c.kind,s.size);
}
function schema(s){const c=s.connector;if(!c||Object.keys(c).sort().join(',')!=='from,kind,to,version'||c.version!==1||!['line','arrow'].includes(c.kind)||![c.from,c.to].every(x=>x===null||id(x))||c.from&&c.from===c.to||s.brush!=='ink'||s.preset!=='ink-fineliner'||s.size>12||['tip','tipReflection','dynamics','recipe','artworkPath'].some(k=>Object.hasOwn(s,k))||s.points.length!==(c.kind==='arrow'?5:2))fail('Invalid connector metadata');}
export function validateConnectors(board){
 const map=index(board),cache=new Map();for(const {s} of map.values())if(Object.hasOwn(s,'connector')){
  if(board.version<18)fail('Connectors require native v18');schema(s);
  for(const target of [s.connector.from,s.connector.to])if(target&&(!map.has(target)||map.get(target).s.connector))fail('Connector target missing or cyclic');
  const expected=shape(s,map,cache);if(s.points.some((p,i)=>p.pressure!==null||Math.abs(p.x-expected[i].x)>1e-7||Math.abs(p.y-expected[i].y)>1e-7))fail('Connector geometry is stale');
 }
}
// Reconcile only a command candidate; imports are validated without repair.
export function syncConnectors(board,previous){
 const map=index(board),old=previous?index(previous):new Map(),cache=new Map();
 for(const {s,l} of map.values())if(s.connector){
  schema(s);const prior=old.get(s.id)?.s;
  for(const key of ['from','to']){const target=s.connector[key];if(target&&!map.has(target))s.connector[key]=null;}
  s.points=shape(s,map,cache);
  if(prior&&!same(prior,s)){const state=layerState(previous,old.get(s.id).l);if(state.locked||!state.visible)fail('Unlock and show the connector layer before changing its attachments');}
 }
}
export function remapConnectors(strokes,map,detachMissing=false){for(const s of strokes)if(s.connector)for(const key of ['from','to']){const target=s.connector[key];if(target)s.connector[key]=map.get(target)??(detachMissing?null:target);}}
export function detachMovedConnectors(board,selected){for(const l of board.layers)for(const s of l.strokes)if(s.connector&&selected.has(s.id))for(const key of ['from','to'])if(!selected.has(s.connector[key]))s.connector[key]=null;}
export function mutateConnector(board,ids,kind,{color='#223344',size=3}={}){
 if(!Array.isArray(ids)||ids.length!==2||new Set(ids).size!==2||!['line','arrow'].includes(kind))fail('Select exactly two whole objects for a connector');
 const map=index(board),targets=ids.map(id=>map.get(id));if(targets.some(t=>!t||t.s.connector))fail('Select two existing drawings, text objects or images');
 const layer=board.layers.find(l=>l.id===board.activeLayer);if([...targets.map(t=>t.l),layer].some(l=>{const state=layerState(board,l);return state.locked||!state.visible;}))fail('Connector and target layers must be visible and unlocked');
 if(!/^#[0-9a-f]{6}$/i.test(color)||!Number.isFinite(size)||size<1||size>12)fail('Invalid connector colour or width');
 const ordered=board.layers.flatMap(l=>l.strokes).filter(s=>ids.includes(s.id)),s={id:crypto.randomUUID(),brush:'ink',preset:'ink-fineliner',size,color,opacity:1,points:connectorPoints(ordered[0].points[0],ordered[1].points[0],kind,size),connector:{version:1,kind,from:ordered[0].id,to:ordered[1].id}};
 board.version=Math.max(18,board.version);board.folders=board.folders||[];layer.strokes.push(s);syncConnectors(board);return s.id;
}
export function mutateConnectorAction(board,id,action){const item=index(board).get(id);if(!item?.s.connector)fail('Select one connector');const {s,l}=item,state=layerState(board,l);if(state.locked||!state.visible)fail('Connector layer is locked or hidden');if(action==='detach')delete s.connector;else if(action==='reverse'){[s.connector.from,s.connector.to]=[s.connector.to,s.connector.from];s.points=connectorPoints(s.points[1],s.points[0],s.connector.kind,s.size);}else fail('Invalid connector action');}
