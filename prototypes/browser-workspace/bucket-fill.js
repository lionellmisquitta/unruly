import {validateSnapshot,regionBounds} from './wand.js';
import {rasterStroke} from './raster.js';
import {command,editable} from './model.js';
import {layerState} from './folders.js';
export const bucketLimits=Object.freeze({dimension:1024,pixels:1048576,gap:8});
export function bucketWindow(p){if(!p||![p.x,p.y].every(Number.isFinite))throw Error('Invalid fill point');return {x:Math.floor(p.x)-512,y:Math.floor(p.y)-512,width:1024,height:1024};}
// Square morphological closing of colour barriers. Four separable sliding
// passes bound work independently of gap radius; original barriers are retained.
function filter(a,w,h,r,horizontal,dilate){const out=new Uint8Array(a.length),lines=horizontal?h:w,length=horizontal?w:h;
 for(let line=0;line<lines;line++){const at=i=>horizontal?line*w+i:i*w+line;let sum=0;for(let i=0;i<=r&&i<length;i++)sum+=a[at(i)];
  for(let i=0;i<length;i++){out[at(i)]=dilate?Number(sum>0):Number(sum===2*r+1);if(i-r>=0)sum-=a[at(i-r)];if(i+r+1<length)sum+=a[at(i+r+1)];}
 }return out;
}
export function bucketMask(s,x,y,{tolerance=12,gap=0}={}){
 validateSnapshot(s);if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=s.width||y>=s.height)throw Error('Tap within the fill window');
 if(!Number.isFinite(tolerance)||tolerance<0||tolerance>100||!Number.isInteger(gap)||gap<0||gap>8)throw Error('Fill tolerance must be 0–100%; gap radius 0–8 pixels');
 const w=s.width,h=s.height,n=w*h,d=s.data,seed=(y*w+x)*4,alpha=d[seed+3],target=[d[seed]*alpha/255,d[seed+1]*alpha/255,d[seed+2]*alpha/255,alpha],threshold=tolerance*255/100,barrier=new Uint8Array(n);
 for(let i=0;i<n;i++){const k=i*4,a=d[k+3];barrier[i]=Number(Math.max(Math.abs(a-target[3]),Math.abs(d[k]*a/255-target[0]),Math.abs(d[k+1]*a/255-target[1]),Math.abs(d[k+2]*a/255-target[2]))>threshold);}
 let closed=barrier;if(gap){closed=filter(filter(filter(filter(barrier,w,h,gap,true,true),w,h,gap,false,true),w,h,gap,true,false),w,h,gap,false,false);}
 const first=y*w+x;if(closed[first])throw Error('Tap farther inside the area or reduce gap tolerance');
 const mask=new Uint8Array(n),seen=new Uint8Array(n),queue=new Int32Array(n);let head=0,tail=0;
 const visit=i=>{if(seen[i])return;seen[i]=1;if(barrier[i]||closed[i])return;const xx=i%w,yy=Math.floor(i/w);if(xx===0||xx===w-1||yy===0||yy===h-1)throw Error('Fill reached the 1024-pixel search boundary · close the outline, increase gap tolerance or fill a smaller area; artwork unchanged');mask[i]=1;queue[tail++]=i;};
 visit(first);while(head<tail){const i=queue[head++],xx=i%w;if(xx)visit(i-1);if(xx+1<w)visit(i+1);if(i>=w)visit(i-w);if(i+w<n)visit(i+w);}
 return {mask,bounds:regionBounds(s,mask),visited:tail,pixels:n};
}
export function fillPixels(s,mask,{color,opacity=1,alphaLock=false}={}){
 validateSnapshot(s);if(!(mask instanceof Uint8Array)||mask.length!==s.width*s.height||mask.some(v=>v>1)||!/^#[0-9a-f]{6}$/i.test(color)||!Number.isFinite(opacity)||opacity<0||opacity>1||typeof alphaLock!=='boolean')throw Error('Invalid fill paint settings');
 const bounds=regionBounds(s,mask);if(!bounds)return {changed:false};const rgb=[1,3,5].map(k=>parseInt(color.slice(k,k+2),16)),data=new Uint8ClampedArray(bounds.width*bounds.height*4);let changed=false,count=0;
 for(let i=0;i<mask.length;i++)if(mask[i]){const p=i*4,da=s.data[p+3]/255,sa=opacity,alpha=alphaLock?da:sa+da*(1-sa),o=((Math.floor(i/s.width)+s.y-bounds.minY)*bounds.width+i%s.width+s.x-bounds.minX)*4;
  if(alphaLock&&!da||!sa){data.set(s.data.subarray(p,p+4),o);continue;}
  for(let k=0;k<3;k++)data[o+k]=alphaLock?Math.round(rgb[k]*sa+s.data[p+k]*(1-sa)):alpha?Math.round((rgb[k]*sa+s.data[p+k]*da*(1-sa))/alpha):0;
  data[o+3]=Math.round(alpha*255);if(data[o]!==s.data[p]||data[o+1]!==s.data[p+1]||data[o+2]!==s.data[p+2]||data[o+3]!==s.data[p+3]){changed=true;count++;}
 }
 return {changed,count,bounds,stroke:changed?rasterStroke(data,bounds.width,bounds.height,bounds.minX,bounds.minY):null};
}
// Removing only filled pixels and replacing them retains alpha-lock semantics.
// The supplied complement factory includes original artwork outside the window.
export function commitBucket(h,board,layerId,paint,remaining){if(h.board!==board||h.board.activeLayer!==layerId)throw Error('Fill target is stale');const l=editable(h.board),state=layerState(h.board,l);if(!state.visible)throw Error('Fill layer is hidden');if(!paint.changed)return h;const rest=remaining();return command(h,b=>{b.version=Math.max(4,b.version);b.layers.find(l=>l.id===layerId).strokes=[...rest,paint.stroke];});}
