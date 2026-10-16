// Pure device-library rules. No DOM, artwork model, renderer or storage imports.
export const paletteLimits=Object.freeze({palettes:16,colours:64,bytes:65536,undo:10});
export const defaultColours=Object.freeze(['#203d48','#171c24','#c14f43','#d69b28','#517a58','#4877a3','#8a63a2','#f2eee3']);
const fail=m=>{throw Error(m);},exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).sort().join(',')===[...keys].sort().join(',');
export const colourHex=c=>typeof c==='string'&&/^#[\da-f]{6}$/i.test(c)?c.toLowerCase():fail('Use a six-digit hex colour');
const name=n=>typeof n==='string'&&n.trim()&&n.trim().length<=64?n.trim():fail('Palette name must contain 1–64 characters');
export function validatePalettes(input){
 if(!exact(input,['version','active','palettes'])||input.version!==1||!Array.isArray(input.palettes)||!input.palettes.length||input.palettes.length>16||new TextEncoder().encode(JSON.stringify(input)).length>65536)fail('Invalid palette library or 16-palette limit');
 const lib=structuredClone(input),ids=new Set(),names=new Set();
 for(const p of lib.palettes){if(!exact(p,['id','name','colours'])||typeof p.id!=='string'||!/^[\w-]{1,80}$/.test(p.id)||ids.has(p.id)||name(p.name)!==p.name||names.has(p.name.toLowerCase())||!Array.isArray(p.colours)||p.colours.length>64)fail('Invalid palette, duplicate name or 64-swatch limit');p.colours=p.colours.map(colourHex);if(new Set(p.colours).size!==p.colours.length)fail('Duplicate palette swatch');ids.add(p.id);names.add(p.name.toLowerCase());}
 if(!ids.has(lib.active))fail('Active palette is missing');return lib;
}
export function migratePalettes(legacy){
 const colours=[];for(const c of Array.isArray(legacy?.palette)?legacy.palette:[]){if(typeof c==='string'&&/^#[\da-f]{6}$/i.test(c)&&!colours.includes(c.toLowerCase()))colours.push(c.toLowerCase());if(colours.length===64)break;}
 return {version:1,active:'saved',palettes:[{id:'saved',name:'Saved colours',colours:colours.length?colours:[...defaultColours]}]};
}
export function paletteCommand(input,action,args={}){
 const lib=validatePalettes(input),p=lib.palettes.find(x=>x.id===lib.active);
 if(action==='select'){if(!lib.palettes.some(x=>x.id===args.id))fail('Palette no longer exists');lib.active=args.id;}
 else if(action==='create'){lib.palettes.push({id:args.id,name:name(args.name),colours:[]});lib.active=args.id;}
 else if(action==='rename')p.name=name(args.name);
 else if(action==='delete'){if(lib.palettes.length===1)fail('Keep at least one palette');lib.palettes=lib.palettes.filter(x=>x.id!==p.id);lib.active=lib.palettes[0].id;}
 else if(action==='add'){const c=colourHex(args.colour);p.colours=[c,...p.colours.filter(x=>x!==c)];}
 else if(action==='remove'){const c=colourHex(args.colour);p.colours=p.colours.filter(x=>x!==c);}
 else fail('Unknown palette action');return validatePalettes(lib);
}
export function parsePalettes(text){if(typeof text!=='string'||new TextEncoder().encode(text).length>65536)fail('Palette backup exceeds 64 KiB');return validatePalettes(JSON.parse(text));}
export function appendPalettes(input,incoming,makeId){
 const lib=validatePalettes(input),other=validatePalettes(incoming);if(lib.palettes.length+other.palettes.length>16)fail('Import exceeds the 16-palette limit');
 let selected;for(const p of other.palettes){let n=p.name,i=2;while(lib.palettes.some(q=>q.name.toLowerCase()===n.toLowerCase()))n=p.name.slice(0,55)+' ('+(i++)+')';const next={id:makeId(),name:n,colours:[...p.colours]};if(p.id===other.active)selected=next.id;lib.palettes.push(next);}lib.active=selected;return validatePalettes(lib);
}
export function mixColours(a,b,percent){
 a=colourHex(a);b=colourHex(b);if(!Number.isFinite(percent)||percent<0||percent>100)fail('Mix must be 0–100%');const t=percent/100,decode=v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4,encode=v=>v<=.0031308?v*12.92:1.055*v**(1/2.4)-.055;
 return '#'+[1,3,5].map(i=>{const x=decode(parseInt(a.slice(i,i+2),16)/255),y=decode(parseInt(b.slice(i,i+2),16)/255);return Math.round(encode(x*(1-t)+y*t)*255).toString(16).padStart(2,'0');}).join('');
}
function imageSize(w,h){if(![w,h].every(n=>Number.isInteger(n)&&n>=1&&n<=1024))fail('Invalid bounded reference image');}
export function referencePoint(box,x,y,width,height){
 imageSize(width,height);if(!box||![box.left,box.top,box.width,box.height,x,y].every(Number.isFinite)||box.width<=0||box.height<=0||x<box.left||y<box.top||x>=box.left+box.width||y>=box.top+box.height)return null;
 return {x:Math.floor((x-box.left)/box.width*width),y:Math.floor((y-box.top)/box.height*height)};
}
export function referenceColour(data,width,height,x,y){
 imageSize(width,height);if(!(data instanceof Uint8ClampedArray||data instanceof Uint8Array)||data.length!==width*height*4)fail('Invalid reference pixels');if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=width||y>=height)return null;const i=(y*width+x)*4;if(!data[i+3])return null;return '#'+[0,1,2].map(k=>data[i+k].toString(16).padStart(2,'0')).join('');
}
