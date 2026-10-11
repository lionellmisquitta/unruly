import {validateRaster} from './raster.js';
import {nativePixelSnapshot} from './pixel-surface.js';
import {createPaintSession} from './pixel-paint.js';
// Sparse alpha coverage: normally hides; inverted coverage reveals. Outside is uniform.
export function validateMasks(board,ids){
 for(const l of board.layers){if(!Object.hasOwn(l,'mask'))continue;const m=l.mask;
  if(board.version<6||!m||Object.keys(m).sort().join(',')!=='enabled,inverted,patch'||typeof m.enabled!=='boolean'||typeof m.inverted!=='boolean')throw Error('Invalid layer mask');
  if(m.patch!==null){const s=m.patch;if(!s||s.brush!=='raster'||typeof s.id!=='string'||!s.id||s.id.length>128||ids.has(s.id))throw Error('Invalid mask patch');validateRaster(s);const [a,b,c,d,x,y]=s.raster.transform;if(a!==1||b!==0||c!==0||d!==1||!Number.isInteger(x)||!Number.isInteger(y))throw Error('Mask must use document pixels');ids.add(s.id);}
 }
 if((board.folders||[]).some(f=>Object.hasOwn(f,'mask')))throw Error('Folder masks are not supported yet');
}
export function mutateMask(b,l,action,value){
 if(action==='add'){if(l.mask)return;b.version=Math.max(6,b.version);b.folders=b.folders||[];l.mask={enabled:true,inverted:false,patch:null};return;}
 if(!l.mask)throw Error('Add a mask first');
 if(action==='enabled')l.mask.enabled=value;
 else if(action==='invert')l.mask.inverted=!l.mask.inverted;
 else if(action==='reset')l.mask={enabled:true,inverted:false,patch:null};
 else if(action==='remove')delete l.mask;
 else if(action==='paint'){if(!l.mask.enabled)throw Error('Enable the mask before painting');l.mask.patch=value;}
 else throw Error('Unknown mask action');
}
export function createMaskSession(mask,settings,first,mode){
 if(!mask?.enabled||!['hide','reveal'].includes(mode))throw Error('Enable a mask and choose Hide or Reveal');
 const snapshot=mask.patch?nativePixelSnapshot(mask.patch):null;
 return createPaintSession(snapshot,{...settings,color:'#000000',erase:(mode==='reveal')!==mask.inverted},first);
}
export function applyLayerMask(l,layer,scratch,v,g,decode){
 const m=l.mask;if(!m?.enabled)return;const lc=layer.getContext('2d');
 lc.save();try{
  lc.setTransform(1,0,0,1,0,0);lc.globalAlpha=1;
  if(!m.patch){if(m.inverted)lc.clearRect(0,0,layer.width,layer.height);return;}
  const r=m.patch.raster;
  // Reuse the existing scratch surface; no extra viewport allocation.
  scratch.width=1;scratch.height=1;scratch.width=r.width;scratch.height=r.height;
  const sc=scratch.getContext('2d');sc.putImageData(new ImageData(decode(r.data),r.width,r.height),0,0);
  lc.globalCompositeOperation=m.inverted?'destination-in':'destination-out';
  lc.setTransform(g.d*v.scale,0,0,g.d*v.scale,g.d*v.x,g.d*v.y);lc.transform(...r.transform);lc.drawImage(scratch,0,0);
 }finally{lc.restore();}
}
