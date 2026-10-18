import {warpGuide} from './drawing-reference.js';
// PAT1: bounded projective raster deformation. No DOM, model or storage dependency.
import {decodePixels,rasterPayload,validateRaster} from './raster.js';
import {layerState} from './folders.js';
const fail=m=>{throw Error(m);};
export const warpIdentity=()=>[[0,0],[1,0],[1,1],[0,1]];
export function validateQuad(q){
 if(!Array.isArray(q)||q.length!==4||q.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>typeof v!=='number'||!Number.isFinite(v)||v<0||v>1)))fail('Corners must be between 0 and 100 percent');
 let area=0;for(let i=0;i<4;i++){const a=q[i],b=q[(i+1)%4],c=q[(i+2)%4];if((b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0])<=.0001)fail('Keep corners clockwise in a convex shape; do not cross edges');area+=a[0]*b[1]-b[0]*a[1];}if(area/2<.01)fail('Deformation must retain at least 1 percent of the image area');return q;
}
function inverseMap(q){
 const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]]=q,dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3,dy1=y1-y2,dy2=y3-y2,dy3=y0-y1+y2-y3,det=dx1*dy2-dx2*dy1;
 const g=(dx3*dy2-dx2*dy3)/det,h=(dx1*dy3-dx3*dy1)/det,a=x1-x0+g*x1,b=x3-x0+h*x3,c=x0,d=y1-y0+g*y1,e=y3-y0+h*y3,f=y0;
 const inv=[e-f*h,c*h-b,b*f-c*e,f*g-d,a-c*g,c*d-a*f,d*h-e*g,b*g-a*h,a*e-b*d];
 if(inv.some(v=>!Number.isFinite(v)))fail('Invalid deformation matrix');return inv;
}
export function warpPixels(source,width,height,quad){
 if(!(source instanceof Uint8ClampedArray)||!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>1024||height>1024||source.length!==width*height*4)fail('Deformation exceeds 1024 pixels per side');validateQuad(quad);
 if(quad.every((p,i)=>p.every((v,k)=>v===warpIdentity()[i][k])))return source.slice();
 const m=inverseMap(quad),out=new Uint8ClampedArray(source.length);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const px=(x+.5)/width,py=(y+.5)/height,w=m[6]*px+m[7]*py+m[8],u=(m[0]*px+m[1]*py+m[2])/w,v=(m[3]*px+m[4]*py+m[5])/w;
  if(!Number.isFinite(u)||!Number.isFinite(v)||u< -1e-12||u>1+1e-12||v< -1e-12||v>1+1e-12)continue;
  const sx=Math.max(0,Math.min(width-1,u*width-.5)),sy=Math.max(0,Math.min(height-1,v*height-.5)),ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy;let alpha=0,red=0,green=0,blue=0;
  for(let k=0;k<4;k++){const xx=Math.min(width-1,ix+(k%2)),yy=Math.min(height-1,iy+(k>>1)),weight=(k%2?fx:1-fx)*(k>>1?fy:1-fy),i=(yy*width+xx)*4,a=source[i+3]*weight;alpha+=a;red+=source[i]*a;green+=source[i+1]*a;blue+=source[i+2]*a;}
  const i=(y*width+x)*4;if(alpha>0){out[i]=Math.round(red/alpha);out[i+1]=Math.round(green/alpha);out[i+2]=Math.round(blue/alpha);out[i+3]=Math.round(alpha);}
 }return out;
}
export function warpTarget(board,layerId,id){
 const l=board.layers.find(l=>l.id===layerId);if(!l||board.activeLayer!==layerId)fail('Select one image or pattern on the active layer');const state=layerState(board,l);if(!state.visible||state.locked)fail('Image layer or its folder is locked or hidden');if(l.alphaLock)fail('Disable alpha lock before deforming image pixels');const s=l.strokes.find(s=>s.id===id);if(!s||s.brush!=='raster')fail('Select one whole image or pattern; region selections and vector strokes cannot deform');validateRaster(s);return s;
}
export function warpedStroke(stroke,quad){
 validateRaster(stroke);validateQuad(quad);if(quad.every((p,i)=>p.every((v,k)=>v===warpIdentity()[i][k])))return structuredClone(stroke);const r=stroke.raster,data=warpPixels(decodePixels(r.data),r.width,r.height,quad),out=structuredClone(stroke);out.raster={...r,...rasterPayload(data,r.width,r.height)};if(out.guide)out.guide=warpGuide(out.guide,quad,r.width,r.height);return out;
}
export function mutateWarp(board,layerId,id,quad){const s=warpTarget(board,layerId,id),next=warpedStroke(s,quad);s.raster=next.raster;if(next.guide)s.guide=next.guide;}
