// Pure colour math and document admission; no model/DOM/storage dependency.
export const neutralAdjustment=Object.freeze({hue:0,saturation:0,lightness:0,black:0,white:255,gamma:1,outBlack:0,outWhite:255});
const keys=Object.keys(neutralAdjustment),finite=(v,a,b)=>typeof v==='number'&&Number.isFinite(v)&&v>=a&&v<=b;
export function validateAdjustment(a){
 if(!a||Array.isArray(a)||Object.keys(a).length!==keys.length||!keys.every(k=>Object.hasOwn(a,k)))throw Error('Invalid colour adjustment');
 if(!finite(a.hue,-180,180)||!finite(a.saturation,-100,100)||!finite(a.lightness,-100,100)||!finite(a.black,0,254)||!finite(a.white,1,255)||a.black>=a.white||!finite(a.gamma,.1,10)||!finite(a.outBlack,0,255)||!finite(a.outWhite,0,255)||a.outBlack>a.outWhite)throw Error('Invalid adjustment range · black must be below white');
 return a;
}
export const hasAdjustment=n=>!!n?.adjustment&&keys.some(k=>n.adjustment[k]!==neutralAdjustment[k]);
export function validateAdjustments(board){for(const n of [...board.layers,...(board.folders||[])])if(Object.hasOwn(n,'adjustment')){if(board.version<10)throw Error('Colour adjustments require v10');validateAdjustment(n.adjustment);}}
export function adjustmentTarget(board,id){const layer=board.layers.find(l=>l.id===id),node=layer||(board.folders||[]).find(f=>f.id===id);if(!node)throw Error('Adjustment target missing');return {node,folder:!layer};}
export function mutateAdjustment(board,id,value){
 const {node,folder}=adjustmentTarget(board,id),map=new Map((board.folders||[]).map(f=>[f.id,f]));
 const parents=n=>{const list=[];let p=n.parentId;while(p){const f=map.get(p);if(!f||list.includes(f))throw Error('Invalid folder ancestry');list.push(f);p=f.parentId;}return list;};
 if(!node.visible||node.locked||parents(node).some(f=>!f.visible||f.locked))throw Error('Adjustment target is hidden or locked');
 if(folder&&board.layers.some(l=>parents(l).some(f=>f.id===id)&&(l.locked||parents(l).some(f=>f.locked))))throw Error('Unlock folder contents before adjusting');
 if(value!==null)validateAdjustment(value);
 if(value===null||!hasAdjustment({adjustment:value})){delete node.adjustment;return;}
 board.version=Math.max(10,board.version);board.folders=board.folders||[];node.adjustment=structuredClone(value);
}
export function adjustPixels(data,a){
 validateAdjustment(a);if(!data||data.length%4)throw Error('Invalid RGBA pixels');if(!hasAdjustment({adjustment:a}))return data;
 const lut=Array.from({length:256},(_,n)=>Math.round(a.outBlack+(a.outWhite-a.outBlack)*Math.pow(Math.max(0,Math.min(1,(n-a.black)/(a.white-a.black))),1/a.gamma)));
 const clamp=n=>Math.max(0,Math.min(1,n));
 for(let i=0;i<data.length;i+=4){if(data[i+3]===0)continue;
  let r=data[i]/255,g=data[i+1]/255,b=data[i+2]/255;
  if(a.hue||a.saturation||a.lightness){const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let l=(max+min)/2,s=d===0?0:d/(1-Math.abs(2*l-1)),h=d===0?0:max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;
   h=((h/6+a.hue/360)%1+1)%1;s=clamp(s*(1+a.saturation/100));l=clamp(l+a.lightness/100);
   const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h*6)%2-1)),m=l-c/2;
   [r,g,b]=h<1/6?[c,x,0]:h<2/6?[x,c,0]:h<3/6?[0,c,x]:h<4/6?[0,x,c]:h<5/6?[x,0,c]:[c,0,x];r+=m;g+=m;b+=m;
  }
  data[i]=lut[Math.round(clamp(r)*255)];data[i+1]=lut[Math.round(clamp(g)*255)];data[i+2]=lut[Math.round(clamp(b)*255)];
 }
 return data;
}
export function applyCanvasAdjustment(node,canvas){if(!hasAdjustment(node))return;const c=canvas.getContext('2d'),image=c.getImageData(0,0,canvas.width,canvas.height);adjustPixels(image.data,node.adjustment);c.putImageData(image,0,0);}
