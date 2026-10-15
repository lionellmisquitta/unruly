// Timelapse v1: bounded forward text deltas. No document/DOM/storage mutation.
export const timeLimits=Object.freeze({events:2000,bytes:32*1024*1024,totalBytes:128*1024*1024,boardBytes:8*1024*1024,pending:4});
const bytes=s=>new TextEncoder().encode(s).length;
const fail=()=>{throw Error('Invalid timelapse recording · original data preserved');};
const keys=(x,want)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).sort().join(',')===want.split(',').sort().join(',');
export const validTimeId=id=>typeof id==='string'&&id.length>0&&id.length<=128;
export function boardText(board,validate){validate(board);const text=JSON.stringify(board);if(bytes(text)>timeLimits.boardBytes)fail();return text;}
// Revision/active-layer selection are not drawing changes; all other native fields count.
export function sameArtwork(a,b){if(a===b)return true;if(!a||!b)return false;const clean=s=>{const b=JSON.parse(s);delete b.revision;delete b.activeLayer;return JSON.stringify(b);};return clean(a)===clean(b);}
// Retained fragments own their backing; a tiny delta must not pin an8MiB old board.
function ownedText(text){let out='';for(let start=0;start<text.length;start+=8192){const units=new Uint16Array(Math.min(8192,text.length-start));for(let i=0;i<units.length;i++)units[i]=text.charCodeAt(start+i);out+=String.fromCharCode(...units);}return out;}
export function textDelta(before,after){let start=0,end=0;while(start<before.length&&start<after.length&&before[start]===after[start])start++;while(end<before.length-start&&end<after.length-start&&before[before.length-1-end]===after[after.length-1-end])end++;return{start,remove:before.length-start-end,insert:ownedText(after.slice(start,after.length-end))};}
export function validateEvent(e){if(!keys(e,'at,gap,view,delta')||!Number.isSafeInteger(e.at)||e.at<0||e.at>365*86400000||typeof e.gap!=='boolean'||!keys(e.view,'x,y,scale')||![e.view.x,e.view.y].every(n=>Number.isFinite(n)&&Math.abs(n)<=1e9)||!Number.isFinite(e.view.scale)||e.view.scale<.1||e.view.scale>8)fail();const d=e.delta;if(!keys(d,'start,remove,insert')||![d.start,d.remove].every(n=>Number.isSafeInteger(n)&&n>=0&&n<=timeLimits.boardBytes)||typeof d.insert!=='string'||d.insert.length>timeLimits.boardBytes)fail();return e;}
export function applyEvent(text,event){validateEvent(event);const d=event.delta;if(d.start+d.remove>text.length||text.length-d.remove+d.insert.length>timeLimits.boardBytes)fail();const next=text.slice(0,d.start)+d.insert+text.slice(d.start+d.remove);if(bytes(next)>timeLimits.boardBytes)fail();return next;}
export function eventBytes(event){validateEvent(event);return bytes(JSON.stringify(event));}
export function recordingHeader(log){if(!keys(log,'version,boardId,events')||log.version!==1||!validTimeId(log.boardId)||!Array.isArray(log.events)||!log.events.length||log.events.length>timeLimits.events)fail();let at=-1,total=0;for(const e of log.events){validateEvent(e);if(e.at<at)fail();at=e.at;total+=eventBytes(e);if(total>timeLimits.bytes)fail();}if(log.events[0].at!==0||log.events[0].delta.start!==0||log.events[0].delta.remove!==0)fail();return total;}
export function frameText(log,index,validate){if(!Number.isInteger(index)||index<0||index>=log.events.length)fail();let text='';for(let i=0;i<=index;i++)text=applyEvent(text,log.events[i]);const b=JSON.parse(text);validate(b);if(b.id!==log.boardId)fail();return{text,board:b,view:{...log.events[index].view}};}
export async function validateRecording(log,validate,yieldTask=()=>Promise.resolve()){const total=recordingHeader(log);let text='';for(let i=0;i<log.events.length;i++){text=applyEvent(text,log.events[i]);const b=JSON.parse(text);validate(b);if(b.id!==log.boardId)fail();if(i%16===15)await yieldTask();}return{bytes:total,text};}
export function timeline(events,skipIdle=true){let time=0;return events.map((e,i)=>{if(i){const raw=Math.max(16,e.at-events[i-1].at);time+=skipIdle?Math.min(raw,1000):raw;}return time;});}
export function frameAtTime(times,time){let low=0,high=times.length-1;while(low<high){const mid=Math.ceil((low+high)/2);if(times[mid]<=time)low=mid;else high=mid-1;}return low;}
// Rebind recorded root board identities only, after full validation and explicit UI consent.
export async function attachRecording(log,boardId,validate,yieldTask=()=>Promise.resolve()){
 if(!validTimeId(boardId))fail();await validateRecording(log,validate,yieldTask);let text='',previous='';const events=[];
 for(let i=0;i<log.events.length;i++){const e=log.events[i];text=applyEvent(text,e);const b=JSON.parse(text);b.id=boardId;validate(b);const next=JSON.stringify(b);events.push({...e,view:{...e.view},delta:textDelta(previous,next)});previous=next;if(i%16===15)await yieldTask();}
 const result={version:1,boardId,events};recordingHeader(result);return result;
}
