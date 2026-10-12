// Editable selection paths are bounded page state; never document strokes.
export const pathLimits=Object.freeze({anchors:64,polygon:512,history:50,tolerance:.25,depth:12});
const clone=x=>structuredClone(x),point=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Math.max(Math.abs(p.x),Math.abs(p.y))<=1e7;
export function validatePath(nodes){if(!Array.isArray(nodes)||nodes.length>pathLimits.anchors||nodes.some(n=>!point(n)||n.in&&!point(n.in)||n.out&&!point(n.out)))throw Error('Path needs finite points and at most 64 anchors');return nodes;}
export function addAnchor(nodes,p){validatePath(nodes);if(!point(p))throw Error('Invalid path point');if(nodes.length>=pathLimits.anchors)throw Error('Path anchor limit · remove a point first');return [...clone(nodes),{x:p.x,y:p.y}];}
export function moveAnchor(nodes,index,p){validatePath(nodes);if(!nodes[index]||!point(p))throw Error('Invalid path anchor');const out=clone(nodes),n=out[index],dx=p.x-n.x,dy=p.y-n.y;n.x=p.x;n.y=p.y;for(const key of ['in','out'])if(n[key])n[key]={x:n[key].x+dx,y:n[key].y+dy};return validatePath(out);}
export function curveAnchor(nodes,index,p){validatePath(nodes);if(!nodes[index]||!point(p))throw Error('Invalid curve handle');const out=clone(nodes),n=out[index];n.out={x:p.x,y:p.y};n.in={x:2*n.x-p.x,y:2*n.y-p.y};return validatePath(out);}
export function moveHandle(nodes,index,key,p){validatePath(nodes);if(!nodes[index]||!['in','out'].includes(key)||!point(p))throw Error('Invalid curve handle');const out=clone(nodes);out[index][key]={x:p.x,y:p.y};return out;}
export function cornerAnchor(nodes,index){validatePath(nodes);if(!nodes[index])throw Error('Choose a path point');const out=clone(nodes);delete out[index].in;delete out[index].out;return out;}
export function removeAnchor(nodes,index){validatePath(nodes);if(!nodes[index])throw Error('Choose a path point');return clone(nodes).filter((_,i)=>i!==index);}
const mid=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,len=dx*dx+dy*dy,t=len?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/len)):0;return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
export function flattenPath(nodes,{closed=true,tolerance=pathLimits.tolerance}={}){
 validatePath(nodes);if(nodes.length<(closed?3:2))throw Error('Place at least 3 points before closing');if(!Number.isFinite(tolerance)||tolerance<=0||tolerance>1)throw Error('Invalid path precision');
 const out=[{x:nodes[0].x,y:nodes[0].y}];let work=0;
 function curve(a,b,c,d,depth){if(++work>8192)throw Error('Path work limit · simplify the outline');if(Math.max(segmentDistance(b,a,d),segmentDistance(c,a,d))<=tolerance){out.push({x:d.x,y:d.y});if(out.length>pathLimits.polygon+(closed?1:0))throw Error('Path detail limit · simplify curve handles');return;}if(depth>=pathLimits.depth)throw Error('Path detail limit · simplify curve handles');const ab=mid(a,b),bc=mid(b,c),cd=mid(c,d),abc=mid(ab,bc),bcd=mid(bc,cd),m=mid(abc,bcd);curve(a,ab,abc,m,depth+1);curve(m,bcd,cd,d,depth+1);}
 for(let i=0;i<nodes.length-(closed?0:1);i++){const a=nodes[i],b=nodes[(i+1)%nodes.length];curve(a,a.out||a,b.in||b,b,0);}
 if(closed)out.pop();return out;
}
export function pathSVG(nodes,view={x:0,y:0,scale:1},closed=false){validatePath(nodes);if(!nodes.length)return '';const p=q=>(q.x*view.scale+view.x)+','+(q.y*view.scale+view.y);let d='M'+p(nodes[0]);for(let i=0;i<nodes.length-(closed?0:1);i++){const a=nodes[i],b=nodes[(i+1)%nodes.length];d+='C'+p(a.out||a)+' '+p(b.in||b)+' '+p(b);}return d+(closed?'Z':'');}
