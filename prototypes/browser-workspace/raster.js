// Bounded document-space RGBA snapshots for raster drawing. No DOM or storage.
export const rasterLimits=Object.freeze({dimension:1024,pixels:1024*1024,work:12000000,dabs:2048});
const finite=x=>typeof x==='number'&&Number.isFinite(x),fail=m=>{throw Error(m);};
export function encodePixels(data){let text='';for(let i=0;i<data.length;i+=8192)text+=String.fromCharCode(...data.subarray(i,i+8192));return btoa(text);}
export function decodePixels(data){const raw=atob(data),out=new Uint8ClampedArray(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out;}
export function rasterPoints(r){const [a,b,c,d,e,f]=r.transform;return [[0,0],[r.width,0],[r.width,r.height],[0,r.height],[0,0]].map(([x,y])=>({x:a*x+c*y+e,y:b*x+d*y+f,pressure:null}));}
export function validateRaster(s){
 const r=s.raster;if(!r||Object.keys(r).sort().join(',')!=='data,height,transform,version,width'||r.version!==1||!Number.isInteger(r.width)||!Number.isInteger(r.height)||r.width<1||r.height<1||r.width>rasterLimits.dimension||r.height>rasterLimits.dimension||r.width*r.height>rasterLimits.pixels)fail('Invalid raster dimensions');
 if(!Array.isArray(r.transform)||r.transform.length!==6||r.transform.some(x=>!finite(x)||Math.abs(x)>1e7))fail('Invalid raster transform');const [a,b,c,d]=r.transform,det=a*d-b*c;if(Math.abs(det)<.0025||Math.abs(det)>400)fail('Raster transform limit');
 const n=r.width*r.height*4;if(typeof r.data!=='string'||r.data.length!==4*Math.ceil(n/3)||!/^[A-Za-z0-9+/]*={0,2}$/.test(r.data))fail('Invalid raster pixels');let raw;try{raw=atob(r.data);}catch{fail('Invalid raster pixels');}if(raw.length!==n||btoa(raw)!==r.data)fail('Invalid raster pixels');
 if(s.preset!==undefined||s.recipe!==undefined||s.dynamics!==undefined||s.size!==1||s.opacity!==1||s.color!=='#000000'||(!Array.isArray(s.points)||s.points.length!==5||s.points.some((p,i)=>{const q=rasterPoints(r)[i];return !p||p.x!==q.x||p.y!==q.y||p.pressure!==null;})))fail('Invalid raster stroke metadata');
 for(const p of s.points)if(Math.abs(p.x)>1e7||Math.abs(p.y)>1e7)fail('Raster coordinate limit');return r;
}
export function rasterStroke(data,width,height,x,y,id=crypto.randomUUID()){const raster={version:1,width,height,data:encodePixels(data),transform:[1,0,0,1,x,y]};return {id,brush:'raster',color:'#000000',size:1,opacity:1,points:rasterPoints(raster),raster};}
export function transformRaster(s,m){const [a,b,c,d,e,f]=s.raster.transform,[u,v,w,z,x,y]=m;s.raster.transform=[u*a+w*b,v*a+z*b,u*c+w*d,v*c+z*d,u*e+w*f+x,v*e+z*f+y];s.points=rasterPoints(s.raster);}
export function sampleTransform(r,x,y){const [a,b,c,d,e,f]=r.transform,det=a*d-b*c;return {x:(d*(x-e)-c*(y-f))/det,y:(a*(y-f)-b*(x-e))/det};}
// Premultiplied blending transports existing pigment/alpha; it never samples paper.
export function smudgeDab(data,width,height,from,to,radius,strength,soft=true,budget={work:0}){
 if(!Number.isInteger(width)||!Number.isInteger(height)||data.length!==width*height*4||!finite(radius)||radius<.5||radius>80||!finite(strength)||strength<0||strength>1||![from.x,from.y,to.x,to.y].every(finite))fail('Invalid smudge dab');
 const dx=to.x-from.x,dy=to.y-from.y;if(strength===0||Math.hypot(dx,dy)<.0001)return false;
 const x0=Math.max(0,Math.floor(to.x-radius)),y0=Math.max(0,Math.floor(to.y-radius)),x1=Math.min(width,Math.ceil(to.x+radius)),y1=Math.min(height,Math.ceil(to.y+radius));
 const work=Math.max(0,x1-x0)*Math.max(0,y1-y0);if(budget.work+work>rasterLimits.work)fail('Smudge work limit; gesture cancelled');budget.work+=work;
 const sx0=Math.max(0,Math.floor(x0-dx)),sy0=Math.max(0,Math.floor(y0-dy)),sx1=Math.min(width,Math.ceil(x1-dx)+1),sy1=Math.min(height,Math.ceil(y1-dy)+1),sw=Math.max(0,sx1-sx0),sh=Math.max(0,sy1-sy0),source=new Uint8ClampedArray(sw*sh*4);
 for(let y=0;y<sh;y++)source.set(data.subarray(((y+sy0)*width+sx0)*4,((y+sy0)*width+sx0+sw)*4),y*sw*4);
 let changed=false;
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const distance=Math.hypot(x+.5-to.x,y+.5-to.y)/radius;if(distance>=1)continue;const t=strength*Math.min(1,(1-distance)*radius)*(typeof soft==='function'?soft(distance,x,y,to.x,to.y):soft?(1-distance)**2:1),sx=Math.floor(x+.5-dx)-sx0,sy=Math.floor(y+.5-dy)-sy0;if(sx<0||sy<0||sx>=sw||sy>=sh)continue;const i=(y*width+x)*4,px=x-dx-sx0,py=y-dy-sy0,ix=Math.floor(px),iy=Math.floor(py),fx=px-ix,fy=py-iy,rgba=[0,0,0,0];
 for(const [xx,yy,weight] of [[ix,iy,(1-fx)*(1-fy)],[ix+1,iy,fx*(1-fy)],[ix,iy+1,(1-fx)*fy],[ix+1,iy+1,fx*fy]]){if(xx<0||yy<0||xx>=sw||yy>=sh)continue;const j=(yy*sw+xx)*4,alpha=source[j+3]/255;rgba[3]+=alpha*weight;for(let k=0;k<3;k++)rgba[k]+=source[j+k]*alpha*weight;}
 const sa=rgba[3],da=data[i+3]/255,alpha=sa*t+da*(1-sa*t),old=[data[i],data[i+1],data[i+2],data[i+3]];
 for(let k=0;k<3;k++)data[i+k]=alpha?Math.round((rgba[k]*t+data[i+k]*da*(1-sa*t))/alpha):0;data[i+3]=Math.round(alpha*255);if(old.some((v,k)=>v!==data[i+k]))changed=true;
 }return changed;
}
