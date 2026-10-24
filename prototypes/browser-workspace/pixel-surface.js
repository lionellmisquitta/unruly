import {rasterLimits,decodePixels,validateRaster} from './raster.js';
export function nativePixelSnapshot(stroke){
 if(stroke?.brush!=='raster')return null;validateRaster(stroke);const r=stroke.raster,[a,b,c,d,x,y]=r.transform;
 if(a!==1||b!==0||c!==0||d!==1||!Number.isInteger(x)||!Number.isInteger(y))return null;
 return {data:decodePixels(r.data),width:r.width,height:r.height,x,y,id:stroke.id};
}
export function createPixelSurface(snapshot){
 let {width,height,x,y}=snapshot;
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>rasterLimits.dimension||height>rasterLimits.dimension||width*height>rasterLimits.pixels||!Number.isInteger(x)||!Number.isInteger(y)||Math.max(Math.abs(x),Math.abs(y),Math.abs(x+width),Math.abs(y+height))>1e7||!snapshot.data||snapshot.data.length!==width*height*4)throw Error('Invalid pixel surface');
 let data=new Uint8ClampedArray(snapshot.data),extensions=0;
 function ensure(left,top,right,bottom){
  if(![left,top,right,bottom].every(Number.isFinite)||left>right||top>bottom)throw Error('Invalid pixel region');
  if(left>=x&&top>=y&&right<=x+width&&bottom<=y+height)return;
  const nx=Math.min(x,Math.floor(left/64)*64),ny=Math.min(y,Math.floor(top/64)*64),nw=Math.max(x+width,Math.ceil(right/64)*64)-nx,nh=Math.max(y+height,Math.ceil(bottom/64)*64)-ny;
  if(nw>rasterLimits.dimension||nh>rasterLimits.dimension||nw*nh>rasterLimits.pixels||Math.max(Math.abs(nx),Math.abs(ny),Math.abs(nx+nw),Math.abs(ny+nh))>1e7)throw Error('Pixel region exceeds4096 px or1,048,576 pixels · gesture cancelled — start a new layer');
  const next=new Uint8ClampedArray(nw*nh*4);for(let row=0;row<height;row++)next.set(data.subarray(row*width*4,(row+1)*width*4),((y-ny+row)*nw+x-nx)*4);
  data=next;x=nx;y=ny;width=nw;height=nh;extensions++;
 }
 return {ensure,get data(){return data;},get x(){return x;},get y(){return y;},get width(){return width;},get height(){return height;},diagnostics:()=>Object.freeze({width,height,pixelBytes:data.byteLength,extensions})};
}
