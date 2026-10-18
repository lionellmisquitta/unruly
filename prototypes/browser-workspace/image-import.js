import {rasterStroke,validateRaster} from './raster.js';
export const imageLimits=Object.freeze({fileBytes:32*1024*1024,sourceDimension:16384,sourcePixels:64*1024*1024,outputDimension:1024,referenceDimension:512});
const fail=m=>{throw Error(m);};
export function imageHeader(bytes){
 const d=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);let width,height,type;
 if(bytes.length>=33&&[137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v)&&d.getUint32(8)===13&&d.getUint32(12)===0x49484452){width=d.getUint32(16);height=d.getUint32(20);type='image/png';}
 else if(bytes.length>=4&&bytes[0]===255&&bytes[1]===216){let pos=2;while(pos+4<=bytes.length){if(bytes[pos++]!==255)fail('Invalid JPEG header');while(bytes[pos]===255)pos++;const marker=bytes[pos++];if(marker===217||marker===218)break;if(marker===1||marker>=208&&marker<=215)continue;const n=d.getUint16(pos);if(n<2||pos+n>bytes.length)fail('Invalid JPEG segment');if([192,193,194].includes(marker)){if(n<8)fail('Invalid JPEG size');height=d.getUint16(pos+3);width=d.getUint16(pos+5);type='image/jpeg';break;}pos+=n;}}
 if(!type)fail('Choose a PNG or JPEG image');if(!width||!height||width>imageLimits.sourceDimension||height>imageLimits.sourceDimension||width*height>imageLimits.sourcePixels)fail('Source image exceeds the safe limit (16384 pixels per side or 64 megapixels)');return {width,height,type};
}
export function fitImage(width,height,max=1024){const scale=Math.min(1,max/Math.max(width,height));return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};}
export function repeatPixels(source,width,height,size,tile){
 if(!Number.isInteger(size)||size<32||size>1024||!Number.isInteger(tile)||tile<8||tile>512||!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>1024||height>1024||source.length!==width*height*4)fail('Invalid pattern dimensions');
 const tileHeight=Math.max(1,Math.round(tile*height/width)),out=new Uint8ClampedArray(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const sx=Math.min(width-1,Math.floor((x%tile)*width/tile)),sy=Math.min(height-1,Math.floor((y%tileHeight)*height/tileHeight)),i=(sy*width+sx)*4;const o=(y*size+x)*4;for(let k=0;k<4;k++)out[o+k]=source[i+k];}return out;
}
export function validateReference(r){if(!r||Object.keys(r).sort().join(',')!=='name,stroke'||typeof r.name!=='string'||r.name.length>64||r.stroke?.brush!=='raster')fail('Invalid reference image');const s=r.stroke;validateRaster(s);if(s.raster.width>512||s.raster.height>512||s.raster.transform.some((v,i)=>v!==[1,0,0,1,0,0][i]))fail('Invalid reference dimensions');return r;}
export function mutateImage(b,stroke,name){validateRaster(stroke);if(b.layers.length>=32)fail('Layer limit reached');const id=crypto.randomUUID();b.version=Math.max(4,b.version);b.layers.push({id,name:String(name).slice(0,64)||'Imported image',visible:true,locked:false,opacity:1,blend:'normal',strokes:[structuredClone(stroke)],...(b.version>=5?{parentId:null}:{})});b.activeLayer=id;return id;}
export function mutateReference(b,reference){if(reference!==null)validateReference(reference);b.version=Math.max(9,b.version);b.folders=b.folders||[];if(reference===null)delete b.reference;else b.reference=structuredClone(reference);}
export async function decodeImageFile(file){
 if(!file||file.size>imageLimits.fileBytes)fail('Image file exceeds 32 MiB');const bytes=new Uint8Array(await file.arrayBuffer()),header=imageHeader(bytes);let bitmap;
 try{const target=fitImage(header.width,header.height);bitmap=await createImageBitmap(new Blob([bytes],{type:header.type}),{imageOrientation:'from-image',resizeWidth:target.width,resizeHeight:target.height,resizeQuality:'high'});const size=fitImage(bitmap.width,bitmap.height),c=document.createElement('canvas');c.width=size.width;c.height=size.height;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0,size.width,size.height);const data=ctx.getImageData(0,0,size.width,size.height).data;c.width=c.height=1;return {...size,data,name:file.name.slice(0,64),sourceWidth:header.width,sourceHeight:header.height};}finally{bitmap?.close();}
}
export function referencePixels(decoded){const {width,height}=fitImage(decoded.width,decoded.height,512),data=new Uint8ClampedArray(width*height*4);for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=(Math.floor(y*decoded.height/height)*decoded.width+Math.floor(x*decoded.width/width))*4;const o=(y*width+x)*4;for(let k=0;k<4;k++)data[o+k]=decoded.data[i+k];}return {name:decoded.name,stroke:rasterStroke(data,width,height,0,0)};}
