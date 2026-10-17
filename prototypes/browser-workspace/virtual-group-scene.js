// Disposable render projection, never a document to save or edit. Collapsed groups
// replay authoritative sources: flattening arbitrary blends is not equivalent.
import {validateBoard} from './model.js';
import {validateVirtualProject} from './virtual-groups.js';
import {folderRows,layerState} from './folders.js';
export function prepareVirtualScene(project,sources){
 validateVirtualProject(project);
 const p=structuredClone(project),boards=new Map(),layers=[],folders=[],rows=[];
 let paper,activeLayer;
 for(const [i,g] of p.groups.entries()){
  const loaded=sources.get(g.boardId);
  if(!loaded||loaded.recovered)throw Error('Source unavailable or recovered; review before composing');
  const b=structuredClone(validateBoard(loaded.board));
  if(b.id!==g.boardId||b.revision!==g.sourceRevision)throw Error('Source identity or revision changed');
  if(boards.has(g.boardId))throw Error('Shared source boards require an explicit edit policy');
  if(b.reference)throw Error('Project reference composition is not yet supported');
  if(paper&&JSON.stringify(paper)!==JSON.stringify(b.paper))throw Error('Virtual groups must share one paper');
  paper=b.paper;boards.set(g.boardId,b);
  const ids=new Map();let seq=0;
  const key=id=>{if(!ids.has(id))ids.set(id,`vg${i}-${seq++}`);return ids.get(id);};
  for(const n of [...(b.folders||[]),...b.layers])key(n.id);
  const editable=g.id===p.activeGroupId&&g.visible&&!g.locked;
  rows.push({id:g.id,title:g.title,kind:'virtual-group',editable,collapsed:g.id!==p.activeGroupId});
  if(g.id===p.activeGroupId)for(const r of folderRows(b))rows.push({id:key(r.node.id),sourceId:r.node.id,groupId:g.id,kind:r.folder?'folder':'layer',depth:r.depth+1,editable:editable&&layerState(b,r.node).visible&&!layerState(b,r.node).locked});
  for(const f of b.folders||[]){const n=structuredClone(f);n.id=key(f.id);n.parentId=f.parentId===null?null:key(f.parentId);n.locked||=!editable;if(n.mask?.patch)n.mask.patch.id=key(n.mask.patch.id);folders.push(n);}
  for(const l of b.layers){const n=structuredClone(l);n.id=key(l.id);n.parentId=l.parentId?key(l.parentId):null;n.visible&&=g.visible;n.locked||=!editable;if(n.clipSource)n.clipSource=key(n.clipSource);if(n.mask?.patch)n.mask.patch.id=key(n.mask.patch.id);for(const s of n.strokes)s.id=key(s.id);layers.push(n);}
  if(g.id===p.activeGroupId)activeLayer=key(b.activeLayer);
 }
 const scene=validateBoard({version:17,id:'virtual-scene',title:p.title,revision:0,paper,layers,folders,activeLayer});
 return {board:scene,rows,activeBoard:structuredClone(boards.get(p.groups.find(g=>g.id===p.activeGroupId).boardId)),mode:'source-replay',project:p};
}
// Uses the existing renderer and caller-owned view; never resets pan/zoom or writes storage.
export function renderVirtualScene(renderer,prepared,view,live=null){
 const active=prepared.project.groups.find(g=>g.id===prepared.project.activeGroupId);
 if(live&&(!active.visible||active.locked))throw Error('Active virtual group is not editable');
 return renderer.render(prepared.board,view,live);
}
