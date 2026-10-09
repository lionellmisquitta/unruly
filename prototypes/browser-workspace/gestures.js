export const TOUCH_LIMITS=Object.freeze({arrivalMs:120,durationMs:250,movePx:8,holdMs:650});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function createTouchTracker(limits=TOUCH_LIMITS){
 let state=null;
 const reset=()=>{state=null;};
 const snapshot=()=>state?{firstDown:state.firstDown,maxCount:state.maxCount,candidate:state.candidate,moved:state.moved,active:[...state.active.values()].map(x=>({...x}))}:null;
 function down(id,x,y,t){
  if(!state)state={firstDown:t,maxCount:0,candidate:true,moved:false,active:new Map()};
  if(state.active.has(id))return snapshot();
  if(t-state.firstDown>limits.arrivalMs)state.candidate=false;
  state.active.set(id,{id,start:{x,y},current:{x,y},down:t});
  state.maxCount=Math.max(state.maxCount,state.active.size);
  if(state.maxCount>3)state.candidate=false;
  return snapshot();
 }
 function move(id,x,y){
  if(!state?.active.has(id))return {crossed:false,state:snapshot()};
  const c=state.active.get(id);c.current={x,y};
  const crossed=dist(c.start,c.current)>limits.movePx;
  if(crossed){state.candidate=false;state.moved=true;}
  return {crossed,state:snapshot()};
 }
 function up(id,t){
  if(!state?.active.has(id))return {action:null,finished:false,state:snapshot()};
  state.active.delete(id);
  if(state.active.size)return {action:null,finished:false,state:snapshot()};
  const duration=t-state.firstDown,count=state.maxCount;
  const action=state.candidate&&duration<=limits.durationMs&&(count===2||count===3)?(count===2?'undo':'redo'):null;
  const ended={count,duration,candidate:state.candidate,moved:state.moved};
  reset();
  return {action,finished:true,ended};
 }
 function cancel(){const ended=snapshot();reset();return ended;}
 return {down,move,up,cancel,snapshot};
}

// G02: non-destructive long-press history scrub controller. A short tap remains a click.
export function createHistoryHold({step,schedule=setTimeout,cancel=clearTimeout,delayMs=550,intervalMs=160}){
 let pointer=null,timer=null,repeating=false;
 const clear=()=>{if(timer!==null)cancel(timer);timer=null;};
 const begin=(id,kind)=>{if(pointer!==null)return false;pointer={id,kind};repeating=false;timer=schedule(function tick(){if(!pointer)return;repeating=true;if(step(pointer.kind)===false){clear();return;}timer=schedule(tick,intervalMs);},delayMs);return true;};
 const end=id=>{if(!pointer||pointer.id!==id)return false;const consumed=repeating;clear();pointer=null;repeating=false;return consumed;};
 const abort=()=>{clear();pointer=null;repeating=false;};
 return {begin,end,abort,active:()=>pointer!==null};
}
