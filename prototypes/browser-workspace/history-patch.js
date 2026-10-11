// Inverse history records: unchanged entities/pixels are not retained in each entry.
// Commands still clone and validate the board; these records are session memory only.
const copy=x=>structuredClone(x),same=(a,b)=>a===b||JSON.stringify(a)===JSON.stringify(b);
const size=x=>new TextEncoder().encode(JSON.stringify(x)).length;
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
const idArray=x=>x.every(v=>object(v)&&typeof v.id==='string')&&new Set(x.map(v=>v.id)).size===x.length;
const set=v=>['set',copy(v)];
const best=(patch,before)=>size(patch)<size(['set',before])?patch:set(before);
// Flatten retained fragments by UTF-16 code unit; sliced strings can otherwise
// keep an entire superseded raster payload alive. Do not normalize lone surrogates.
function ownedText(text){let out='';for(let start=0;start<text.length;start+=8192){const chars=new Uint16Array(Math.min(8192,text.length-start));for(let i=0;i<chars.length;i++)chars[i]=text.charCodeAt(start+i);out+=String.fromCharCode(...chars);}return out;}
function ownStrings(value){if(typeof value==='string')return ownedText(value);if(Array.isArray(value)){for(let i=0;i<value.length;i++)value[i]=ownStrings(value[i]);}else if(object(value)){for(const key of Object.keys(value))Object.defineProperty(value,key,{value:ownStrings(value[key]),enumerable:true,writable:true,configurable:true});}return value;}
function textPatch(before,after){
 let start=0,end=0;while(start<before.length&&start<after.length&&before[start]===after[start])start++;
 while(end<before.length-start&&end<after.length-start&&before[before.length-1-end]===after[after.length-1-end])end++;
 return best(['text',start,after.length-start-end,before.slice(start,before.length-end)],before);
}
function tilePatch(before,after){
 // Both payloads have already passed raster admission; never decode unchanged pixels.
 if(!before.startsWith('T2:')||!after.startsWith('T2:'))return null;
 let a,b;try{a=JSON.parse(before.slice(3));b=JSON.parse(after.slice(3));}catch{return null;}
 const payload=x=>{if(!x||Object.keys(x).join(',')!=='width,height,tiles'||!Number.isInteger(x.width)||!Number.isInteger(x.height)||x.width<1||x.height<1||x.width>1024||x.height>1024||!Array.isArray(x.tiles))return false;let last=-1;return x.tiles.every(t=>{if(!Array.isArray(t)||t.length!==3||!Number.isInteger(t[0])||!Number.isInteger(t[1])||t[0]<0||t[1]<0||t[0]>=x.width||t[1]>=x.height||t[0]%64||t[1]%64||typeof t[2]!=='string')return false;const index=t[1]/64*Math.ceil(x.width/64)+t[0]/64;if(index<=last)return false;last=index;return true;});};
 if(!payload(a)||!payload(b)||before!=='T2:'+JSON.stringify(a)||after!=='T2:'+JSON.stringify(b)||a.width!==b.width||a.height!==b.height)return null;
 const key=t=>t[0]+','+t[1],old=new Map(a.tiles.map(t=>[key(t),t])),next=new Map(b.tiles.map(t=>[key(t),t])),changes=[];
 for(const [k,t]of old){const n=next.get(k);if(!n)changes.push([t[0],t[1],set(t[2])]);else if(t[2]!==n[2])changes.push([t[0],t[1],textPatch(t[2],n[2])]);}
 for(const [k,t]of next)if(!old.has(k))changes.push([t[0],t[1],null]);
 return best(['tiles',a.width,a.height,changes],before);
}
function difference(before,after,root=false){
 if(same(before,after))return null;
 if(typeof before==='string'&&typeof after==='string')return tilePatch(before,after)||textPatch(before,after);
 if(Array.isArray(before)&&Array.isArray(after)){
  if(idArray(before)&&idArray(after)){
   const old=new Map(before.map(x=>[x.id,x])),next=new Map(after.map(x=>[x.id,x])),restore=[],edits=[];
   for(const x of before){if(!next.has(x.id))restore.push(copy(x));else{const p=difference(x,next.get(x.id));if(p)edits.push([x.id,p]);}}
   return best(['ids',before.map(x=>x.id),restore,edits],before);
  }
  let start=0,end=0;while(start<before.length&&start<after.length&&same(before[start],after[start]))start++;
  while(end<before.length-start&&end<after.length-start&&same(before[before.length-1-end],after[after.length-1-end]))end++;
  return best(['splice',start,after.length-start-end,copy(before.slice(start,before.length-end))],before);
 }
 if(object(before)&&object(after)){
  const restore=[],drop=[],edits=[];
  for(const key of Object.keys(before)){if(root&&key==='revision')continue;if(!Object.hasOwn(after,key))restore.push([key,copy(before[key])]);else{const p=difference(before[key],after[key]);if(p)edits.push([key,p]);}}
  for(const key of Object.keys(after))if(!Object.hasOwn(before,key)&&(!root||key!=='revision'))drop.push(key);
  const order=Object.keys(before),reordered=JSON.stringify(order)!==JSON.stringify(Object.keys(after));
  return restore.length||drop.length||edits.length||reordered?best(['object',restore,drop,edits,reordered?order:null],before):null;
 }
 return set(before);
}
export function inverseHistory(before,after){const patch=difference(before,after,true),entry={historyPatch:1,patch:patch||['object',[],[],[]]};const legacy=before?.version===3||before?.version===4;return ownStrings(!legacy||size(entry)<size(before)?entry:patch?.[0]==='set'?patch[1]:copy(before));}
function apply(value,p){
 if(!Array.isArray(p))throw Error('Invalid history patch');
 switch(p[0]){
 case 'set':return copy(p[1]);
 case 'text':if(typeof value!=='string')throw Error('Invalid text history');return value.slice(0,p[1])+p[3]+value.slice(p[1]+p[2]);
 case 'splice':if(!Array.isArray(value))throw Error('Invalid array history');return value.slice(0,p[1]).concat(copy(p[3]),value.slice(p[1]+p[2]));
 case 'object':{
  if(!object(value))throw Error('Invalid object history');
  for(const key of p[2])delete value[key];
  for(const [key,v]of p[1])Object.defineProperty(value,key,{value:copy(v),enumerable:true,writable:true,configurable:true});
  for(const [key,edit]of p[3])Object.defineProperty(value,key,{value:apply(value[key],edit),enumerable:true,writable:true,configurable:true});
  if(p[4]){const result={};for(const key of p[4])Object.defineProperty(result,key,{value:value[key],enumerable:true,writable:true,configurable:true});return result;}
  return value;
 }
 case 'ids':{
  if(!Array.isArray(value))throw Error('Invalid entity history');const items=new Map(value.map(x=>[x.id,x]));
  for(const v of p[2])items.set(v.id,copy(v));for(const [id,edit]of p[3]){if(!items.has(id))throw Error('History entity missing');items.set(id,apply(items.get(id),edit));}
  return p[1].map(id=>{if(!items.has(id))throw Error('History entity missing');return items.get(id);});
 }
 case 'tiles':{
  if(typeof value!=='string'||!value.startsWith('T2:'))throw Error('Invalid tile history');const data=JSON.parse(value.slice(3));if(data.width!==p[1]||data.height!==p[2])throw Error('History raster dimensions changed');
  const key=(x,y)=>x+','+y,tiles=new Map(data.tiles.map(t=>[key(t[0],t[1]),t]));
  for(const [x,y,edit]of p[3]){const k=key(x,y);if(edit===null)tiles.delete(k);else tiles.set(k,[x,y,apply(tiles.get(k)?.[2],edit)]);}
  data.tiles=[...tiles.values()].sort((a,b)=>a[1]-b[1]||a[0]-b[0]);return 'T2:'+JSON.stringify(data);
 }
 default:throw Error('Invalid history patch type');
 }
}
export function restoreHistory(current,entry){
 // Accept old in-memory snapshots too; persisted boards never contain history records.
 if(entry?.version===3||entry?.version===4)return copy(entry);
 if(entry?.historyPatch!==1||Object.keys(entry).sort().join(',')!=='historyPatch,patch')throw Error('Invalid history entry');
 return apply(copy(current),entry.patch);
}
