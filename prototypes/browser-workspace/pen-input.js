// Original bounded stylus contracts. No device identifiers or external services.
export const DEFAULT_DYNAMICS=Object.freeze({size:true,opacity:false,minWidth:.08,minOpacity:.2,exponent:1.2});
export function validateDynamics(d){
 const keys=['size','opacity','minWidth','minOpacity','exponent'];
 if(!d||typeof d!=='object'||Array.isArray(d)||Object.keys(d).length!==keys.length||Object.keys(d).some(k=>!keys.includes(k))||typeof d.size!=='boolean'||typeof d.opacity!=='boolean'||!Number.isFinite(d.minWidth)||d.minWidth<.01||d.minWidth>1||!Number.isFinite(d.minOpacity)||d.minOpacity<.01||d.minOpacity>1||!Number.isFinite(d.exponent)||d.exponent<.25||d.exponent>3)throw Error('Invalid brush dynamics');
 return d;
}
export function pressureWidth(preset,pressure,dynamics){
 if(pressure===null)return 1;const p=Math.max(0,Math.min(1,pressure));
 if(!dynamics)return preset.minWidth+(1-preset.minWidth)*Math.pow(p,preset.exponent);
 if(!dynamics.size)return 1;return dynamics.minWidth+(1-dynamics.minWidth)*Math.pow(p,dynamics.exponent);
}
export function pressureOpacity(pressure,dynamics){if(pressure===null||!dynamics?.opacity)return 1;return dynamics.minOpacity+(1-dynamics.minOpacity)*Math.pow(Math.max(0,Math.min(1,pressure)),dynamics.exponent);}
export function penAction(e,mappings){if(e.pointerType!=='pen')return null;const action=e.buttons&32?mappings.eraser:e.buttons&2?mappings.barrel:null;return ['lasso','eraser','pan'].includes(action)?action:null;}
export function readPenConfig(){const defaults={dynamics:{...DEFAULT_DYNAMICS},mappings:{barrel:'lasso',eraser:'eraser'}};try{const x=JSON.parse(localStorage.getItem('unruly-pen-ui-v1')||'null');if(x?.dynamics)defaults.dynamics={...validateDynamics(x.dynamics)};for(const k of ['barrel','eraser'])if(['lasso','eraser','pan','none'].includes(x?.mappings?.[k]))defaults.mappings[k]=x.mappings[k];}catch{}return defaults;}
