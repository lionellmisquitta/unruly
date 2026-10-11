import {curveValues,responsePressure,pressureWidth,pressureOpacity,validateDynamics} from './pen-input.js';

// One personal profile, a bounded graph, and a disposable calibration pad.
export function initPressureUI({$,getDynamics,blocked,onChange,status,onSamples=()=>{}}){
 const graph=$('pressure-graph'),pad=$('pressure-test'),ctx=pad.getContext('2d'),handles=[1,2,3].map(i=>$('curve-point-'+i)),inputs=[1,2,3].map(i=>$('curve-value-'+i));
 let drag=null,padActive=null,points=[],paintFrame=0;
 const clone=()=>structuredClone(getDynamics());
 const values=()=>drag?.values||curveValues(getDynamics());
 const draftDynamics=()=>drag?{...getDynamics(),curve:[...drag.values]}:getDynamics();
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function updateGraph(){const ys=values(),d=draftDynamics();let path='';for(let i=0;i<=40;i++){const p=i/40;path+=(i?'L':'M')+(40+260*p)+' '+(180-164*responsePressure(p,d));}$('curve-line').setAttribute('d',path);for(let i=0;i<3;i++){handles[i].setAttribute('transform','translate('+(105+65*i)+','+(180-164*ys[i])+')');handles[i].setAttribute('aria-valuenow',String(Math.round(ys[i]*100)));inputs[i].value=String(Math.round(ys[i]*100));}paintPad();}
 function commit(ys){const d={...clone(),curve:[...ys]};validateDynamics(d);onChange(d);updateGraph();}
 function bound(ys,i,n){ys[i]=clamp(n,i?ys[i-1]:0,i<2?ys[i+1]:1);}
 function finishGraph(cancelled=false){if(!drag)return;const done=drag;drag=null;if(!cancelled)commit(done.values);else updateGraph();try{if(graph.hasPointerCapture(done.id))graph.releasePointerCapture(done.id);}catch{}}
 function graphMove(e){if(!drag||drag.id!==e.pointerId)return;e.preventDefault();const r=graph.getBoundingClientRect(),sy=(e.clientY-r.top)*220/r.height;bound(drag.values,drag.index,(180-sy)/164);updateGraph();}
 for(let i=0;i<3;i++){
  handles[i].addEventListener('pointerdown',e=>{if(blocked()||e.button!==0)return;e.preventDefault();e.stopPropagation();handles[i].focus();drag={id:e.pointerId,index:i,values:curveValues(getDynamics())};try{graph.setPointerCapture(e.pointerId);}catch{finishGraph(true);}});
  handles[i].addEventListener('keydown',e=>{if(e.key==='Escape'&&drag){finishGraph(true);e.preventDefault();e.stopPropagation();return;}if(!['ArrowUp','ArrowDown','Home','End'].includes(e.key)||blocked())return;e.preventDefault();e.stopPropagation();const ys=curveValues(getDynamics()),n=e.key==='Home'?0:e.key==='End'?1:ys[i]+(e.key==='ArrowUp'?.02:-.02);bound(ys,i,n);commit(ys);});
  inputs[i].addEventListener('change',()=>{if(blocked()){updateGraph();return;}const n=Number(inputs[i].value);if(inputs[i].value===''||!Number.isFinite(n)||n<0||n>100){status('Response must be from 0 to 100%',true);updateGraph();return;}const ys=curveValues(getDynamics());bound(ys,i,n/100);commit(ys);});
 }
 graph.addEventListener('pointermove',graphMove);graph.addEventListener('pointerup',e=>{if(drag?.id===e.pointerId){graphMove(e);finishGraph();}});for(const type of ['pointercancel','lostpointercapture'])graph.addEventListener(type,e=>{if(drag?.id===e.pointerId)finishGraph(true);});
 $('pressure-profile-reset').onclick=()=>{if(blocked())return;const d=clone();delete d.curve;d.exponent=1.2;onChange(d);updateGraph();};
 function padPoint(e){const r=pad.getBoundingClientRect();return{x:clamp((e.clientX-r.left)*360/r.width,0,360),y:clamp((e.clientY-r.top)*140/r.height,0,140),pressure:e.pointerType==='pen'?clamp(e.pressure,0,1):null};}
 function schedulePad(){if(!paintFrame)paintFrame=requestAnimationFrame(()=>{paintFrame=0;paintPad();});}
 function paintPad(){ctx.globalAlpha=1;ctx.fillStyle='#faf8f3';ctx.fillRect(0,0,360,140);ctx.strokeStyle=ctx.fillStyle='#203d48';ctx.lineCap=ctx.lineJoin='round';const d=draftDynamics();for(let i=0;i<points.length;i++){const q=points[i],p=points[Math.max(0,i-1)],w=24*pressureWidth(null,q.pressure,d);ctx.globalAlpha=pressureOpacity(q.pressure,d);if(i===0){ctx.beginPath();ctx.arc(q.x,q.y,w/2,0,Math.PI*2);ctx.fill();}else{ctx.lineWidth=(w+24*pressureWidth(null,p.pressure,d))/2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}ctx.globalAlpha=1;pad.dataset.sampleCount=String(points.length);reportPad();onSamples(points);}
 function reportPad(){const pen=points.filter(p=>p.pressure!==null),last=points.at(-1);if(!last){$('pressure-test-status').textContent='Draw lightly, then firmly. This test does not change your board.';return;}if(last.pressure===null){$('pressure-test-status').textContent='Mouse · pressure unavailable · full width. This test does not change your board.';return;}const min=Math.min(...pen.map(p=>p.pressure)),max=Math.max(...pen.map(p=>p.pressure)),out=responsePressure(last.pressure,draftDynamics());$('pressure-test-status').textContent='Pen · raw '+last.pressure.toFixed(2)+' → response '+out.toFixed(2)+' · range '+min.toFixed(2)+'–'+max.toFixed(2)+' · '+(max-min>.01?'varying pressure observed':'constant report · hardware support unconfirmed');}
 function endPad(cancelled=false){if(!padActive)return;const done=padActive;padActive=null;if(cancelled)points=done.prior;try{if(pad.hasPointerCapture(done.id))pad.releasePointerCapture(done.id);}catch{}paintPad();}
 pad.addEventListener('pointerdown',e=>{if(blocked()||e.button!==0)return;e.preventDefault();if(e.pointerType==='touch'){$('pressure-test-status').textContent='Touch · pressure unavailable. Use your pen to test pressure.';return;}padActive={id:e.pointerId,prior:points};points=[padPoint(e)];try{pad.setPointerCapture(e.pointerId);}catch{endPad(true);}schedulePad();});
 pad.addEventListener('pointermove',e=>{if(padActive?.id!==e.pointerId)return;e.preventDefault();points.push(padPoint(e));if(points.length>256)points.shift();schedulePad();});
 pad.addEventListener('pointerup',e=>{if(padActive?.id===e.pointerId)endPad();});for(const type of ['pointercancel','lostpointercapture'])pad.addEventListener(type,e=>{if(padActive?.id===e.pointerId)endPad(true);});pad.addEventListener('contextmenu',e=>e.preventDefault());
 $('pressure-test-clear').onclick=()=>{if(blocked())return;points=[];paintPad();};
 function cancel(){finishGraph(true);endPad(true);}
 window.addEventListener('blur',cancel);$('pressure-profile').addEventListener('toggle',()=>{if(!$('pressure-profile').open)cancel();});window.addEventListener('keydown',e=>{if(e.key==='Escape'&&(drag||padActive)){cancel();e.preventDefault();e.stopPropagation();}},true);
 updateGraph();return{sync:updateGraph,editing:()=>!!drag||!!padActive,cancel};
}
