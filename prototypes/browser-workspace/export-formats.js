// Bounded image metadata and single-page raster PDF. No network or document writes.
const text=s=>new TextEncoder().encode(s),u32=n=>new Uint8Array([(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]);
export function joinBytes(parts){const b=new Uint8Array(parts.reduce((n,x)=>n+x.length,0));let i=0;for(const x of parts){b.set(x,i);i+=x.length;}return b;}
export function crc32(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
export function withPNGResolution(bytes,dpi){
 const b=new Uint8Array(bytes);if(b.length<33||b[0]!==137||String.fromCharCode(...b.slice(1,4))!=='PNG')throw Error('Invalid encoded PNG');
 const parts=[b.slice(0,8)],payload=joinBytes([text('pHYs'),u32(Math.round(dpi/0.0254)),u32(Math.round(dpi/0.0254)),new Uint8Array([1])]),chunk=joinBytes([u32(9),payload,u32(crc32(payload))]);let at=8,inserted=false;
 while(at<b.length){if(at+12>b.length)throw Error('Invalid PNG chunk');const n=new DataView(b.buffer,b.byteOffset+at,4).getUint32(0),end=at+12+n;if(end>b.length)throw Error('Invalid PNG chunk');const kind=String.fromCharCode(...b.slice(at+4,at+8));if(kind!=='pHYs')parts.push(b.slice(at,end));if(kind==='IHDR'){parts.push(chunk);inserted=true;}at=end;}
 if(!inserted)throw Error('Missing PNG dimensions');return new Blob(parts,{type:'image/png'});
}
export function withJPEGResolution(bytes,dpi){
 const b=new Uint8Array(bytes);if(b[0]!==255||b[1]!==216)throw Error('Invalid encoded JPEG');let start=2;
 if(b[2]===255&&b[3]===224&&String.fromCharCode(...b.slice(6,11))==='JFIF\0')start=4+((b[4]<<8)|b[5]);
 const header=new Uint8Array([255,224,0,16,74,70,73,70,0,1,1,1,dpi>>8,dpi&255,dpi>>8,dpi&255,0,0]);return new Blob([b.slice(0,2),header,b.slice(start)],{type:'image/jpeg'});
}
export function rasterPDF(jpeg,width,height,dpi){
 const w=(width/dpi*72).toFixed(6),h=(height/dpi*72).toFixed(6),parts=[text('%PDF-1.4\n%UNRULY\n')],offsets=[0];let length=parts[0].length;
 const push=b=>{parts.push(b);length+=b.length;},object=(n,...data)=>{offsets[n]=length;push(text(n+' 0 obj\n'));for(const b of data)push(b);push(text('\nendobj\n'));};
 object(1,text('<< /Type /Catalog /Pages 2 0 R >>'));object(2,text('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'));
 object(3,text('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+w+' '+h+'] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>'));
 object(4,text('<< /Type /XObject /Subtype /Image /Width '+width+' /Height '+height+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+jpeg.length+' >>\nstream\n'),jpeg,text('\nendstream'));
 const draw=text('q\n'+w+' 0 0 '+h+' 0 0 cm\n/Im0 Do\nQ\n');object(5,text('<< /Length '+draw.length+' >>\nstream\n'),draw,text('endstream'));
 const xref=length;push(text('xref\n0 6\n0000000000 65535 f \n'+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n'));return new Blob(parts,{type:'application/pdf'});
}
