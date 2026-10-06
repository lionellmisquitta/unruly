import test from 'node:test';import assert from 'node:assert/strict';
const m=await import(new URL('../../prototypes/browser-workspace/model.js',import.meta.url).href);
const brushes=await import(new URL('../../prototypes/browser-workspace/brushes.js',import.meta.url).href);
const pt=(x,y,pressure=null)=>({x,y,pressure});
const stroke=(preset='ink-fineliner',brush='ink')=>({id:'u2-stroke',brush,preset,color:'#203d48',size:6,opacity:.8,points:[pt(0,0,0),pt(80,20,.5),pt(140,40,1)]});
const board=()=>{const b=m.createBoard('u2-board','U2');b.layers[0].strokes=[stroke()];return b;};
test('U2M01 immutable preset catalogue is exact 12 / four compatible families',()=>{
 assert.equal(brushes.BRUSH_PRESETS.length,12);assert.deepEqual(brushes.BRUSH_CATEGORIES,['pencil','ink','marker','airbrush']);
 const ids=brushes.BRUSH_PRESETS.map(p=>p.id);assert.equal(new Set(ids).size,12);
 assert.deepEqual(ids,['pencil-hb','pencil-2b','pencil-6b','ink-fineliner','ink-technical','ink-brush','marker-chisel','marker-round','marker-highlighter','airbrush-soft','airbrush-firm','airbrush-mist']);
 for(const p of brushes.BRUSH_PRESETS){assert(brushes.presetCompatible(p.family,p.id));assert(p.defaultSize>=1&&p.defaultSize<=40);assert(p.defaultOpacity>=0&&p.defaultOpacity<=1);}
});
test('U2M02 v3 accepts category-compatible preset and rejects unknown/mismatched/alias atomically',()=>{
 const b=board();assert.equal(m.validateBoard(b),b);
 for(const bad of [()=>{const q=structuredClone(b);q.layers[0].strokes[0].preset='pencil-hb';return q;},()=>{const q=structuredClone(b);q.layers[0].strokes[0].preset='unknown';return q;},()=>{const q=structuredClone(b);q.layers[0].strokes[0].presetId='ink-fineliner';return q;}])assert.throws(()=>m.validateBoard(bad()));
});
test('U2M03 absent preset remains valid legacy state and v2 migration never invents a preset',()=>{
 const b=board();delete b.layers[0].strokes[0].preset;m.validateBoard(b);
 const v2=structuredClone(b);v2.version=2;for(const l of v2.layers)delete l.blend;const q=m.migrateV2(v2);assert.equal(q.layers[0].strokes[0].preset,undefined);assert.equal(q.layers[0].blend,'normal');
});
test('U2M04 import and duplicate preserve preset identity but remap stroke/layer IDs',()=>{
 const b=board(),q=m.importDocument(JSON.stringify(b));assert.equal(q.layers[0].strokes[0].preset,'ink-fineliner');assert.notEqual(q.layers[0].strokes[0].id,b.layers[0].strokes[0].id);
 let h=m.createHistory(b);h=m.layerCommand(h,'duplicate',h.board.activeLayer);assert.equal(h.board.layers[1].strokes[0].preset,'ink-fineliner');assert.notEqual(h.board.layers[1].strokes[0].id,h.board.layers[0].strokes[0].id);
});
test('U2M05 pressure rule and work accounting are bounded and deterministic',()=>{
 const hb=brushes.getPreset('pencil-hb');assert.equal(brushes.pressureScale(hb,null),1);assert.equal(brushes.pressureScale(hb,0),.25);assert.equal(brushes.pressureScale(hb,1),1);
 const s=stroke('pencil-6b','pencil'),a=brushes.replayWork(s),z=brushes.replayWork(structuredClone(s));assert.deepEqual(a,z);assert(a.dabs>1&&a.dabs<=20000);assert.equal(a.particles,a.dabs*28);assert(a.particles<=600000);
});
test('U2M06 excessive preset replay rejects before board admission',()=>{
 const b=m.createBoard('u2-heavy','Heavy');b.layers[0].strokes=[{id:'heavy',brush:'airbrush',preset:'airbrush-mist',color:'#203d48',size:1,opacity:1,points:[pt(0,0,.5),pt(12000,0,.5)]}];assert.throws(()=>m.validateBoard(b),/replay|particle/i);
});
