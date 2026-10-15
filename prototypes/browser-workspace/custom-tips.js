import {validateGrain,grainMask} from './grain.js';
import {pressureWidth,pressureOpacity} from './pen-input.js';
export const tipLimits=Object.freeze({dimension:128,stamps:4096,sampledPixels:4194304,sections:16,brushes:32,libraryBytes:1048576});
export const TIP_DEFAULTS=Object.freeze({spacing:.25,spacingJitter:0,lateral:0,linear:0,rotation:'fixed',angle:0,count:1,countJitter:0,sizeJitter:0,opacityJitter:0,flipX:false,flipY:false});
const fail=m=>{throw Error(m);},num=(x,a,b)=>Number.isFinite(x)&&x>=a&&x<=b,exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).sort().join(',')===[...keys].sort().join(',');
export function validateTip(t){
 if(!exact(t,['version','width','height','mask','options','seed','scale','angle',...(t?.version===2?['grain']:[])])||![1,2].includes(t.version)||![t.width,t.height].every(x=>Number.isInteger(x)&&x>=1&&x<=128)||typeof t.mask!=='string'||t.mask.length!==4*Math.ceil(t.width*t.height/3)||!Number.isInteger(t.seed)||!num(t.seed,0,4294967295)||!num(t.scale,.0001,10000)||!num(t.angle,-1e7,1e7))fail('Invalid image tip');
 let raw;try{raw=atob(t.mask);}catch{fail('Invalid tip mask');}if(raw.length!==t.width*t.height||btoa(raw)!==t.mask||!Array.from(raw).some(c=>c.charCodeAt(0)))fail('Tip mask must contain visible pixels');
 if(t.version===2)validateGrain(t.grain);const o=t.options;if(!exact(o,Object.keys(TIP_DEFAULTS))||!num(o.spacing,.05,3)||!['spacingJitter','countJitter','sizeJitter','opacityJitter'].every(k=>num(o[k],0,1))||!['lateral','linear'].every(k=>num(o[k],0,2))||!['fixed','follow','random'].includes(o.rotation)||!num(o.angle,-180,180)||!Number.isInteger(o.count)||!num(o.count,1,8)||!['flipX','flipY'].every(k=>typeof o[k]==='boolean'))fail('Invalid image tip controls');return t;
}
export function imageTip(decoded,mode='alpha',invert=false){
 if(!['alpha','grayscale'].includes(mode)||typeof invert!=='boolean'||!decoded||!Number.isInteger(decoded.width)||!Number.isInteger(decoded.height)||decoded.width<1||decoded.height<1||decoded.width>1024||decoded.height>1024||decoded.data?.length!==decoded.width*decoded.height*4)fail('Invalid tip image');
 const factor=Math.min(1,128/Math.max(decoded.width,decoded.height)),width=Math.max(1,Math.round(decoded.width*factor)),height=Math.max(1,Math.round(decoded.height*factor));let raw='';
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=(Math.floor(y*decoded.height/height)*decoded.width+Math.floor(x*decoded.width/width))*4,a=decoded.data[i+3],l=.2126*decoded.data[i]+.7152*decoded.data[i+1]+.0722*decoded.data[i+2];const v=mode==='alpha'?(invert?255-a:a):a*(invert?l:255-l)/255;raw+=String.fromCharCode(Math.round(v));}
 return validateTip({version:1,width,height,mask:btoa(raw),options:{...TIP_DEFAULTS},seed:173,scale:1,angle:0});
}
// Distances carry across input segments. Randomness depends only on saved seed/order.
export function visitTip(s,visit=()=>{}){
 const t=validateTip(s.tip),o=t.options;let seed=t.seed>>>0,n=0;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;},signed=()=>random()*2-1;
 const step=()=>Math.max(.5,s.size*t.scale*o.spacing*(1+signed()*o.spacingJitter*.9));
 let next=step();
 const stamp=(p,heading)=>{const count=Math.max(1,o.count-Math.floor(random()*(o.count+1)*o.countJitter));for(let j=0;j<count;j++){
  if(++n>tipLimits.stamps||n*t.width*t.height>tipLimits.sampledPixels)fail('Image tip replay limit reached; shorten the stroke or increase spacing');
  const width=s.size*t.scale*pressureWidth({minWidth:.08,exponent:1.2},p.pressure,s.dynamics)*(1-random()*o.sizeJitter),linear=signed()*o.linear*s.size*t.scale,lateral=signed()*o.lateral*s.size*t.scale;
  visit({x:p.x+Math.cos(heading)*linear-Math.sin(heading)*lateral,y:p.y+Math.sin(heading)*linear+Math.cos(heading)*lateral,width,angle:(o.angle+t.angle)*Math.PI/180+(o.rotation==='follow'?heading:o.rotation==='random'?random()*2*Math.PI:0),opacity:pressureOpacity(p.pressure,s.dynamics)*(1-random()*o.opacityJitter),flipX:o.flipX,flipY:o.flipY});
 }};
 const first=s.points[0],second=s.points.find(p=>p.x!==first.x||p.y!==first.y);stamp(first,second?Math.atan2(second.y-first.y,second.x-first.x):0);
 for(let i=1;i<s.points.length;i++){const a=s.points[i-1],b=s.points[i],length=Math.hypot(b.x-a.x,b.y-a.y),heading=Math.atan2(b.y-a.y,b.x-a.x);let used=0;
  while(length-used>=next){used+=next;const f=used/length;stamp({x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,pressure:a.pressure===null||b.pressure===null?null:a.pressure+(b.pressure-a.pressure)*f},heading);next=step();}next-=length-used;
 }return n;
}
export function drawTip(ctx,s){
 // Admission completes before allocating/drawing; no partial replay on work overflow.
 visitTip(s);const t=s.tip,c=document.createElement('canvas');c.width=t.width;c.height=t.height;const cc=c.getContext('2d'),data=cc.createImageData(t.width,t.height),raw=grainMask(t),rgb=s.color.slice(1).match(/../g).map(x=>parseInt(x,16));
 for(let i=0;i<raw.length;i++){data.data.set(rgb,i*4);data.data[i*4+3]=raw.charCodeAt(i);}cc.putImageData(data,0,0);
 try{visitTip(s,p=>{ctx.save();try{ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.scale(p.flipX?-1:1,p.flipY?-1:1);ctx.globalAlpha=p.opacity;const f=p.width/Math.max(t.width,t.height);ctx.drawImage(c,-t.width*f/2,-t.height*f/2,t.width*f,t.height*f);}finally{ctx.restore();}});}finally{c.width=c.height=1;}
}
export const tipRadius=s=>s.tip?s.size*s.tip.scale*(Math.SQRT1_2+Math.hypot(s.tip.options.lateral,s.tip.options.linear)):s.size/2;
export const emptyLibrary=()=>({version:1,sections:[{id:'imported',name:'Imported'}],brushes:[]});
const nameOK=x=>typeof x==='string'&&x.trim().length>0&&x.length<=64;
export function validateTipLibrary(lib){
 if(!exact(lib,['version','sections','brushes'])||lib.version!==1||!Array.isArray(lib.sections)||!lib.sections.length||lib.sections.length>16||!Array.isArray(lib.brushes)||lib.brushes.length>32||new TextEncoder().encode(JSON.stringify(lib)).length>1048576)fail('Brush library limit or invalid format');
 const ids=new Set();for(const section of lib.sections){if(!exact(section,['id','name'])||!nameOK(section.id)||!nameOK(section.name)||ids.has(section.id))fail('Invalid brush section');ids.add(section.id);}const brushIds=new Set();for(const b of lib.brushes){if(!exact(b,['id','name','section','tip'])||!nameOK(b.id)||!nameOK(b.name)||!ids.has(b.section)||brushIds.has(b.id))fail('Invalid saved brush');brushIds.add(b.id);validateTip(b.tip);}return lib;
}
