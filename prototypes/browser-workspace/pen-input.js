// Original bounded stylus contracts. No device identifiers or external services.
export const DEFAULT_DYNAMICS=Object.freeze({size:true,opacity:false,minWidth:.08,minOpacity:.2,exponent:1.2});
export function validateDynamics(d){
 const keys=['size','opacity','minWidth','minOpacity','exponent'];
 if(!d||typeof d!=='object'||Array.isArray(d)||Object.keys(d).length!==keys.length+(Object.hasOwn(d,'curve')?1:0)||Object.keys(d).some(k=>!keys.includes(k)&&k!=='curve')||typeof d.size!=='boolean'||typeof d.opacity!=='boolean'||!Number.isFinite(d.minWidth)||d.minWidth<.01||d.minWidth>1||!Number.isFinite(d.minOpacity)||d.minOpacity<.01||d.minOpacity>1||!Number.isFinite(d.exponent)||d.exponent<.25||d.exponent>3)throw Error('Invalid brush dynamics');
 if(Object.hasOwn(d,'curve')&&(!Array.isArray(d.curve)||d.curve.length!==3||Array.from(d.curve).some(v=>!Number.isFinite(v)||v<0||v>1)||d.curve[0]>d.curve[1]||d.curve[1]>d.curve[2]))throw Error('Invalid pressure curve');
 return d;
}
export function curveValues(d){return d.curve?[...d.curve]:[.25,.5,.75].map(p=>Math.pow(p,d.exponent));}
export function responsePressure(pressure,d){if(pressure===null)return null;const p=Math.max(0,Math.min(1,pressure));if(!d.curve)return Math.pow(p,d.exponent);if(p===1)return 1;const values=[0,...d.curve,1],segment=Math.floor(p*4),t=p*4-segment;return values[segment]+(values[segment+1]-values[segment])*t;}
export function pressureWidth(preset,pressure,dynamics){
 if(pressure===null)return 1;const p=Math.max(0,Math.min(1,pressure));
 if(!dynamics)return preset.minWidth+(1-preset.minWidth)*Math.pow(p,preset.exponent);
 if(!dynamics.size)return 1;return dynamics.minWidth+(1-dynamics.minWidth)*responsePressure(p,dynamics);
}
export function pressureOpacity(pressure,dynamics){if(pressure===null||!dynamics?.opacity)return 1;return dynamics.minOpacity+(1-dynamics.minOpacity)*responsePressure(pressure,dynamics);}
export function penAction(e,mappings){if(e.pointerType!=='pen')return null;const action=e.buttons&32?mappings.eraser:e.buttons&2?mappings.barrel:null;return ['lasso','eraser','pan'].includes(action)?action:null;}
export function readPenConfig(){const defaults={dynamics:{...DEFAULT_DYNAMICS},mappings:{barrel:'lasso',eraser:'eraser'},overrides:{}};try{const x=JSON.parse(localStorage.getItem('unruly-pen-ui-v1')||'null');if(x?.dynamics)defaults.dynamics=structuredClone(validateDynamics(x.dynamics));if(x?.overrides&&typeof x.overrides==='object'&&!Array.isArray(x.overrides)){for(const [key,value] of Object.entries(x.overrides)){if(typeof key!=='string'||!key||key.length>64)continue;try{defaults.overrides[key]=structuredClone(validateDynamics(value));}catch{}}}for(const k of ['barrel','eraser'])if(['lasso','eraser','pan','none'].includes(x?.mappings?.[k]))defaults.mappings[k]=x.mappings[k];}catch{}return defaults;}

// PRESS2: resolve only explicit per-preset overrides; never mutate the global profile.
export function resolveBrushDynamics(globalDynamics, overrides, presetId){
 const base=structuredClone(validateDynamics(globalDynamics));
 if(overrides===undefined||overrides===null)return base;
 if(!overrides||typeof overrides!=='object'||Array.isArray(overrides))throw Error('Invalid pressure overrides');
 if(typeof presetId!=='string'||!presetId||presetId.length>64)throw Error('Invalid pressure preset');
 const selected=Object.hasOwn(overrides,presetId)?overrides[presetId]:null;
 return selected===null||selected===undefined?base:structuredClone(validateDynamics(selected));
}
