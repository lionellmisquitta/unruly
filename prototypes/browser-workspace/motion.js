// Saved cue schema and disposable motion geometry. No model, DOM or storage imports.
import {folderLayers,layerState} from './folders.js';
import {transformRaster} from './raster.js';
import {transformText} from './text.js';
export const motionLimits=Object.freeze({cues:24,path:128,bytes:2*1024*1024,durationMin:250,durationMax:30000});
const fail=m=>{throw Error(m);},clone=x=>structuredClone(x);
const number=(v,min=-1e7,max=1e7)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
const id=v=>typeof v==='string'&&v.length>0&&v.length<=128;
function keys(v,list){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).sort().join(',')!==[...list].sort().join(','))fail('Invalid motion fields');}
function ids(v){if(!Array.isArray(v)||!v.length||v.length>2000||new Set(v).size!==v.length||!v.every(id))fail('Invalid motion target identities');}
export function encodeMotionMask(mask){if(!(mask instanceof Uint8Array)||!mask.length||mask.length>1024*1024||mask.some(x=>x>1))fail('Invalid motion region mask');let s='';for(let i=0;i<mask.length;i+=8192)s+=String.fromCharCode(...mask.subarray(i,i+8192));return btoa(s);}
export function decodeMotionMask(target){const r=target.rect;if(typeof target.mask!=='string'||target.mask.length!==4*Math.ceil(r.width*r.height/3))fail('Invalid motion mask length');let raw;try{raw=atob(target.mask);}catch{fail('Invalid motion mask encoding');}if(raw.length!==r.width*r.height||btoa(raw)!==target.mask)fail('Invalid motion mask encoding');const data=Uint8Array.from(raw,c=>c.charCodeAt(0));if(data.some(x=>x>1)||!data.some(Boolean))fail('Empty or invalid motion region');return data;}
export function validateTarget(t){
 if(t?.kind==='objects'){keys(t,['kind','ids']);ids(t.ids);}
 else if(t?.kind==='folder'){keys(t,['kind','id']);if(!id(t.id))fail('Invalid motion folder');}
 else if(t?.kind==='region'){keys(t,['kind','layerId','rect','mask','sourceIds']);if(!id(t.layerId))fail('Invalid motion region layer');ids(t.sourceIds);keys(t.rect,['x','y','width','height']);const r=t.rect;if(![r.x,r.y,r.width,r.height].every(Number.isInteger)||![r.x,r.y,r.x+r.width,r.y+r.height].every(n=>number(n))||!number(r.width,1,1024)||!number(r.height,1,1024))fail('Invalid motion region rectangle');decodeMotionMask(t);}
 else fail('Invalid motion target');return t;
}
export function validateCue(c){
 if(c?.kind==='move'){keys(c,['id','name','kind','target','path','duration']);validateTarget(c.target);if(!Array.isArray(c.path)||c.path.length<2||c.path.length>motionLimits.path)fail('Motion path needs 2–128 points');for(const p of c.path){keys(p,['x','y']);if(!number(p.x)||!number(p.y))fail('Invalid motion path point');}if(c.path[0].x!==0||c.path[0].y!==0||!c.path.some(p=>p.x!==0||p.y!==0))fail('Motion path must start at zero and move');}
 else if(c?.kind==='camera'){keys(c,['id','name','kind','target','duration']);keys(c.target,['x','y','scale']);if(!number(c.target.x)||!number(c.target.y)||!number(c.target.scale,.1,8))fail('Invalid motion camera');}
 else fail('Invalid motion cue kind');
 if(!id(c.id)||typeof c.name!=='string'||!c.name.trim()||c.name.length>64||!Number.isInteger(c.duration)||!number(c.duration,250,30000))fail('Invalid motion cue name or duration');return c;
}
export function validateMotion(board,used=new Set()){
 if(!Object.hasOwn(board,'motion'))return;
 if(board.version<14)fail('Motion cues require v14');keys(board.motion,['version','cues']);if(board.motion.version!==1||!Array.isArray(board.motion.cues)||board.motion.cues.length>motionLimits.cues||new TextEncoder().encode(JSON.stringify(board.motion)).length>motionLimits.bytes)fail('Motion cue capacity exceeded');
 const seen=new Set(used);for(const c of board.motion.cues){validateCue(c);if(seen.has(c.id))fail('Duplicate motion identity');seen.add(c.id);}
}
export function mutateMotion(board,action,value){
 if(action==='save'){validateCue(value);board.version=Math.max(14,board.version);board.folders=board.folders||[];board.motion=board.motion||{version:1,cues:[]};const at=board.motion.cues.findIndex(c=>c.id===value.id);if(at<0)board.motion.cues.push(clone(value));else board.motion.cues[at]=clone(value);}
 else{const cues=board.motion?.cues,at=cues?.findIndex(c=>c.id===value);if(at===undefined||at<0)fail('Motion cue no longer exists');if(action==='delete')cues.splice(at,1);else if(action==='up'||action==='down'){const to=at+(action==='up'?-1:1);if(to>=0&&to<cues.length)[cues[at],cues[to]]=[cues[to],cues[at]];}else fail('Invalid motion action');}
 validateMotion(board);
}
export function remapMotion(board,map){if(!board.motion)return;for(const c of board.motion.cues){c.id=crypto.randomUUID();if(c.kind!=='move')continue;const t=c.target;if(t.kind==='objects')t.ids=t.ids.map(x=>map.get(x)||x);else if(t.kind==='folder')t.id=map.get(t.id)||t.id;else{t.layerId=map.get(t.layerId)||t.layerId;t.sourceIds=t.sourceIds.map(x=>map.get(x)||x);}}}
export function resolveTarget(board,target){
 validateTarget(target);let layers,strokes;
 if(target.kind==='folder'){const folder=(board.folders||[]).find(f=>f.id===target.id);if(!folder)fail('Motion folder is missing · replace or delete this cue');layers=folderLayers(board,folder.id);strokes=layers.flatMap(l=>l.strokes);}
 else if(target.kind==='region'){layers=board.layers.filter(l=>l.id===target.layerId);if(layers.length!==1||layers[0].strokes.length!==target.sourceIds.length||target.sourceIds.some((x,i)=>layers[0].strokes[i]?.id!==x))fail('Motion region source changed · select it again');strokes=layers[0].strokes;}
 else{const selected=new Set(target.ids);layers=board.layers.filter(l=>l.strokes.some(s=>selected.has(s.id)));strokes=layers.flatMap(l=>l.strokes.filter(s=>selected.has(s.id)));if(strokes.length!==target.ids.length)fail('Motion artwork is missing · replace or delete this cue');}
 if(!layers.length||!strokes.length)fail('Motion target is empty');if(layers.some(l=>{const state=layerState(board,l);return state.locked||!state.visible;}))fail('Motion target is locked or hidden');return{layers,strokes};
}
export function targetAnchor(board,target){const{strokes}=resolveTarget(board,target);if(target.kind==='region'){const r=target.rect;return{x:r.x+r.width/2,y:r.y+r.height/2};}let x=Infinity,y=Infinity,xx=-Infinity,yy=-Infinity;for(const s of strokes)for(const p of s.points){x=Math.min(x,p.x);y=Math.min(y,p.y);xx=Math.max(xx,p.x);yy=Math.max(yy,p.y);}return{x:(x+xx)/2,y:(y+yy)/2};}
export function pathPosition(path,progress){if(!number(progress,0,1))fail('Invalid motion progress');const lengths=[0];for(let i=1;i<path.length;i++)lengths.push(lengths.at(-1)+Math.hypot(path[i].x-path[i-1].x,path[i].y-path[i-1].y));const distance=progress*lengths.at(-1);let i=1;while(i<path.length-1&&lengths[i]<distance)i++;const t=(distance-lengths[i-1])/(lengths[i]-lengths[i-1]||1),a=path[i-1],b=path[i];return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}
function translateStroke(s,dx,dy){if(s.brush==='raster')transformRaster(s,[1,0,0,1,dx,dy]);else if(s.brush==='text')transformText(s,[1,0,0,1,dx,dy]);else for(const p of s.points){p.x+=dx;p.y+=dy;}if(s.points.some(p=>!number(p.x)||!number(p.y)))fail('Motion would exceed document coordinates');}
export function moveTarget(board,target,dx,dy){if(target.kind==='region')fail('Prepare selected pixels before movement');if(!number(dx)||!number(dy))fail('Invalid motion displacement');const{layers,strokes}=resolveTarget(board,target),selected=new Set(strokes.map(s=>s.id)),layerIds=new Set(layers.map(l=>l.id)),out=clone(board);for(const l of out.layers){for(const s of l.strokes)if(selected.has(s.id))translateStroke(s,dx,dy);if(target.kind==='folder'&&layerIds.has(l.id)&&l.mask?.patch)translateStroke(l.mask.patch,dx,dy);}return out;}
export function cameraView(camera,size){return{x:size.width/2-camera.x*camera.scale,y:size.height/2-camera.y*camera.scale,scale:camera.scale};}
export function cameraAt(view,size){if(!view||![view.x,view.y].every(n=>number(n))||!number(view.scale,.1,8)||!size||![size.width,size.height].every(n=>number(n,1,100000)))fail('Invalid motion viewport');return{x:(size.width/2-view.x)/view.scale,y:(size.height/2-view.y)/view.scale,scale:view.scale};}
export function compileMotion(board,cues,view,size,prepareRegion){
 if(!Array.isArray(cues)||!cues.length||cues.length>24)fail('Save or select a motion cue first');let current=board,camera=cameraAt(view,size);const segments=[],regions=new Map();
 for(const cue of cues){validateCue(cue);let target=cue.target,base=current;if(cue.kind==='move'){if(target.kind==='region'&&regions.has(JSON.stringify(target))){target=regions.get(JSON.stringify(target));resolveTarget(base,target);}else{resolveTarget(base,target);if(target.kind==='region'){if(!prepareRegion)fail('Motion region preparation unavailable');const key=JSON.stringify(target),prepared=prepareRegion(base,target);base=prepared.board;target=prepared.target;regions.set(key,target);}}const end=pathPosition(cue.path,1);current=moveTarget(base,target,end.x,end.y);}const nextCamera=cue.kind==='camera'?clone(cue.target):camera;segments.push({cue:clone(cue),target,base,from:camera,to:nextCamera});camera=nextCamera;}
 return{original:board,view:clone(view),size:clone(size),segments};
}
export function sampleMotion(session,index,progress){if(!Number.isInteger(index)||index<0||index>=session.segments.length||!number(progress,0,1))fail('Invalid motion playback position');const s=session.segments[index];let board=s.base;if(s.cue.kind==='move'){const p=pathPosition(s.cue.path,progress);board=moveTarget(s.base,s.target,p.x,p.y);}const camera={x:s.from.x+(s.to.x-s.from.x)*progress,y:s.from.y+(s.to.y-s.from.y)*progress,scale:s.from.scale*Math.pow(s.to.scale/s.from.scale,progress)};const hasGeometry=session.segments.slice(0,index).some(x=>x.cue.kind==='move'&&Math.hypot(...Object.values(pathPosition(x.cue.path,1)))>0)||(s.cue.kind==='move'&&Math.hypot(...Object.values(pathPosition(s.cue.path,progress)))>0);return{board,view:cameraView(camera,session.size),hasGeometry};}
