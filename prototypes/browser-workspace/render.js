import {drawTip} from './custom-tips.js';
import {applyCanvasFilter,filterPadding} from './filters.js';
import {applyCanvasAdjustment} from './adjustments.js';
import {effectDepth,composeEffects} from './effect-compositor.js';
import {drawText} from './text.js';
import {createClipCache,clipBudget} from './clipping.js';
import {applyLayerMask} from './masks.js';
import {renderBoard} from './folders.js';
// Stable renderer boundary. Auto retains occupied upper layers; canvas2d is the replay fallback.
import {createCanvas2DRenderer} from './canvas2d-renderer.js';
import {createLayerCompositor} from './layer-compositor.js';
import {createRasterCache} from './raster-cache.js';
import {decodePixels} from './raster.js';
import {describeFrame} from './render-contract.js';
export {graphiteGrain,rendererBudget} from './canvas2d-renderer.js';

export function createRenderer(canvas,{backend='auto',layerCacheBytes=16*1024*1024}={}){
 if(!['auto','canvas2d'].includes(backend))throw Error('Unsupported renderer backend: '+backend);
 const rasterCache=createRasterCache(),plainCache=backend==='auto'?createLayerCompositor({budgetBytes:layerCacheBytes}):null,clippedCache=backend==='auto'?createLayerCompositor({budgetBytes:Math.max(0,Math.min(layerCacheBytes,16*1024*1024)-clipBudget)}):null,clipCache=createClipCache();let reference=false,maskPreview=null,clipMode=false,drawing=false,frameBoard=null,frameLive=null,groupDepth=0,halo=0,tipReserve=0;
 const layerCompositor=backend==='auto'?{clear:()=>{plainCache.clear();clippedCache.clear();},render:args=>(clipMode?clippedCache:plainCache).render({...args,backingLimit:args.backingLimit-(clipMode?clipBudget:0)})}:null;
 const engine=createCanvas2DRenderer(canvas,{drawText,drawTip,decodeRaster:data=>reference?decodePixels(data):rasterCache.decode(data),layerCompositor,allocationReserve:()=>tipReserve+(clipMode?clipBudget:0)+groupDepth*300*150*4,extraSurfaces:()=>groupDepth,framePadding:v=>halo*v.scale,groupComposer:args=>composeEffects({...args,afterGroup:(n,c)=>{if(drawing&&clipMode)clipCache.captureGroup(n,c,args.view,args.g);}}),applyMask:(l,layer,scratch,v,g,decode)=>{
  applyCanvasAdjustment(l,layer);
  applyCanvasFilter(l,layer,scratch,g.d*v.scale);
  const adapted=maskPreview?.id===l.id?{...l,mask:{...l.mask,patch:maskPreview.patch}}:l;applyLayerMask(adapted,layer,scratch,v,g,decode);
  if(drawing&&clipMode){clipCache.apply(l,layer);clipCache.capture(l,layer,v,g,l.id===frameBoard.activeLayer?(maskPreview?.patch||frameLive):null);}
 }});
 let epoch=0,reason='initial',lastFrame=null,frames=0;
 function invalidate(why='external',releaseRaster=true){
  if(releaseRaster)rasterCache.clear();clipCache.clear();
  epoch++;reason=String(why);lastFrame=null;engine.invalidate();
 }
 function draw(method,board,view={x:0,y:0,scale:1},live=null){
  board=renderBoard(board);tipReserve=[...board.layers.flatMap(l=>l.strokes),...(live?[live]:[])].reduce((n,s)=>Math.max(n,s.tip?s.tip.width*s.tip.height*4:0),0);groupDepth=effectDepth(board);halo=filterPadding(board);reference=method==='renderReference';drawing=true;frameBoard=board;frameLive=live;clipMode=board.layers.some(l=>l.clipSource);clipCache.prepare(board);
  try{
   const result=engine[method](board,view,live);
   lastFrame=describeFrame(board,view,live,result);frames++;
   const extra=clipCache.diagnostics().residentBytes+tipReserve;return {...result,backingBytes:result.backingBytes+extra,...(result.totalBackingBytes!==undefined?{totalBackingBytes:result.totalBackingBytes+extra}:{}),clipCacheBytes:extra-tipReserve,tipTemporaryBytes:tipReserve};
  }catch(error){invalidate('render-failed');throw error;}finally{reference=false;drawing=false;}
 }
 function auxiliary(method,args){
  // Preview/thumbnail/picker/snapshot share backing stores with live ink.
  invalidate(method,false);clipMode=false;groupDepth=0,halo=0,tipReserve=0;
  try{return engine[method](...args);}catch(error){invalidate(method+'-failed');throw error;}
 }
 return {
  render:(...args)=>draw('render',...args),
  renderReference:(...args)=>draw('renderReference',...args),
  renderMask:(board,view,preview)=>{maskPreview=preview;try{return draw('render',board,view,{opacity:0});}finally{maskPreview=null;}},
  preview:(...args)=>auxiliary('preview',args),
  thumbnail:(...args)=>auxiliary('thumbnail',args),
  magnify:(...args)=>auxiliary('magnify',args),
  snapshotLayer:(...args)=>auxiliary('snapshotLayer',args),
  snapshotRegion:(...args)=>auxiliary('snapshotRegion',args),
  invalidate,
  surfaces:engine.surfaces,
  getDiagnostics:()=>Object.freeze({contractVersion:1,backend:'canvas2d',epoch,reason,frames,lastFrame,rasterCache:rasterCache.diagnostics(),clipCache:clipCache.diagnostics(),layerCache:(clipMode?clippedCache:plainCache)?.diagnostics()||null})
 };
}
