import test from 'node:test';
import assert from 'node:assert/strict';
import {graphiteGrain} from '../../prototypes/browser-workspace/render.js';
test('C04M01 tooth is deterministic and bounded for construction pencil and charcoal',()=>{
 for(const preset of ['pencil-4h','pencil-charcoal'])for(let i=0;i<150;i++){
  const n=graphiteGrain(preset,i/4,i/7,i);assert(Number.isFinite(n)&&n>=0&&n<=1);assert.equal(n,graphiteGrain(preset,i/4,i/7,i));
 }
});
test('C04M02 original twelve pencils and other brush families have unchanged grain factor',()=>{
 for(const name of ['pencil-hb','pencil-2b','pencil-6b','marker-round','ink-fineliner','airbrush-soft'])assert.equal(graphiteGrain(name,2,3,11),1);
});
test('C04M03 invalid graphite positions are rejected',()=>{
 assert.throws(()=>graphiteGrain('pencil-4h',NaN,1,1));
 assert.throws(()=>graphiteGrain('pencil-charcoal',0,Infinity,1));
});
