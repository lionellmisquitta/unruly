// UNRULY U2 immutable original brush presets. MIT.
export const BRUSH_PRESETS=Object.freeze([
 Object.freeze({family:'pencil',category:'Pencil',id:'pencil-hb',name:'HB',kind:'pencil',particles:12,coverage:.35,dot:.55,stepFactor:.18,minWidth:.25,exponent:1,defaultSize:3,defaultOpacity:1}),
 Object.freeze({family:'pencil',category:'Pencil',id:'pencil-2b',name:'2B',kind:'pencil',particles:20,coverage:.55,dot:.75,stepFactor:.18,minWidth:.20,exponent:1,defaultSize:5,defaultOpacity:1}),
 Object.freeze({family:'pencil',category:'Pencil',id:'pencil-6b',name:'6B',kind:'pencil',particles:28,coverage:.75,dot:1,stepFactor:.18,minWidth:.18,exponent:1,defaultSize:9,defaultOpacity:1}),
 Object.freeze({family:'ink',category:'Pen',id:'ink-fineliner',name:'Fineliner',kind:'continuous',coverage:1,minWidth:.65,exponent:1,defaultSize:3,defaultOpacity:1}),
 Object.freeze({family:'ink',category:'Pen',id:'ink-technical',name:'Technical',kind:'continuous',coverage:1,minWidth:.85,exponent:1,defaultSize:2,defaultOpacity:1}),
 Object.freeze({family:'ink',category:'Pen',id:'ink-brush',name:'Brush pen',kind:'continuous',coverage:1,minWidth:.10,exponent:1.5,defaultSize:6,defaultOpacity:1}),
 Object.freeze({family:'marker',category:'Marker',id:'marker-chisel',name:'Chisel',kind:'chisel',coverage:1,stepFactor:.2,minWidth:.60,exponent:1,defaultSize:12,defaultOpacity:1}),
 Object.freeze({family:'marker',category:'Marker',id:'marker-round',name:'Round',kind:'round',coverage:.85,stepFactor:.2,minWidth:.50,exponent:1,defaultSize:10,defaultOpacity:1}),
 Object.freeze({family:'marker',category:'Marker',id:'marker-highlighter',name:'Highlighter',kind:'chisel',coverage:.25,stepFactor:.2,minWidth:.80,exponent:1,defaultSize:16,defaultOpacity:1}),
 Object.freeze({family:'airbrush',category:'Airbrush',id:'airbrush-soft',name:'Soft',kind:'airbrush-soft',coverage:.25,stepFactor:.3,minWidth:.25,exponent:1,defaultSize:20,defaultOpacity:1}),
 Object.freeze({family:'airbrush',category:'Airbrush',id:'airbrush-firm',name:'Firm',kind:'airbrush-firm',coverage:.45,stepFactor:.3,minWidth:.25,exponent:1,defaultSize:14,defaultOpacity:1}),
 Object.freeze({family:'airbrush',category:'Airbrush',id:'airbrush-mist',name:'Mist',kind:'mist',particles:24,coverage:.15,stepFactor:.3,minWidth:.25,exponent:1,defaultSize:28,defaultOpacity:1})
]);
const byId=new Map(BRUSH_PRESETS.map(p=>[p.id,p]));
export const BRUSH_CATEGORIES=Object.freeze(['pencil','ink','marker','airbrush']);
export const getPreset=id=>byId.get(id)||null;
export const presetLabel=id=>getPreset(id)?.name||'Legacy '+String(id||'brush');
export const presetsFor=family=>BRUSH_PRESETS.filter(p=>p.family===family);
export const presetCompatible=(family,id)=>getPreset(id)?.family===family;
export function pressureScale(preset,pressure){if(pressure===null)return 1;const p=Math.max(0,Math.min(1,pressure));return preset.minWidth+(1-preset.minWidth)*Math.pow(p,preset.exponent);}
export const samplingStep=(preset,size)=>Math.max(.5,size*(preset.stepFactor||.2));
export function replayWork(stroke){
 const preset=getPreset(stroke.preset);if(!preset)return {dabs:0,particles:0};
 if(preset.kind==='continuous')return {dabs:0,particles:0};
 const step=samplingStep(preset,stroke.size);let dabs=1;
 for(let i=1;i<stroke.points.length;i++)dabs+=Math.max(1,Math.ceil(Math.hypot(stroke.points[i].x-stroke.points[i-1].x,stroke.points[i].y-stroke.points[i-1].y)/step));
 return {dabs,particles:dabs*(preset.particles||1)};
}
