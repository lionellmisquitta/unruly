import {visitTip,tipLimits} from './custom-tips.js';
// Bounded input geometry only; guide preferences/overlays never enter board JSON.
export const guideDefaults=Object.freeze({mode:'off',symmetry:'off',x:0,y:0,angle:0,spacing:25});
export function validateGuide(g){
 if(!g||Object.keys(g).some(k=>!Object.hasOwn(guideDefaults,k))||!['off','ruler','grid','angle','endpoints'].includes(g.mode)||!['off','vertical','horizontal','both'].includes(g.symmetry)||!['x','y','angle','spacing'].every(k=>typeof g[k]==='number'&&Number.isFinite(g[k]))||Math.abs(g.x)>1e7||Math.abs(g.y)>1e7||Math.abs(g.angle)>180||g.spacing<1||g.spacing>1000)throw Error('Invalid drawing guide');
 return g;
}
export function guideEndpoints(strokes){return strokes.filter(s=>!['raster','text'].includes(s.brush)).slice(0,2000).flatMap(s=>[s.points[0],s.points.at(-1)]).map(p=>({x:p.x,y:p.y}));}
export function createGuide(config,first,scale=1,targets=[]){
 const g=structuredClone(validateGuide(config)),zoom=Number.isFinite(scale)&&scale>0?scale:1,angle=g.angle*Math.PI/180,dx=Math.cos(angle),dy=Math.sin(angle),candidates=targets.slice(0,4000).map(p=>({x:p.x,y:p.y}));
 return {config:g,enabled:g.mode!=='off'||g.symmetry!=='off',advance(p){
  if(g.mode==='off')return p;let x=p.x,y=p.y;
  if(g.mode==='ruler'){const d=(x-g.x)*dx+(y-g.y)*dy;x=g.x+d*dx;y=g.y+d*dy;}
  else if(g.mode==='grid'){x=g.x+Math.round((x-g.x)/g.spacing)*g.spacing;y=g.y+Math.round((y-g.y)/g.spacing)*g.spacing;}
  else if(g.mode==='angle'){const r=Math.hypot(x-first.x,y-first.y),a=Math.round(Math.atan2(y-first.y,x-first.x)/(Math.PI/12))*Math.PI/12;x=first.x+r*Math.cos(a);y=first.y+r*Math.sin(a);}
  else{let nearest=null,d=(8/zoom)**2;for(const q of candidates){const v=(x-q.x)**2+(y-q.y)**2;if(v<d){nearest=q;d=v;}}if(nearest){x=nearest.x;y=nearest.y;}}
  return {...p,x,y};
 }};
}
export function guidedCopies(stroke,g,newId=()=>crypto.randomUUID()){
 validateGuide(g);if(g.symmetry==='off')return [stroke];
 const masks=g.symmetry==='both'?[[1,1],[-1,1],[1,-1],[-1,-1]]:g.symmetry==='vertical'?[[1,1],[-1,1]]:[[1,1],[1,-1]];
 const out=[],seen=new Set();
 let work=0,stamps=0;
 for(const [sx,sy]of masks){const points=stroke.points.map(p=>({...p,x:g.x+(p.x-g.x)*sx,y:g.y+(p.y-g.y)*sy})),key=JSON.stringify(points);if(!stroke.tip&&seen.has(key))continue;seen.add(key);const copy={...structuredClone(stroke),id:out.length?newId():stroke.id,points};
  if(copy.tip)copy.tipReflection??={parity:1,heading:0};
  if(copy.tip&&(sx!==1||sy!==1)){const parity=sx*sy,heading=(stroke.tipReflection?.heading??0)*Math.PI/180;copy.tipReflection={parity:(stroke.tipReflection?.parity??1)*parity,heading:Math.atan2(sy*Math.sin(heading),sx*Math.cos(heading))*180/Math.PI};copy.tip.options.angle*=parity;copy.tip.angle=copy.tip.angle*parity+(copy.tip.options.rotation==='follow'?0:sx===-1?180:0);if(parity<0)copy.tip.options.flipY=!copy.tip.options.flipY;}
  if(copy.tip){const n=visitTip(copy);stamps+=n;work+=n*copy.tip.width*copy.tip.height;if(stamps>tipLimits.stamps||work>tipLimits.sampledPixels)throw Error('Image-tip symmetry work limit · gesture cancelled');}out.push(copy);
 }
 return out;
}
