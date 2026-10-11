// Sparse persisted RGBA payloads. Empty means all four bytes are zero, not just alpha.
// Tiles are reconstructed before Canvas2D sampling: interpolation never sees tile edges.
export const tileSize=64;
const prefix='T2:',dimension=1024;
const fail=()=>{throw Error('Invalid raster pixels');};
const dimensions=(w,h)=>Number.isInteger(w)&&Number.isInteger(h)&&w>=1&&h>=1&&w<=dimension&&h<=dimension;
const encodedLength=n=>4*Math.ceil(n/3);
function decodeTile(text,n){
 if(typeof text!=='string'||text.length!==encodedLength(n)||!/^[A-Za-z0-9+/]*={0,2}$/.test(text))fail();
 let raw;try{raw=atob(text);}catch{fail();}if(raw.length!==n||btoa(raw)!==text)fail();
 const data=new Uint8ClampedArray(n);let occupied=false;for(let i=0;i<n;i++){data[i]=raw.charCodeAt(i);occupied=occupied||data[i]!==0;}if(!occupied)fail();return data;
}
export function encodeSparsePixels(data,width,height,encode){
 if(!dimensions(width,height)||!(data instanceof Uint8ClampedArray||data instanceof Uint8Array)||data.length!==width*height*4)fail();
 const occupiedTiles=[];
 for(let y=0;y<height;y+=tileSize)for(let x=0;x<width;x+=tileSize){
  const w=Math.min(tileSize,width-x),h=Math.min(tileSize,height-y);let occupied=false;
  for(let row=0;row<h&&!occupied;row++){const start=((y+row)*width+x)*4;for(let i=start;i<start+w*4;i++)if(data[i]){occupied=true;break;}}
  if(!occupied)continue;
  occupiedTiles.push({x,y,w,h});
 }
 const estimate=prefix.length+JSON.stringify({width,height,tiles:[]}).length+occupiedTiles.reduce((sum,t)=>sum+JSON.stringify([t.x,t.y,'']).length+encodedLength(t.w*t.h*4),0)+Math.max(0,occupiedTiles.length-1);
 if(estimate>=encodedLength(width*height*4))return null;
 const tiles=occupiedTiles.map(({x,y,w,h})=>{const tile=new Uint8ClampedArray(w*h*4);for(let row=0;row<h;row++)tile.set(data.subarray(((y+row)*width+x)*4,((y+row)*width+x+w)*4),row*w*4);return [x,y,encode(tile)];});
 return prefix+JSON.stringify({width,height,tiles});
}
export function readSparsePixels(text,expectedWidth,expectedHeight){
 // Bound the string before JSON.parse, then bound tile count and bytes before decode.
 if(typeof text!=='string'||!text.startsWith(prefix)||text.length>encodedLength(dimension*dimension*4))fail();
 let value;try{value=JSON.parse(text.slice(prefix.length));}catch{fail();}
 if(!value||Object.keys(value).join(',')!=='width,height,tiles'||!dimensions(value.width,value.height)||!Array.isArray(value.tiles)||value.tiles.length>Math.ceil(value.width/tileSize)*Math.ceil(value.height/tileSize))fail();
 const {width,height,tiles}=value;
 if((expectedWidth!==undefined&&width!==expectedWidth)||(expectedHeight!==undefined&&height!==expectedHeight)||text.length>=encodedLength(width*height*4)||prefix+JSON.stringify(value)!==text)fail();
 let last=-1;const result=[];
 for(const t of tiles){
  if(!Array.isArray(t)||t.length!==3)fail();const [x,y,encoded]=t;
  if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=width||y>=height||x%tileSize||y%tileSize)fail();
  const index=(y/tileSize)*Math.ceil(width/tileSize)+x/tileSize;if(index<=last)fail();last=index;
  const w=Math.min(tileSize,width-x),h=Math.min(tileSize,height-y);
  result.push({x,y,width:w,height:h,data:decodeTile(encoded,w*h*4)});
 }
 return {width,height,tiles:result};
}
export function decodeSparsePixels(text){
 const {width,height,tiles}=readSparsePixels(text),data=new Uint8ClampedArray(width*height*4);
 for(const t of tiles)for(let y=0;y<t.height;y++)data.set(t.data.subarray(y*t.width*4,(y+1)*t.width*4),((t.y+y)*width+t.x)*4);
 return data;
}
