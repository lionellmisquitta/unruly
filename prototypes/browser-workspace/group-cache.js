// Optional processed-folder retention. No document mutation or persistent state.
export function createGroupCache({budgetBytes=16*1024*1024,makeCanvas=()=>document.createElement('canvas')}={}){
 if(!Number.isFinite(budgetBytes)||budgetBytes<0)throw Error('Invalid group cache budget');
 const limit=Math.min(16*1024*1024,Math.floor(budgetBytes)),entries=new Map();
 let residentBytes=0,hits=0,misses=0,bypasses=0,failures=0,state='',available=0;
 const release=e=>{residentBytes-=e.bytes;e.canvas.width=0;e.canvas.height=0;};
 function clear(){for(const e of entries.values())release(e);entries.clear();state='';}
 function prepare(key,headroom){available=Math.max(0,Math.min(limit,headroom));if(state!==key||residentBytes>available){clear();state=key;}}
 function get(id,key){const e=entries.get(id);if(e?.key===key){hits++;return e.canvas;}misses++;if(e){release(e);entries.delete(id);}return null;}
 function put(id,key,source){const bytes=source.width*source.height*4;const old=entries.get(id);if(old){release(old);entries.delete(id);}if(bytes>available-residentBytes||Math.max(bytes,300*150*4)>available-residentBytes){bypasses++;return;}let c;try{c=makeCanvas();c.width=0;c.height=0;c.width=source.width;c.height=source.height;const ctx=c.getContext('2d');if(!ctx)throw Error('Group cache context unavailable');ctx.drawImage(source,0,0);entries.set(id,{canvas:c,key,bytes});residentBytes+=bytes;}catch{if(c){c.width=0;c.height=0;}failures++;}}
 return {clear,prepare,get,put,diagnostics:()=>Object.freeze({budgetBytes:limit,residentBytes,entries:entries.size,hits,misses,bypasses,failures})};
}
