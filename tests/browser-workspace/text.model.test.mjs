import test from 'node:test';import assert from 'node:assert/strict';
import {makeText,validateText,textContains} from '../../prototypes/browser-workspace/text.js';
import {createBoard,createHistory,textCommand,undo,redo,validateBoard,importDocument,layerCommand,eraseGesture,clippingCommand,maskCommand,folderCommand} from '../../prototypes/browser-workspace/model.js';
import {transformSelection,moveSelection,copySelection,pasteSelection,selectLasso} from '../../prototypes/browser-workspace/selection.js';
const text=(options={})=>makeText({content:'Hello\nUNRULY',transform:[1,0,0,1,20,30],...options},line=>line.length*20),seed=()=>{let h=createHistory(createBoard());return textCommand(h,h.board.activeLayer,text());};
test('TEXTM01 add/edit use v8 and exact Undo/Redo',()=>{let h=seed();assert.equal(h.board.version,8);const original=structuredClone(h.board.layers),s=text({content:'Changed',bold:true,italic:true,align:'right'});s.id=h.board.layers[0].strokes[0].id;h=textCommand(h,h.board.activeLayer,s,s.id);assert.equal(h.board.layers[0].strokes[0].text.content,'Changed');assert.deepEqual(undo(h).board.layers,original);assert.deepEqual(redo(undo(h)).board.layers,h.board.layers);assert.equal(undo(undo(h)).board.version,3);});
test('TEXTM02 malformed fonts/control chars/huge work/singular matrices reject',()=>{for(const patch of [{content:''},{content:'a\u0000b'},{content:'x'.repeat(2049)},{content:Array(34).fill('x').join('\n')},{font:'url(https://evil)'},{fontSize:7},{fontSize:257},{align:'justify'},{bold:'true'},{transform:[0,0,0,0,0,0]},{transform:[NaN,0,0,1,0,0]}])assert.throws(()=>text(patch));assert.throws(()=>makeText({content:'huge'},()=>2000));});
test('TEXTM03 forged bounds and legacy/schema crossover reject',()=>{const h=seed(),b=structuredClone(h.board);b.layers[0].strokes[0].points[0].x++;assert.throws(()=>validateBoard(b));for(const v of [3,4,5,6,7]){const b=structuredClone(h.board);b.version=v;assert.throws(()=>validateBoard(b));}const s=text();s.recipe={};assert.throws(()=>validateText(s));});
test('TEXTM04 inherited locks/hidden and stale edits reject atomically',()=>{let h=seed();const id=h.board.activeLayer;h=folderCommand(h,'group',null,[id]);for(const action of ['locked','visible']){const blocked=folderCommand(h,action,h.board.folders[0].id,action==='locked');assert.throws(()=>textCommand(blocked,id,text()));}assert.throws(()=>textCommand(h,id,text(),'missing'));assert.equal(h.board.layers[0].strokes.length,1);});
test('TEXTM05 affine move/scale/rotate retain content and exact history',()=>{let h=seed();const id=h.board.layers[0].strokes[0].id,base=structuredClone(h.board.layers);h=transformSelection(h,[id],{dx:3,dy:4,scale:2,angle:90});const s=h.board.layers[0].strokes[0];assert.equal(s.text.content,'Hello\nUNRULY');validateText(s);assert.deepEqual(undo(h).board.layers,base);h=moveSelection(h,[id],10,20);validateText(h.board.layers[0].strokes[0]);assert(textContains(s,{x:s.points.slice(0,4).reduce((a,p)=>a+p.x,0)/4,y:s.points.slice(0,4).reduce((a,p)=>a+p.y,0)/4}));});
test('TEXTM06 lasso inside text box, clipboard version and editable paste',()=>{let h=seed(),s=h.board.layers[0].strokes[0],id=s.id;const poly=[{x:30,y:40},{x:40,y:40},{x:40,y:50},{x:30,y:50}];assert.deepEqual(selectLasso(h.board,poly),[id]);const payload=copySelection(h.board,[id]);const target=createHistory(createBoard());h=pasteSelection(target,payload,100,100);assert.equal(h.board.version,8);assert.equal(h.board.layers[0].strokes[0].brush,'text');assert.notEqual(h.board.layers[0].strokes[0].id,id);validateText(h.board.layers[0].strokes[0]);});
test('TEXTM07 import and duplicate preserve text while remapping IDs',()=>{let h=seed();const b=importDocument(JSON.stringify(h.board));assert.notEqual(b.layers[0].strokes[0].id,h.board.layers[0].strokes[0].id);assert.deepEqual(b.layers[0].strokes[0].text,h.board.layers[0].strokes[0].text);h=layerCommand(h,'duplicate',h.board.activeLayer);assert.equal(h.board.layers.length,2);assert.deepEqual(h.board.layers[0].strokes[0].text,h.board.layers[1].strokes[0].text);});
test('TEXTM08 masks and clipping never downgrade text documents',()=>{let h=seed();h=maskCommand(h,'add',h.board.activeLayer);assert.equal(h.board.version,8);h=clippingCommand(h,'alphaLock',h.board.activeLayer,true);assert.equal(h.board.version,8);validateBoard(h.board);});
test('TEXTM09 whole eraser hits text interior, partial/intersection preserve editable text',()=>{const h=seed(),sweep=[{a:{x:30,y:40},b:{x:40,y:45}}];assert.equal(eraseGesture(h.board,'whole',sweep,2).layers[0].strokes.length,0);for(const mode of ['partial','intersection'])assert.deepEqual(eraseGesture(h.board,mode,sweep,2).layers,h.board.layers);});
test('TEXTM10 input text is stored literally with no HTML interpretation',()=>{let h=seed();const s=text({content:'<img src=x onerror=alert(1)> & 👋'});h=textCommand(h,h.board.activeLayer,s);assert.equal(h.board.layers[0].strokes[1].text.content,s.text.content);validateBoard(h.board);});

import {layoutRichText} from '../../prototypes/browser-workspace/rich-text-layout.js';
const richLayout=(content,options={})=>layoutRichText({content,maxWidth:60,fontSize:16,measure:s=>Array.from(s).length*10,...options});
test('RTEXT1 preserve source and explicit paragraph boundaries',()=>{const x=richLayout('one two three\n\nagain');assert.equal(x.source,'one two three\n\nagain');assert.deepEqual(x.lines.map(l=>l.paragraph),[0,0,0,1,2]);assert.equal(x.lines.filter(l=>l.paragraph===0).map(l=>l.text).join(''),'one two three');});
test('RTEXT2 wrapping preserves spaces and Unicode grapheme boundaries',()=>{const x=richLayout('abc defghijkl');assert.equal(x.lines.map(l=>l.text).join(''),'abc defghijkl');assert(x.lines.length>1);assert.equal(richLayout('👨‍👩‍👧').lines.length,1);});
test('RTEXT3 invalid or impossible layouts are refused without altering source',()=>{for(const c of ['', ' ', 'z'.repeat(2049), 'bad\u0000text',Array(34).fill('x').join('\n')])assert.throws(()=>richLayout(c));assert.throws(()=>richLayout('wide',{maxWidth:5}));assert.throws(()=>richLayout('ok',{measure:()=>NaN}));});
test('RTEXT4 line and font budgets are enforced, never truncated',()=>{assert.throws(()=>richLayout('a'.repeat(50),{maxWidth:10}));assert.throws(()=>richLayout('a',{fontSize:257}));assert.throws(()=>richLayout('a',{lineSpacing:4}));assert.throws(()=>richLayout('a',{maxWidth:1025}));});
test('RTEXT5 line spacing changes measured height but not source',()=>{const a=richLayout('hello'),b=richLayout('hello',{lineSpacing:2});assert.equal(a.source,b.source);assert(b.height>a.height);});

import {textFont,validTextFont} from '../../prototypes/browser-workspace/text.js';
test('FONTM01 safe local family round trip and portable CSS fallback',()=>{
 const s=text({font:'Noto Sans Devanagari'});validateText(s);
 assert.equal(s.text.font,'Noto Sans Devanagari');
 assert.match(textFont(s.text),/"Noto Sans Devanagari", sans-serif/);
 assert.equal(textFont(text({font:'serif'}).text).endsWith('serif'),true);
 for(const name of ['Segoe UI','Roboto','Noto Sans','MS Gothic'])assert(validTextFont(name));
});
test('FONTM02 injected or unbounded families reject before changing board',()=>{
 for(const name of ['url(http://bad)','Arial, serif','"Arial"','Arial; color:red','a'.repeat(81),' bad','', '<script>','A/B'])assert.throws(()=>text({font:name}));
 let h=seed();const prior=structuredClone(h.board);assert.throws(()=>textCommand(h,h.board.activeLayer,{...h.board.layers[0].strokes[0],text:{...h.board.layers[0].strokes[0].text,font:'a;evil'}}));assert.deepEqual(h.board,prior);
});

import {readFileSync} from 'node:fs';
test('FONTM03 offline cache migrates to FONT2 without losing normal asset inventory',()=>{
 const sw=readFileSync(new URL('../../prototypes/browser-workspace/sw.js',import.meta.url),'utf8');
 assert.match(sw,/CACHE=NORMAL_PREFIX\+'v10-20261025-core1'/);
 for(const asset of ['./text.js','./rich-text-layout.js','./app.js','./storage.js'])assert(sw.includes("'"+asset+"'"),'missing offline asset '+asset);
 assert(sw.includes("e.data?.type==='ACTIVATE_UPDATE'"),'existing explicit update gesture retained');
 assert(sw.includes("keys.filter(k=>k.startsWith(NORMAL_PREFIX)&&k!==CACHE)"),'old cache activation cleanup retained');
});

import {drawText} from '../../prototypes/browser-workspace/text.js';
test('RTEXT2M01 wraps into one editable v8 text with original source and one history item',()=>{
 let h=createHistory(createBoard()),before=structuredClone(h.board.layers);
 const s=text({content:'one two three four five six seven eight',font:'Noto Sans',fontSize:20,wrapWidth:120,lineSpacing:1.8});
 assert.equal(s.text.content,'one two three four five six seven eight');assert.equal(s.text.wrap,true);
 assert.equal(s.text.width,120);assert.equal(s.text.lineSpacing,1.8);assert(s.text.height>55);
 h=textCommand(h,h.board.activeLayer,s);validateBoard(h.board);assert.equal(h.board.version,8);
 assert.deepEqual(undo(h).board.layers,before);assert.deepEqual(redo(undo(h)).board.layers,h.board.layers);
 const round=importDocument(JSON.stringify(h.board));
 assert.equal(round.layers[0].strokes[0].text.content,s.text.content);
 assert.equal(round.layers[0].strokes[0].text.width,120);
});
test('RTEXT2M02 legacy font and text payload remain byte-for-byte compatible',()=>{
 const s=text(),keys=Object.keys(s.text).sort().join(',');
 assert.equal(keys,'align,bold,content,font,fontSize,height,italic,transform,width');
 assert.equal(s.text.height,Math.ceil(2*32*1.4+8));
 const spaced=text({lineSpacing:2});
 assert.equal(Object.hasOwn(spaced.text,'wrap'),false);
 assert.equal(spaced.text.lineSpacing,2);
 validateText(spaced);validateText(s);
});
test('RTEXT2M03 bounded inputs reject without truncating or corrupting history',()=>{
 for(const options of [{wrapWidth:99},{wrapWidth:1025},{wrapWidth:120.5},{wrapWidth:NaN},{lineSpacing:0.9},{lineSpacing:3.1},{lineSpacing:NaN},{content:'x'.repeat(2049),wrapWidth:200},{content:'a'.repeat(1600),wrapWidth:100}]){
   assert.throws(()=>text(options),JSON.stringify(options).slice(0,60));
 }
 const b=seed(),before=structuredClone(b.board);
 const forged=structuredClone(b.board.layers[0].strokes[0]);forged.text.wrap=false;
 assert.throws(()=>textCommand(b,b.board.activeLayer,forged,forged.id));
 assert.deepEqual(b.board,before);
});
test('RTEXT2M04 visual layout respects wrapping, line spacing, alignment, and source Unicode',()=>{
 const calls=[];
 const ctx={save(){},restore(){},transform(){},beginPath(){},rect(){},clip(){},measureText:s=>({width:Array.from(s).length*10}),fillText:(s,x,y,w)=>calls.push({s,x,y,w})};
 const s=makeText({content:'one two three four five\n👨‍👩‍👧',fontSize:20,align:'center',wrapWidth:140,lineSpacing:2},str=>[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(str)].length*10);
 drawText(ctx,s);
 assert(calls.length>2,'wrapped text should occupy multiple lines');assert.equal(calls.map(x=>x.s).join(''),'one two three four five👨‍👩‍👧');
 assert(calls.every(x=>x.x===70&&x.w===122));
 assert.equal(calls[1].y-calls[0].y,40);
 const old=text({content:'same\nlegacy'});calls.length=0;drawText(ctx,old);
 assert.deepEqual(calls.map(x=>x.s),['same','legacy']);
 assert.equal(calls[1].y-calls[0].y,44.8);
});
test('RTEXT2M05 wrap layout is grapheme-safe and rejects unrenderable size',()=>{
 const source='Hello 👩‍🚀 long sentence';
 const w=layoutRichText({content:source,font:'Noto Sans',fontSize:18,maxWidth:60,measure:s=>[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(s)].length*10});
 assert.equal(w.lines.map(l=>l.text).join(''),source);
 assert.throws(()=>text({content:'W',fontSize:256,wrapWidth:150}),/Grapheme wider/);
});
