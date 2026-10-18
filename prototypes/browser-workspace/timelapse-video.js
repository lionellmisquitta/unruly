import {applyEvent,timeline,recordingHeader} from './timelapse.js';
import {selectionBounds} from './selection.js';
import {layerState} from './folders.js';
import {filterPadding} from './filters.js';
import {createRenderer} from './render.js';
import {muxMP4,muxWebM} from './video-container.js';
export const videoLimits=Object.freeze({fps:12,seconds:60,frames:720,encodedBytes:32*1048576,fileBytes:40*1048576,wallMs:120000});
const task=()=>new Promise(r=>setTimeout(r,0));
const cancelled=()=>{throw new DOMException('Video export cancelled','AbortError');};
function guard(signal,deadline=Infinity){if(signal?.aborted)cancelled();if(performance.now()>deadline)throw Error('Export took too long · try 360p or a shorter recording');}
export function videoTiming(events,{speed=1,skipIdle=true}={}){
 if(![.5,1,2,4].includes(speed)||typeof skipIdle!=='boolean')throw Error('Invalid video timing');
 const times=timeline(events,skipIdle),frames=[];let last=-1;
 for(const t of times){const index=Math.max(last+1,Math.round(t/1000/speed*videoLimits.fps));frames.push(index);last=index;}
 const count=last+videoLimits.fps;
 if(count>videoLimits.frames)throw Error('Video exceeds 60 seconds · increase speed, skip idle gaps or use a shorter recording');
 return{states:frames,count,duration:count/videoLimits.fps,fps:videoLimits.fps};
}
export function fitVideoView(bounds,width,height){
 if(!bounds||![bounds.minX,bounds.minY,bounds.width,bounds.height].every(Number.isFinite)||bounds.width<=0||bounds.height<=0)throw Error('Select a nonempty region before opening Timelapse');
 const scale=Math.min(width/bounds.width,height/bounds.height);return{x:(width-bounds.width*scale)/2-bounds.minX*scale,y:(height-bounds.height*scale)/2-bounds.minY*scale,scale};
}
export function unionVideoBounds(a,b){if(!b)return a;if(!a)return{...b};const minX=Math.min(a.minX,b.minX),minY=Math.min(a.minY,b.minY),maxX=Math.max(a.minX+a.width,b.minX+b.width),maxY=Math.max(a.minY+a.height,b.minY+b.height);return{minX,minY,width:maxX-minX,height:maxY-minY};}
function boardBounds(board){let b=null;for(const l of board.layers){if(!layerState(board,l).visible||!l.opacity)continue;const ids=l.strokes.filter(s=>s.opacity!==0).map(s=>s.id);if(ids.length)b=unionVideoBounds(b,selectionBounds(board,ids,{layerIds:[l.id]}));}if(b){const p=filterPadding(board)+8;b={minX:b.minX-p,minY:b.minY-p,width:Math.max(1,b.width+2*p),height:Math.max(1,b.height+2*p)};}return b;}
export async function prepareVideo(log,options,validate,{signal,onProgress=()=>{}}={}){
 recordingHeader(log);const {width=640,height=360,framing='all',selection=null,viewport}=options;
 if(![[640,360],[1280,720]].some(([w,h])=>w===width&&h===height)||!['all','selection','navigation'].includes(framing))throw Error('Invalid video options');
 if(framing==='navigation'&&(!viewport||![viewport.width,viewport.height].every(n=>Number.isFinite(n)&&n>0)))throw Error('Invalid recording viewport');
 const timing=videoTiming(log.events,options);let text='',bounds=null;
 for(let i=0;i<log.events.length;i++){guard(signal);text=applyEvent(text,log.events[i]);const board=JSON.parse(text);validate(board);if(board.id!==log.boardId)throw Error('Recording board mismatch');if(framing==='all')bounds=unionVideoBounds(bounds,boardBounds(board));if(i%8===0){onProgress({phase:'Preparing',done:i,total:log.events.length});await task();}}
 if(framing==='all'&&!bounds)throw Error('Recording has no visible artwork · choose recorded navigation');
 const view=framing==='navigation'?null:fitVideoView(framing==='selection'?selection:bounds,width,height);
 return{...timing,width,height,framing,view,viewport,bounds};
}
export function videoConfig(format,width,height){return{codec:format==='mp4'?'avc1.42001f':'vp8',width,height,bitrate:width*height*4,framerate:videoLimits.fps,latencyMode:'realtime',...(format==='mp4'?{avc:{format:'avc'}}:{})};}
export async function supportedVideoFormats(width=640,height=360){
 if(typeof VideoEncoder==='undefined'||typeof VideoFrame==='undefined')return[];
 const formats=[];for(const format of ['mp4','webm'])try{if((await VideoEncoder.isConfigSupported(videoConfig(format,width,height))).supported)formats.push(format);}catch{}return formats;
}
// Deterministic timestamps, one validated sequential board, at most 4 pending frames.
export async function exportVideo(log,options,validate,{signal,onProgress=()=>{}}={}){
 const deadline=performance.now()+videoLimits.wallMs;guard(signal,deadline);
 const formats=await supportedVideoFormats(options.width,options.height),format=options.format==='auto'||!options.format?formats[0]:options.format;
 if(!formats.includes(format))throw Error('Video encoder unavailable · try another format/browser; recording backup still works');
 const plan=await prepareVideo(log,options,validate,{signal,onProgress});await document.fonts.ready;guard(signal,deadline);
 const canvas=document.createElement('canvas');canvas.width=plan.width;canvas.height=plan.height;
 // Renderer uses CSS geometry and DPR; override only this detached canvas geometry.
 canvas.getBoundingClientRect=()=>({width:plan.width/(window.devicePixelRatio||1),height:plan.height/(window.devicePixelRatio||1)});
 const renderer=createRenderer(canvas,{backend:'canvas2d',layerCacheBytes:0,groupCacheBytes:0}),output=document.createElement('canvas');output.width=plan.width;output.height=plan.height;
 const ctx=output.getContext('2d',{alpha:false}),samples=[];let bytes=0,description=null,encoder,failure=null;
 const abort=()=>{if(encoder&&encoder.state!=='closed')encoder.close();};const watchdog=setTimeout(()=>{failure=Error('Video export timed out · try 360p');abort();},Math.max(1,deadline-performance.now()));signal?.addEventListener('abort',abort,{once:true});
 try{
  encoder=new VideoEncoder({output:(chunk,meta)=>{if(signal?.aborted||failure)return;bytes+=chunk.byteLength;if(bytes>videoLimits.encodedBytes){failure=Error('Encoded video exceeds 32 MiB · try 360p');return;}const data=new Uint8Array(chunk.byteLength);chunk.copyTo(data);samples.push({data,key:chunk.type==='key',timestamp:chunk.timestamp});if(meta?.decoderConfig?.description)description=new Uint8Array(meta.decoderConfig.description).slice();},error:e=>{failure=e;}});
  encoder.configure(videoConfig(format,plan.width,plan.height));let text='',state=-1,board=null;
  for(let i=0;i<plan.count;i++){
   guard(signal,deadline);if(failure)throw failure;
   let changed=false;while(state+1<log.events.length&&plan.states[state+1]<=i){text=applyEvent(text,log.events[++state]);board=JSON.parse(text);changed=true;}
   if(changed){const ratio=1/(window.devicePixelRatio||1),nav=log.events[state].view,navScale=plan.framing==='navigation'?Math.min(plan.width/plan.viewport.width,plan.height/plan.viewport.height):0;
    const v=plan.framing==='navigation'?{x:(plan.width-plan.viewport.width*navScale)/2+nav.x*navScale,y:(plan.height-plan.viewport.height*navScale)/2+nav.y*navScale,scale:nav.scale*navScale}:plan.view;
    renderer.renderReference(board,{x:v.x*ratio,y:v.y*ratio,scale:v.scale*ratio});ctx.drawImage(canvas,0,0,plan.width,plan.height);
   }
   const frame=new VideoFrame(output,{timestamp:Math.round(i*1e6/plan.fps),duration:Math.round((i+1)*1e6/plan.fps)-Math.round(i*1e6/plan.fps)});
   try{encoder.encode(frame,{keyFrame:i%plan.fps===0});}finally{frame.close();}
   if(encoder.encodeQueueSize>=4)await encoder.flush();
   onProgress({phase:'Exporting',done:i+1,total:plan.count});await task();
  }
  await encoder.flush();guard(signal,deadline);if(failure)throw failure;if(samples.length!==plan.count)throw Error('Encoder returned incomplete video · retry');
  samples.sort((a,b)=>a.timestamp-b.timestamp);const blob=(format==='mp4'?muxMP4:muxWebM)(samples,{...plan,description});if(blob.size>videoLimits.fileBytes)throw Error('Video file exceeds 40 MiB');
  return{blob,format,width:plan.width,height:plan.height,frames:plan.count,duration:plan.duration,fps:plan.fps};
 }finally{clearTimeout(watchdog);signal?.removeEventListener('abort',abort);abort();for(const c of new Set([...renderer.surfaces,output])){c.width=1;c.height=1;}renderer.invalidate('video-release');samples.length=0;}
}
