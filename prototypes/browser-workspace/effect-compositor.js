import {isolatesGroup,applyCanvasFilter} from './filters.js';
import {hasAdjustment,applyCanvasAdjustment} from './adjustments.js';
// Effects, enabled masks or explicit group controls isolate; legacy folders pass through.
export function effectDepth(board){const map=new Map((board.folders||[]).map(f=>[f.id,f]));let depth=0;for(const l of board.layers){let n=0,p=l.parentId;while(p){const f=map.get(p);if(!f)throw Error('Invalid effect folder');if(isolatesGroup(f))n++;p=f.parentId;}depth=Math.max(depth,n);}return depth;}
export function composeEffects({board,target,g,background,drawLayer,scratch,processGroup=null,afterGroup=null,cache=null,live=null,makeCanvas=()=>document.createElement('canvas')}){
 const children=new Map(),positions=new Map(board.layers.map((l,i)=>[l.id,i]));
 for(const n of [...board.layers,...(board.folders||[])]){const key=n.parentId??null;if(!children.has(key))children.set(key,[]);children.get(key).push(n);}
 const index=n=>positions.has(n.id)?positions.get(n.id):Math.min(Infinity,...(children.get(n.id)||[]).map(index));
 for(const list of children.values())list.sort((a,b)=>index(a)-index(b));
 // Full content serialization is conservative: committed edits invalidate every group.
 // Do not use revision/object identity alone; draft/live arrays can mutate in place.
 const boardKey=cache?JSON.stringify(board):'';
 const leaves=n=>positions.has(n.id)?[n]:(children.get(n.id)||[]).flatMap(leaves);
 const cacheInfo=n=>{const members=leaves(n),ids=new Set(members.map(l=>l.id));
  // Skipping leaf replay would omit mattes needed by an external clipped layer.
  const externalConsumer=board.layers.some(l=>!ids.has(l.id)&&l.clipSource&&l.clipSource!==n.id&&([...board.layers,...(board.folders||[])].find(x=>x.id===l.clipSource)&&leaves([...board.layers,...(board.folders||[])].find(x=>x.id===l.clipSource)).some(x=>ids.has(x.id))));
  const externalInput=members.some(l=>l.clipSource&&!ids.has(l.clipSource));
  return {safe:!externalConsumer,key:boardKey+'|'+JSON.stringify((ids.has(board.activeLayer)||externalInput)?live:null)};
 };
 const allocated=[];let count=0;
 function visit(parent,destination){for(const n of children.get(parent)||[]){if(!n.visible)continue;if(positions.has(n.id)){if(n.opacity!==0)count+=drawLayer(n,destination);continue;}
   if(!isolatesGroup(n)){visit(n.id,destination);continue;}
   const info=cache?cacheInfo(n):null,retained=info?.safe?cache.get(n.id,info.key):null;
   const c=retained||makeCanvas();if(!retained){allocated.push(c);c.width=0;c.height=0;c.width=g.w;c.height=g.h;}
   try{if(!retained){visit(n.id,c);applyCanvasAdjustment(n,c);applyCanvasFilter(n,c,scratch,g.d*g.scale);processGroup?.(n,c);if(info?.safe)cache.put(n.id,info.key,c);}afterGroup?.(n,c);const ctx=destination.getContext('2d');ctx.save();try{ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=n.opacity??1;ctx.globalCompositeOperation=n.blend&&n.blend!=='normal'?n.blend:'source-over';if(ctx.globalCompositeOperation!==(n.blend&&n.blend!=='normal'?n.blend:'source-over'))throw Error('Unsupported group blend');ctx.drawImage(c,destination===target?-(g.padding||0):0,destination===target?-(g.padding||0):0);}finally{ctx.restore();}}finally{if(!retained){c.width=0;c.height=0;}}
 }}
 try{background(target);visit(null,target);return count;}finally{for(const c of allocated){c.width=0;c.height=0;}}
}
