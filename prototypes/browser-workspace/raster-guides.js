import {createGuide} from './guides.js';
export function rasterGuide(config,first,scale=1,targets=[]){const guide=createGuide(config,first,scale,targets);return {...guide,first:guide.advance(first)};}
function copies(point,g){const sx=g.symmetry==='vertical'||g.symmetry==='both',sy=g.symmetry==='horizontal'||g.symmetry==='both';return [point,...(sx?[{...point,x:2*g.x-point.x}]:[]),...(sy?[{...point,y:2*g.y-point.y}]:[]),...(sx&&sy?[{...point,x:2*g.x-point.x,y:2*g.y-point.y}]:[])];}
export function guidedRaster(session,guide,{tip=false}={}){
 if(!guide.enabled)return session;
 if(!tip)copies(guide.first,guide.config).slice(1).forEach((p,i)=>session.advance(p,i+1));
 return {advance(point){const p=guide.advance(point);if(tip)return session.advance(p);for(const [i,q]of copies(p,guide.config).entries())session.advance(q,i);return session.changed;},stroke:()=>session.stroke(),get changed(){return session.changed;},diagnostics:()=>session.diagnostics()};
}
