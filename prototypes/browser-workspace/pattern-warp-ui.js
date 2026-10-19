import {warpIdentity,validateQuad,warpTarget,warpedStroke} from './pattern-warp.js';
import {decodePixels} from './raster.js';
// Disposable draft controller. Full-source sampling only at change/pointer release.
export function initPatternWarp({$,getBoard,prepare,blocked,closePopovers,status,preview,commit,focus}){
 const dialog=$('warp-editor'),surface=$('warp-surface'),image=$('warp-preview'),overlay=$('warp-overlay'),error=$('warp-error'),apply=$('warp-apply'),names=['Top left','Top right','Bottom right','Bottom left'];let draft=null,drag=null;
 function sync(){if(!draft)return;for(let i=0;i<4;i++){for(let k=0;k<2;k++)$('warp-'+i+'-'+k).value=String(Math.round(draft.quad[i][k]*10000)/100);const h=$('warp-handle-'+i);h.style.left=draft.quad[i][0]*100+'%';h.style.top=draft.quad[i][1]*100+'%';}overlay.setAttribute('points',draft.quad.map(p=>p.map(v=>v*100).join(',')).join(' '));}
 function render(){if(!draft)return;sync();try{validateQuad(draft.quad);const s=warpedStroke(draft.source,draft.quad),r=s.raster,c=document.createElement('canvas');c.width=r.width;c.height=r.height;c.getContext('2d').putImageData(new ImageData(decodePixels(r.data),r.width,r.height),0,0);image.src=c.toDataURL();c.width=c.height=1;const b=structuredClone(draft.base);b.layers.find(l=>l.id===draft.layerId).strokes.find(s=>s.id===draft.id).raster=r;preview(b);error.textContent='';apply.disabled=false;}catch(e){error.textContent=e.message;apply.disabled=true;preview(null);}}
 function cancel(){drag=null;draft=null;preview(null);image.removeAttribute('src');dialog.close();focus();}
 function open(){if(blocked())return;try{const target=prepare(),source=target.source;closePopovers();draft={...target,quad:warpIdentity()};surface.style.width=Math.min(280,280*source.raster.width/source.raster.height)+'px';surface.style.aspectRatio=source.raster.width+'/'+source.raster.height;dialog.showModal();render();$('warp-0-0').focus();}catch(e){draft=null;status(e.message,true);}}
 for(let i=0;i<4;i++){
  for(let k=0;k<2;k++)$('warp-'+i+'-'+k).addEventListener('change',()=>{if(!draft)return;draft.quad[i][k]=Number($('warp-'+i+'-'+k).value);draft.quad[i][k]/=100;render();});
  const h=$('warp-handle-'+i);h.onpointerdown=e=>{if(!draft||drag||e.button!==0)return;e.preventDefault();drag={id:e.pointerId,index:i,before:structuredClone(draft.quad)};h.setPointerCapture(e.pointerId);};
  h.onpointermove=e=>{if(!draft||drag?.id!==e.pointerId)return;const r=surface.getBoundingClientRect();draft.quad[i]=[Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))];sync();};
  const finish=(e,cancelled)=>{if(!draft||drag?.id!==e.pointerId)return;if(cancelled)draft.quad=drag.before;drag=null;if(h.hasPointerCapture(e.pointerId))h.releasePointerCapture(e.pointerId);render();};
  h.onpointerup=e=>finish(e,false);h.onpointercancel=e=>finish(e,true);h.onlostpointercapture=e=>{if(drag?.id===e.pointerId)finish(e,true);};
 }
 $('warp-open').onclick=open;$('warp-cancel').onclick=cancel;$('warp-reset').onclick=()=>{if(!draft)return;drag=null;draft.quad=warpIdentity();render();};dialog.addEventListener('cancel',e=>{e.preventDefault();cancel();});
 $('warp-form').onsubmit=e=>{e.preventDefault();if(!draft||drag)return;try{if(getBoard()!==draft.original)throw Error('Artwork changed; cancel and reopen deformation');validateQuad(draft.quad);warpTarget(draft.base,draft.layerId,draft.id);commit(draft.layerId,draft.id,warpedStroke(draft.source,draft.quad),draft.original,draft.base);cancel();status('Deformation applied · Undo restores original pixels');}catch(e){error.textContent=e.message;apply.disabled=true;}};
 return {editing:()=>!!draft,key:e=>{if(!draft)return false;if(e.key==='Escape'){e.preventDefault();cancel();}return true;},cancel};
}
