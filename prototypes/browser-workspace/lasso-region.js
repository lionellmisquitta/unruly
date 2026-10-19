import {tipRadius} from './custom-tips.js';
import {validateSnapshot,regionBounds} from './wand.js';
import {rasterStroke} from './raster.js';
// These limits bound selection work, not the extent of the drawing layer.
export const regionTileLimit=16;
export function polygonWindow(polygon){
 if(!Array.isArray(polygon)||polygon.length<3||polygon.length>512||polygon.some(p=>!p||![p.x,p.y].every(Number.isFinite)||Math.max(Math.abs(p.x),Math.abs(p.y))>1e7))throw Error('Lasso needs a valid closed loop (3–512 points)');
 const x=Math.floor(Math.min(...polygon.map(p=>p.x))),y=Math.floor(Math.min(...polygon.map(p=>p.y))),width=Math.ceil(Math.max(...polygon.map(p=>p.x)))-x,height=Math.ceil(Math.max(...polygon.map(p=>p.y)))-y;
 if(width<1||height<1)throw Error('Lasso loop is too small or ambiguous');
 if(width>1024||height>1024)throw Error('Selected area exceeds 1024 × 1024 document pixels · draw a smaller lasso or zoom in');
 return {x,y,width,height};
}
export function layerTiles(layer){
 const tiles=new Map(),side=1024;
 for(const s of layer.strokes){if(s.opacity===0)continue;
  const padding=s.brush==='raster'||s.brush==='text'?0:tipRadius(s)+2;
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;for(const p of s.points){minX=Math.min(minX,p.x);minY=Math.min(minY,p.y);maxX=Math.max(maxX,p.x);maxY=Math.max(maxY,p.y);}
  const x0=Math.floor(minX-padding),y0=Math.floor(minY-padding),x1=Math.ceil(maxX+padding),y1=Math.ceil(maxY+padding);
  for(let y=Math.floor(y0/side);y<=Math.floor((y1-1)/side);y++)for(let x=Math.floor(x0/side);x<=Math.floor((x1-1)/side);x++){
   const key=x+','+y;if(!tiles.has(key)){if(tiles.size===regionTileLimit)throw Error('Region edit work limit · artwork unchanged; copy remains available');tiles.set(key,{x:x*side,y:y*side,width:side,height:side});}
  }
 }
 return [...tiles.values()];
}
// Replay one disjoint tile at a time, before layer opacity/masks/clipping. The
// pixel complement includes ALL original artwork, not only the cropped window.
export function remainingRegionTiles(layer,region,snapshotRegion){
 const out=[];let bytes=0;
 for(const tile of layerTiles(layer)){
  const s=snapshotRegion(layer,tile);validateSnapshot(s);let pigment=false;
  for(let y=0;y<s.height;y++)for(let x=0;x<s.width;x++){
   const sx=s.x+x-region.snapshot.x,sy=s.y+y-region.snapshot.y,i=(y*s.width+x)*4;
   if(sx>=0&&sy>=0&&sx<region.snapshot.width&&sy<region.snapshot.height&&region.mask[sy*region.snapshot.width+sx])s.data.fill(0,i,i+4);
   else if(s.data[i+3])pigment=true;
  }
  if(!pigment)continue;
  const suffix='.tile.'+tile.x+'.'+tile.y,id=layer.id.length+suffix.length<=128?layer.id+suffix:layer.id.slice(0,72)+'.'+Array.from(layer.id).reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261).toString(16)+suffix;const stroke=rasterStroke(s.data,s.width,s.height,s.x,s.y,id);bytes+=JSON.stringify(stroke).length;
  if(bytes>8*1024*1024)throw Error('Region edit document limit · artwork unchanged');out.push(stroke);
 }
 return out;
}
// Pixel centres and even-odd scanline fill: bounded by source height*512 +1MP pixels.
export function polygonPixels(s,polygon){validateSnapshot(s);if(!Array.isArray(polygon)||polygon.length<3||polygon.length>512||polygon.some(p=>!p||![p.x,p.y].every(Number.isFinite)||Math.max(Math.abs(p.x),Math.abs(p.y))>1e7)||new Set(polygon.map(p=>p.x+','+p.y)).size<3)throw Error('Lasso needs a valid closed loop (3–512 points)');let area=0;for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length];area+=a.x*b.y-b.x*a.y;}if(Math.abs(area)<2)throw Error('Lasso loop is too small or ambiguous');const mask=new Uint8Array(s.width*s.height);let edgesTested=0,filled=0;for(let y=0;y<s.height;y++){const yy=s.y+y+.5,xs=[];for(let i=0;i<polygon.length;i++){edgesTested++;const a=polygon[i],b=polygon[(i+1)%polygon.length];if((a.y>yy)!==(b.y>yy))xs.push(a.x+(yy-a.y)*(b.x-a.x)/(b.y-a.y));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2){const lo=Math.max(0,Math.ceil(xs[i]-s.x-.5)),hi=Math.min(s.width,Math.ceil(xs[i+1]-s.x-.5));for(let x=lo;x<hi;x++){mask[y*s.width+x]=1;filled++;}}}return {mask,bounds:regionBounds(s,mask),edgesTested,filled};}
