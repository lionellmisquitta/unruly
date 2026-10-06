import {limits,validateBoard,migrateV1,migrateV2} from './model.js';
const request=r=>new Promise((ok,no)=>{r.onblocked=()=>no(Error('Storage is busy in another tab'));r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});
const completed=tx=>new Promise((ok,no)=>{tx.oncomplete=()=>ok();tx.onabort=()=>no(tx.error||Error('Storage transaction aborted'));tx.onerror=()=>{};});
const sourceKey=(source,id)=>JSON.stringify([source,id]);
const sources=['unruly-workspace','unruly-foundation'];
export async function openStore(){
 const r=indexedDB.open('unruly-workspace-v3',1);r.onupgradeneeded=()=>{for(const name of ['boards','migrations'])r.result.createObjectStore(name,{keyPath:name==='boards'?'id':'key'});r.result.createObjectStore('meta');};const db=await request(r);
 const read=(store,key)=>request(db.transaction(store).objectStore(store).get(key));
 const list=()=>request(db.transaction('boards').objectStore('boards').getAll());
 async function load(id){const record=await read('boards',id);if(!record)throw Error('Saved board missing; stored data preserved');if(!Number.isSafeInteger(record.dbRevision)||record.dbRevision<1)throw Error('Invalid stored revision');let board,recovered=false;const checked=b=>{validateBoard(b);if(b.id!==record.id)throw Error('Stored identity mismatch');return b;};try{board=checked(record.current);}catch{try{board=checked(record.previous);recovered=true;}catch{throw Error('Damaged board; original data preserved');}}return {board:structuredClone(board),dbRevision:record.dbRevision,recovered};}
 function save(board,expectedRevision,select=true){const snapshot=structuredClone(validateBoard(board));if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0)throw Error('Invalid expected revision');return new Promise((ok,no)=>{const tx=db.transaction(['boards','meta'],'readwrite'),store=tx.objectStore('boards');let problem;const abort=e=>{problem=e;try{tx.abort();}catch{no(e);}};tx.oncomplete=()=>ok(expectedRevision+1);tx.onabort=()=>no(problem||tx.error||Error('Save aborted'));tx.onerror=()=>{};
 const get=store.get(snapshot.id);get.onsuccess=()=>{const old=get.result;if((old?old.dbRevision:0)!==expectedRevision){abort(Error('Conflict: another tab saved this board. Export your work before reopening.'));return;}const put=()=>{try{let previous=null;if(old){const checked=b=>{validateBoard(b);if(b.id!==old.id)throw Error('Stored identity mismatch');return structuredClone(b);};try{previous=checked(old.current);}catch{try{previous=checked(old.previous);}catch{abort(Error('Damaged original record; export your work'));return;}}}store.put({id:snapshot.id,dbRevision:expectedRevision+1,current:snapshot,previous});if(select)tx.objectStore('meta').put(snapshot.id,'lastBoard');}catch(e){abort(e);}};if(old)put();else{const count=store.count();count.onsuccess=()=>count.result>=limits.boards?abort(Error('Board limit reached')):put();}};});}
 async function snapshotSource(name){let legacy;try{
  if(indexedDB.databases){const names=await indexedDB.databases();if(!names.some(d=>d.name===name))return null;}
  const probe=indexedDB.open(name);let absent=false;probe.onupgradeneeded=()=>{absent=true;probe.transaction.abort();};try{legacy=await request(probe);}catch(e){if(absent)return null;throw e;}
  if(legacy.version!==1||!legacy.objectStoreNames.contains('boards'))throw Error('Unsupported source storage schema');
  const names=legacy.objectStoreNames.contains('meta')?['boards','meta']:['boards'];const tx=legacy.transaction(names,'readonly'),done=completed(tx);
  const values=await Promise.all([request(tx.objectStore('boards').getAll()),names.includes('meta')?request(tx.objectStore('meta').get('lastBoard')):Promise.resolve(undefined),done]);
  return {source:name,records:values[0],last:values[1]};
 }finally{legacy?.close();}}
 function convertRecord(source,record){
  if(!record||typeof record.id!=='string'||!record.id||record.id.length>128||!Number.isSafeInteger(record.dbRevision)||record.dbRevision<1)throw Error('Invalid source identity or stored revision');
  const convert=value=>{if(value?.version!==(source==='unruly-workspace'?2:1))throw Error('Invalid source document version');const b=source==='unruly-workspace'?migrateV2(value):migrateV1(value,record.dbRevision);if(b.id!==record.id)throw Error('Source identity mismatch');return structuredClone(b);};
  let current,previous=null,recovered=false;try{current=convert(record.current);}catch{try{current=convert(record.previous);recovered=true;}catch{throw Error('Damaged source board; export/recover original data');}}
  if(!recovered){try{previous=convert(record.previous);}catch{}}
  return {current,previous,recovered};
 }
 // Target snapshot and all completion identities commit together. The write lock
 // also makes concurrent migration calls converge on the first completed map.
 function copySource(source,record,converted,aliases=[]){return new Promise((ok,no)=>{
  const tx=db.transaction(['boards','migrations'],'readwrite'),boards=tx.objectStore('boards'),maps=tx.objectStore('migrations');let problem,out;
  const abort=e=>{problem=e;try{tx.abort();}catch{no(e);}};tx.oncomplete=()=>ok(out);tx.onabort=()=>no(problem||tx.error||Error('Migration copy aborted'));tx.onerror=()=>{};
  const key=sourceKey(source,record.id),get=maps.get(key);get.onsuccess=()=>{try{
   if(get.result){const map=get.result;if(map.completed!==true||typeof map.targetID!=='string'){abort(Error('Invalid migration map; original data preserved'));return;}const target=boards.get(map.targetID);target.onsuccess=()=>{if(!target.result){abort(Error('Copied target missing; completed mapping preserved'));return;}out={copied:false,map};};return;}
   const create=()=>{const count=boards.count();count.onsuccess=()=>{if(count.result>=limits.boards){abort(Error('Board limit reached'));return;}const probe=id=>{const existing=boards.get(id);existing.onsuccess=()=>{if(existing.result){probe(crypto.randomUUID());return;}try{
    const current=structuredClone(converted.current),previous=converted.previous?structuredClone(converted.previous):null;current.id=id;if(previous)previous.id=id;validateBoard(current);if(previous)validateBoard(previous);
    boards.put({id,dbRevision:1,current,previous});
    const mapFor=(namespace,original)=>({key:sourceKey(namespace,original.id),source:namespace,sourceBoardID:original.id,sourceRevision:namespace===source?current.revision:(Number.isSafeInteger(original.current?.revision)?original.current.revision:null),sourceDbRevision:original.dbRevision??null,targetID:id,completed:true,completedIdentity:{id,revision:current.revision,dbRevision:1},recovered:converted.recovered,fallback:aliases.length>0});
    const map=mapFor(source,record);maps.put(map);for(const alias of aliases)maps.put(mapFor(alias.source,alias.record));out={copied:true,map};
   }catch(e){abort(e);}};};probe(record.id);};};
   const guard=i=>{if(i===aliases.length){create();return;}const alias=aliases[i],check=maps.get(sourceKey(alias.source,alias.record.id));check.onsuccess=()=>{if(!check.result){guard(i+1);return;}const map=check.result;if(map.completed!==true||typeof map.targetID!=='string'){abort(Error('Invalid migration map; original data preserved'));return;}const target=boards.get(map.targetID);target.onsuccess=()=>{if(!target.result){abort(Error('Copied target missing; completed mapping preserved'));return;}out={copied:false,map};};};};guard(0);
  }catch(e){abort(e);}};
 });}
 async function migrateLegacy(){
  const result={copied:0,skipped:0,errors:[],warnings:[],recovered:0,failedSources:[],mappings:[],hadSources:false};const snapshots=[];
  for(const source of sources){try{const snapshot=await snapshotSource(source);if(snapshot){snapshots.push(snapshot);result.hadSources=result.hadSources||snapshot.records.length>0;}}catch(e){result.hadSources=true;result.errors.push({source,message:e.message});}}
  const workspace=snapshots.find(s=>s.source===sources[0]),foundation=snapshots.find(s=>s.source===sources[1]),validWorkspace=new Set(),damagedWorkspace=new Map();
  const fail=(source,record,e)=>{const failure={source,id:record?.id,message:e.message};result.errors.push(failure);result.failedSources.push(failure);};
  const note=map=>{result.mappings.push(map);if(map.recovered){result.recovered++;result.warnings.push({source:map.source,id:map.sourceBoardID,message:'Recovered previous source version; newer edits may not be recovered'});}if(map.fallback)result.warnings.push({source:map.source,id:map.sourceBoardID,message:'Older foundation board recovered; newer v2 edits were not recovered'});};
  const existing=async(source,record)=>{const map=await read('migrations',sourceKey(source,record.id));if(!map)return false;if(map.completed!==true||typeof map.targetID!=='string'||!await read('boards',map.targetID))throw Error('Completed migration target missing or invalid; mapping and sources preserved');result.skipped++;note(map);return true;};
  const copy=async(source,record,converted,aliases=[])=>{try{const outcome=await copySource(source,record,converted,aliases);result[outcome.copied?'copied':'skipped']++;note(outcome.map);return true;}catch(e){fail(source,record,e);return false;}};
  for(const record of workspace?.records||[]){try{if(await existing(sources[0],record)){validWorkspace.add(record.id);continue;}}catch(e){validWorkspace.add(record.id);fail(sources[0],record,e);continue;}try{const converted=convertRecord(sources[0],record);validWorkspace.add(record.id);await copy(sources[0],record,converted);}catch(e){damagedWorkspace.set(record.id,{record,error:e});}}
  for(const record of foundation?.records||[]){if(validWorkspace.has(record.id)){result.skipped++;continue;}try{if(await existing(sources[1],record))continue;const converted=convertRecord(sources[1],record),damaged=damagedWorkspace.get(record.id);const success=await copy(sources[1],record,converted,damaged?[{source:sources[0],record:damaged.record}]:[]);if(success&&damaged)damagedWorkspace.delete(record.id);}catch(e){fail(sources[1],record,e);}}
  for(const {record,error} of damagedWorkspace.values())fail(sources[0],record,error);
  // Preserve an existing v3 selection. Old selection is resolved exclusively via
  // completed mappings whose target exists; an incomplete source stays visible.
  if(!await read('meta','lastBoard')){for(const snapshot of snapshots){if(!snapshot.last)continue;let map=await read('migrations',sourceKey(snapshot.source,snapshot.last));if(!map&&snapshot.source===sources[1]&&validWorkspace.has(snapshot.last))map=await read('migrations',sourceKey(sources[0],snapshot.last));if(map?.completed&&await read('boards',map.targetID)){try{await selectIfUnset(map.targetID);}catch(e){result.errors.push({source:snapshot.source,id:snapshot.last,message:'Copied board preserved, but selected-board save failed: '+e.message});}break;}result.warnings.push({source:snapshot.source,id:snapshot.last,message:'Last selected source board could not be restored; originals preserved'});}}
  return result;
 }
 function selectIfUnset(id){return new Promise((ok,no)=>{const tx=db.transaction(['meta','boards'],'readwrite');tx.oncomplete=()=>ok();tx.onabort=()=>no(tx.error||Error('Selection save aborted'));tx.onerror=()=>{};const meta=tx.objectStore('meta'),last=meta.get('lastBoard');last.onsuccess=()=>{if(last.result)return;const target=tx.objectStore('boards').get(id);target.onsuccess=()=>{if(target.result)meta.put(id,'lastBoard');};};});}
 const select=id=>new Promise((ok,no)=>{const tx=db.transaction('meta','readwrite');tx.oncomplete=()=>ok();tx.onabort=()=>no(tx.error||Error('Selection save aborted'));tx.onerror=()=>{};try{tx.objectStore('meta').put(id,'lastBoard');}catch(e){try{tx.abort();}catch{}no(e);}});
 return {db,list,load,save,migrateLegacy,select,last:()=>read('meta','lastBoard'),close:()=>db.close()};
}
