const finite=n=>typeof n==='number'&&Number.isFinite(n);
const hypot=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const meanPressure=points=>{const q=points.map(p=>p.pressure).filter(finite);return q.length?q.reduce((a,b)=>a+b,0)/q.length:null;};
const withPressure=(p,pressure)=>({x:p.x,y:p.y,pressure});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export const SHAPE_HOLD=Object.freeze({ms:650,jitterCss:14,minExtentCss:20,maxPathCss:8192,maxSamples:4096});
function uniform(points,count=96){
 const distance=[0];for(let i=1;i<points.length;i++)distance.push(distance.at(-1)+hypot(points[i-1],points[i]));
 const total=distance.at(-1);if(!total)return [points[0]];let j=1;
 return Array.from({length:count},(_,i)=>{const d=total*i/(count-1);while(j<distance.length-1&&distance[j]<d)j++;const t=(d-distance[j-1])/(distance[j]-distance[j-1]||1),a=points[j-1],b=points[j];return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};});
}
function loopPoints(center,rx,ry,angle,pressure,rectangle=false){
 const co=Math.cos(angle),si=Math.sin(angle),local=rectangle?[[-rx,-ry],[rx,-ry],[rx,ry],[-rx,ry],[-rx,-ry]]:Array.from({length:129},(_,i)=>[Math.cos(i*Math.PI/64)*rx,Math.sin(i*Math.PI/64)*ry]);
 return local.map(([x,y])=>withPressure({x:center.x+x*co-y*si,y:center.y+x*si+y*co},pressure));
}
function directionOK(points,c){let sweep=0,pos=0,neg=0,prev=Math.atan2(points[0].y-c.y,points[0].x-c.x);for(const p of points.slice(1)){const a=Math.atan2(p.y-c.y,p.x-c.x);let d=a-prev;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;sweep+=d;if(d>.015)pos++;else if(d<-.015)neg++;prev=a;}return Math.abs(sweep)>Math.PI*1.65&&Math.max(pos,neg)/Math.max(1,pos+neg)>.85;}
function closedFit(points,scale,pressure){
 let best=null;for(let i=0;i<180;i++){const angle=i*Math.PI/360,co=Math.cos(angle),si=Math.sin(angle),xy=points.map(p=>({x:p.x*co+p.y*si,y:-p.x*si+p.y*co}));let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;for(const p of xy){x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y);}const area=(x1-x0)*(y1-y0);if(!best||area<best.area)best={angle,co,si,xy,x0,x1,y0,y1,area};}
 const b=best,rx=(b.x1-b.x0)/2,ry=(b.y1-b.y0)/2;if(Math.min(rx,ry)*scale<6)return null;
 const cx=(b.x0+b.x1)/2,cy=(b.y0+b.y1)/2,center={x:cx*b.co-cy*b.si,y:cx*b.si+cy*b.co};if(!directionOK(points,center))return null;
 const radial=b.xy.map(p=>Math.hypot((p.x-cx)/rx,(p.y-cy)/ry)-1),rms=Math.sqrt(radial.reduce((s,x)=>s+x*x,0)/radial.length);
 if(rms<.12&&Math.max(...radial.map(Math.abs))<.28){const circle=Math.max(rx,ry)/Math.min(rx,ry)<1.08,r=(rx+ry)/2;return circle?{kind:'circle',center,radius:r,pressure,points:loopPoints(center,r,r,0,pressure)}:{kind:'ellipse',center,rx,ry,angle:b.angle,pressure,points:loopPoints(center,rx,ry,b.angle,pressure)};}
 const error=b.xy.map(p=>Math.min(Math.abs(Math.abs(p.x-cx)-rx),Math.abs(Math.abs(p.y-cy)-ry)));
 if(Math.max(...error)<=Math.max(5/scale,Math.max(rx,ry)*.12))return{kind:'rectangle',center,rx,ry,angle:b.angle,pressure,points:loopPoints(center,rx,ry,b.angle,pressure,true)};
 return null;
}
function smoothCurve(points,pressure,diameter){
 const pts=uniform(points,65),a=pts[0],b=pts.at(-1);let aa=0,bb=0,ab=0,ax=0,ay=0,bx=0,by=0;
 for(let i=1;i<pts.length-1;i++){const t=i/(pts.length-1),u=1-t,w1=3*u*u*t,w2=3*u*t*t,x=pts[i].x-u*u*u*a.x-t*t*t*b.x,y=pts[i].y-u*u*u*a.y-t*t*t*b.y;aa+=w1*w1;bb+=w2*w2;ab+=w1*w2;ax+=w1*x;ay+=w1*y;bx+=w2*x;by+=w2*y;}
 const den=aa*bb-ab*ab;if(den<1e-9)return null;const c={x:(ax*bb-bx*ab)/den,y:(ay*bb-by*ab)/den},d={x:(bx*aa-ax*ab)/den,y:(by*aa-ay*ab)/den};
 const out=pts.map((p,i)=>{const t=i/(pts.length-1),u=1-t;return withPressure({x:u**3*a.x+3*u*u*t*c.x+3*u*t*t*d.x+t**3*b.x,y:u**3*a.y+3*u*u*t*c.y+3*u*t*t*d.y+t**3*b.y},pressure);}),err=out.map((p,i)=>hypot(p,pts[i]));
 if(Math.sqrt(err.reduce((s,x)=>s+x*x,0)/err.length)>diameter*.045||Math.max(...err)>diameter*.1)return null;
 let turns=0,sign=0;for(let i=2;i<pts.length;i++){const p=pts[i-2],q=pts[i-1],r=pts[i],cross=(q.x-p.x)*(r.y-q.y)-(q.y-p.y)*(r.x-q.x);if(Math.abs(cross)>.05){const z=Math.sign(cross);if(sign&&z!==sign)turns++;sign=z;}}if(turns>6)return null;
 return{kind:'curve',pressure,points:out};
}
export function recognizeHeldShape(points,scale=1){
 if(!Array.isArray(points)||points.length<2||points.length>SHAPE_HOLD.maxSamples||!finite(scale)||scale<=0||points.some(p=>!finite(p.x)||!finite(p.y)))return null;
 const pressure=meanPressure(points),pts=uniform(points),a=pts[0],b=pts.at(-1),xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),diameter=Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys));let path=0;for(let i=1;i<points.length;i++)path+=hypot(points[i-1],points[i]);
 if(diameter*scale<SHAPE_HOLD.minExtentCss||path*scale>SHAPE_HOLD.maxPathCss)return null;
 const chord=hypot(a,b),closed=chord<=diameter*.22;
 if(closed){const original=legacyRecognize(points,scale);if(original?.kind==='circle')return original;return points.length>=10?closedFit(pts,scale,pressure):null;}
 if(chord*scale<20)return null;
 const dx=b.x-a.x,dy=b.y-a.y,dev=pts.map(p=>Math.abs(dy*(p.x-a.x)-dx*(p.y-a.y))/chord);
 let backwards=0;for(let i=1;i<pts.length;i++)backwards+=Math.max(0,-((pts[i].x-pts[i-1].x)*dx+(pts[i].y-pts[i-1].y)*dy)/chord);
 if(path/chord<=1.35&&backwards/chord<.06&&Math.max(...dev)*scale<=Math.max(8,.075*chord*scale))return{kind:'line',pressure,points:[withPressure(a,pressure),withPressure(b,pressure)]};
 if(path/chord>4||backwards/chord>.35)return null;
 return smoothCurve(points,pressure,diameter);
}
export function constrainRecognized(q){
 if(q.kind==='ellipse'||q.kind==='rectangle'){const r=(q.rx+q.ry)/2;return q.kind==='ellipse'?{kind:'circle',center:{...q.center},radius:r,pressure:q.pressure,points:loopPoints(q.center,r,r,0,q.pressure)}:{...q,rx:r,ry:r,points:loopPoints(q.center,r,r,q.angle,q.pressure,true)};}
 if(q.kind==='curve'){
  const a=q.points[0],b=q.points.at(-1),m=q.points[Math.floor(q.points.length/2)],den=2*(a.x*(m.y-b.y)+m.x*(b.y-a.y)+b.x*(a.y-m.y));if(Math.abs(den)<1e-6)return q;
  const aa=a.x*a.x+a.y*a.y,mm=m.x*m.x+m.y*m.y,bb=b.x*b.x+b.y*b.y,center={x:(aa*(m.y-b.y)+mm*(b.y-a.y)+bb*(a.y-m.y))/den,y:(aa*(b.x-m.x)+mm*(a.x-b.x)+bb*(m.x-a.x))/den},radius=hypot(center,a);let start=Math.atan2(a.y-center.y,a.x-center.x),end=Math.atan2(b.y-center.y,b.x-center.x),mid=Math.atan2(m.y-center.y,m.x-center.x),positive=(end-start+2*Math.PI)%(2*Math.PI),middle=(mid-start+2*Math.PI)%(2*Math.PI),sweep=middle<=positive?positive:positive-2*Math.PI;
  if(!finite(radius)||radius>1e7)return q;return{kind:'arc',pressure:q.pressure,points:Array.from({length:65},(_,i)=>withPressure({x:center.x+radius*Math.cos(start+sweep*i/64),y:center.y+radius*Math.sin(start+sweep*i/64)},q.pressure))};
 }
 return q;
}
export function scaleRecognized(q,factor,center=q.center||q.points[0]){
 if(!finite(factor)||factor<=0||factor>100)throw Error('Invalid shape scale');const out={...q,points:q.points.map(p=>({...p,x:center.x+(p.x-center.x)*factor,y:center.y+(p.y-center.y)*factor}))};if(q.center)out.center={x:center.x+(q.center.x-center.x)*factor,y:center.y+(q.center.y-center.y)*factor};if(q.radius)out.radius=q.radius*factor;if(q.rx)out.rx=q.rx*factor;if(q.ry)out.ry=q.ry*factor;if(out.points.some(p=>Math.abs(p.x)>1e7||Math.abs(p.y)>1e7))throw Error('Invalid shape extent');return out;
}

function legacyRecognize(points,scale=1){
 if(!Array.isArray(points)||points.length<4||points.length>1024||!finite(scale)||scale<=0)return null;
 const pts=points.map(p=>({x:Number(p.x),y:Number(p.y),pressure:p.pressure??null}));
 if(pts.some(p=>!finite(p.x)||!finite(p.y)))return null;
 const pressure=meanPressure(pts),first=pts[0],last=pts.at(-1);
 let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity,path=0;
 for(let i=0;i<pts.length;i++){const p=pts[i];minX=Math.min(minX,p.x);minY=Math.min(minY,p.y);maxX=Math.max(maxX,p.x);maxY=Math.max(maxY,p.y);if(i)path+=hypot(pts[i-1],p);}
 const width=maxX-minX,height=maxY-minY,diameter=Math.max(width,height),extentCss=diameter*scale;
 if(extentCss<20||path*scale>1024)return null;

 if(pts.length>=12&&diameter>0&&hypot(first,last)<=diameter*.2){
  const cx=pts.reduce((s,p)=>s+p.x,0)/pts.length,cy=pts.reduce((s,p)=>s+p.y,0)/pts.length;
  const radii=pts.map(p=>Math.hypot(p.x-cx,p.y-cy)),r=radii.reduce((a,b)=>a+b,0)/radii.length;
  if(r>0){
   const rms=Math.sqrt(radii.reduce((s,v)=>s+(v-r)**2,0)/radii.length),maxErr=Math.max(...radii.map(v=>Math.abs(v-r)));
   let sweep=0,positive=0,negative=0,prev=Math.atan2(pts[0].y-cy,pts[0].x-cx);
   for(let i=1;i<pts.length;i++){let a=Math.atan2(pts[i].y-cy,pts[i].x-cx),d=a-prev;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;sweep+=d;if(d>0.02)positive++;else if(d<-.02)negative++;prev=a;}
   const directionConsistency=Math.max(positive,negative)/Math.max(1,positive+negative);
   if(rms<=r*.12&&maxErr<=r*.25&&Math.abs(sweep)>=Math.PI*5/3&&directionConsistency>=.8){
    const out=[];for(let i=0;i<=128;i++){const a=Math.PI*2*i/128;out.push(withPressure({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r},pressure));}
    return {kind:'circle',center:{x:cx,y:cy},radius:r,points:out,pressure};
   }
  }
 }

 const chord=hypot(first,last);
 if(chord*scale>=20&&chord>0&&path/chord<=1.2){
  const dx=last.x-first.x,dy=last.y-first.y,den=Math.hypot(dx,dy);
  let maxDeviation=0;
  for(const p of pts)maxDeviation=Math.max(maxDeviation,Math.abs(dy*p.x-dx*p.y+last.x*first.y-last.y*first.x)/den);
  if(maxDeviation*scale<=Math.max(3,.03*chord*scale)){
   return {kind:'line',points:[withPressure(first,pressure),withPressure(last,pressure)],pressure};
  }
 }
 return null;
}

export function reshapeRecognized(recognized,point,{snap15=false}={}){
 if(!recognized||!point||!finite(point.x)||!finite(point.y))return recognized;
 if(recognized.kind==='line'){
  const start=recognized.points[0];let dx=point.x-start.x,dy=point.y-start.y;
  if(snap15){const len=Math.hypot(dx,dy),step=Math.PI/12,a=Math.round(Math.atan2(dy,dx)/step)*step;dx=Math.cos(a)*len;dy=Math.sin(a)*len;}
  return {...recognized,points:[{...start},{x:start.x+dx,y:start.y+dy,pressure:recognized.pressure}]};
 }
 if(recognized.kind==='circle'){
  const c=recognized.center,r=Math.max(.001,recognized.dragRadius?recognized.radius*Math.hypot(point.x-c.x,point.y-c.y)/recognized.dragRadius:Math.hypot(point.x-c.x,point.y-c.y)),out=[];
  for(let i=0;i<=128;i++){const a=Math.PI*2*i/128;out.push({x:c.x+Math.cos(a)*r,y:c.y+Math.sin(a)*r,pressure:recognized.pressure});}
  return {...recognized,radius:r,points:out};
 }
 if(['ellipse','rectangle','curve','arc'].includes(recognized.kind)){
  const center=recognized.center||recognized.points[0],end=recognized.points.at(-1),base=recognized.dragRadius||hypot(center,end)||1,factor=clamp(hypot(center,point)/base,.02,20);let q=scaleRecognized(recognized,factor,center);if(snap15)q=constrainRecognized(q);return q;
 }
 return recognized;
}

export function editRecognized(recognized,values){
 if(!recognized)return null;
 if(recognized.kind==='line'){
  const [a,b]=recognized.points;const x1=Number(values.x1??a.x),y1=Number(values.y1??a.y),x2=Number(values.x2??b.x),y2=Number(values.y2??b.y);
  if([x1,y1,x2,y2].some(v=>!finite(v)||Math.abs(v)>1e7))throw Error('Invalid line geometry');
  return {...recognized,points:[{x:x1,y:y1,pressure:recognized.pressure},{x:x2,y:y2,pressure:recognized.pressure}]};
 }
 if(recognized.kind!=='circle'){
  let q=scaleRecognized(recognized,Number(values.scale??100)/100);const c=q.center||q.points[0],dx=Number(values.cx??c.x)-c.x,dy=Number(values.cy??c.y)-c.y;if(!finite(dx)||!finite(dy))throw Error('Invalid shape geometry');q={...q,points:q.points.map(p=>({...p,x:p.x+dx,y:p.y+dy}))};if(q.center)q.center={x:q.center.x+dx,y:q.center.y+dy};if(q.points.some(p=>Math.abs(p.x)>1e7||Math.abs(p.y)>1e7))throw Error('Invalid shape extent');return q;
 }
 const cx=Number(values.cx??recognized.center.x),cy=Number(values.cy??recognized.center.y),r=Number(values.radius??recognized.radius);
 if(!finite(cx)||!finite(cy)||!finite(r)||r<=0||Math.abs(cx)+r>1e7||Math.abs(cy)+r>1e7)throw Error('Invalid circle geometry');
 const out=[];for(let i=0;i<=128;i++){const a=Math.PI*2*i/128;out.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r,pressure:recognized.pressure});}
 return {...recognized,center:{x:cx,y:cy},radius:r,points:out};
}

