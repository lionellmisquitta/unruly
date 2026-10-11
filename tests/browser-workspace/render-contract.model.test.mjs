import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {describeFrame} from '../../prototypes/browser-workspace/render-contract.js';
import {createRenderer} from '../../prototypes/browser-workspace/render.js';
const metrics={mode:'reference',completedStrokesReplayed:3,dpr:2,backingBytes:8000,surfaces:[{width:20,height:20}]};
const board=()=>({revision:3,activeLayer:'a',layers:[{id:'a',visible:true,opacity:1},{id:'b',visible:true,opacity:.5}]});
const frame=(b=board(),live={},m=metrics)=>describeFrame(b,{x:5,y:7,scale:2},live,m);
test('PERF2M01 Canvas2D extraction preserves the accepted source exactly',()=>{
 const source=fs.readFileSync(new URL('../../prototypes/browser-workspace/canvas2d-renderer.js',import.meta.url),'utf8').replace('export function createCanvas2DRenderer(canvas){','export function createRenderer(canvas){');
 assert.equal(createHash('sha256').update(source).digest('hex'),'2d18d52d86589bac65e3ab9ab6fb1d0a296165b683c3d3aca256a66cd1d9e506');
});
test('PERF2M02 upper layers prohibit the retained path',()=>{const f=frame();assert.equal(f.canRetainLowerLayers,false);assert.equal(f.replayReason,'visible-upper-layers');assert.equal(f.workRegion,'full-viewport');assert.deepEqual(f.region,{space:'backing-pixels',x:0,y:0,width:20,height:20});});
test('PERF2M03 hidden and zero-opacity uppers permit retained live ink',()=>{for(const patch of [{visible:false},{opacity:0}]){const b=board();Object.assign(b.layers[1],patch);assert.equal(frame(b).canRetainLowerLayers,true);assert.deepEqual(frame(b).visibleLayerIds,['a']);}});
test('PERF2M04 idle/hidden/zero-opacity active frames remain reference candidates',()=>{assert.equal(frame(board(),null).replayReason,'no-live-stroke');for(const patch of [{visible:false},{opacity:0}]){const b=board();Object.assign(b.layers[0],patch);assert.equal(frame(b).canRetainLowerLayers,false);assert.equal(frame(b).replayReason,'inactive-layer');}});
test('PERF2M05 diagnostic snapshots cannot be mutated or changed through input aliases',()=>{const b=board(),f=frame(b);b.layers[0].id='changed';metrics.surfaces[0].width=99;assert.deepEqual(f.visibleLayerIds,['a','b']);assert.equal(f.region.width,20);assert.throws(()=>{f.view.x=99;},TypeError);assert.throws(()=>f.visibleLayerIds.push('c'),TypeError);metrics.surfaces[0].width=20;});
test('PERF2M06 frame metadata never traverses stroke geometry',()=>{const b=board();Object.defineProperty(b.layers[0],'strokes',{get(){throw Error('geometry scanned');}});assert.equal(frame(b).documentRevision,3);});
test('PERF2M07 unsupported backends fail before touching DOM',()=>{assert.throws(()=>createRenderer(null,{backend:'webgpu'}),/Unsupported renderer backend/);assert.throws(()=>createRenderer(null,{backend:'rust'}),/Unsupported renderer backend/);});
