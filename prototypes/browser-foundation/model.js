export const limits = Object.freeze({boards:100,strokes:2000,points:100000,bytes:8*1024*1024});
const finite = n => typeof n==='number' && Number.isFinite(n);
export function validateBoard(b) {
  if(!b || b.version!==1 || typeof b.id!=='string' || !/^[a-zA-Z0-9-]{1,80}$/.test(b.id) || typeof b.title!=='string' || b.title.length>128 || !Number.isSafeInteger(b.revision) || b.revision<0 || !Array.isArray(b.strokes) || b.strokes.length>limits.strokes) throw Error('Invalid board header');
  let count=0;const ids=new Set();
  for(const s of b.strokes){
    if(!s || typeof s.id!=='string' || ids.has(s.id) || !/^#[0-9a-f]{6}$/i.test(s.color) || !finite(s.size) || s.size<1 || s.size>40 || !Array.isArray(s.points) || !s.points.length) throw Error('Invalid stroke');
    ids.add(s.id);count+=s.points.length;if(count>limits.points)throw Error('Point limit reached');
    for(const p of s.points)if(!p || !finite(p.x) || !finite(p.y) || Math.abs(p.x)>1e7 || Math.abs(p.y)>1e7 || !(p.pressure===null || finite(p.pressure)&&p.pressure>=0&&p.pressure<=1))throw Error('Invalid point');
  }
  if(new TextEncoder().encode(JSON.stringify(b)).length>limits.bytes)throw Error('Board size limit reached');
  return b;
}
export function createBoard(id,title='Untitled board'){return validateBoard({version:1,id,title,revision:0,strokes:[]});}
export function createHistory(board){validateBoard(board);return {board,past:[],future:[]};}
function transition(h,strokes){const next={...h.board,revision:h.board.revision+1,strokes};validateBoard(next);return {board:next,past:[...h.past,h.board.strokes].slice(-100),future:[]};}
export function addStroke(h,stroke){return transition(h,[...h.board.strokes,structuredClone(stroke)]);}
export function eraseStroke(h,id){return h.board.strokes.some(s=>s.id===id)?transition(h,h.board.strokes.filter(s=>s.id!==id)):h;}
export function undo(h){if(!h.past.length)return h;return {board:{...h.board,revision:h.board.revision+1,strokes:h.past.at(-1)},past:h.past.slice(0,-1),future:[...h.future,h.board.strokes]};}
export function redo(h){if(!h.future.length)return h;return {board:{...h.board,revision:h.board.revision+1,strokes:h.future.at(-1)},past:[...h.past,h.board.strokes].slice(-100),future:h.future.slice(0,-1)};}
export function toDocument(x,y,v){return {x:(x-v.x)/v.scale,y:(y-v.y)/v.scale};}
export function zoomAt(v,x,y,factor){if(![v.x,v.y,v.scale,x,y,factor].every(finite)||v.scale<=0||factor<=0)throw Error('Invalid view');const p=toDocument(x,y,v);const scale=Math.min(16,Math.max(.05,v.scale*factor));return {x:x-p.x*scale,y:y-p.y*scale,scale};}
