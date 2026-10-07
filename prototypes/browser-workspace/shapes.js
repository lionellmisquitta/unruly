const finite=n=>typeof n==='number'&&Number.isFinite(n);
const hypot=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const meanPressure=points=>{const q=points.map(p=>p.pressure).filter(finite);return q.length?q.reduce((a,b)=>a+b,0)/q.length:null;};
const withPressure=(p,pressure)=>({x:p.x,y:p.y,pressure});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export function recognizeHeldShape(points,scale=1){
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
  const c=recognized.center,r=Math.max(.001,Math.hypot(point.x-c.x,point.y-c.y)),out=[];
  for(let i=0;i<=128;i++){const a=Math.PI*2*i/128;out.push({x:c.x+Math.cos(a)*r,y:c.y+Math.sin(a)*r,pressure:recognized.pressure});}
  return {...recognized,radius:r,points:out};
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
 const cx=Number(values.cx??recognized.center.x),cy=Number(values.cy??recognized.center.y),r=Number(values.radius??recognized.radius);
 if(!finite(cx)||!finite(cy)||!finite(r)||r<=0||Math.abs(cx)+r>1e7||Math.abs(cy)+r>1e7)throw Error('Invalid circle geometry');
 const out=[];for(let i=0;i<=128;i++){const a=Math.PI*2*i/128;out.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r,pressure:recognized.pressure});}
 return {...recognized,center:{x:cx,y:cy},radius:r,points:out};
}

