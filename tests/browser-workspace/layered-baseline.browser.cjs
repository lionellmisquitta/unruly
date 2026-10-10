// PERF1: correctness gates plus descriptive timings, never a tablet FPS claim.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),os=require('node:os');
const base=process.env.UNRULY_TEST_URL||'http://127.0.0.1:4173/unruly/';
const out=path.join(__dirname,'evidence');fs.mkdirSync(out,{recursive:true});
const results=[],sourceHashes={};let browser;
for(const name of ['model.js','render.js','selection.js','storage.js','raster.js','app.js'])sourceHashes[name]=crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../../prototypes/browser-workspace',name))).digest('hex');
async function ready(p){await p.waitForFunction(()=>/Saved on this device|Copied \d+ old boards|Recovery warning/.test(document.querySelector('#save')?.textContent));}
async function run(id,fn,viewport={width:1024,height:768},dpr=1){
 const context=await browser.newContext({viewport,deviceScaleFactor:dpr,hasTouch:true}),p=await context.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 try{await p.goto(base);await ready(p);await install(p);const metrics=await fn(p);assert.deepEqual(errors,[]);results.push({id,status:'PASS',viewport,dpr,metrics});}
 catch(e){results.push({id,status:'FAIL',error:e.stack,errors});console.error(id,e.message);await p.screenshot({path:path.join(out,id+'-failure.png')}).catch(()=>{});}
 finally{await context.close();}
}
async function install(p){await p.evaluate(async()=>{
 const m=await import('./model.js'),r=await import('./render.js'),s=await import('./selection.js'),rs=await import('./raster.js');
 const check=(v,msg)=>{if(!v)throw Error(msg);},bytes=x=>new TextEncoder().encode(JSON.stringify(x)).length;
 const timed=fn=>{const t=performance.now(),value=fn();return {ms:performance.now()-t,value};};
 const summary=a=>{const sorted=[...a].sort((x,y)=>x-y);return {samples:a.length,p50:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.min(sorted.length-1,Math.ceil(sorted.length*.95)-1)],max:sorted.at(-1)};};
 function fixture(count=30,{dense=false,mixed=false,below=false}={}){
  const b=m.createBoard('perf1-'+count+'-'+dense+'-'+mixed+'-'+below,'PERF1 layered fixture');b.paper.kind='plain';
  b.layers=Array.from({length:count},(_,i)=>({id:'layer-'+i,name:'Detail '+i,visible:true,locked:false,blend:i%7===1?'multiply':i%7===2?'screen':'normal',opacity:.65+(i%3)*.15,strokes:Array.from({length:dense?25:8},(_,j)=>({id:'stroke-'+i+'-'+j,brush:'ink',preset:'ink-fineliner',color:['#26374a','#ac6942','#508d72'][i%3],size:2+(j%3),opacity:.75,points:Array.from({length:dense?120:12},(_,k)=>({x:70+(i%6)*125+j*2+k*.15,y:95+Math.floor(i/6)*90+j*4+Math.sin(k*.15)*5,pressure:(k%11)/10}))}))}));
  if(mixed){b.version=4;for(let i=0;i<count;i+=3){const data=new Uint8ClampedArray(48*48*4);for(let y=8;y<40;y++)for(let x=8;x<40;x++){const q=(y*48+x)*4;data.set([90+i,110,170,150],q);}b.layers[i].strokes.push(rs.rasterStroke(data,48,48,80+(i%6)*125,100+Math.floor(i/6)*90,'raster-'+i));}}
  b.activeLayer=b.layers[below?0:count-1].id;return b;
 }
 function canvas(){const c=document.createElement('canvas');c.style.cssText='position:fixed;left:0;top:0;width:'+innerWidth+'px;height:'+innerHeight+'px;pointer-events:none;visibility:hidden';document.body.append(c);return c;}
 window.perf1={m,r,s,rs,fixture,check,bytes,timed,summary,canvas};
});}
async function rendererCase(p,options){return p.evaluate(options=>{
 const {m,r,fixture,check,bytes,timed,summary,canvas}=perf1,b=fixture(options.count,options),before=JSON.stringify(b);
 m.validateBoard(b);const c=canvas(),reference=canvas(),renderer=r.createRenderer(c),rr=r.createRenderer(reference),view={x:0,y:0,scale:1};
 const live={id:'live',brush:'ink',preset:'ink-fineliner',color:'#172134',size:5,opacity:.7,points:[{x:140,y:180,pressure:.1},{x:160,y:184,pressure:.9}]};
 const cold=renderer.render(b,view,live),warm=[];for(let i=0;i<8;i++){live.points.push({x:165+i*4,y:184+Math.sin(i)*5,pressure:i/8});warm.push(renderer.render(b,view,live));}
 const expected=options.below?'reference':'retained-hit';check(warm.every(x=>x.mode===expected),'renderer path');
 const strokes=b.layers.reduce((n,l)=>n+l.strokes.length,0);check(warm.every(x=>x.completedStrokesReplayed===(options.below?strokes:0)),'replay count');
 rr.renderReference(b,view,live);
 // Untimed pixel oracle: exclude synchronous GPU readback from render samples.
 const a=c.getContext('2d').getImageData(0,0,c.width,c.height).data,z=reference.getContext('2d').getImageData(0,0,reference.width,reference.height).data;
 check(a.length===z.length&&a.every((v,i)=>v===z[i]),'exact reference pixels');
 const backing=warm.at(-1).backingBytes;check(backing<=r.rendererBudget.backingBytes,'backing budget');
 const schema=timed(()=>m.validateBoard(b)),history=m.createHistory(b),edit=timed(()=>m.addStroke(history,live)),undone=timed(()=>m.undo(edit.value));
 check(JSON.stringify(undone.value.board.layers)===JSON.stringify(b.layers),'undo exact layer content');
 const redone=timed(()=>m.redo(undone.value));check(JSON.stringify(redone.value.board.layers)===JSON.stringify(edit.value.board.layers),'redo exact layer content');
 const historyBytes=edit.value.past.reduce((n,x)=>n+bytes(x),0)+edit.value.future.reduce((n,x)=>n+bytes(x),0);check(historyBytes<=m.limits.historyBytes,'history budget');
 const stats={},polygon=[{x:0,y:0},{x:1000,y:0},{x:1000,y:700},{x:0,y:700}],scope={layerIds:b.layers.map(l=>l.id),stats},selection=timed(()=>perf1.s.selectLasso(b,polygon,scope));
 check(selection.value.length===strokes,'all-layer selection');const transformed=timed(()=>perf1.s.transformSelection(history,selection.value,{dx:5,dy:-3,angle:7,scale:1.1},scope));
 check(JSON.stringify(m.undo(transformed.value).board.layers)===JSON.stringify(b.layers),'transform atomic undo');
 check(transformed.value.board.layers.every((l,i)=>l.strokes.every((s,j)=>s.id===b.layers[i].strokes[j].id&&s.size===b.layers[i].strokes[j].size&&s.points.every((q,k)=>q.pressure===b.layers[i].strokes[j].points[k].pressure))),'ownership width pressure');
 check(JSON.stringify(b)===before,'fixture never mutated');
 const result={layers:b.layers.length,strokes,points:b.layers.reduce((n,l)=>n+l.strokes.reduce((v,s)=>v+s.points.length,0),0),documentBytes:bytes(b),rasterPixelBytes:b.layers.flatMap(l=>l.strokes).filter(s=>s.raster).reduce((n,s)=>n+s.raster.width*s.raster.height*4,0),rendererBackingBytes:backing,coldRenderMs:cold.ms,warmRenderMs:summary(warm.map(x=>x.ms)),mode:expected,replayedCompletedStrokesPerWarmFrame:warm[0].completedStrokesReplayed,validationMs:schema.ms,addStrokeMs:edit.ms,undoMs:undone.ms,redoMs:redone.ms,historyBytes,lassoMs:selection.ms,lassoComparisons:stats.comparisons,transformMs:transformed.ms,exactReferencePixels:true};
 c.remove();reference.remove();return result;
 },options);}
async function capacity(p){return p.evaluate(()=>{const {m,fixture,check}=perf1;const b=fixture(50),h=m.createHistory(fixture(32)),before=JSON.stringify(h);let validateRejected=false,writeRejected=false;try{m.validateBoard(b);}catch(e){validateRejected=/Layer limit/.test(e.message);}try{m.layerCommand(h,'add');}catch(e){writeRejected=/Layer limit/.test(e.message);}check(validateRejected&&writeRejected,'capacity rejects unsupported 50 and 33rd layer');check(before===JSON.stringify(h),'capacity rejection atomic');return{supportedLayerCap:m.limits.layers,targetLayers:50,targetStatus:'BLOCKED_BY_CURRENT_DOCUMENT_CAP',foldersMasksPatterns:'NOT_IMPLEMENTED'};});}
async function ui(p){
 await p.evaluate(async()=>{const {openStore}=await import('./storage.js'),store=await openStore(),b=perf1.fixture(30,{mixed:true,below:true});await store.save(b,0);await store.select(b.id);store.close();});await p.reload();await ready(p);await install(p);
 const before=await p.evaluate(async()=>{const{openStore}=await import('./storage.js'),s=await openStore(),b=(await s.load(await s.last())).board;s.close();return b;});
 const bounds=await p.locator('#canvas').boundingBox(),cdp=await p.context().newCDPSession(p),samples=[];
 const send=async(type,x,y)=>{await cdp.send('Input.dispatchMouseEvent',{type,x:bounds.x+x,y:bounds.y+y,button:'left',buttons:type==='mouseReleased'?0:1,pointerType:'pen',force:type==='mouseReleased'?0:.55,clickCount:1});samples.push(await p.evaluate(()=>new Promise(ok=>{const t=performance.now();requestAnimationFrame(()=>ok(performance.now()-t));})));};
 await send('mousePressed',200,200);for(let i=1;i<=8;i++)await send('mouseMoved',200+i*8,200+Math.sin(i)*8);await send('mouseReleased',264,208);await cdp.detach();
 await p.waitForTimeout(700);const after=await p.evaluate(async()=>{const{openStore}=await import('./storage.js'),s=await openStore(),b=(await s.load(await s.last())).board;s.close();return b;});
 assert.equal(after.layers[0].strokes.length,before.layers[0].strokes.length+1);assert.deepEqual(after.layers.slice(1),before.layers.slice(1));
 await p.locator('#undo').click();await p.waitForTimeout(600);const undone=await p.evaluate(async()=>{const{openStore}=await import('./storage.js'),s=await openStore(),b=(await s.load(await s.last())).board;s.close();return b;});assert.deepEqual(undone.layers,before.layers);
 await p.locator('#redo').click();await p.waitForTimeout(600);await p.reload();await ready(p);await install(p);
 const restored=await p.evaluate(async()=>{const{openStore}=await import('./storage.js'),s=await openStore(),b=(await s.load(await s.last())).board;s.close();return b;});assert.deepEqual(restored.layers,after.layers);
 await p.locator('#lasso').click();await p.keyboard.press('Escape');await p.waitForTimeout(100);
 await p.evaluate(()=>{window.replays=0;window.originals={};for(const key of ['stroke','fill','drawImage','clearRect']){originals[key]=CanvasRenderingContext2D.prototype[key];CanvasRenderingContext2D.prototype[key]=function(...args){if(this.canvas.id==='canvas')replays++;return originals[key].apply(this,args);};}});
 const c=await p.context().newCDPSession(p);for(const [type,x,y] of [['mousePressed',170,170],['mouseMoved',290,170],['mouseMoved',290,240],['mouseMoved',170,240]])await c.send('Input.dispatchMouseEvent',{type,x:bounds.x+x,y:bounds.y+y,button:'left',buttons:1,pointerType:'pen',force:.5,clickCount:1});
 await p.waitForTimeout(50);assert.equal(await p.evaluate(()=>replays),0,'lasso overlay must not replay artwork');await c.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:bounds.x+170,y:bounds.y+170,button:'left',buttons:0,pointerType:'pen',force:0,clickCount:1});await c.detach();
 await p.evaluate(()=>{for(const [key,value]of Object.entries(originals))CanvasRenderingContext2D.prototype[key]=value;});
 await p.screenshot({path:path.join(out,'PERF1-layered-ui.png')});
 return{layers:30,mixedRasterVector:true,activeLayerBelowOutlines:true,penSaveUndoRedoReload:true,artworkReplaysDuringLasso:0,postDispatchNextRafMs:await p.evaluate(samples=>perf1.summary(samples),samples),measurementNote:'Post-dispatch next-rAF wait excludes driver/pen/display latency and may include scheduling noise.'};
}
(async()=>{
 browser=await chromium.launch({headless:true});
 for(const [id,options,viewport,dpr]of[
  ['PERF1-small-top',{count:30},{width:1024,height:768},1],
  ['PERF1-small-below',{count:30,below:true},{width:1024,height:768},1],
  ['PERF1-dense-top',{count:32,dense:true},{width:1024,height:768},1],
  ['PERF1-dense-below',{count:32,dense:true,below:true},{width:1024,height:768},1],
  ['PERF1-mixed-portrait',{count:30,mixed:true},{width:768,height:1024},2],
  ['PERF1-mixed-below',{count:30,mixed:true,below:true},{width:1024,height:768},2]
 ])await run(id,p=>rendererCase(p,options),viewport,dpr);
 await run('PERF1-capacity',capacity);await run('PERF1-ui-save-lasso',ui);
 const report={schema:1,checkpoint:'CHG-UNRULY-PERF1-1011',recordedAt:new Date().toISOString(),environment:{browser:browser.version(),node:process.version,platform:process.platform,arch:process.arch,cpu:os.cpus()[0]?.model,cpuCount:os.cpus().length,runnerRamBytes:os.totalmem(),headless:true},sourceHashes,physicalTablet:'NOT_VERIFIED',totalBrowserGpuRam:'NOT_MEASURED',timings:'Descriptive runner timings; correctness PASS does not establish acceptable tablet latency. Pixel readback is excluded from render timings.',results};
 fs.writeFileSync(path.join(out,'layered-baseline-results.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(results));process.exitCode=results.some(x=>x.status!=='PASS')?1:0;
})().catch(async e=>{console.error(e);if(browser)await browser.close();process.exitCode=1;});
