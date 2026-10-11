// Pass-through folder hierarchy. No pixel buffers, flattening or group opacity.
export const folderLimits=Object.freeze({count:16,depth:8});
const fail=m=>{throw Error(m);}, parent=n=>n.parentId??null;
export function ancestors(board,node){const result=[],map=new Map((board.folders||[]).map(f=>[f.id,f]));let id=parent(node);while(id!==null){if(result.length>=folderLimits.depth||result.some(f=>f.id===id)||!map.has(id))fail('Invalid folder ancestry');const f=map.get(id);result.push(f);id=parent(f);}return result;}
export const layerState=(b,l)=>({visible:l.visible&&ancestors(b,l).every(f=>f.visible),locked:l.locked||ancestors(b,l).some(f=>f.locked)});
export const folderLayers=(b,id)=>b.layers.filter(l=>ancestors(b,l).some(f=>f.id===id));
export function validateFolders(b,used){
 if(b.version!==5){if(Object.hasOwn(b,'folders')||b.layers.some(l=>Object.hasOwn(l,'parentId')))fail('Folders require document v5');return;}
 if(!Array.isArray(b.folders)||b.folders.length>folderLimits.count)fail('Folder limit or invalid folders');
 for(const f of b.folders){if(!f||typeof f.id!=='string'||!f.id||f.id.length>128||used.has(f.id)||typeof f.name!=='string'||!f.name.trim()||f.name.length>64||typeof f.visible!=='boolean'||typeof f.locked!=='boolean'||!Object.hasOwn(f,'parentId')||!(f.parentId===null||typeof f.parentId==='string'))fail('Invalid folder');used.add(f.id);}
 for(const n of [...b.folders,...b.layers]){if(Object.hasOwn(n,'parentId')&&!(n.parentId===null||typeof n.parentId==='string'))fail('Invalid folder parent');ancestors(b,n);}
 for(const f of b.folders){const indices=folderLayers(b,f.id).map(l=>b.layers.indexOf(l));if(indices.length&&indices.at(-1)-indices[0]+1!==indices.length)fail('Folder layers must remain adjacent');}
}
const cache=new WeakMap();
export function renderBoard(board){if(!board.folders?.length)return board;if(cache.has(board))return cache.get(board);const adapted={...board,layers:board.layers.map(l=>{const s=layerState(board,l);return s.visible===l.visible?l:{...l,visible:s.visible};})};cache.set(board,adapted);return adapted;}
export function folderRows(b,collapsed=new Set()){
 const rows=[];const emit=(pid,depth)=>{const leaves=b.layers.filter(l=>parent(l)===pid),groups=(b.folders||[]).filter(f=>parent(f)===pid);const entries=[...leaves,...groups].sort((a,z)=>{const pos=n=>b.layers.includes(n)?b.layers.indexOf(n):Math.max(-1,...folderLayers(b,n.id).map(l=>b.layers.indexOf(l)));return pos(z)-pos(a);});for(const n of entries){const folder=groups.includes(n);rows.push({node:n,folder,depth});if(folder&&!collapsed.has(n.id))emit(n.id,depth+1);}};emit(null,0);return rows;
}
function writable(b,n){if(n.locked||ancestors(b,n).some(f=>f.locked))fail('Layer or folder is locked');}
function moveBlock(b,n,target){
 writable(b,n);if(target!==null&&!b.folders.some(f=>f.id===target))fail('Folder missing');
 const destination=target===null?null:b.folders.find(f=>f.id===target);if(destination)writable(b,destination);
 if(destination&&(destination.id===n.id||ancestors(b,destination).some(f=>f.id===n.id)))fail('Cannot nest a folder inside itself');
 if(parent(n)===target)return;
 const moving=b.layers.includes(n)?[n]:folderLayers(b,n.id),stay=b.layers.filter(l=>!moving.includes(l));n.parentId=target;
 let siblings=destination?stay.filter(l=>ancestors(b,l).some(f=>f.id===target)):stay;if(destination&&!siblings.length){for(const f of ancestors(b,destination)){siblings=stay.filter(l=>ancestors(b,l).some(a=>a.id===f.id));if(siblings.length)break;}}
 const at=siblings.length?stay.indexOf(siblings.at(-1))+1:stay.length;stay.splice(at,0,...moving);b.layers=stay;
}
export function mutateFolder(b,action,id,value){
 if(action==='group'){
  const ids=value;if(!Array.isArray(ids)||!ids.length||new Set(ids).size!==ids.length)fail('Select layers to group');
  const layers=b.layers.filter(l=>ids.includes(l.id));if(layers.length!==ids.length)fail('Selected layers missing');if(layers.some(l=>parent(l)!==parent(layers[0])))fail('Group layers from the same folder');for(const l of layers)writable(b,l);
  if((b.folders||[]).length>=folderLimits.count)fail('Folder limit reached');b.version=5;b.folders=b.folders||[];
  const f={id:crypto.randomUUID(),name:'Folder '+(b.folders.length+1),parentId:parent(layers[0]),visible:true,locked:false};b.folders.push(f);
  const top=b.layers.indexOf(layers.at(-1)),stay=b.layers.filter(l=>!layers.includes(l)),at=b.layers.slice(0,top+1).filter(l=>!layers.includes(l)).length;stay.splice(at,0,...layers);b.layers=stay;for(const l of layers)l.parentId=f.id;return f.id;
 }
 const f=(b.folders||[]).find(f=>f.id===id);
 if(action==='move'){const n=f||b.layers.find(l=>l.id===id);if(!n)fail('Layer or folder missing');moveBlock(b,n,value);return;}
 if(!f)fail('Folder missing');
 if(action==='locked'){if(ancestors(b,f).some(x=>x.locked))fail('Parent folder is locked');f.locked=value;return;}
 writable(b,f);
 if(action==='name'){f.name=value;return;}
 if(action==='visible'){f.visible=value;return;}
 if(action==='ungroup'){if(folderLayers(b,f.id).some(l=>layerState(b,l).locked)||b.folders.some(x=>ancestors(b,x).some(a=>a.id===f.id)&&x.locked))fail('Unlock folder contents first');for(const n of [...b.layers,...b.folders])if(parent(n)===id)n.parentId=parent(f);b.folders=b.folders.filter(x=>x!==f);return;}
 if(action==='up'||action==='down'){
  const entries=folderRows(b).filter(x=>parent(x.node)===parent(f)).map(x=>x.node).reverse(),i=entries.indexOf(f),j=i+(action==='up'?1:-1);if(j<0||j>=entries.length)return;const other=entries[j];writable(b,other);const a=folderLayers(b,id),z=b.layers.includes(other)?[other]:folderLayers(b,other.id);if(!a.length||!z.length)return;const start=Math.min(b.layers.indexOf(a[0]),b.layers.indexOf(z[0]));b.layers=b.layers.filter(l=>!a.includes(l)&&!z.includes(l));b.layers.splice(start,0,...(action==='up'?[...z,...a]:[...a,...z]));return;
 }
 fail('Unknown folder action');
}
