// Project metadata and native sources share one existing boards/meta transaction.
// No schema upgrade, source flattening, or changes to standalone board storage.
import {validateBoard,importDocument,limits} from './model.js';
import {validateVirtualProject} from './virtual-groups.js';
import {prepareVirtualScene} from './virtual-group-scene.js';
const prefix='virtual-project:',lastKey='lastVirtualProject';
const req=q=>new Promise((ok,no)=>{q.onsuccess=()=>ok(q.result);q.onerror=()=>no(q.error);});
const validView=v=>v&&Number.isFinite(v.x)&&Number.isFinite(v.y)&&Number.isFinite(v.scale)&&v.scale>=.05&&v.scale<=20;
export function projectFromBoard(board){
 const source=importDocument(JSON.stringify(validateBoard(board)));source.title=board.title;
 const id=crypto.randomUUID(),group={id:crypto.randomUUID(),title:source.title||'Group 1',boardId:source.id,sourceRevision:source.revision,visible:true,locked:false};
 const project={version:1,id,title:board.title||'Untitled artwork',activeGroupId:group.id,groups:[group]};
 prepareVirtualScene(project,new Map([[source.id,{board:source}]]));return {project,sources:[source]};
}
export function encodeProject(project,sources){
 prepareVirtualScene(project,sources);return JSON.stringify({format:'unruly-virtual-project',version:1,project,sources:[...sources.values()].map(r=>r.board)});
}
export function decodeProject(text){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>limits.bytes+65536)throw Error('Project backup exceeds limit');
 const p=JSON.parse(text);if(p.format!=='unruly-virtual-project'||p.version!==1||!Array.isArray(p.sources))throw Error('Invalid project backup');
 validateVirtualProject(p.project);if(p.sources.length!==p.project.groups.length)throw Error('Project backup sources mismatch');
 const sourceMap=new Map(p.sources.map(board=>[board.id,{board}]));prepareVirtualScene(p.project,sourceMap);
 const project=structuredClone(p.project);project.id=crypto.randomUUID();const sources=[];
 for(const g of project.groups){const b=importDocument(JSON.stringify(sourceMap.get(g.boardId).board));g.id=crypto.randomUUID();if(g.boardId===p.project.groups.find(x=>x.id===p.project.activeGroupId).boardId)project.activeGroupId=g.id;g.boardId=b.id;g.sourceRevision=b.revision;delete g.snapshot;sources.push(b);}
 prepareVirtualScene(project,new Map(sources.map(board=>[board.id,{board}])));return {project,sources};
}
export function virtualProjectStore(store){
 const read=(name,key)=>req(store.db.transaction(name).objectStore(name).get(key));
 async function list(){const t=store.db.transaction('meta'),s=t.objectStore('meta');const [keys,values]=await Promise.all([req(s.getAllKeys()),req(s.getAll())]);return values.filter((v,i)=>typeof keys[i]==='string'&&keys[i].startsWith(prefix)).map(r=>({id:r.id,title:r.current?.title||'Damaged project',sourceIds:Array.isArray(r.current?.groups)?r.current.groups.map(g=>g.boardId):[]}));}
 async function load(id){
  // Read metadata and every native record in one snapshot, not separate store.load calls.
  const record=await read('meta',prefix+id);if(!record)throw Error('Project missing; source boards preserved');if(record.id!==id||!Number.isSafeInteger(record.revision)||record.revision<1||record.current?.id!==id)throw Error('Invalid project record; source boards preserved');validateVirtualProject(record.current);
  const tx=store.db.transaction(['boards','meta']),meta=tx.objectStore('meta'),boards=tx.objectStore('boards');
  const [current,records]=await Promise.all([req(meta.get(prefix+id)),Promise.all(record.current.groups.map(g=>req(boards.get(g.boardId))))]);
  if(!current||current.revision!==record.revision)throw Error('Project changed while opening; retry');
  const sources=new Map();for(let i=0;i<records.length;i++){const r=records[i],g=current.current.groups[i];if(!r||r.id!==g.boardId||!Number.isSafeInteger(r.dbRevision)||r.dbRevision<1)throw Error('Source board missing or invalid; originals preserved');try{validateBoard(r.current);}catch{throw Error('Source needs recovery; export its native backup from Gallery');}sources.set(g.boardId,{board:r.current,dbRevision:r.dbRevision,recovered:false});}
  prepareVirtualScene(current.current,sources);return {project:structuredClone(current.current),revision:current.revision,sources,view:validView(current.view)?current.view:{x:0,y:0,scale:1}};
 }
 function commit(project,expected,updates=[],view={x:0,y:0,scale:1}){
  const p=structuredClone(validateVirtualProject(project));if(!Number.isSafeInteger(expected)||expected<0||!validView(view))throw Error('Invalid project revision or view');
  const changes=new Map();for(const u of updates){validateBoard(u.board);if(changes.has(u.board.id)||!Number.isSafeInteger(u.expected)||u.expected<0||!p.groups.some(g=>g.boardId===u.board.id))throw Error('Invalid source update');changes.set(u.board.id,structuredClone(u));}
  return new Promise((ok,no)=>{const tx=store.db.transaction(['boards','meta'],'readwrite'),boards=tx.objectStore('boards'),meta=tx.objectStore('meta'),records=new Map();let old,count,remaining=p.groups.length+2,problem;
   const abort=e=>{problem=e;tx.abort();};tx.oncomplete=()=>ok(expected+1);tx.onabort=()=>no(problem||tx.error||Error('Project save aborted'));tx.onerror=()=>{};
   const ready=()=>{if(--remaining)return;try{
    if((old?.revision||0)!==expected)throw Error('Project conflict: reopen or export your work');
    if(old)validateVirtualProject(old.current);
    const sources=new Map();let added=0;
    for(const g of p.groups){const r=records.get(g.boardId),u=changes.get(g.boardId);if(u){if((r?.dbRevision||0)!==u.expected)throw Error('Source conflict: export your work before reopening');if(r){validateBoard(r.current);const prior=old?.current.groups.find(x=>x.boardId===g.boardId);if(!prior||prior.sourceRevision!==r.current.revision)throw Error('Source revision changed outside project');}else added++;sources.set(g.boardId,{board:u.board});}else{if(!r)throw Error('Source missing; active project unchanged');validateBoard(r.current);sources.set(g.boardId,{board:r.current});}}
    if(count+added>limits.boards)throw Error('Board limit reached');prepareVirtualScene(p,sources);
    for(const [id,u] of changes){const r=records.get(id);boards.put({id,dbRevision:u.expected+1,current:u.board,previous:r?structuredClone(r.current):null});}
    meta.put({id:p.id,revision:expected+1,current:p,previous:old?.current||null,view:structuredClone(view)},prefix+p.id);meta.put(p.id,lastKey);meta.put(p.groups.find(g=>g.id===p.activeGroupId).boardId,'lastBoard');
   }catch(e){abort(e);}};
   const previous=meta.get(prefix+p.id);previous.onsuccess=()=>{old=previous.result;ready();};const total=boards.count();total.onsuccess=()=>{count=total.result;ready();};
   for(const g of p.groups){const q=boards.get(g.boardId);q.onsuccess=()=>{records.set(g.boardId,q.result);ready();};}
  });
 }
 async function leave(){await new Promise((ok,no)=>{const tx=store.db.transaction('meta','readwrite');tx.objectStore('meta').delete(lastKey);tx.oncomplete=ok;tx.onabort=()=>no(tx.error);});}
 return {list,load,commit,leave,last:()=>read('meta',lastKey)};
}
