import {drawTip,visitTip,validateTip} from './custom-tips.js';
import {validateDynamics} from './pen-input.js';
import {rasterLimits,rasterStroke} from './raster.js';

const fail=message=>{throw Error(message);};
const pointOK=p=>p&&[p.x,p.y].every(Number.isFinite)&&Math.max(Math.abs(p.x),Math.abs(p.y))<=1e7&&(p.pressure===null||Number.isFinite(p.pressure)&&p.pressure>=0&&p.pressure<=1);
export function mergeAlphaTip(source,coverage,color,opacity){
 if(!(source instanceof Uint8ClampedArray)||!(coverage instanceof Uint8ClampedArray)||source.length!==coverage.length||source.length%4||!/^#[\da-f]{6}$/i.test(color)||!Number.isFinite(opacity)||opacity<0||opacity>1)fail('Invalid alpha-tip pixels');
 const result=new Uint8ClampedArray(source),rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));let changed=false;
 for(let i=0;i<result.length;i+=4){if(!source[i+3])continue;const a=coverage[i+3]/255*opacity;if(!a)continue;for(let k=0;k<3;k++){result[i+k]=Math.round(rgb[k]*a+source[i+k]*(1-a));if(result[i+k]!==source[i+k])changed=true;}}
 return {data:result,changed};
}
function tipCoverage(snapshot,stroke){
 const canvas=document.createElement('canvas');canvas.width=snapshot.width;canvas.height=snapshot.height;
 try{const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)fail('Image-tip paint canvas unavailable');ctx.translate(-snapshot.x,-snapshot.y);drawTip(ctx,stroke);return ctx.getImageData(0,0,snapshot.width,snapshot.height).data;}finally{canvas.width=canvas.height=1;}
}
// Disposable raster draft: original alpha/source remain authoritative until commit.
export function createImageTipPaintSession(snapshot,settings,first,render=tipCoverage){
 if(!snapshot||![snapshot.width,snapshot.height,snapshot.x,snapshot.y].every(Number.isInteger)||snapshot.width<1||snapshot.height<1||snapshot.width>1024||snapshot.height>1024||Math.max(Math.abs(snapshot.x),Math.abs(snapshot.y),Math.abs(snapshot.x+snapshot.width),Math.abs(snapshot.y+snapshot.height))>1e7||!(snapshot.data instanceof Uint8ClampedArray)||snapshot.data.length!==snapshot.width*snapshot.height*4)fail('Invalid alpha-tip source');
 const config=structuredClone(settings);validateTip(config.tip);validateDynamics(config.dynamics);
 if(!/^#[\da-f]{6}$/i.test(config.color)||!Number.isFinite(config.size)||config.size<1||config.size>160||!Number.isFinite(config.opacity)||config.opacity<0||config.opacity>1||!pointOK(first))fail('Invalid alpha-tip paint settings');
 const source={...snapshot,data:new Uint8ClampedArray(snapshot.data)},id=snapshot.id||crypto.randomUUID(),stroke={...config,points:[{...first}]};let dirty=config.opacity>0,changed=false,cached=null,work=0,stamps=0;
 function admit(){let cost=source.width*source.height;stamps=visitTip(stroke,p=>{const radius=p.width*Math.SQRT1_2+1,x0=Math.max(source.x,Math.floor(p.x-radius)),y0=Math.max(source.y,Math.floor(p.y-radius)),x1=Math.min(source.x+source.width,Math.ceil(p.x+radius)),y1=Math.min(source.y+source.height,Math.ceil(p.y+radius));cost+=Math.max(0,x1-x0)*Math.max(0,y1-y0);if(cost>rasterLimits.work)fail('Image-tip alpha-lock work limit · gesture cancelled');});work=cost;}
 admit();
 return {advance(point){if(!pointOK(point))fail('Invalid alpha-tip paint point');const last=stroke.points.at(-1);if(last.x===point.x&&last.y===point.y&&last.pressure===point.pressure)return dirty||changed;if(stroke.points.length>=5000)fail('Image-tip point limit · gesture cancelled');stroke.points.push({...point});try{admit();}catch(e){stroke.points.pop();throw e;}dirty=config.opacity>0;return dirty||changed;},stroke(){if(dirty){const result=mergeAlphaTip(source.data,render(source,stroke),config.color,config.opacity);cached=rasterStroke(result.data,source.width,source.height,source.x,source.y,id);changed=result.changed;dirty=false;}return cached;},get changed(){return dirty||changed;},diagnostics:()=>Object.freeze({points:stroke.points.length,stamps,work,sourceBytes:source.data.byteLength,maxTemporaryPixelBytes:source.data.byteLength*4})};
}
