import test from 'node:test';import assert from 'node:assert/strict';
const g=await import(new URL('../../prototypes/browser-workspace/gestures.js',import.meta.url).href);
const s=await import(new URL('../../prototypes/browser-workspace/shapes.js',import.meta.url).href);
const m=await import(new URL('../../prototypes/browser-workspace/model.js',import.meta.url).href);
const q=await import(new URL('../../prototypes/browser-workspace/selection.js',import.meta.url).href);

test('U3M01 two/three finger single chords fire exactly once at inclusive boundaries',()=>{
 let t=g.createTouchTracker();t.down(1,0,0,0);t.down(2,10,0,120);assert.equal(t.up(1,200).action,null);let r=t.up(2,250);assert.equal(r.action,'undo');assert(r.finished);
 t=g.createTouchTracker();t.down(1,0,0,0);t.down(2,10,0,20);t.down(3,20,0,40);t.up(1,100);t.up(2,110);r=t.up(3,120);assert.equal(r.action,'redo');
});
test('U3M02 movement, late arrival, long duration and fourth contact cancel history',()=>{
 let t=g.createTouchTracker();t.down(1,0,0,0);t.down(2,1,0,10);t.move(1,8.01,0);t.up(1,30);assert.equal(t.up(2,40).action,null);
 t=g.createTouchTracker();t.down(1,0,0,0);t.down(2,1,0,121);t.up(1,130);assert.equal(t.up(2,140).action,null);
 t=g.createTouchTracker();t.down(1,0,0,0);t.down(2,1,0,10);t.up(1,200);assert.equal(t.up(2,251).action,null);
 t=g.createTouchTracker();for(let i=1;i<=4;i++)t.down(i,i,0,i*10);for(let i=1;i<4;i++)t.up(i,100+i);assert.equal(t.up(4,110).action,null);
});
test('U3M03 line recognition is bounded and preserves mean reported pressure',()=>{
 const pts=Array.from({length:8},(_,i)=>({x:i*20,y:i*.2,pressure:i%2?.8:.2})),r=s.recognizeHeldShape(pts,1);
 assert.equal(r.kind,'line');assert.equal(r.points.length,2);assert(Math.abs(r.pressure-.5)<1e-9);assert.equal(r.points[0].pressure,r.pressure);
 assert.equal(s.recognizeHeldShape([{x:0,y:0},{x:2,y:2},{x:4,y:0},{x:2,y:-2}],1),null);
});
test('U3M04 circle recognition returns closed 129-point geometry and rejects reversal-heavy trace',()=>{
 const pts=Array.from({length:33},(_,i)=>{const a=i/32*Math.PI*2;return{x:100+40*Math.cos(a),y:80+40*Math.sin(a),pressure:null};});
 const r=s.recognizeHeldShape(pts,1);assert.equal(r.kind,'circle');assert.equal(r.points.length,129);assert(Math.abs(r.points[0].x-r.points.at(-1).x)<1e-9);assert.equal(r.pressure,null);
 const rev=[];for(let k=0;k<4;k++)for(let i=0;i<10;i++){const a=(k%2?9-i:i)/9*Math.PI;rev.push({x:100+40*Math.cos(a),y:80+40*Math.sin(a),pressure:null});}
 assert.equal(s.recognizeHeldShape(rev,1),null);
});
test('U3M05 shape reshape/edit keeps explicit line/circle semantics',()=>{
 const line={kind:'line',pressure:.4,points:[{x:0,y:0,pressure:.4},{x:10,y:0,pressure:.4}]};
 const snap=s.reshapeRecognized(line,{x:10,y:2},{snap15:true});const angle=Math.atan2(snap.points[1].y,snap.points[1].x)*180/Math.PI;const nearest15=Math.round(angle/15)*15;assert(Math.abs(angle-nearest15)<1e-8);
 const edited=s.editRecognized(line,{x2:30,y2:40});assert.deepEqual(edited.points[1],{x:30,y:40,pressure:.4});
 const circle=s.editRecognized({kind:'circle',pressure:null,center:{x:0,y:0},radius:5,points:[]},{cx:2,cy:3,radius:10});assert.equal(circle.points.length,129);assert.deepEqual(circle.center,{x:2,y:3});assert.throws(()=>s.editRecognized(circle,{radius:0}),/circle/i);
});
test('U3M06 affine transform is one immutable history command and preserves brush width/preset/pressure',()=>{
 const b=m.createBoard('u3-transform','U3');b.layers[0].strokes=[{id:'s',brush:'ink',preset:'ink-fineliner',color:'#123456',size:4,opacity:.7,points:[{x:0,y:0,pressure:0},{x:10,y:0,pressure:1}]}];const h=m.createHistory(b);
 const n=q.transformSelection(h,['s'],{dx:3,dy:0,scale:2,angle:90});assert.equal(h.board.layers[0].strokes[0].points[0].x,0);assert.equal(n.past.length,1);const out=n.board.layers[0].strokes[0];assert.equal(out.size,4);assert.equal(out.preset,'ink-fineliner');assert.deepEqual(out.points.map(p=>p.pressure),[0,1]);assert(Math.abs(out.points[0].x-8)<1e-9&&Math.abs(out.points[0].y+10)<1e-9);assert(Math.abs(out.points[1].x-8)<1e-9&&Math.abs(out.points[1].y-10)<1e-9);
 assert.throws(()=>q.transformSelection(h,['s'],{scale:.01}),/transform/i);assert.throws(()=>q.transformSelection(h,['s'],{angle:361}),/transform/i);
});
