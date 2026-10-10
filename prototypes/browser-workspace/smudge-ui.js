import {BRUSH_PRESETS,EXTRA_BRUSH_PRESETS,getPreset} from './brushes.js';
import {brushWidthFromPercent,brushPercentFromWidth} from './brush-size.js';
const KEY='unruly-smudge-v1',DEFAULT={preset:'soft',brushPreset:'airbrush-soft',size:24,strength:.65};
export function initSmudgeUI({$,blocked,onChange,status}){
 let settings={...DEFAULT};try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&['soft','round'].includes(s.preset)&&typeof s.size==='number'&&Number.isFinite(s.size)&&s.size>=1&&s.size<=160&&typeof s.strength==='number'&&Number.isFinite(s.strength)&&s.strength>=0&&s.strength<=1&&getPreset(s.brushPreset))settings={preset:s.preset,brushPreset:s.brushPreset,size:s.size,strength:s.strength};}catch{}
 for(const p of [...BRUSH_PRESETS,...EXTRA_BRUSH_PRESETS]){const option=document.createElement('option');option.value=p.id;option.textContent=p.category+' · '+p.name;$('smudge-brush').append(option);}
 function sync(){$('smudge-brush').value=settings.brushPreset;$('smudge-size').value=brushPercentFromWidth(settings.size,'airbrush');$('smudge-size-value').value=$('smudge-size').value+'%';$('smudge-strength').value=Math.round(settings.strength*100);$('smudge-strength-value').value=$('smudge-strength').value+'%';for(const id of ['soft','round'])$('smudge-'+id).setAttribute('aria-pressed',String(settings.preset===id));}
 function persist(){sync();try{localStorage.setItem(KEY,JSON.stringify(settings));}catch{status('Smudge settings could not be saved',true);}onChange();}
 $('smudge-brush').onchange=()=>{if(blocked()){sync();return;}const p=getPreset($('smudge-brush').value);if(!p)return;settings.brushPreset=p.id;settings.preset=p.kind==='soft'?'soft':'round';persist();};
 for(const id of ['soft','round'])$('smudge-'+id).onclick=()=>{if(blocked())return;settings.preset=id;persist();};
 function set(control,value){if(blocked()){sync();return false;}if(!Number.isFinite(value)||value<0||value>100){sync();status('Smudge value must be 0 to 100%',true);return false;}if(control==='size')settings.size=brushWidthFromPercent(value,'airbrush');else settings.strength=value/100;persist();return true;}
 for(const control of ['size','strength'])$('smudge-'+control).oninput=()=>set(control,Number($('smudge-'+control).value));
 $('smudge-reset').onclick=()=>{if(blocked())return;settings={...DEFAULT};persist();};sync();return {snapshot:()=>structuredClone(settings),set,sync,transfer:paint=>{if(blocked())return;settings={preset:getPreset(paint.preset)?.kind==='soft'?'soft':'round',brushPreset:paint.preset,size:paint.size,strength:paint.opacity};persist();}};
}
