import test from 'node:test';
import assert from 'node:assert/strict';
import {createHistoryHold} from '../../prototypes/browser-workspace/gestures.js';
function harness(){const tasks=new Map();let serial=0;const calls=[];const hold=createHistoryHold({step:k=>{calls.push(k);return calls.length<3;},schedule:f=>{const id=++serial;tasks.set(id,f);return id;},cancel:id=>tasks.delete(id)});const tick=()=>{const [id,fn]=tasks.entries().next().value||[];if(fn){tasks.delete(id);fn();}};return {hold,calls,tasks,tick};}
test('G02M01 short tap does not repeat and preserves click action',()=>{const q=harness();assert(q.hold.begin(1,'undo'));assert.equal(q.hold.end(1),false);assert.deepEqual(q.calls,[]);assert.equal(q.tasks.size,0);});
test('G02M02 held undo repeats within bounded work and consumes release click',()=>{const q=harness();q.hold.begin(1,'undo');q.tick();q.tick();q.tick();assert.deepEqual(q.calls,['undo','undo','undo']);assert.equal(q.tasks.size,0);assert.equal(q.hold.end(1),true);});
test('G02M03 cancel and unmatched pointer never act',()=>{const q=harness();q.hold.begin(4,'redo');assert.equal(q.hold.end(5),false);q.hold.abort();q.tick();assert.deepEqual(q.calls,[]);assert.equal(q.hold.active(),false);});
