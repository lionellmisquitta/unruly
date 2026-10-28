// Local-only recording work. Artwork remains owned by the main-thread history.
import {validateBoard} from './model.js';
import {boardText,sameArtwork,operationDelta,eventBytes,validateRecording,compactRecording,validTimeId} from './timelapse.js';
import {openTimelapseStore} from './timelapse-store.js';
let db=null,boardId=null,previous='',revision=0,chain=Promise.resolve();
const storage=async()=>db||(db=await openTimelapseStore());
async function handle({action,payload}){
 if(action==='load'){
  if(!validTimeId(payload.boardId))throw Error('Invalid recording board');
  const r=await(await storage()).read(payload.boardId);let bytes=0,text='';
  if(r.log){const checked=await validateRecording(r.log,validateBoard);bytes=checked.bytes;text=checked.text;
   if(r.log.version===1&&r.log.events.length>1){const compact=await compactRecording(r.log,validateBoard);if(compact.bytes<bytes){r.revision=await(await storage()).rewriteLog(compact.log,r.revision);r.log=compact.log;bytes=compact.bytes;}}
  }
  boardId=payload.boardId;previous=text;revision=r.revision;return{...r,bytes};
 }
 if(action==='capture'){
  const {board,view,at,gap,force,expected}=payload;
  if(board?.id!==boardId||expected!==revision)throw Error('Recording source changed · pause and reopen Timelapse');
  // Only immutable native boards admitted by host history use structural validation.
  const text=boardText(board,b=>validateBoard(b,{deep:false}));
  if(!force&&sameArtwork(previous,text))return{event:null};
  const event={at,gap,view,delta:operationDelta(previous,text)},bytes=eventBytes(event);
  const next=await(await storage()).append(boardId,revision,event);previous=text;revision=next;return{event,bytes,revision};
 }
 throw Error('Unknown recording task');
}
self.onmessage=({data})=>{const {request}=data;chain=chain.then(()=>handle(data)).then(result=>self.postMessage({request,result}),e=>self.postMessage({request,error:e.message||String(e)}));};
