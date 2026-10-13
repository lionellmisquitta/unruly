import {hasAdjustment} from './adjustments.js';
import {ancestors,folderLayers} from './folders.js';
export const curveChannels=Object.freeze(['master','red','green','blue']);
export const neutralFilter=Object.freeze({curves:Object.freeze(Object.fromEntries(curveChannels.map(k=>[k,Object.freeze([Object.freeze([0,0]),Object.freeze([255,255])])]))),blur:0});
export function validateFilter(f){
 if(!f||Object.keys(f).sort().join(',')!=='blur,curves'||typeof f.blur!=='number'||!Number.isFinite(f.blur)||f.blur<0||f.blur>16||!f.curves||Object.keys(f.curves).sort().join(',')!=='blue,green,master,red')throw Error('Invalid curves or blur');
 for(const k of curveChannels){const points=f.curves[k];if(!Array.isArray(points)||points.length<2||points.length>8||points[0]?.[0]!==0||points.at(-1)?.[0]!==255)throw Error('Curve requires 2–8 points with fixed input endpoints');let last=-1;for(const p of points){if(!Array.isArray(p)||p.length!==2||!p.every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=255)||p[0]<=last)throw Error('Curve inputs must increase; values are 0–255');last=p[0];}}
 return f;
}
export const hasFilter=n=>!!n?.filter&&(n.filter.blur!==0||curveChannels.some(k=>n.filter.curves[k].some(([x,y])=>x!==y)));
export const isolatesGroup=n=>hasAdjustment(n)||hasFilter(n);
export function validateFilters(b){for(const n of [...b.layers,...(b.folders||[])])if(Object.hasOwn(n,'filter')){if(b.version<11)throw Error('Curves/blur require v11');validateFilter(n.filter);}}
export function mutateFilter(b,id,value){
 const n=b.layers.find(l=>l.id===id)||(b.folders||[]).find(f=>f.id===id);if(!n)throw Error('Filter target missing');const parents=ancestors(b,n);if(!n.visible||n.locked||parents.some(f=>!f.visible||f.locked))throw Error('Filter target is hidden or locked');
 if(!b.layers.includes(n)&&folderLayers(b,id).some(l=>l.locked||ancestors(b,l).some(f=>f.locked)))throw Error('Unlock folder contents before filtering');
 if(value!==null)validateFilter(value);if(value===null||!hasFilter({filter:value})){delete n.filter;return;}
 b.version=Math.max(11,b.version);b.folders=b.folders||[];n.filter=structuredClone(value);
}
export function curveLut(points){let j=1;const lut=new Uint8ClampedArray(256);for(let x=0;x<256;x++){while(j<points.length-1&&x>points[j][0])j++;const [a,b]=points[j-1],[c,d]=points[j];lut[x]=Math.round(b+(d-b)*(x-a)/(c-a));}return lut;}
export function curvePixels(data,curves){const master=curveLut(curves.master),channels=['red','green','blue'].map(k=>curveLut(curves[k]));for(let i=0;i<data.length;i+=4){if(!data[i+3])continue;for(let c=0;c<3;c++)data[i+c]=channels[c][master[data[i+c]]];}return data;}
export function gaussianKernel(sigma){if(!Number.isFinite(sigma)||sigma<0||sigma>256)throw Error('Invalid Gaussian sigma');if(!sigma)return new Float64Array([1]);const radius=Math.ceil(3*sigma),kernel=new Float64Array(radius*2+1);let sum=0;for(let x=-radius;x<=radius;x++){const v=Math.exp(-x*x/(2*sigma*sigma));kernel[x+radius]=v;sum+=v;}for(let i=0;i<kernel.length;i++)kernel[i]/=sum;return kernel;}
// Bounded, premultiplied separable reference/fallback; outside pixels transparent.
export function gaussianPixels(data,width,height,sigma){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||data.length!==width*height*4)throw Error('Invalid blur pixels');const kernel=gaussianKernel(sigma);if(!sigma)return data.slice();if(width*height>262144||width*height*kernel.length*2>32e6)throw Error('Gaussian fallback work limit · zoom out or reduce blur');
 const source=new Float32Array(data.length),temp=new Float32Array(data.length),dest=new Float32Array(data.length),radius=(kernel.length-1)/2;
 for(let i=0;i<data.length;i+=4){const alpha=data[i+3]/255;for(let c=0;c<3;c++)source[i+c]=data[i+c]*alpha;source[i+3]=data[i+3];}
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)for(let k=-radius;k<=radius;k++){if(x+k<0||x+k>=width)continue;const a=(y*width+x)*4,b=(y*width+x+k)*4,w=kernel[k+radius];for(let c=0;c<4;c++)temp[a+c]+=source[b+c]*w;}
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)for(let k=-radius;k<=radius;k++){if(y+k<0||y+k>=height)continue;const a=(y*width+x)*4,b=((y+k)*width+x)*4,w=kernel[k+radius];for(let c=0;c<4;c++)dest[a+c]+=temp[b+c]*w;}
 const result=new Uint8ClampedArray(data.length);for(let i=0;i<result.length;i+=4){const alpha=dest[i+3];result[i+3]=Math.round(alpha);if(alpha>0)for(let c=0;c<3;c++)result[i+c]=Math.round(dest[i+c]*255/alpha);}return result;
}
export function filterPadding(b){const map=new Map((b.folders||[]).map(f=>[f.id,f]));let max=0;for(const l of b.layers){let sum=l.filter?.blur||0,p=l.parentId;while(p){const f=map.get(p);if(!f)throw Error('Filter folder missing');sum+=f.filter?.blur||0;p=f.parentId;}max=Math.max(max,sum);}return 3*max;}
export function applyCanvasFilter(node,canvas,scratch,scale=1){
 if(!hasFilter(node))return;const f=node.filter,c=canvas.getContext('2d');
 if(curveChannels.some(k=>f.curves[k].some(([x,y])=>x!==y))){const image=c.getImageData(0,0,canvas.width,canvas.height);curvePixels(image.data,f.curves);c.putImageData(image,0,0);}
 if(!f.blur)return;const sigma=f.blur*scale;
 if('filter' in c){scratch.width=1;scratch.height=1;scratch.width=canvas.width;scratch.height=canvas.height;const ctx=scratch.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.filter='blur('+sigma+'px)';if(ctx.filter==='none')throw Error('Gaussian blur unsupported');ctx.drawImage(canvas,0,0);ctx.filter='none';c.save();try{c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='copy';c.drawImage(scratch,0,0);}finally{c.restore();}}
 else{const image=c.getImageData(0,0,canvas.width,canvas.height);image.data.set(gaussianPixels(image.data,canvas.width,canvas.height,sigma));c.putImageData(image,0,0);}
}
