import test from 'node:test';
import assert from 'node:assert/strict';
import {createTouchTracker,TOUCH_LIMITS,twoFingerViewReset} from '../../prototypes/browser-workspace/gestures.js';
function touch(duration,move=false){const q=createTouchTracker();q.down(1,20,20,1000);q.down(2,50,20,1040);if(move)q.move(2,70,20);q.up(1,1000+duration);return q.up(2,1000+duration).ended;}
test('G02F01 stationary two-finger hold resets viewport, not undo',()=>assert.equal(twoFingerViewReset(touch(850),TOUCH_LIMITS.holdMs),true));
test('G02F02 quick two-finger undo is preserved',()=>{const q=createTouchTracker();q.down(1,20,20,1000);q.down(2,40,20,1040);q.up(1,1150);const result=q.up(2,1160);assert.equal(result.action,'undo');assert.equal(twoFingerViewReset(result.ended),false);});
test('G02F03 moving pinch must not reset viewport',()=>assert.equal(twoFingerViewReset(touch(850,true)),false));
test('G02F04 one-finger and malformed holds never reset',()=>{assert.equal(twoFingerViewReset({count:1,candidate:true,moved:false,duration:850}),false);assert.equal(twoFingerViewReset({count:2,candidate:true,moved:false,duration:NaN}),false);});
