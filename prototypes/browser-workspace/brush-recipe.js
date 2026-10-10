// C04-B02 versioned, opt-in recipes. Defaults preserve immutable original presets.
export const DEFAULT_RECIPE=Object.freeze({version:1,density:1,spacing:1,grain:0,tip:'preset'});
export function validateRecipe(r,family){
 const keys=['version','density','spacing','grain','tip'];
 if(!r||typeof r!=='object'||Array.isArray(r)||Object.keys(r).length!==5||Object.keys(r).some(k=>!keys.includes(k))||r.version!==1||!['ink','pencil','marker','airbrush'].includes(family)||!Number.isFinite(r.density)||r.density<.1||r.density>1||!Number.isFinite(r.spacing)||r.spacing<.5||r.spacing>3||!Number.isFinite(r.grain)||r.grain<0||r.grain>1||!['preset','round','flat'].includes(r.tip)||(r.grain!==0&&(family!=='pencil'||r.tip!=='preset')))throw Error('Invalid custom brush recipe');
 return r;
}
export function applyRecipe(p,r){
 if(r===undefined)return p;validateRecipe(r,p.family);
 if(r.density===1&&r.spacing===1&&r.grain===0&&r.tip==='preset')return p;
 const kind=r.tip==='flat'?'flat':r.tip==='round'?'round':p.kind==='continuous'&&r.spacing!==1?'round':p.kind;
 const particles=['pencil','mist'].includes(kind)?Math.max(1,Math.round(p.particles*r.density)):undefined;
 return {...p,kind,...(particles?{particles}:{}),coverage:p.coverage*(particles?1:r.density),stepFactor:(p.stepFactor||.2)*r.spacing};
}
