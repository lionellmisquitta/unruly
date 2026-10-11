// Stable renderer boundary. Canvas2D is the sole supported backend today.
import {createCanvas2DRenderer} from './canvas2d-renderer.js';
import {describeFrame} from './render-contract.js';
export {graphiteGrain,rendererBudget} from './canvas2d-renderer.js';

export function createRenderer(canvas,{backend='auto'}={}){
 if(!['auto','canvas2d'].includes(backend))throw Error('Unsupported renderer backend: '+backend);
 const engine=createCanvas2DRenderer(canvas);
 let epoch=0,reason='initial',lastFrame=null,frames=0;
 function invalidate(why='external'){
  epoch++;reason=String(why);lastFrame=null;engine.invalidate();
 }
 function draw(method,board,view={x:0,y:0,scale:1},live=null){
  try{
   const result=engine[method](board,view,live);
   lastFrame=describeFrame(board,view,live,result);frames++;
   return result;
  }catch(error){invalidate('render-failed');throw error;}
 }
 function auxiliary(method,args){
  // Preview/thumbnail/picker/snapshot share backing stores with live ink.
  invalidate(method);
  try{return engine[method](...args);}catch(error){invalidate(method+'-failed');throw error;}
 }
 return {
  render:(...args)=>draw('render',...args),
  renderReference:(...args)=>draw('renderReference',...args),
  preview:(...args)=>auxiliary('preview',args),
  thumbnail:(...args)=>auxiliary('thumbnail',args),
  magnify:(...args)=>auxiliary('magnify',args),
  snapshotLayer:(...args)=>auxiliary('snapshotLayer',args),
  invalidate,
  surfaces:engine.surfaces,
  getDiagnostics:()=>Object.freeze({contractVersion:1,backend:'canvas2d',epoch,reason,frames,lastFrame})
 };
}
