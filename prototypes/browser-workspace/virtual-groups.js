// CHAIN1: additive virtual-group contract. No rendering or storage side effects.
// Source boards remain authoritative; snapshots are visual caches, never editable source.
const fail=m=>{throw Error(m);};
const id=x=>typeof x==='string'&&x.length>0&&x.length<=128;
const natural=x=>Number.isSafeInteger(x)&&x>=0;
const bytes=x=>new TextEncoder().encode(JSON.stringify(x)).length;
export const groupLimits=Object.freeze({groups:24,snapshotBytes:8*1024*1024,manifestBytes:64*1024});
export function validateVirtualProject(project){
 if(!project||project.version!==1||!id(project.id)||!id(project.title)||!Array.isArray(project.groups)||!project.groups.length||project.groups.length>groupLimits.groups||!id(project.activeGroupId))fail('Invalid virtual project');
 const seen=new Set();let active=false;
 for(const g of project.groups){
  if(!g||!id(g.id)||seen.has(g.id)||!id(g.title)||!id(g.boardId)||!natural(g.sourceRevision)||typeof g.visible!=='boolean'||typeof g.locked!=='boolean')fail('Invalid virtual group');
  seen.add(g.id);active ||=g.id===project.activeGroupId;
  if(g.snapshot!=null){const s=g.snapshot;if(!s||!id(s.assetId)||!natural(s.sourceRevision)||s.sourceRevision>g.sourceRevision||!natural(s.width)||s.width===0||s.width>8192||!natural(s.height)||s.height===0||s.height>8192||!natural(s.bytes)||s.bytes>groupLimits.snapshotBytes)fail('Invalid group snapshot');}
 }
 if(!active||bytes(project)>groupLimits.manifestBytes)fail('Invalid active group or project size');
 return project;
}
export const activeVirtualGroup=p=>validateVirtualProject(p).groups.find(g=>g.id===p.activeGroupId);
export function activateVirtualGroup(project,groupId){
 validateVirtualProject(project);if(!id(groupId)||!project.groups.some(g=>g.id===groupId))fail('Missing virtual group');
 // No source writes or canvas view mutation: caller must preserve zoom/pan and save atomically.
 return validateVirtualProject({...project,activeGroupId:groupId});
}
export function sourceChanged(project,groupId,nextRevision){
 validateVirtualProject(project);const target=project.groups.find(g=>g.id===groupId);
 if(!target||!natural(nextRevision)||nextRevision<=target.sourceRevision)fail('Invalid source revision');
 return validateVirtualProject({...project,groups:project.groups.map(g=>g.id===groupId?{...g,sourceRevision:nextRevision}:g)});
}
export function snapshotState(group){
 if(!group?.snapshot)return 'missing';
 return group.snapshot.sourceRevision===group.sourceRevision?'current':'stale';
}
export function commitSnapshot(project,groupId,snapshot){
 validateVirtualProject(project);const g=project.groups.find(x=>x.id===groupId);
 if(!g||!snapshot||snapshot.sourceRevision!==g.sourceRevision)fail('Stale snapshot commit');
 return validateVirtualProject({...project,groups:project.groups.map(x=>x.id===groupId?{...x,snapshot:{...snapshot}}:x)});
}
export function compositingPlan(project){
 validateVirtualProject(project);
 return project.groups.filter(g=>g.visible).map(g=>({id:g.id,boardId:g.boardId,mode:g.id===project.activeGroupId?'editable':'proxy',snapshot:snapshotState(g),sourceRevision:g.sourceRevision}));
}
