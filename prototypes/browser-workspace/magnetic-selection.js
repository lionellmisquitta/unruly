// Local edge attraction, in original document pixels. No full-layer edge map.
export const magneticLimits=Object.freeze({screenRadius:12,maxRadius:32,minRadius:1,contrast:24,spacing:8});
export function magneticRadius(scale){if(!Number.isFinite(scale)||scale<=0)throw Error('Invalid magnetic zoom');return Math.max(1,Math.min(32,12/scale));}
export function magneticWindow(p,scale){const r=Math.ceil(magneticRadius(scale))+2;return {x:Math.floor(p.x)-r,y:Math.floor(p.y)-r,width:2*r+2,height:2*r+2};}
export function snapEdge(snapshot,p,radius){
 if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||!Number.isFinite(radius)||radius<1||radius>32)throw Error('Invalid magnetic point or radius');
 const {x,y,width:w,height:h,data}=snapshot;
 if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w>70||h>70||!Number.isFinite(x)||!Number.isFinite(y)||data?.length!==w*h*4)throw Error('Invalid magnetic window');
 let best=null,cost=Infinity;
 const contrast=(a,b)=>{const aa=data[a+3]/255,ba=data[b+3]/255;return Math.max(Math.abs(data[a+3]-data[b+3]),...Array.from({length:3},(_,k)=>Math.abs(data[a+k]*aa-data[b+k]*ba)));};
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){
  const a=(j*w+i)*4;
  for(const [dx,dy] of [[1,0],[0,1]]){
   if(i+dx>=w||j+dy>=h)continue;
   const strength=contrast(a,((j+dy)*w+i+dx)*4);if(strength<magneticLimits.contrast)continue;
   const q={x:x+i+.5+dx*.5,y:y+j+.5+dy*.5},distance=Math.hypot(q.x-p.x,q.y-p.y);
   if(distance>radius)continue;
   // Proximity dominates; strength resolves similarly close competing edges.
   const score=distance+(1-strength/255)*1.5;
   if(score<cost){cost=score;best=q;}
  }
 }
 return {point:best||{x:p.x,y:p.y},snapped:!!best};
}
