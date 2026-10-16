import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_DYNAMICS,resolveBrushDynamics} from '../../prototypes/browser-workspace/pen-input.js';
const clone=x=>structuredClone(x);
test('PRESS2M01 global pressure applies when no brush override exists',()=>{
 const global=clone(DEFAULT_DYNAMICS);global.opacity=true;global.minOpacity=.1;
 assert.deepEqual(resolveBrushDynamics(global,{},'pencil-hb'),global);
 assert.deepEqual(resolveBrushDynamics(global,{'pencil-2b':{...global,minOpacity:.4}},'pencil-hb'),global);
});
test('PRESS2M02 explicit override takes precedence without mutating global',()=>{
 const global=clone(DEFAULT_DYNAMICS),special={...global,opacity:true,minOpacity:.08};
 const overrides={'pencil-hb':special};const got=resolveBrushDynamics(global,overrides,'pencil-hb');
 assert.deepEqual(got,special);got.minOpacity=.9;
 assert.equal(global.minOpacity,.2);assert.equal(overrides['pencil-hb'].minOpacity,.08);
});
test('PRESS2M03 removing explicit override returns global behavior',()=>{
 const global=clone(DEFAULT_DYNAMICS),overrides={'pencil-hb':{...global,minWidth:.1}};
 assert.equal(resolveBrushDynamics(global,overrides,'pencil-hb').minWidth,.1);
 delete overrides['pencil-hb'];assert.deepEqual(resolveBrushDynamics(global,overrides,'pencil-hb'),global);
});
test('PRESS2M04 malformed profiles and override collections are rejected',()=>{
 const global=clone(DEFAULT_DYNAMICS);
 for(const overrides of [[],3,'invalid'])assert.throws(()=>resolveBrushDynamics(global,overrides,'pencil-hb'));
 assert.throws(()=>resolveBrushDynamics(global,{'pencil-hb':{...global,minOpacity:-.5}},'pencil-hb'));
 assert.throws(()=>resolveBrushDynamics(global,{},''));
});
