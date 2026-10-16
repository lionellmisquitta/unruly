// Input geometry only. No DOM/model/storage, timers, replay metadata or point buffer.
export function smoothingAmount(value){
 const n=Number(value);return Number.isFinite(n)&&n>=0&&n<=100?Math.round(n):0;
}
export function createStabilizer(first,amount=0,scale=1){
 const strength=smoothingAmount(amount),zoom=Number.isFinite(scale)&&scale>0?scale:1;
 const radius=18*(strength/100)**2/zoom;
 let x=first.x,y=first.y;
 return {
  advance(point){
   if(!radius)return point;
   const distance=Math.hypot(point.x-x,point.y-y),alpha=-Math.expm1(-distance/radius);
   x+=(point.x-x)*alpha;y+=(point.y-y)*alpha;
   return {...point,x,y};
  },
  finish(point){x=point.x;y=point.y;return point;}
 };
}
