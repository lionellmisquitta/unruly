import {readSparsePixels,decodeTile} from './raster-tiles.js';
import {decodePixels} from './raster.js';
export const rasterCacheBudget=Object.freeze({bytes:8*1024*1024,entries:512});
// Each renderer owns an LRU. Cost includes decoded buffers + owned ASCII key bytes
// and a fixed key/entry allowance; this is not a total browser/GPU heap guarantee.
export function createRasterCache({bytes=rasterCacheBudget.bytes,entries=rasterCacheBudget.entries}={}){
 if(!Number.isSafeInteger(bytes)||bytes<0||bytes>rasterCacheBudget.bytes||!Number.isSafeInteger(entries)||entries<0||entries>rasterCacheBudget.entries)throw Error('Invalid raster cache budget');
 const cache=new Map();let residentBytes=0,hits=0,misses=0,evictions=0,decodes=0;
 function get(text,n,decode,kind='tile'){
  // Own ASCII key bytes rather than retaining substrings of old board payloads.
  // Fingerprints select candidates only; byte equality prevents hash collisions.
  const cost=text.length+n+128;
  if(cost>bytes||entries===0){misses++;decodes++;return decode();}
  let h1=2166136261,h2=5381;for(let i=0;i<text.length;i++){const c=text.charCodeAt(i);h1=Math.imul(h1^c,16777619);h2=Math.imul(h2,33)^c;}
  const key=kind+':'+n+':'+(h1>>>0)+':'+(h2>>>0),old=cache.get(key);
  if(old&&old.encoded.length===text.length&&old.encoded.every((v,i)=>v===text.charCodeAt(i))){cache.delete(key);cache.set(key,old);hits++;return kind==='dense'?old.data.slice():old.data;}
  misses++;decodes++;
  if(old){cache.delete(key);residentBytes-=old.cost;evictions++;}
  while(cache.size&&(residentBytes+cost>bytes||cache.size>=entries)){const first=cache.keys().next().value;residentBytes-=cache.get(first).cost;cache.delete(first);evictions++;}
  const data=decode();if(data.length!==n)throw Error('Invalid raster cache pixels');
  const encoded=new Uint8Array(text.length);for(let i=0;i<text.length;i++)encoded[i]=text.charCodeAt(i);
  cache.set(key,{data,encoded,cost});residentBytes+=cost;return kind==='dense'?data.slice():data;
 }
 function decode(text){
  try{
   if(typeof text!=='string'||text.length>4*Math.ceil(1024*1024*4/3))throw Error('Invalid raster pixels');
   if(text.startsWith('T2:')){
    const r=readSparsePixels(text,undefined,undefined,(encoded,n)=>get(encoded,n,()=>decodeTile(encoded,n))),data=new Uint8ClampedArray(r.width*r.height*4);
    for(const t of r.tiles)for(let y=0;y<t.height;y++)data.set(t.data.subarray(y*t.width*4,(y+1)*t.width*4),((t.y+y)*r.width+t.x)*4);
    return data;
   }
   // Dense payloads are valid legacy base64; byte count avoids decoding on a hit.
   if(!/^[A-Za-z0-9+/]*={0,2}$/.test(text)||text.length%4)throw Error('Invalid raster pixels');
   const padding=text.endsWith('==')?2:text.endsWith('=')?1:0,n=text.length/4*3-padding;
   if(n<4||n%4)throw Error('Invalid raster pixels');
   return get(text,n,()=>decodePixels(text),'dense');
  }catch(error){clear();throw error;}
 }
 function clear(){cache.clear();residentBytes=0;}
 const diagnostics=()=>Object.freeze({budgetBytes:bytes,budgetEntries:entries,residentBytes,entries:cache.size,hits,misses,evictions,decodes});
 return {decode,clear,diagnostics};
}
