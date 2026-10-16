import {guideDefaults,validateGuide} from './guides.js';
import {artworkNodes,editedArtwork,nearestArtwork} from './artwork-geometry.js';
import {pathSVG,curveAnchor,moveHandle} from './path-selection.js';
const clone=x=>structuredClone(x),NS='http://www.w3.org/2000/svg';
export function initDrawingTools({$,canvas,getState,onStart,onCommit,onPreview,onChange,status}){
 let guide={...guideDefaults},draft=null,picking=false,drag=null,index=0,hasSavedGuide=false;
 try{const raw=localStorage.getItem('unruly-guides-v1');guide=validateGuide({...guide,...JSON.parse(raw||'{}')});hasSavedGuide=!!raw;}catch{guide={...guideDefaults};}
 const panel=$('drawing-tools'),overlay=$('drawing-overlay'),art=$('artwork-node-overlay'),guides=$('drawing-guide-overlay');
 const consume=e=>{e.preventDefault();e.stopImmediatePropagation();};
 const point=(e,v=getState().view)=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left-v.x)/v.scale,y:(e.clientY-r.top-v.y)/v.scale};};
 function same(){const s=getState();return draft&&s.board===draft.board&&s.layerId===draft.layerId&&s.writable;}
 const snapshot=()=>({nodes:clone(draft.nodes),closed:draft.closed,authored:draft.authored});
 function remember(before){if(JSON.stringify(before)===JSON.stringify(snapshot()))return;draft.past.push(before);if(draft.past.length>50)draft.past.shift();draft.future=[];}
 function cancel(message=true){draft=null;picking=false;drag=null;onPreview(null);sync();onChange();if(message)status('Artwork edit cancelled · original preserved');}
 function preview(){if(!draft){onPreview(null);sync();return;}if(!same()){cancel();return;}
  try{const s=editedArtwork(draft.stroke,draft.nodes,draft),b=clone(draft.board),l=b.layers.find(l=>l.id===draft.layerId);if(s.artworkPath){b.version=Math.max(15,b.version);b.folders=b.folders||[];}if(draft.existing)l.strokes=l.strokes.map(x=>x.id===s.id?s:x);else l.strokes.push(s);onPreview(b);draft.error='';}
  catch(e){onPreview(null);draft.error=e.message;}sync();onChange();
 }
 function create(stroke,existing=false){const s=getState(),data=existing?artworkNodes(stroke):{nodes:[],closed:false,authored:true};draft={...data,stroke:clone(stroke),existing,board:s.board,layerId:s.layerId,past:[],future:[],error:''};picking=false;index=0;if(data.stale)status('Curve source changed after erase · editing current artwork points');preview();}
 function begin(mode){
  if(getState().blocked||!getState().writable){status('Finish the current edit and choose an unlocked visible artwork layer',true);return;}
  onStart();const s=getState();if(!s.writable)return;
  if(mode==='curve'){if(s.maskTarget||s.paintMode!=='vector'||s.alphaLock){status('Curve pen needs Vector ink with Alpha lock off',true);return;}const ink=s.newStroke();if(ink.opacity===0){status('Choose visible ink opacity before starting a curve',true);return;}create(ink);status('Curve pen · tap anchors, drag to curve · Apply or Cancel');}
  else{const chosen=s.selected.length===1?s.strokes.find(x=>x.id===s.selected[0]):null;if(chosen){try{create(chosen,true);}catch(e){status(e.message,true);}return;}picking=true;draft=null;sync();onChange();status('Tap one active-layer ink stroke to edit its real nodes');}
 }
 function apply(){if(!draft||drag||!same())return;if(draft.error){status(draft.error,true);return;}try{const value=editedArtwork(draft.stroke,draft.nodes,draft);onCommit(value,draft.existing,draft.board,draft.layerId);draft=null;picking=false;onPreview(null);sync();onChange();status('Artwork saved · one Undo step');}catch(e){status(e.message,true);}}
 function modify(fn){if(!draft||drag||!same())return;try{const before=snapshot();draft.nodes=fn(clone(draft.nodes));remember(before);index=Math.min(index,draft.nodes.length-1);preview();}catch(e){status(e.message,true);}}
 function history(redo=false){if(!draft||drag)return;const from=redo?draft.future:draft.past,to=redo?draft.past:draft.future;if(!from.length)return;to.push(snapshot());Object.assign(draft,from.pop());index=Math.min(index,draft.nodes.length-1);preview();}
 function startDrag(e,i,key,before,newPoint=false){drag={id:e.pointerId,index:i,key,before,view:{...getState().view},start:point(e),newPoint};try{e.currentTarget.setPointerCapture(e.pointerId);}catch{}}
 canvas.addEventListener('pointerdown',e=>{
  if(!draft&&!picking||e.pointerType==='touch'||e.button!==0||e.pointerType==='pen'&&e.pressure===0&&!(e.buttons&1))return;consume(e);
  try{const s=getState(),p=point(e);if(picking){const stroke=nearestArtwork(s.strokes,p,s.view.scale);if(!stroke){status('No vector stroke near that point');return;}create(stroke,true);return;}
   if(!same()){cancel();return;}if(draft.existing){status('Drag a displayed point/handle or choose its node index');return;}
   if(draft.nodes.length>=64)throw Error('Curve anchor limit64 · remove a point first');const before=snapshot();draft.nodes.push({...p,pressure:e.pointerType==='pen'?Math.max(0,Math.min(1,e.pressure)):null});index=draft.nodes.length-1;startDrag(e,index,'new',before,true);preview();
  }catch(err){status(err.message,true);}
 },true);
 overlay.addEventListener('pointerdown',e=>{const hit=e.target.closest('[data-art-node]');if(!hit||!draft||drag||e.pointerType==='touch')return;consume(e);index=Number(hit.dataset.artNode);startDrag(e,index,hit.dataset.artHandle||'anchor',snapshot());sync();},true);
 function move(e){
  if(!drag||e.pointerId!==drag.id)return;consume(e);if(!same()){cancel();return;}const p=point(e,drag.view);
  try{if(drag.key==='new'){if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)*drag.view.scale>3)draft.nodes=curveAnchor(draft.nodes,drag.index,p);}
   else if(drag.key==='anchor'){const n=draft.nodes[drag.index],dx=p.x-n.x,dy=p.y-n.y;n.x=p.x;n.y=p.y;for(const k of ['in','out'])if(n[k]){n[k].x+=dx;n[k].y+=dy;}}
   else draft.nodes=moveHandle(draft.nodes,drag.index,drag.key,p);preview();
  }catch(err){status(err.message,true);}
 }
 window.addEventListener('pointermove',move,true);
 function end(e,cancelled=false){if(!drag||e.pointerId!==drag.id)return;consume(e);if(!cancelled)move(e);if(!drag)return;const before=drag.before;drag=null;if(!draft)return;if(cancelled)Object.assign(draft,before);else remember(before);index=Math.min(index,draft.nodes.length-1);preview();}
 window.addEventListener('pointerup',e=>end(e),true);window.addEventListener('pointercancel',e=>end(e,true),true);window.addEventListener('lostpointercapture',e=>end(e,true),true);window.addEventListener('blur',()=>{if(draft||picking)cancel();});
 const svg=(tag,attrs)=>{const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));return e;};
 function syncGuideFields(){for(const k of Object.keys(guideDefaults))$('guide-'+k).value=String(guide[k]);}
 function sync(){
  if(draft&&!same()){draft=null;drag=null;onPreview(null);}
  const s=getState(),v=s.view||{x:0,y:0,scale:1},screen=p=>({x:p.x*v.scale+v.x,y:p.y*v.scale+v.y});
  guides.replaceChildren();art.replaceChildren();const rect=canvas.getBoundingClientRect();overlay.setAttribute('viewBox','0 0 '+rect.width+' '+rect.height);
  const center=screen(guide),span=Math.hypot(rect.width,rect.height)*2,line=(x1,y1,x2,y2)=>guides.append(svg('line',{x1,y1,x2,y2,class:'drawing-guide-line'}));
  if(guide.mode==='ruler'){const a=guide.angle*Math.PI/180;line(center.x-span*Math.cos(a),center.y-span*Math.sin(a),center.x+span*Math.cos(a),center.y+span*Math.sin(a));}
  if(['vertical','both'].includes(guide.symmetry))line(center.x,0,center.x,rect.height);
  if(['horizontal','both'].includes(guide.symmetry))line(0,center.y,rect.width,center.y);
  if(guide.mode==='grid'){let step=guide.spacing*v.scale;while(step<16)step*=2;for(let x=((center.x%step)+step)%step;x<rect.width;x+=step)line(x,0,x,rect.height);for(let y=((center.y%step)+step)%step;y<rect.height;y+=step)line(0,y,rect.width,y);}
  $('artwork-editor-controls').hidden=!draft&&!picking;$('artwork-state').textContent=picking?'Tap an active-layer ink stroke':draft?(draft.error||draft.nodes.length+' nodes · '+(draft.authored?'curve anchors':'actual artwork points')):'';
  for(const id of ['artwork-apply','artwork-undo','artwork-redo','artwork-remove','artwork-corner','artwork-curve','artwork-x','artwork-y','artwork-index','artwork-closed'])$(id).disabled=!draft||!!drag||id==='artwork-apply'&&!!draft.error;
  $('artwork-undo').disabled=!draft?.past.length||!!drag;$('artwork-redo').disabled=!draft?.future.length||!!drag;
  if(draft||picking){$('undo').disabled=true;$('redo').disabled=true;}
  if(draft){$('artwork-index').max=draft.nodes.length;$('artwork-index').value=index+1;$('artwork-closed').checked=draft.closed;$('artwork-closed').disabled=!draft.authored||!!drag;
   const n=draft.nodes[index];$('artwork-x').value=n?.x??'';$('artwork-y').value=n?.y??'';
   if(draft.nodes.length){const path=draft.authored?pathSVG(draft.nodes,v,draft.closed):draft.nodes.map((p,i)=>(i?'L':'M')+screen(p).x+','+screen(p).y).join('');art.append(svg('path',{d:path,class:'drawing-art-path'}));}
   const lo=Math.max(0,index-31),hi=Math.min(draft.nodes.length,lo+64);
   for(let i=lo;i<hi;i++){const n=draft.nodes[i],a=screen(n);for(const k of ['in','out'])if(n[k]){const b=screen(n[k]);art.append(svg('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:'drawing-handle-line'}),svg('circle',{cx:b.x,cy:b.y,r:7,class:'drawing-handle','data-art-node':i,'data-art-handle':k}));}art.append(svg('circle',{cx:a.x,cy:a.y,r:i===index?9:7,class:'drawing-anchor'+(i===index?' current':''),'data-art-node':i}));}
  }
  for(const k of Object.keys(guideDefaults))$('guide-'+k).disabled=!!draft||picking||s.blocked;
 }
 $('drawing-tools-open').onclick=()=>{if(getState().blocked)return;onStart();panel.hidden=false;if(!hasSavedGuide){const v=getState().view,r=canvas.getBoundingClientRect();guide.x=(r.width/2-v.x)/v.scale;guide.y=(r.height/2-v.y)/v.scale;}syncGuideFields();sync();};
 $('guide-center').onclick=()=>{if(draft||picking||getState().blocked)return;const v=getState().view,r=canvas.getBoundingClientRect();guide.x=(r.width/2-v.x)/v.scale;guide.y=(r.height/2-v.y)/v.scale;syncGuideFields();try{localStorage.setItem('unruly-guides-v1',JSON.stringify(guide));hasSavedGuide=true;}catch{status('Guide centre changed for this session',true);}sync();onChange();};
 $('drawing-tools-close').onclick=()=>{if(draft||picking)cancel();panel.hidden=true;};
 for(const mode of ['curve','edit'])$('artwork-'+mode+'-start').onclick=()=>begin(mode);
 $('artwork-apply').onclick=apply;$('artwork-cancel').onclick=()=>cancel();$('artwork-undo').onclick=()=>history();$('artwork-redo').onclick=()=>history(true);
 $('artwork-remove').onclick=()=>modify(nodes=>nodes.filter((_,i)=>i!==index));
 $('artwork-corner').onclick=()=>modify(nodes=>{if(nodes[index]){delete nodes[index].in;delete nodes[index].out;}return nodes;});
 $('artwork-curve').onclick=()=>{if(!draft||draft.nodes.length>64){status('Curve conversion supports up to64anchors; current points preserved',true);return;}modify(nodes=>{const n=nodes[index];if(!n)return nodes;draft.authored=true;return curveAnchor(nodes,index,{x:n.x+40/getState().view.scale,y:n.y});});};
 $('artwork-index').onchange=()=>{if(!draft)return;index=Math.max(0,Math.min(draft.nodes.length-1,Math.round(Number($('artwork-index').value))-1));sync();};
 for(const k of ['x','y'])$('artwork-'+k).onchange=()=>modify(nodes=>{const n=nodes[index],value=Number($('artwork-'+k).value);if(!n||!Number.isFinite(value)||Math.abs(value)>1e7)throw Error('Invalid node coordinate');const delta=value-n[k];n[k]=value;for(const h of ['in','out'])if(n[h])n[h][k]+=delta;return nodes;});
 $('artwork-closed').onchange=()=>{if(!draft)return;const before=snapshot();draft.closed=$('artwork-closed').checked;remember(before);preview();};
 for(const k of Object.keys(guideDefaults))$('guide-'+k).onchange=()=>{if(draft||picking||getState().blocked){syncGuideFields();return;}try{const next={...guide};for(const f of Object.keys(guideDefaults))next[f]=['mode','symmetry'].includes(f)?$('guide-'+f).value:Number($('guide-'+f).value);guide=validateGuide(next);hasSavedGuide=true;try{localStorage.setItem('unruly-guides-v1',JSON.stringify(guide));}catch{status('Guides changed for this session · preference could not be saved',true);}sync();onChange();}catch(e){syncGuideFields();status(e.message,true);}};
 function key(e){if(!draft&&!picking)return false;if(e.key==='Escape'){consume(e);cancel();return true;}if(e.target.closest('input,select,textarea'))return false;if(e.target.closest('button')&&['Enter',' '].includes(e.key))return false;if(e.key==='Enter'){consume(e);apply();return true;}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){consume(e);history(e.shiftKey);return true;}if(['Delete','Backspace'].includes(e.key)){consume(e);$('artwork-remove').click();return true;}const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(delta&&draft){consume(e);modify(nodes=>{const n=nodes[index];if(!n)return nodes;for(const [k,d]of [['x',delta[0]],['y',delta[1]]]){n[k]+=d*(e.shiftKey?10:1);for(const h of ['in','out'])if(n[h])n[h][k]+=d*(e.shiftKey?10:1);}return nodes;});return true;}consume(e);return true;}
 syncGuideFields();return {sync,key,cancel,editing:()=>!!draft||picking,config:()=>clone(guide)};
}
