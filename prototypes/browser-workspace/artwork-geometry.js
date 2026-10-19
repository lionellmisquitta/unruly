import {flattenPath} from './path-selection.js';
export const artworkLimits=Object.freeze({anchors:64,points:512});
const copy=x=>structuredClone(x),finite=x=>typeof x==='number'&&Number.isFinite(x)&&Math.abs(x)<=1e7;
const pressure=x=>x===null||typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=1;
function point(p){return p&&finite(p.x)&&finite(p.y);}
export function validateArtworkPath(path){
 if(!path||Object.keys(path).some(k=>!['version','nodes','closed','basis'].includes(k))||path.version!==1||typeof path.closed!=='boolean'||!Array.isArray(path.nodes)||path.nodes.length<2||path.nodes.length>64||path.closed&&path.nodes.length<3)throw Error('Invalid artwork path');
 for(const n of path.nodes)if(!point(n)||!pressure(n.pressure)||Object.keys(n).some(k=>!['x','y','pressure','in','out'].includes(k))||['in','out'].some(k=>n[k]&&(!point(n[k])||Object.keys(n[k]).some(k=>!['x','y'].includes(k)))))throw Error('Invalid artwork node');
 if(!Array.isArray(path.basis)||path.basis.length<2||path.basis.length>512||path.basis.some(p=>!point(p)||!pressure(p.pressure)||Object.keys(p).some(k=>!['x','y','pressure'].includes(k))))throw Error('Invalid artwork path source');
 return path;
}
export function validateArtworkStroke(s,version){
 if(!Object.hasOwn(s,'artworkPath'))return;
 if(version<15||['raster','text'].includes(s.brush))throw Error('Editable curve authoring requires native v15 vector ink');
 validateArtworkPath(s.artworkPath);
}
export function currentArtworkPath(s){const p=s.artworkPath;if(!p)return false;validateArtworkPath(p);return p.basis.length===s.points.length&&p.basis.every((q,i)=>q.x===s.points[i].x&&q.y===s.points[i].y&&q.pressure===s.points[i].pressure);}
export function artworkNodes(s,near=null){
 if(['raster','text'].includes(s.brush)||!Array.isArray(s.points)||s.points.length<2)throw Error('Choose a vector ink stroke with at least two points');
 if(currentArtworkPath(s))return {nodes:copy(s.artworkPath.nodes),closed:s.artworkPath.closed,authored:true,stale:false};
 let center=0;if(near)for(let i=1;i<s.points.length;i++)if(Math.hypot(s.points[i].x-near.x,s.points[i].y-near.y)<Math.hypot(s.points[center].x-near.x,s.points[center].y-near.y))center=i;const pointOffset=s.points.length>512?Math.max(0,Math.min(s.points.length-512,center-256)):0;
 return {nodes:copy(s.points.slice(pointOffset,pointOffset+512)),closed:false,authored:false,stale:!!s.artworkPath,...(s.points.length>512?{pointOffset,pointCount:512}:{} )};
}
export function sampleArtwork(nodes,closed=false){
 if(!Array.isArray(nodes)||nodes.length<2||nodes.length>64||closed&&nodes.length<3)throw Error('Curve needs2–64anchors; closed curves need3');
 const basis=nodes.map(n=>({x:n.x,y:n.y,pressure:n.pressure??null}));validateArtworkPath({version:1,nodes,closed,basis});
 const points=[basis[0]],segments=nodes.length-(closed?0:1);
 for(let i=0;i<segments;i++){const a=nodes[i],b=nodes[(i+1)%nodes.length],part=flattenPath([a,b],{closed:false}),dist=[0];for(let j=1;j<part.length;j++)dist.push(dist.at(-1)+Math.hypot(part[j].x-part[j-1].x,part[j].y-part[j-1].y));const total=dist.at(-1);
  for(let j=1;j<part.length;j++){const t=total?dist[j]/total:1;points.push({...part[j],pressure:a.pressure===null&&b.pressure===null?null:(a.pressure??1)*(1-t)+(b.pressure??1)*t});if(points.length>512)throw Error('Curve detail limit512points; reduce handles');}
 }
 return points;
}
export function editedArtwork(stroke,nodes,{closed=false,authored=false,pointOffset=0,pointCount=null}={}){
 const out=copy(stroke);delete out.artworkPath;
 if(authored){out.points=sampleArtwork(nodes,closed);out.artworkPath=validateArtworkPath({version:1,nodes:copy(nodes),closed,basis:copy(out.points)});}
 else{if(nodes.length<2||nodes.length>512||nodes.some(n=>!point(n)||!pressure(n.pressure)))throw Error('Invalid artwork points');const edited=nodes.map(n=>({x:n.x,y:n.y,pressure:n.pressure}));if(pointCount!==null){if(!Number.isInteger(pointOffset)||!Number.isInteger(pointCount)||pointOffset<0||pointCount<2||pointOffset+pointCount>stroke.points.length)throw Error('Invalid node editing window');out.points=[...copy(stroke.points.slice(0,pointOffset)),...edited,...copy(stroke.points.slice(pointOffset+pointCount))];}else out.points=edited;}
 return out;
}
export function mapArtworkPath(stroke,transform){
 if(!stroke.artworkPath)return;const p=stroke.artworkPath;
 for(const n of p.nodes){Object.assign(n,transform(n));for(const key of ['in','out'])if(n[key])Object.assign(n[key],transform(n[key]));}
 for(const q of p.basis)Object.assign(q,transform(q));
}
export function nearestArtwork(strokes,p,scale=1){
 let result=null,best=(12/scale)**2,work=0;
 for(const s of [...strokes].reverse()){if(['raster','text'].includes(s.brush)||s.opacity===0)continue;for(let i=1;i<s.points.length;i++){if(++work>100000)throw Error('Artwork pick budget reached; select one object with lasso first');const a=s.points[i-1],b=s.points[i],dx=b.x-a.x,dy=b.y-a.y,len=dx*dx+dy*dy,t=len?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/len)):0,d=(p.x-a.x-t*dx)**2+(p.y-a.y-t*dy)**2;if(d<best){best=d;result=s;}}}return result;
}
