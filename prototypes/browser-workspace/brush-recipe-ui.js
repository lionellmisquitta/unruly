import {getPreset} from './brushes.js';
import {DEFAULT_RECIPE,validateRecipe} from './brush-recipe.js';
const KEY='unruly-brush-recipes-v1';
export function initRecipeUI({$,settings,blocked,sample,status}){
 const saved=Object.create(null);try{const parsed=JSON.parse(localStorage.getItem(KEY)||'{}');if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))for(const [id,r] of Object.entries(parsed)){const p=getPreset(id);if(p)try{saved[id]=structuredClone(validateRecipe(r,p.family));}catch{}}}catch{}
 const controls=['brush-density','brush-spacing','brush-grain','brush-tip'];
 function sync(){const r=settings.recipe||DEFAULT_RECIPE,enabled=!!settings.recipe;$('brush-custom-enabled').checked=enabled;$('brush-density').value=Math.round(r.density*100);$('brush-spacing').value=Math.round(r.spacing*100);$('brush-grain').value=Math.round(r.grain*100);$('brush-tip').value=r.tip;for(const id of controls)$(id).disabled=!enabled;$('brush-grain').disabled=!enabled||settings.brush!=='pencil'||r.tip!=='preset';$('brush-recipe-scope').textContent=enabled?'Custom settings for '+getPreset(settings.preset).name+' · future strokes only':'Original preset settings · future strokes only';}
 function persist(){try{localStorage.setItem(KEY,JSON.stringify(saved));}catch{status('Custom brush settings cannot be saved on this device',true);}}
 function commit(r){if(r===undefined){delete settings.recipe;delete saved[settings.preset];}else{settings.recipe=structuredClone(validateRecipe(r,settings.brush));saved[settings.preset]=structuredClone(settings.recipe);}persist();sync();sample();}
 $('brush-custom-enabled').onchange=()=>{if(blocked()){sync();return;}commit($('brush-custom-enabled').checked?{...DEFAULT_RECIPE}:undefined);};
 for(const id of controls)$(id).onchange=()=>{if(blocked()||!settings.recipe){sync();return;}try{const tip=$('brush-tip').value,r={version:1,density:Number($('brush-density').value)/100,spacing:Number($('brush-spacing').value)/100,grain:settings.brush==='pencil'&&tip==='preset'?Number($('brush-grain').value)/100:0,tip};if(['brush-density','brush-spacing','brush-grain'].some(k=>$(k).value===''))throw Error('Enter a value within the displayed range');commit(r);}catch(e){status(e.message,true);sync();}};
 $('brush-recipe-reset').onclick=()=>{if(!blocked())commit(undefined);};
 function select(id,reset=false){if(reset){delete saved[id];persist();}if(Object.hasOwn(saved,id))settings.recipe=structuredClone(saved[id]);else delete settings.recipe;sync();}
 select(settings.preset);return{select,snapshot:id=>Object.hasOwn(saved,id)?structuredClone(saved[id]):undefined};
}
