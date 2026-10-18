// Minimal silent video containers for bounded WebCodecs output. No network/storage.
const u8=x=>x instanceof Uint8Array?x:new Uint8Array(x),text=s=>new TextEncoder().encode(s);
export function concat(...parts){parts=parts.flat().map(u8);const b=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let at=0;for(const p of parts){b.set(p,at);at+=p.length;}return b;}
const uint=(n,size=4)=>{const b=new Uint8Array(size);for(let i=size-1;i>=0;i--){b[i]=n%256;n=Math.floor(n/256);}return b;};
const zeros=n=>new Uint8Array(n),box=(name,...data)=>{const b=concat(...data);return concat(uint(b.length+8),text(name),b);},full=(name,...data)=>box(name,zeros(4),...data);
const matrix=concat(uint(65536),zeros(12),uint(65536),zeros(12),uint(1073741824));
// AVC chunks use length-prefixed NAL units, description is AVCDecoderConfigurationRecord.
export function muxMP4(samples,{width,height,fps,description}){
 if(!description||description.byteLength<7||!samples.length)throw Error('Missing MP4 decoder configuration');
 const n=samples.length,scale=12000,step=scale/fps,duration=n*step,ftyp=box('ftyp',text('isom'),uint(512),text('isomiso2avc1mp41'));
 const avc1=box('avc1',zeros(6),uint(1,2),zeros(16),uint(width,2),uint(height,2),uint(72*65536),uint(72*65536),zeros(4),uint(1,2),zeros(32),uint(24,2),uint(65535,2),box('avcC',u8(description)));
 const stbl=box('stbl',full('stsd',uint(1),avc1),full('stts',uint(1),uint(n),uint(step)),full('stsc',uint(1),uint(1),uint(n),uint(1)),full('stsz',uint(0),uint(n),samples.map(s=>uint(s.data.length))),full('stco',uint(1),uint(ftyp.length+8)),full('stss',uint(samples.filter(s=>s.key).length),samples.flatMap((s,i)=>s.key?[uint(i+1)]:[])));
 const minf=box('minf',box('vmhd',uint(1),zeros(8)),box('dinf',full('dref',uint(1),box('url ',uint(1)))),stbl);
 const mdia=box('mdia',full('mdhd',zeros(8),uint(scale),uint(duration),uint(0x55c4,2),zeros(2)),full('hdlr',zeros(4),text('vide'),zeros(12),text('UNRULY\0')),minf);
 const trak=box('trak',box('tkhd',uint(7),zeros(8),uint(1),zeros(4),uint(duration),zeros(8),zeros(8),matrix,uint(width*65536),uint(height*65536)),mdia);
 const moov=box('moov',full('mvhd',zeros(8),uint(scale),uint(duration),uint(65536),uint(256,2),zeros(10),matrix,zeros(24),uint(2)),trak);
 return new Blob([ftyp,box('mdat',samples.map(s=>s.data)),moov],{type:'video/mp4'});
}
const hex=h=>new Uint8Array(h.match(/../g).map(x=>parseInt(x,16)));
function vint(n){for(let size=1;size<=8;size++)if(n<2**(7*size)-1){const b=uint(n,size);b[0]|=1<<(8-size);return b;}throw Error('WebM size limit');}
const ebml=(id,...parts)=>{const b=concat(...parts);return concat(hex(id),vint(b.length),b);};
const num=(id,n)=>ebml(id,uint(n,n<256?1:n<65536?2:4));
export function muxWebM(samples,{width,height,fps}){
 if(!samples.length)throw Error('No encoded video frames');
 const duration=new Uint8Array(8);new DataView(duration.buffer).setFloat64(0,samples.length*1000/fps);
 const header=ebml('1a45dfa3',num('4286',1),num('42f7',1),num('42f2',4),num('42f3',8),ebml('4282',text('webm')),num('4287',2),num('4285',2));
 const info=ebml('1549a966',num('2ad7b1',1000000),ebml('4489',duration),ebml('4d80',text('UNRULY')),ebml('5741',text('UNRULY')));
 const tracks=ebml('1654ae6b',ebml('ae',num('d7',1),num('73c5',1),num('83',1),ebml('86',text('V_VP8')),num('23e383',Math.round(1e9/fps)),ebml('e0',num('b0',width),num('ba',height))));
 const clusters=samples.map((s,i)=>ebml('1f43b675',num('e7',Math.round(i*1000/fps)),ebml('a3',new Uint8Array([0x81,0,0,s.key?0x80:0]),s.data)));
 // Segment-relative seek positions: fixed-width offsets keep the index size stable.
 const seek=(id,pos)=>ebml('4dbb',ebml('53ab',hex(id)),ebml('53ac',uint(pos,4)));
 const seekHead=(infoAt,tracksAt,cuesAt)=>ebml('114d9b74',seek('1549a966',infoAt),seek('1654ae6b',tracksAt),seek('1c53bb6b',cuesAt));
 const headSize=seekHead(0,0,0).length;let offset=headSize+info.length+tracks.length;const cues=[];
 samples.forEach((s,i)=>{if(s.key)cues.push(ebml('bb',num('b3',Math.round(i*1000/fps)),ebml('b7',num('f7',1),ebml('f1',uint(offset,4)))));offset+=clusters[i].length;});
 return new Blob([header,ebml('18538067',seekHead(headSize,headSize+info.length,offset),info,tracks,clusters,ebml('1c53bb6b',cues))],{type:'video/webm'});
}
