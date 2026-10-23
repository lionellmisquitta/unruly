import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createBoard,createHistory,command,undo,eraseGesture,limits} from '../../prototypes/browser-workspace/model.js';
const source=readFileSync(new URL('../../prototypes/browser-workspace/app.js',import.meta.url),'utf8');
function harness(failMessage){
 const board=createBoard('eraser-capacity');board.layers[0].strokes=[{id:'line',brush:'ink',color:'#203d48',opacity:1,size:2,points:[{x:0,y:0,pressure:1},{x:50,y:0,pressure:1}]}];
 const preview=structuredClone(board);preview.layers[0].strokes=[];let calls=0,cancelled=0;
 const c={active:{id:1,erase:true,base:board,erased:preview,mode:'whole',radius:2,sweeps:[],last:{x:0,y:0}},h:createHistory(board),contacts:new Map(),command,point:()=>({x:5,y:0}),restorePenTool:()=>{},refresh:()=>{},panels:()=>{},$:()=>({hidden:true}),status:()=>{},cancel:()=>{cancelled++;c.active=null;},changed:next=>{c.h=next;},eraseGesture:()=>{calls++;throw Error(failMessage);}};
 vm.createContext(c);vm.runInContext(source.split('\n').find(x=>x.startsWith('function sweep(p)'))+'\n'+source.split('\n').find(x=>x.startsWith('function finish(e,')),c);
 return {c,board,preview,calls:()=>calls,cancelled:()=>cancelled};
}
for(const message of ['Eraser work limit reached; gesture cancelled','Partial eraser precision limit; gesture cancelled'])test('ERASECAP capacity retains preview and release commits one undo: '+message,()=>{
 const f=harness(message);f.c.sweep({x:1,y:0});assert.equal(f.cancelled(),0);assert.equal(f.c.active.erased,f.preview);assert.equal(f.c.active.eraseStopped,true);
 for(let i=0;i<100;i++)f.c.sweep({x:2,y:0});assert.equal(f.calls(),1,'stopped gestures do no additional work');
 f.c.finish({pointerId:1});assert.equal(f.c.active,null);assert.equal(f.c.h.board.layers[0].strokes.length,0);assert.equal(f.c.h.past.length,1);assert.deepEqual(undo(f.c.h).board.layers,f.board.layers);
});
test('ERASECAP 2000-sweep boundary keeps existing preview and commits on release',()=>{const f=harness('must not run');f.c.active.sweeps=Array(2000).fill({a:{x:0,y:0},b:{x:0,y:0}});f.c.sweep({x:1,y:0});assert.equal(f.calls(),0);assert.equal(f.c.active.sweeps.length,2000);f.c.finish({pointerId:1});assert.equal(f.c.h.board.layers[0].strokes.length,0);assert.equal(f.c.h.past.length,1);});
test('ERASECAP explicit pointer cancellation preserves original even after limit',()=>{const f=harness('Eraser work limit reached; gesture cancelled');f.c.sweep({x:1,y:0});f.c.finish({pointerId:1},true);assert.deepEqual(f.c.h.board.layers,f.board.layers);assert.equal(f.c.h.past.length,0);});
test('ERASECAP noncapacity errors still cancel and preserve original',()=>{const f=harness('Choose Whole eraser or detach the connector before partial erasing');f.c.sweep({x:1,y:0});assert.equal(f.cancelled(),1);assert.deepEqual(f.c.h.board.layers,f.board.layers);});
test('ERASECAP real model rejects accumulated sweeps without mutating source',()=>{const b=createBoard('actual-limit'),before=structuredClone(b),sweep={a:{x:0,y:0},b:{x:1,y:1}};assert.throws(()=>eraseGesture(b,'whole',Array(2001).fill(sweep),2),/Invalid eraser gesture/);assert.deepEqual(b,before);assert.equal(limits.comparisons,200000);assert.equal(limits.eraseSamples,20000);});
