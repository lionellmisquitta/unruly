// Bounded piecewise-affine image mesh; samples the original source, never a preview.
import {decodePixels,rasterPayload,validateRaster} from './raster.js';
import {polygonPixels} from './lasso-region.js';
export const meshIdentity=()=>Array.from({length:9},(_,i)=>[i%3/2,Math.floor(i/3)/2]);
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const triangles=Object.freeze([[0,1,4],[0,4,3],[1,2,5],[1,5,4],[3,4,7],[3,7,6],[4,5,8],[4,8,7]]);
export function validateMesh(mesh){
 if(!Array.isArray(mesh)||mesh.length!==9||mesh.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>!Number.isFinite(v)||typeof v!=='number'||v<0||v>1)))throw Error('Nine mesh points must stay inside image bounds');
 for(const [a,b,c] of triangles)if(cross(mesh[a],mesh[b],mesh[c])<.0001)throw Error('Mesh cells cannot fold, cross or collapse');
 const boundary=[0,1,2,5,8,7,6,3];
 for(let i=0;i<8;i++)for(let j=i+2;j<8;j++){if(i===0&&j===7)continue;const a=mesh[boundary[i]],b=mesh[boundary[(i+1)%8]],c=mesh[boundary[j]],d=mesh[boundary[(j+1)%8]];if(cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0)throw Error('Mesh boundary cannot cross');}
 return mesh;
}
export function validateOutline(polygon){if(!Array.isArray(polygon)||polygon.length<3||polygon.length>128||polygon.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>!Number.isFinite(v)||typeof v!=='number'||v<0||v>1)))throw Error('Draw an outline with 3–128 points inside the image');let area=0;for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length];area+=a[0]*b[1]-b[0]*a[1];for(let j=i+2;j<polygon.length;j++){if(i===0&&j===polygon.length-1)continue;const c=polygon[j],d=polygon[(j+1)%polygon.length];if(cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0)throw Error('Outline cannot cross itself');}}if(Math.abs(area)<.02)throw Error('Outline is too small');return polygon;}
export function fitMesh(polygon){
 validateOutline(polygon);const top=Math.min(...polygon.map(p=>p[1])),bottom=Math.max(...polygon.map(p=>p[1])),out=[];
 for(let row=0;row<3;row++){const y=top+(bottom-top)*row/2,scan=Math.max(top+1e-6,Math.min(bottom-1e-6,y)),xs=[];for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length];if((a[1]>scan)!==(b[1]>scan))xs.push(a[0]+(scan-a[1])*(b[0]-a[0])/(b[1]-a[1]));}if(xs.length<2)throw Error('Outline has no usable span');const left=Math.min(...xs),right=Math.max(...xs);for(let col=0;col<3;col++)out.push([left+(right-left)*col/2,y]);}
 return validateMesh(out);
}
export function meshPixels(source,width,height,mesh,outline=null){
 if(!(source instanceof Uint8ClampedArray)||!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>1024||height>1024||source.length!==width*height*4)throw Error('Mesh source exceeds 1024 pixels per side');validateMesh(mesh);if(outline)validateOutline(outline);
 const uv=meshIdentity();if(!outline&&mesh.every((p,i)=>p.every((v,k)=>v===uv[i][k])))return source.slice();
 const clip=outline?polygonPixels({data:source,width,height,x:0,y:0},outline.map(([x,y])=>({x:x*width,y:y*height}))).mask:null,out=new Uint8ClampedArray(source.length);
 for(const ids of triangles){const [a,b,c]=ids.map(i=>mesh[i]),area=cross(a,b,c),loX=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0])*width)),hiX=Math.min(width,Math.ceil(Math.max(a[0],b[0],c[0])*width)),loY=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1])*height)),hiY=Math.min(height,Math.ceil(Math.max(a[1],b[1],c[1])*height));
  for(let y=loY;y<hiY;y++)for(let x=loX;x<hiX;x++){if(clip&&!clip[y*width+x])continue;const p=[(x+.5)/width,(y+.5)/height],wa=cross(b,c,p)/area,wb=cross(c,a,p)/area,wc=1-wa-wb;if(Math.min(wa,wb,wc)<-1e-10)continue;const u=wa*uv[ids[0]][0]+wb*uv[ids[1]][0]+wc*uv[ids[2]][0],v=wa*uv[ids[0]][1]+wb*uv[ids[1]][1]+wc*uv[ids[2]][1],sx=Math.max(0,Math.min(width-1,u*width-.5)),sy=Math.max(0,Math.min(height-1,v*height-.5)),ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy;let alpha=0,red=0,green=0,blue=0;
   for(let k=0;k<4;k++){const xx=Math.min(width-1,ix+k%2),yy=Math.min(height-1,iy+(k>>1)),weight=(k%2?fx:1-fx)*(k>>1?fy:1-fy),i=(yy*width+xx)*4,a=source[i+3]*weight;alpha+=a;red+=source[i]*a;green+=source[i+1]*a;blue+=source[i+2]*a;}
   if(alpha>0){const i=(y*width+x)*4;out[i]=Math.round(red/alpha);out[i+1]=Math.round(green/alpha);out[i+2]=Math.round(blue/alpha);out[i+3]=Math.round(alpha);}
  }
 }return out;
}
export function meshedStroke(stroke,mesh,outline=null){validateRaster(stroke);validateMesh(mesh);if(!outline&&mesh.every((p,i)=>p.every((v,k)=>v===meshIdentity()[i][k])))return structuredClone(stroke);const out=structuredClone(stroke),r=stroke.raster;out.raster={...r,...rasterPayload(meshPixels(decodePixels(r.data),r.width,r.height,mesh,outline),r.width,r.height)};return out;}
