import {isolatesGroup,applyCanvasFilter} from './filters.js';
import {hasAdjustment,applyCanvasAdjustment} from './adjustments.js';
// Only adjusted folders isolate. Unadjusted hierarchy remains pass-through.
export function effectDepth(board){const map=new Map((board.folders||[]).map(f=>[f.id,f]));let depth=0;for(const l of board.layers){let n=0,p=l.parentId;while(p){const f=map.get(p);if(!f)throw Error('Invalid effect folder');if(isolatesGroup(f))n++;p=f.parentId;}depth=Math.max(depth,n);}return depth;}
export function composeEffects({board,target,g,background,drawLayer,scratch,afterGroup=null,makeCanvas=()=>document.createElement('canvas')}){
 const children=new Map(),positions=new Map(board.layers.map((l,i)=>[l.id,i]));
 for(const n of [...board.layers,...(board.folders||[])]){const key=n.parentId??null;if(!children.has(key))children.set(key,[]);children.get(key).push(n);}
 const index=n=>positions.has(n.id)?positions.get(n.id):Math.min(Infinity,...(children.get(n.id)||[]).map(index));
 for(const list of children.values())list.sort((a,b)=>index(a)-index(b));
 const allocated=[];let count=0;
 function visit(parent,destination){for(const n of children.get(parent)||[]){if(!n.visible)continue;if(positions.has(n.id)){if(n.opacity!==0)count+=drawLayer(n,destination);continue;}
   if(!isolatesGroup(n)){visit(n.id,destination);continue;}
   const c=makeCanvas();allocated.push(c);c.width=0;c.height=0;c.width=g.w;c.height=g.h;
   try{visit(n.id,c);applyCanvasAdjustment(n,c);applyCanvasFilter(n,c,scratch,g.d*g.scale);afterGroup?.(n,c);const ctx=destination.getContext('2d');ctx.save();try{ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.drawImage(c,destination===target?-(g.padding||0):0,destination===target?-(g.padding||0):0);}finally{ctx.restore();}}finally{c.width=0;c.height=0;}
 }}
 try{background(target);visit(null,target);return count;}finally{for(const c of allocated){c.width=0;c.height=0;}}
}
