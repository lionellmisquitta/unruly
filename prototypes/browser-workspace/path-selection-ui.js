import {pathLimits,addAnchor,moveAnchor,curveAnchor,moveHandle,cornerAnchor,removeAnchor,flattenPath,pathSVG} from './path-selection.js';
export function initPathSelection({$,canvas,getState,onBegin,onCancel,onSelect,onChange,status}){
 let draft=null,drag=null,index=-1;const ns='http://www.w3.org/2000/svg';
 const editing=()=>!!draft&&!draft.closed;
 const same=()=>{const s=getState();return draft&&draft.board===s.board&&draft.layerId===s.layerId;};
 const remember=before=>{if(JSON.stringify(before)===JSON.stringify(draft.nodes))return;draft.past.push(before);if(draft.past.length>pathLimits.history)draft.past.shift();draft.future=[];};
 function cancel(restore=true){if(!draft)return;const old=draft;draft=null;drag=null;index=-1;if(restore&&!old.closed&&getState().board===old.board&&getState().layerId===old.layerId)onCancel(old.prior);onChange();}
 function start(nodes=[]){const s=getState();if(!s.board||s.blocked)return false;if(!s.writable){status('Choose visible unlocked artwork before selecting a path',true);return false;}if(draft&&!draft.closed)cancel();draft={board:s.board,layerId:s.layerId,nodes:structuredClone(nodes),closed:false,past:[],future:[],prior:onBegin()};index=nodes.length-1;status('Path · tap corners, drag new points for curves, then Close & select');onChange();return true;}
 function edit(){if(!draft||!draft.closed||!same()||getState().blocked)return;const nodes=draft.nodes;draft=null;start(nodes);}
 function close(){if(!editing()||drag||getState().blocked)return false;try{const polygon=flattenPath(draft.nodes);if(!onSelect(polygon))return false;draft.closed=true;status('Path region selected · drag highlighted pixels; Edit outline to refine');onChange();return true;}catch(e){status(e.message,true);return false;}}
 function history(kind){if(!editing())return false;if(drag||getState().blocked)return true;const from=kind==='undo'?draft.past:draft.future,to=kind==='undo'?draft.future:draft.past;if(from.length){to.push(structuredClone(draft.nodes));draft.nodes=from.pop();index=Math.min(index,draft.nodes.length-1);onChange();status('Path '+kind);}else status('No path '+kind+' history');return true;}
 function modify(fn){if(!editing()||drag||getState().blocked)return;try{const before=structuredClone(draft.nodes);draft.nodes=fn(draft.nodes);remember(before);index=Math.min(index,draft.nodes.length-1);onChange();}catch(e){status(e.message,true);}}
 function hit(p,v){if(!draft)return null;for(let i=draft.nodes.length-1;i>=0;i--){const n=draft.nodes[i];if(Math.hypot(p.x-n.x,p.y-n.y)*v.scale<=12)return {index:i,key:'anchor'};}for(let i=draft.nodes.length-1;i>=0;i--)for(const key of ['in','out']){const n=draft.nodes[i][key];if(n&&Math.hypot(p.x-n.x,p.y-n.y)*v.scale<=12)return {index:i,key};}return null;}
 const pos=(e,v)=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.x-v.x)/v.scale,y:(e.clientY-r.y-v.y)/v.scale};};
 const consume=e=>{e.preventDefault();e.stopImmediatePropagation();};
 canvas.addEventListener('pointerdown',e=>{const s=getState();if(s.enabled&&editing()&&e.pointerType==='pen'&&((e.buttons&2)||(e.buttons&32))){consume(e);status('Close & select or Cancel the path before using a pen button');return;}if(e.pointerType==='touch'||!s.enabled||s.space||s.blocked||e.button!==0||e.pointerType==='pen'&&((e.buttons&2)||(e.buttons&32)))return;
  const p=pos(e,s.view);if(draft?.closed&&s.inside(p))return;consume(e);canvas.focus();
  if(!draft||draft.closed){if(!start())return;}if(!same())return;
  const before=structuredClone(draft.nodes),target=hit(p,s.view);try{if(target)index=target.index;else{draft.nodes=addAnchor(draft.nodes,p);index=draft.nodes.length-1;}drag={id:e.pointerId,before,view:{...s.view},start:p,index,key:target?.key||'new',moved:false};try{canvas.setPointerCapture(e.pointerId);}catch{}onChange();}catch(err){status(err.message,true);}
 },true);
 canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;consume(e);const p=pos(e,drag.view);if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)*drag.view.scale>3)drag.moved=true;if(!drag.moved)return;try{if(drag.key==='new')draft.nodes=curveAnchor(draft.nodes,drag.index,p);else if(drag.key==='anchor')draft.nodes=moveAnchor(draft.nodes,drag.index,p);else draft.nodes=moveHandle(draft.nodes,drag.index,drag.key,p);onChange();}catch(err){status(err.message,true);}},true);
 function end(e,cancelled=false){if(!drag||drag.id!==e.pointerId)return;consume(e);const done=drag;drag=null;if(cancelled){draft.nodes=done.before;index=Math.min(index,draft.nodes.length-1);}else{remember(done.before);if(done.key==='anchor'&&done.index===0&&!done.moved&&draft.nodes.length>=3)close();}try{canvas.releasePointerCapture(e.pointerId);}catch{}onChange();}
 canvas.addEventListener('pointerup',e=>end(e),true);canvas.addEventListener('pointercancel',e=>end(e,true),true);canvas.addEventListener('lostpointercapture',e=>end(e,true),true);
 function svg(tag,attrs){const el=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,String(v));return el;}
 function sync(){const s=getState();if(draft&&!same()){draft=null;drag=null;index=-1;}const show=!!draft&&s.enabled&&!s.preview,group=$('path-selection-overlay');group.replaceChildren();group.toggleAttribute('hidden',!show);
  $('path-controls').hidden=!s.enabled;$('path-quick-controls').hidden=!s.enabled||s.blocked||s.space;const isEdit=editing();for(const id of ['path-close','path-quick-close'])$(id).disabled=!isEdit||!!drag||s.blocked||draft.nodes.length<3;for(const id of ['path-edit','path-quick-edit'])$(id).disabled=!draft?.closed||s.blocked;for(const id of ['path-cancel','path-new','path-remove','path-corner'])$(id).disabled=s.blocked||!!drag||(!draft&&id!=='path-new')||(id==='path-remove'||id==='path-corner')&&(!isEdit||index<0);$('path-quick-cancel').disabled=!draft||s.blocked;$('path-count').textContent=draft?draft.nodes.length+' points · '+(draft.closed?'region ready':'editing outline'):'Tap to begin a path';
  if(isEdit){$('undo').disabled=!draft.past.length||!!drag;$('redo').disabled=!draft.future.length||!!drag;for(const id of ['copy-selection','cut-selection','delete-selection','transform-selection','move-selection','paste-selection','download-selection'])$(id).disabled=true;$('quick-transform').hidden=true;}
  if(!show||!draft.nodes.length)return;group.append(svg('path',{d:pathSVG(draft.nodes,s.view,draft.closed),class:'precision-outline'}));if(!isEdit)return;
  const screen=p=>({x:p.x*s.view.scale+s.view.x,y:p.y*s.view.scale+s.view.y});
  for(let i=0;i<draft.nodes.length;i++){const n=draft.nodes[i],a=screen(n);for(const key of ['in','out'])if(n[key]){const b=screen(n[key]);group.append(svg('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:'precision-guide'}),svg('circle',{cx:b.x,cy:b.y,r:6,class:'precision-handle','data-node':i,'data-handle':key}));}group.append(svg('circle',{cx:a.x,cy:a.y,r:8,class:'precision-anchor'+(index===i?' current':''),'data-node':i}));}
 }
 for(const id of ['path-close','path-quick-close'])$(id).onclick=close;for(const id of ['path-edit','path-quick-edit'])$(id).onclick=edit;
 $('path-new').onclick=()=>{if(getState().blocked||drag)return;cancel();start();};for(const id of ['path-cancel','path-quick-cancel'])$(id).onclick=()=>{if(getState().blocked)return;cancel();status('Path cancelled · prior selection restored');};
 $('path-remove').onclick=()=>modify(nodes=>removeAnchor(nodes,index));$('path-corner').onclick=()=>modify(nodes=>cornerAnchor(nodes,index));
 function key(e){if(!editing()||e.target.closest('input,select,textarea,dialog'))return false;if(e.target.closest('button')&&['Enter',' '].includes(e.key))return false;
  if(e.key==='Escape'){consume(e);if(drag){draft.nodes=drag.before;drag=null;}cancel();status('Path cancelled · prior selection restored');return true;}
  if(e.key==='Enter'){consume(e);close();return true;}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){consume(e);history(e.shiftKey?'redo':'undo');return true;}
  if(e.key==='Delete'||e.key==='Backspace'){consume(e);modify(nodes=>removeAnchor(nodes,index));return true;}
  const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(delta){consume(e);modify(nodes=>{const n=nodes[index];if(!n)throw Error('Choose a path point');const step=e.shiftKey?10:1;return moveAnchor(nodes,index,{x:n.x+delta[0]*step,y:n.y+delta[1]*step});});return true;}
  if((e.ctrlKey||e.metaKey)&&['c','x','v'].includes(e.key.toLowerCase())||['t','T','v','V','w','W'].includes(e.key)){consume(e);status('Close & select or Cancel the path first');return true;}return false;
 }
 return {sync,start,edit,close,cancel,history,key,editing,dragging:()=>!!drag,active:()=>!!draft};
}
