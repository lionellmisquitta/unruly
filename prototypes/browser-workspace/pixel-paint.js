import {rasterLimits,rasterStroke} from './raster.js';
import {createPixelSurface} from './pixel-surface.js';
import {pressureWidth,pressureOpacity,validateDynamics} from './pen-input.js';
const checkPoint=p=>{if(!p||![p.x,p.y].every(Number.isFinite)||Math.max(Math.abs(p.x),Math.abs(p.y))>1e7||p.pressure!==null&&(!Number.isFinite(p.pressure)||p.pressure<0||p.pressure>1))throw Error('Invalid paint point');};
export function createPaintSession(snapshot,settings,first){
 checkPoint(first);const config=structuredClone(settings);
 if(!['round','soft'].includes(config.tip)||!/^#[a-fA-F0-9]{6}$/.test(config.color)||!Number.isFinite(config.size)||config.size<1||config.size>160||!Number.isFinite(config.opacity)||config.opacity<0||config.opacity>1)throw Error('Invalid paint settings');
 validateDynamics(config.dynamics);const id=snapshot?.id||crypto.randomUUID(),surface=createPixelSurface(snapshot||{data:new Uint8ClampedArray(4),width:1,height:1,x:Math.floor(first.x),y:Math.floor(first.y)});
 const color=[1,3,5].map(i=>parseInt(config.color.slice(i,i+2),16));let last={...first},changed=false,dabs=0,work=0;
 function stamp(p){
  const radius=Math.max(.5,config.size*pressureWidth({},p.pressure,config.dynamics)/2),opacity=config.opacity*pressureOpacity(p.pressure,config.dynamics);
  if(opacity===0)return;
  const x0=Math.max(0,Math.floor(p.x-surface.x-radius-.5)),y0=Math.max(0,Math.floor(p.y-surface.y-radius-.5)),x1=Math.min(surface.width,Math.ceil(p.x-surface.x+radius+.5)),y1=Math.min(surface.height,Math.ceil(p.y-surface.y+radius+.5));
  const cost=Math.max(0,x1-x0)*Math.max(0,y1-y0);if(work+cost>rasterLimits.work)throw Error('Paint work limit · gesture cancelled');work+=cost;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
   const distance=Math.hypot(x+.5+surface.x-p.x,y+.5+surface.y-p.y),coverage=config.tip==='soft'?Math.max(0,1-distance/(radius+.5))**2*.25:Math.max(0,Math.min(1,radius+.5-distance));if(coverage===0)continue;
   const sa=opacity*coverage,i=(y*surface.width+x)*4,data=surface.data,da=data[i+3]/255,alpha=sa+da*(1-sa);
   if(config.alphaLock){if(!data[i+3])continue;const old=[data[i],data[i+1],data[i+2]];for(let k=0;k<3;k++)data[i+k]=Math.round(color[k]*sa+data[i+k]*(1-sa));if(old.some((v,k)=>v!==data[i+k]))changed=true;continue;}
   if(config.erase){const old=data[i+3];data[i+3]=Math.round(old*(1-sa));if(!data[i+3])data.fill(0,i,i+4);if(data[i+3]!==old)changed=true;continue;}
   if(Math.round(alpha*255)===0)continue;
   const red=data[i],green=data[i+1],blue=data[i+2],oldAlpha=data[i+3];for(let k=0;k<3;k++)data[i+k]=alpha?Math.round((color[k]*sa+data[i+k]*da*(1-sa))/alpha):0;data[i+3]=Math.round(alpha*255);if(red!==data[i]||green!==data[i+1]||blue!==data[i+2]||oldAlpha!==data[i+3])changed=true;
  }
 }
 function reserve(a,b){const padding=config.size/2+1;surface.ensure(Math.min(a.x,b.x)-padding,Math.min(a.y,b.y)-padding,Math.max(a.x,b.x)+padding,Math.max(a.y,b.y)+padding);}
 if(config.opacity>0){if(!config.alphaLock)reserve(first,first);stamp(first);dabs++;}
 return {advance(point){checkPoint(point);const distance=Math.hypot(point.x-last.x,point.y-last.y);if(distance<1e-7&&point.pressure===last.pressure)return changed;const n=Math.max(1,Math.ceil(distance/Math.max(.5,config.size*Math.min(pressureWidth({},last.pressure,config.dynamics),pressureWidth({},point.pressure,config.dynamics))*.15)));if(dabs+n>rasterLimits.dabs)throw Error('Paint dab limit · gesture cancelled');if(config.opacity>0&&!config.alphaLock)reserve(last,point);for(let j=1;j<=n;j++){const t=j/n;stamp({x:last.x+(point.x-last.x)*t,y:last.y+(point.y-last.y)*t,pressure:last.pressure===null||point.pressure===null?null:last.pressure+(point.pressure-last.pressure)*t});}dabs+=n;last={...point};return changed;},stroke:()=>rasterStroke(surface.data,surface.width,surface.height,surface.x,surface.y,id),get changed(){return changed;},diagnostics:()=>Object.freeze({...surface.diagnostics(),dabs,work})};
}
