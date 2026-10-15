// Portable stamp-local grain. Pure schema/conversion/math; no model or DOM imports.
const fail=m=>{throw Error(m);};
const exact=(x,k)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).sort().join(',')===[...k].sort().join(',');
export function validateGrain(g){
 if(!exact(g,['version','width','height','mask','scale','depth','rotation'])||g.version!==1||![g.width,g.height].every(x=>Number.isInteger(x)&&x>=1&&x<=64)||typeof g.mask!=='string'||g.mask.length!==4*Math.ceil(g.width*g.height/3)||!Number.isFinite(g.scale)||g.scale<4||g.scale>128||!Number.isFinite(g.depth)||g.depth<0||g.depth>1||!Number.isFinite(g.rotation)||Math.abs(g.rotation)>180)fail('Invalid grain controls or image');
 let raw;try{raw=atob(g.mask);}catch{fail('Invalid grain mask');}if(raw.length!==g.width*g.height||btoa(raw)!==g.mask)fail('Invalid grain mask');return g;
}
export function grainFromImage(d,invert=false){
 if(!d||![d.width,d.height].every(x=>Number.isInteger(x)&&x>=1&&x<=1024)||d.data?.length!==d.width*d.height*4||typeof invert!=='boolean')fail('Invalid grain image');
 const f=Math.min(1,64/Math.max(d.width,d.height)),width=Math.max(1,Math.round(d.width*f)),height=Math.max(1,Math.round(d.height*f));let raw='';
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=(Math.floor(y*d.height/height)*d.width+Math.floor(x*d.width/width))*4,l=.2126*d.data[i]+.7152*d.data[i+1]+.0722*d.data[i+2];raw+=String.fromCharCode(Math.round(d.data[i+3]/255*(invert?255-l:l)));}
 return validateGrain({version:1,width,height,mask:btoa(raw),scale:32,depth:.65,rotation:0});
}
export function grainMask(t){
 const raw=atob(t.mask),g=t.grain;if(!g||g.depth===0)return raw;validateGrain(g);
 const source=atob(g.mask),r=g.rotation*Math.PI/180,cos=Math.cos(r),sin=Math.sin(r),wrap=(v,n)=>((Math.floor(v)%n)+n)%n;let out='';
 for(let y=0;y<t.height;y++)for(let x=0;x<t.width;x++){const dx=x+.5-t.width/2,dy=y+.5-t.height/2,u=wrap((cos*dx+sin*dy)/g.scale*g.width,g.width),v=wrap((-sin*dx+cos*dy)/g.scale*g.height,g.height),a=source.charCodeAt(v*g.width+u)/255;out+=String.fromCharCode(Math.round(raw.charCodeAt(y*t.width+x)*(1-g.depth+g.depth*a)));}return out;
}
export function textureTip(kind){
 if(!['splatter','sprinkle'].includes(kind))fail('Unknown texture preset');let seed=173;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};const size=32,alpha=new Uint8Array(size*size);
 for(let i=0;i<(kind==='splatter'?25:10);i++){const x=2+random()*28,y=2+random()*28,r=kind==='splatter'?.5+random()*2.5:.6;for(let yy=0;yy<size;yy++)for(let xx=0;xx<size;xx++)if(Math.hypot(xx+.5-x,yy+.5-y)<=r)alpha[yy*size+xx]=255;}
 return {version:1,width:size,height:size,mask:btoa(String.fromCharCode(...alpha)),options:{spacing:kind==='splatter'?.8:1.2,spacingJitter:.5,lateral:.8,linear:.4,rotation:'random',angle:0,count:kind==='splatter'?2:3,countJitter:.5,sizeJitter:.6,opacityJitter:.3,flipX:false,flipY:false},seed:173,scale:1,angle:0};
}
