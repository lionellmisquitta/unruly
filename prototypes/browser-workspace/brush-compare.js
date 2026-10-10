import {BRUSH_PRESETS,EXTRA_BRUSH_PRESETS,getPreset} from './brushes.js';
import {brushWidthFromPercent,brushPercentFromWidth} from './brush-size.js';
import {resolveBrushDynamics} from './pen-input.js';
// Disposable comparison snapshots; no board, history or persisted settings writes.
export function initBrushComparison({$,renderer,getSettings,getConfig,blocked}){
 const ids=['a','b'],profiles={},defaultPoints=[{x:16,y:45,pressure:.1},{x:45,y:28,pressure:.3},{x:80,y:60,pressure:1},{x:120,y:34,pressure:.6},{x:165,y:45,pressure:.15}];let points=defaultPoints;
 function preset(id,n){const p=getPreset(id),c=getConfig();return{brush:p.family,preset:id,size:brushWidthFromPercent(n,p.family),opacity:1,color:'#203d48',dynamics:resolveBrushDynamics(c.dynamics,c.overrides,id)};}
 function paint(){for(const id of ids){const s=profiles[id];$('compare-image-'+id).src=renderer.preview({id:'comparison-'+id,...s,points},180,90);$('compare-label-'+id).textContent=getPreset(s.preset).name+' · '+brushPercentFromWidth(s.size,s.brush)+'% · '+(s.dynamics.curve?'custom pressure':'pressure '+s.dynamics.exponent);$('compare-preset-'+id).value=s.preset;}}
 for(const id of ids){const select=$('compare-preset-'+id);for(const p of [...BRUSH_PRESETS,...EXTRA_BRUSH_PRESETS]){const o=document.createElement('option');o.value=p.id;o.textContent=p.category+' · '+p.name;select.append(o);}select.onchange=()=>{if(blocked()){paint();return;}profiles[id]=preset(select.value,Number($('compare-size').value));paint();};$('compare-capture-'+id).onclick=()=>{if(blocked())return;profiles[id]=structuredClone(getSettings());paint();};}
 $('compare-size').oninput=()=>{if(blocked())return;for(const id of ids)profiles[id].size=brushWidthFromPercent(Number($('compare-size').value),profiles[id].brush);paint();};
 function reset(){profiles.a=preset('ink-brush',40);profiles.b=preset('airbrush-soft',40);$('compare-size').value='40';points=defaultPoints;paint();}
 $('compare-reset').onclick=()=>{if(!blocked())reset();};$('compare-sample').onclick=()=>{if(!blocked()){points=defaultPoints;paint();}};
 reset();return{samples(samples){points=samples.length?samples.map(p=>({x:p.x/2,y:p.y*.5+10,pressure:p.pressure})):defaultPoints;paint();}};
}
