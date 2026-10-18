// Region conversion is disposable until an explicit geometry commit.
import {decodeMotionMask,resolveTarget,validateCue} from './motion.js';
import {createHistory,validateBoard} from './model.js';
import {prepareRegionTransform,splitPixels,validateSnapshot} from './wand.js';
import {remainingRegionTiles,layerTiles} from './lasso-region.js';
import {nativePixelSnapshot} from './pixel-surface.js';
import {rasterStroke} from './raster.js';
import {tipRadius} from './custom-tips.js';
export function prepareMotionRegion(board,target,snapshotRegion){
 const layer=board.layers.find(l=>l.id===target.layerId);if(!layer)throw Error('Motion region layer missing');const region={board,layerId:layer.id,snapshot:snapshotRegion(layer,target.rect),mask:decodeMotionMask(target)};
 region.remainingFactory=()=>remainingRegionTiles(layer,region,snapshotRegion);
 const h=createHistory(board),prepared=prepareRegionTransform(h,{...region,board:h.board});
 return{board:prepared.working.board,target:{kind:'objects',ids:[prepared.id]}};
}

// Source ownership is session-local; only the existing cue target schema is
// rewritten in the disposable result, ready for an explicit one-Undo commit.
export const mixedMotionLimits=Object.freeze({pixels:16*1024*1024,fragments:256});
const regionKey=t=>JSON.stringify([t.layerId,t.rect.x,t.rect.y,t.rect.width,t.rect.height,t.mask,t.sourceIds]);
function strokeRect(s){
 let x=Infinity,y=Infinity,xx=-Infinity,yy=-Infinity;for(const p of s.points){x=Math.min(x,p.x);y=Math.min(y,p.y);xx=Math.max(xx,p.x);yy=Math.max(yy,p.y);}
 const pad=['raster','text'].includes(s.brush)?0:tipRadius(s)+2,left=Math.floor(x-pad),top=Math.floor(y-pad);
 return{x:left,y:top,width:Math.max(1,Math.ceil(xx+pad)-left),height:Math.max(1,Math.ceil(yy+pad)-top)};
}
const intersects=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
export function prepareMixedMotionRegions(board,cues,snapshotRegion){
 const regionCues=cues.filter(c=>c.kind==='move'&&c.target.kind==='region'),other=cues.filter(c=>c.kind==='move'&&c.target.kind!=='region');
 if(!regionCues.length||!other.length)return null;
 for(const c of cues){validateCue(c);if(c.kind==='move')resolveTarget(board,c.target);}
 const mixed=new Set(regionCues.filter(c=>other.some(o=>resolveTarget(board,o.target).layers.some(l=>l.id===c.target.layerId))).map(c=>c.target.layerId));
 if(!mixed.size)return null;
 const sourceIds=new Set(board.layers.filter(l=>mixed.has(l.id)).flatMap(l=>l.strokes.map(s=>s.id)));
 if(board.layers.some(l=>l.strokes.some(s=>s.connector&&(sourceIds.has(s.id)||sourceIds.has(s.connector.from)||sourceIds.has(s.connector.to)))))throw Error('Detach connectors before combining pixel-region and object motion on this layer');
 const out=structuredClone(board),entries=new Map(out.layers.filter(l=>mixed.has(l.id)).map(l=>[l.id,l.strokes.map(stroke=>({stroke,source:stroke.id,regions:new Set()}))])),regions=new Map();
 for(const c of [...cues,...(board.motion?.cues||[])])if(c.kind==='move'&&c.target.kind==='region'&&mixed.has(c.target.layerId)){
  resolveTarget(board,c.target);const key=regionKey(c.target);if(!regions.has(key))regions.set(key,{target:c.target,mask:decodeMotionMask(c.target)});
 }
 let pixels=0,fragments=0;
 const snapshot=(layer,rect,stroke)=>{
  pixels+=rect.width*rect.height;if(pixels>mixedMotionLimits.pixels)throw Error('Mixed motion pixel work limit reached; use a smaller selection or fewer overlapping sources');
  const native=stroke.opacity===1?nativePixelSnapshot(stroke):null;
  return validateSnapshot(native&&native.x===rect.x&&native.y===rect.y&&native.width===rect.width&&native.height===rect.height?native:snapshotRegion(layer,rect));
 };
 for(const [key,{target,mask}] of regions){
  const layer=out.layers.find(l=>l.id===target.layerId),next=[];
  for(const entry of entries.get(layer.id)){
   const s=entry.stroke,rect=strokeRect(s);if(!intersects(rect,target.rect)||s.opacity===0){next.push(entry);continue;}
   const single={...layer,strokes:[s]},native=s.opacity===1?nativePixelSnapshot(s):null,tiles=native?[{x:native.x,y:native.y,width:native.width,height:native.height}]:rect.width<=1024&&rect.height<=1024?[rect]:layerTiles(single),parts=[];let selected=false;
   for(const tile of tiles){
    const image=snapshot(single,tile,s),local=new Uint8Array(image.width*image.height);let count=0;
    for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++){
     const rx=image.x+x-target.rect.x,ry=image.y+y-target.rect.y;if(rx>=0&&ry>=0&&rx<target.rect.width&&ry<target.rect.height&&mask[ry*target.rect.width+rx]){local[y*image.width+x]=1;count++;}
    }
    if(!count){if(image.data.some((v,i)=>i%4===3&&v))parts.push({...entry,stroke:rasterStroke(image.data,image.width,image.height,image.x,image.y)});continue;}
    const split=splitPixels(image,local);
    if(split.remaining)parts.push({...entry,stroke:split.remaining});
    if(split.pigment){selected=true;parts.push({...entry,stroke:split.selected,regions:new Set([...entry.regions,key])});}
   }
   if(!selected){next.push(entry);continue;}
   fragments+=parts.length;if(fragments>mixedMotionLimits.fragments)throw Error('Mixed motion fragment limit reached; reduce overlapping selections');next.push(...parts);
  }
  entries.set(layer.id,next);
 }
 const sources=new Map(),regionIds=new Map();
 for(const [id,parts] of entries){out.layers.find(l=>l.id===id).strokes=parts.map(e=>e.stroke);for(const e of parts){if(!sources.has(e.source))sources.set(e.source,[]);sources.get(e.source).push(e.stroke.id);for(const key of e.regions){if(!regionIds.has(key))regionIds.set(key,[]);regionIds.get(key).push(e.stroke.id);}}}
 const remap=target=>{
  if(target.kind==='objects')return{kind:'objects',ids:target.ids.flatMap(id=>sources.get(id)||[id])};
  if(target.kind==='region'&&mixed.has(target.layerId)){const ids=regionIds.get(regionKey(target));if(!ids?.length)throw Error('Selected motion region has no pigment; select it again');return{kind:'objects',ids:[...ids]};}
  return structuredClone(target);
 };
 if(out.motion)for(const c of out.motion.cues)if(c.kind==='move')c.target=remap(c.target);
 validateBoard(out);
 return{board:out,targets:cues.map(c=>c.kind==='move'?remap(c.target):structuredClone(c.target)),diagnostics:{pixels,fragments,mixedLayers:mixed.size}};
}
