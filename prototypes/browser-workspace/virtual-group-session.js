// CHAIN1-B: bounded activation adapter. Source boards remain owned by existing storage.
import {validateVirtualProject,activateVirtualGroup,snapshotState} from './virtual-groups.js';
// Load before switching. No autosave, renderer change, silent source replacement or viewport reset.
export async function prepareVirtualGroupSwitch(project,targetId,loadBoard){
 validateVirtualProject(project);
 if(typeof loadBoard!=='function')throw Error('Board loader required');
 const next=activateVirtualGroup(project,targetId);
 const group=next.groups.find(g=>g.id===targetId);
 let loaded;
 try{loaded=await loadBoard(group.boardId);}catch{throw Error('Source board unavailable; active group unchanged');}
 if(!loaded||!loaded.board||loaded.board.id!==group.boardId||!Number.isSafeInteger(loaded.board.revision)||loaded.board.revision<0)throw Error('Source board identity invalid; active group unchanged');
 if(loaded.board.revision!==group.sourceRevision)throw Error('Source board revision changed; refresh project before switching');
 if(loaded.recovered)throw Error('Recovered source revision needs review before switching');
 return {project:next,board:loaded.board,dbRevision:loaded.dbRevision,visualStatus:snapshotState(group)};
}
// Caller replaces active view only after successfully persisting pending edits and confirming
// the returned result still matches the current project generation. No side effects here.
export function assertSwitchStillCurrent(original,prepared){
 validateVirtualProject(original);validateVirtualProject(prepared?.project);
 if(original.id!==prepared.project.id||original.groups.length!==prepared.project.groups.length||
    original.groups.some((g,i)=>g.id!==prepared.project.groups[i].id||g.boardId!==prepared.project.groups[i].boardId||g.sourceRevision!==prepared.project.groups[i].sourceRevision))throw Error('Project changed during switch; do not apply stale result');
 return true;
}
