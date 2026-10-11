// Retain occupied upper-layer rectangles, never a flattened upper composite.
// Blending remains in the accepted backend, in original layer order.
export const layerCacheLimit=16*1024*1024;
export function occupiedBounds(data,width,height){
 let x0=width,y0=height,x1=0,y1=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(data[(y*width+x)*4+3]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x+1);y1=Math.max(y1,y+1);}
 return x1>x0&&y1>y0?{x:x0,y:y0,width:x1-x0,height:y1-y0}:null;
}
export function createLayerCompositor({budgetBytes=layerCacheLimit,makeCanvas=()=>document.createElement('canvas')}={}){
 if(!Number.isFinite(budgetBytes)||budgetBytes<0)throw Error('Invalid layer cache budget');
 const limit=Math.min(layerCacheLimit,Math.floor(budgetBytes));
 let state=null,residentBytes=0,hits=0,misses=0,bypasses=0;
 const entries=new Map(),uncached=new Set();
 function clear(){for(const entry of entries.values())if(entry?.canvas){entry.canvas.width=0;entry.canvas.height=0;}entries.clear();uncached.clear();residentBytes=0;state=null;}
 function render({board,view,live,g,index,ops,backingLimit}){
  const key=[board.revision,board.activeLayer,view.x,view.y,view.scale,g.cssW,g.cssH,g.w,g.h,g.d,g.deviceDpr,...board.layers.map(l=>[l.id,l.visible,l.opacity,l.blend].join(':'))].join('|');
  const baseBytes=5*g.w*g.h*4,available=Math.max(0,Math.min(limit,backingLimit-baseBytes));
  let count=0,cold=false;
  if(!state||state.board!==board||state.key!==key){
   clear();cold=true;ops.background();
   for(const layer of board.layers.slice(0,index)){if(!layer.visible||layer.opacity===0)continue;ops.replay(layer);count+=layer.strokes.filter(s=>s.opacity!==0).length;ops.compositeLower(layer);}
   ops.replay(board.layers[index]);count+=board.layers[index].strokes.filter(s=>s.opacity!==0).length;ops.retainActive();state={board,key};
  }
  ops.restoreLower();ops.restoreActive();ops.live(live);ops.composite(board.layers[index]);
  for(const layer of board.layers.slice(index+1)){
   if(!layer.visible||layer.opacity===0)continue;
   if(entries.has(layer.id)){
    hits++;ops.restoreUpper(entries.get(layer.id));
   }else{
    misses++;ops.replay(layer);count+=layer.strokes.filter(s=>s.opacity!==0).length;
    if(!uncached.has(layer.id)&&available-residentBytes>=300*150*4){
     const source=ops.layer(),data=source.getContext('2d').getImageData(0,0,g.w,g.h).data,bounds=occupiedBounds(data,g.w,g.h);
     const bytes=bounds?bounds.width*bounds.height*4:0;
     if(bytes<=available-residentBytes){
      if(!bounds)entries.set(layer.id,null);
      else{
       const canvas=makeCanvas();try{canvas.width=0;canvas.height=0;canvas.width=bounds.width;canvas.height=bounds.height;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Layer cache context unavailable');ctx.drawImage(source,bounds.x,bounds.y,bounds.width,bounds.height,0,0,bounds.width,bounds.height);entries.set(layer.id,{canvas,...bounds});residentBytes+=bytes;}catch(error){canvas.width=0;canvas.height=0;throw error;}
      }
     }else{uncached.add(layer.id);bypasses++;}
    }else if(!uncached.has(layer.id)){uncached.add(layer.id);bypasses++;}
   }
   ops.composite(layer);
  }
  return {mode:cold?'layer-retained-miss':uncached.size?'layer-retained-mixed':'layer-retained-hit',count,layerCacheApplied:true,layerCacheBytes:residentBytes,totalBackingBytes:baseBytes+residentBytes};
 }
 return {render,clear,diagnostics:()=>Object.freeze({budgetBytes:limit,residentBytes,entries:entries.size,bypassedLayers:uncached.size,hits,misses,bypasses})};
}
