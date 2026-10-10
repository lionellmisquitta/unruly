import {transformRaster} from './raster.js';
// Original bounded vector selection. MIT. No DOM, storage or system clipboard.
import {limits,validateBoard,editable,command,createBoard} from './model.js';
const clone=x=>structuredClone(x),finite=x=>typeof x==='number'&&Number.isFinite(x),fail=m=>{throw Error(m);};
function scoped(board,options={},write=false){
 validateBoard(board);const ids=options.layerIds??[board.activeLayer];
 if(!Array.isArray(ids)||!ids.length||ids.length>limits.layers||new Set(ids).size!==ids.length||ids.some(id=>typeof id!=='string'||!board.layers.some(l=>l.id===id)))fail('Invalid selection layers');
 const layers=board.layers.filter(l=>ids.includes(l.id));
 if(write&&layers.some(l=>l.locked||!l.visible))fail('Selected layer is locked or hidden');return layers;
}
function chosen(board,ids,write=false,options={}){const layers=scoped(board,options,write);if(!Array.isArray(ids)||ids.length>limits.strokes||ids.some(id=>typeof id!=='string'||!id||id.length>128)||new Set(ids).size!==ids.length)fail('Invalid selection IDs');const set=new Set(ids),strokes=layers.flatMap(l=>l.strokes),map=new Map(strokes.map(s=>[s.id,s]));if(ids.some(id=>!map.has(id)))fail('Selection is stale or belongs to another layer');return strokes.filter(s=>set.has(s.id));}
function boundsOf(strokes){if(!strokes.length)return null;let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;for(const s of strokes)for(const p of s.points){minX=Math.min(minX,p.x-s.size/2);minY=Math.min(minY,p.y-s.size/2);maxX=Math.max(maxX,p.x+s.size/2);maxY=Math.max(maxY,p.y+s.size/2);}return{minX,minY,maxX,maxY,width:maxX-minX,height:maxY-minY,cx:(minX+maxX)/2,cy:(minY+maxY)/2};}
export function selectionBounds(board,ids,options={}){return boundsOf(chosen(board,ids,false,options));}
const cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
const on=(p,a,b)=>Math.abs(cross(a,b,p))<=1e-7&&p.x>=Math.min(a.x,b.x)-1e-7&&p.x<=Math.max(a.x,b.x)+1e-7&&p.y>=Math.min(a.y,b.y)-1e-7&&p.y<=Math.max(a.y,b.y)+1e-7;
function segments(a,b,c,d){if(on(a,c,d)||on(b,c,d)||on(c,a,b)||on(d,a,b))return true;return (cross(a,b,c)>0)!==(cross(a,b,d)>0)&&(cross(c,d,a)>0)!==(cross(c,d,b)>0);}
export function selectLasso(board,polygon,options={}){
 const layers=scoped(board,options,true);if(!Array.isArray(polygon)||polygon.length<3||polygon.length>512||polygon.some(p=>!p||!finite(p.x)||!finite(p.y)||Math.abs(p.x)>1e7||Math.abs(p.y)>1e7)||new Set(polygon.map(p=>p.x+','+p.y)).size<3)fail('Lasso needs a valid loop (3–512 points)');let area=0;for(let i=0;i<polygon.length;i++){const p=polygon[i],q=polygon[(i+1)%polygon.length];area+=p.x*q.y-q.x*p.y;}if(Math.abs(area)/2<1)fail('Lasso loop is too small or ambiguous');const limit=options.comparisons??200000;if(!Number.isSafeInteger(limit)||limit<1||limit>200000)fail('Invalid lasso work limit');let count=0;const check=()=>{if(++count>limit)fail('Lasso work limit reached; selection unchanged');};
 // Exact broad phase: index edges by Y; never replace polygon truth with a box.
 const minX=Math.min(...polygon.map(p=>p.x)),maxX=Math.max(...polygon.map(p=>p.x)),minY=Math.min(...polygon.map(p=>p.y)),maxY=Math.max(...polygon.map(p=>p.y));
 const bins=Array.from({length:64},()=>[]),bin=y=>Math.max(0,Math.min(63,Math.floor((y-minY)/Math.max(1e-7,maxY-minY)*64)));
 const edges=polygon.map((a,i)=>{const b=polygon[(i+1)%polygon.length];return{a,b,minX:Math.min(a.x,b.x),maxX:Math.max(a.x,b.x),minY:Math.min(a.y,b.y),maxY:Math.max(a.y,b.y)};});
 edges.forEach((e,i)=>{for(let j=bin(e.minY-1e-7);j<=bin(e.maxY+1e-7);j++)bins[j].push(i);});
 function insideRaw(p){check();if(p.x<minX-1e-7||p.x>maxX+1e-7||p.y<minY-1e-7||p.y>maxY+1e-7)return false;let yes=false;for(const i of bins[bin(p.y)]){const e=edges[i];if(p.y<e.minY-1e-7||p.y>e.maxY+1e-7)continue;check();const{a,b}=e;if(on(p,a,b))return true;if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)yes=!yes;}return yes;}
 const pointMemo=new Map();function inside(p){const key=p.x+','+p.y;if(pointMemo.has(key))return pointMemo.get(key);const result=insideRaw(p);if(pointMemo.size<4096)pointMemo.set(key,result);return result;}
 function intersects(a,b){const loX=Math.min(a.x,b.x),hiX=Math.max(a.x,b.x),loY=Math.min(a.y,b.y),hiY=Math.max(a.y,b.y);if(hiX<minX||loX>maxX||hiY<minY||loY>maxY)return false;const seen=new Set();for(let j=bin(loY);j<=bin(hiY);j++)for(const i of bins[j]){if(seen.has(i))continue;seen.add(i);const e=edges[i];if(hiX<e.minX-1e-7||loX>e.maxX+1e-7||hiY<e.minY-1e-7||loY>e.maxY+1e-7)continue;check();if(segments(a,b,e.a,e.b))return true;}return false;}
 const result=layers.flatMap(l=>l.strokes).filter(s=>{
  let loX=Infinity,loY=Infinity,hiX=-Infinity,hiY=-Infinity;for(const p of s.points){loX=Math.min(loX,p.x);hiX=Math.max(hiX,p.x);loY=Math.min(loY,p.y);hiY=Math.max(hiY,p.y);}if(hiX<minX-1e-7||loX>maxX+1e-7||hiY<minY-1e-7||loY>maxY+1e-7)return false;
  if(s.brush==='raster'){const center={x:s.points.slice(0,4).reduce((n,p)=>n+p.x,0)/4,y:s.points.slice(0,4).reduce((n,p)=>n+p.y,0)/4};if(inside(center))return true;const polygonContains=p=>{let yes=false;for(let i=0;i<4;i++){check();const a=s.points[i],b=s.points[i+1];if(on(p,a,b))return true;if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)yes=!yes;}return yes;};if(polygon.some(polygonContains))return true;}
  for(let i=0;i<s.points.length;i++){if(inside(s.points[i]))return true;if(i&&intersects(s.points[i-1],s.points[i]))return true;}return false;
 }).map(s=>s.id);if(options.stats)options.stats.comparisons=count;return result;
}
export function copySelection(board,ids,options={}){if(scoped(board,options).some(l=>!l.visible))fail('Active layer is hidden');const strokes=clone(chosen(board,ids,false,options));if(!strokes.length)fail('Nothing selected');const payload={version:1,strokes,bounds:boundsOf(strokes)};checkClipboard(payload);return payload;}
function checkClipboard(payload){if(!payload||payload.version!==1||!Array.isArray(payload.strokes)||!payload.strokes.length||new TextEncoder().encode(JSON.stringify(payload)).length>limits.bytes)fail('Invalid or oversized clipboard');const b=createBoard();if(payload.strokes.some(s=>s.brush==='raster'))b.version=4;b.layers[0].strokes=clone(payload.strokes);validateBoard(b);return {strokes:b.layers[0].strokes,bounds:selectionBounds(b,b.layers[0].strokes.map(s=>s.id))};}
export function deleteSelection(h,ids,options={}){chosen(h.board,ids,true,options);if(!ids.length)return h;const set=new Set(ids);return command(h,b=>{for(const l of b.layers)l.strokes=l.strokes.filter(s=>!set.has(s.id));});}
export function moveSelection(h,ids,dx,dy,options={}){chosen(h.board,ids,true,options);if(!finite(dx)||!finite(dy))fail('Invalid movement');if(!ids.length||dx===0&&dy===0)return h;const set=new Set(ids);return command(h,b=>{for(const l of b.layers)for(const s of l.strokes)if(set.has(s.id)){if(s.brush==='raster')transformRaster(s,[1,0,0,1,dx,dy]);else for(const p of s.points){p.x+=dx;p.y+=dy;}}});}
export function pasteSelection(h,payload,x,y){editable(h.board);if(!finite(x)||!finite(y))fail('Invalid paste position');const {strokes,bounds}=checkClipboard(payload),dx=x-bounds.cx,dy=y-bounds.cy;return command(h,b=>{for(const s of strokes){s.id=crypto.randomUUID();if(s.brush==='raster'){b.version=4;transformRaster(s,[1,0,0,1,dx,dy]);}else for(const p of s.points){p.x+=dx;p.y+=dy;}}editable(b).strokes.push(...strokes);});}

export function transformSelection(h,ids,params={},options={}){
 const strokes=chosen(h.board,ids,true,options);if(!strokes.length)return h;
 const bounds=boundsOf(strokes),dx=Number(params.dx??0),dy=Number(params.dy??0),scale=Number(params.scale??1),angle=Number(params.angle??0),cx=Number(params.cx??bounds.cx),cy=Number(params.cy??bounds.cy);
 if(![dx,dy,scale,angle,cx,cy].every(finite)||scale<.05||scale>20||Math.abs(angle)>360)fail('Invalid transform');
 if(dx===0&&dy===0&&scale===1&&angle===0)return h;
 const rad=angle*Math.PI/180,cos=Math.cos(rad),sin=Math.sin(rad),set=new Set(ids);
 return command(h,b=>{for(const l of b.layers)for(const s of l.strokes)if(set.has(s.id)){if(s.brush==='raster'){transformRaster(s,[scale*cos,scale*sin,-scale*sin,scale*cos,cx+dx-scale*cos*cx+scale*sin*cy,cy+dy-scale*sin*cx-scale*cos*cy]);continue;}for(const p of s.points){const x=(p.x-cx)*scale,y=(p.y-cy)*scale;p.x=cx+x*cos-y*sin+dx;p.y=cy+x*sin+y*cos+dy;}}});
}
