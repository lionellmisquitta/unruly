import test from 'node:test';
import assert from 'node:assert/strict';
import {createBoard,validateBoard} from '../../prototypes/browser-workspace/model.js';
const stroke=(brush,size)=>{const b=createBoard();b.layers[0].strokes.push({id:'air-size-test',brush,color:'#202020',size,opacity:1,points:[{x:10,y:10,pressure:null},{x:50,y:40,pressure:null}]});return b;};
test('Airbrush large valid stroke, reject unsafe 161+',()=>{assert.doesNotThrow(()=>validateBoard(stroke('airbrush',160)));assert.throws(()=>validateBoard(stroke('airbrush',161)),/Invalid stroke/);});
test('Other brush size cap stays 40',()=>{assert.doesNotThrow(()=>validateBoard(stroke('pencil',40)));assert.throws(()=>validateBoard(stroke('pencil',41)),/Invalid stroke/);});
