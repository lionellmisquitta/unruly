import test from 'node:test';
import assert from 'node:assert/strict';
import {createTouchTracker,TOUCH_LIMITS,twoFingerViewReset,threeFingerFocusToggle,fitArtworkView} from '../../prototypes/browser-workspace/gestures.js';
function touch(duration,move=false){const q=createTouchTracker();q.down(1,20,20,1000);q.down(2,50,20,1040);if(move)q.move(2,70,20);q.up(1,1000+duration);return q.up(2,1000+duration).ended;}
test('G02F01 stationary two-finger hold resets viewport, not undo',()=>assert.equal(twoFingerViewReset(touch(850),TOUCH_LIMITS.holdMs),true));
test('G02F02 quick two-finger undo is preserved',()=>{const q=createTouchTracker();q.down(1,20,20,1000);q.down(2,40,20,1040);q.up(1,1150);const result=q.up(2,1160);assert.equal(result.action,'undo');assert.equal(twoFingerViewReset(result.ended),false);});
test('G02F03 moving pinch must not reset viewport',()=>assert.equal(twoFingerViewReset(touch(850,true)),false));
test('G02F04 one-finger and malformed holds never reset',()=>{assert.equal(twoFingerViewReset({count:1,candidate:true,moved:false,duration:850}),false);assert.equal(twoFingerViewReset({count:2,candidate:true,moved:false,duration:NaN}),false);});

test('G02F05 fit visible strokes and exclude hidden layers',()=>{const b={layers:[{visible:true,strokes:[{points:[{x:0,y:0},{x:200,y:100}]}]},{visible:false,strokes:[{points:[{x:9999,y:9999}]}]}]};const v=fitArtworkView(b,1000,700);assert(v.scale>0&&v.scale<=8);assert(Math.abs(v.x+100*v.scale-500)<1e-7);assert(Math.abs(v.y+50*v.scale-350)<1e-7);});
test('G02F06 empty fit, invalid size and bad coordinates',()=>{assert.deepEqual(fitArtworkView({layers:[{visible:true,strokes:[]}]},800,600),{x:0,y:0,scale:1});assert.throws(()=>fitArtworkView({layers:[]},0,600));assert.throws(()=>fitArtworkView({layers:[{strokes:[{points:[{x:NaN,y:1}]}]}]},800,600));});

test('G02F07 stationary three-finger focus does not mask quick redo',()=>{const q=createTouchTracker();q.down(1,0,0,1000);q.down(2,12,0,1020);q.down(3,20,0,1030);q.up(1,1800);q.up(2,1810);const h=q.up(3,1820);assert.equal(threeFingerFocusToggle(h.ended),true);assert.equal(h.action,null);const z=createTouchTracker();z.down(1,0,0,1000);z.down(2,12,0,1020);z.down(3,20,0,1030);z.up(1,1120);z.up(2,1130);const quick=z.up(3,1140);assert.equal(quick.action,'redo');assert.equal(threeFingerFocusToggle(quick.ended),false);});
test('G02F08 moving three fingers cannot toggle focus',()=>{assert.equal(threeFingerFocusToggle({count:3,candidate:false,moved:true,duration:850}),false);assert.equal(threeFingerFocusToggle({count:3,candidate:true,moved:false,duration:250}),false);});
