// Editable text uses a bounded local box and an affine transform. No network fonts.
import {layoutRichText} from './rich-text-layout.js';
export const textFonts=Object.freeze(['sans-serif','serif','monospace']);
const finite=n=>typeof n==='number'&&Number.isFinite(n),fail=m=>{throw Error(m);};
export function validTextFont(name){return typeof name==='string'&&name===name.trim()&&name.length>0&&name.length<=80&&/^[\p{L}\p{N}][\p{L}\p{N} ._+\-]*$/u.test(name);}
export function validateText(s){const t=s.text;if(!t||(Object.keys(t).sort().join(',')!==['align','bold','content','font','fontSize','height','italic','transform','width',...(Object.hasOwn(t,'wrap')?['wrap']:[]),...(Object.hasOwn(t,'lineSpacing')?['lineSpacing']:[])].sort().join(','))||typeof t.content!=='string'||!t.content.trim()||t.content.length>2048||t.content.split('\n').length>32||/[\u0000-\u0008\u000b-\u001f\u007f]/.test(t.content)||(Object.hasOwn(t,'wrap')&&t.wrap!==true)||(Object.hasOwn(t,'lineSpacing')&&(!finite(t.lineSpacing)||t.lineSpacing<1||t.lineSpacing>3))||!validTextFont(t.font)||!finite(t.fontSize)||t.fontSize<8||t.fontSize>256||!['left','center','right'].includes(t.align)||typeof t.bold!=='boolean'||typeof t.italic!=='boolean'||![t.width,t.height].every(n=>finite(n)&&n>=1&&n<=1024)||!Array.isArray(t.transform)||t.transform.length!==6||!t.transform.every(finite)||Math.abs(t.transform[0]*t.transform[3]-t.transform[1]*t.transform[2])<1e-8||t.transform.some(n=>Math.abs(n)>1e7)||s.size!==1||s.points.length!==5||['preset','dynamics','recipe','raster'].some(k=>Object.hasOwn(s,k)))fail('Invalid or oversized text');const expected=textPoints(t);if(!s.points.every((q,i)=>q.pressure===null&&Math.abs(q.x-expected[i].x)<1e-6&&Math.abs(q.y-expected[i].y)<1e-6))fail('Text bounds do not match transform');}
export function textFont(t){return `${t.italic?'italic ':''}${t.bold?'bold ':''}${t.fontSize}px ${textFonts.includes(t.font)?t.font:'"'+t.font+'", sans-serif'}`;}
export function textPoints(t){const [a,b,c,d,e,f]=t.transform;return [[0,0],[t.width,0],[t.width,t.height],[0,t.height],[0,0]].map(([x,y])=>({x:a*x+c*y+e,y:b*x+d*y+f,pressure:null}));}
export function transformText(s,m){const t=s.text,[a,b,c,d,e,f]=m,[u,v,w,z,x,y]=t.transform;t.transform=[a*u+c*v,b*u+d*v,a*w+c*z,b*w+d*z,a*x+c*y+e,b*x+d*y+f];s.points=textPoints(t);}
export function textContains(s,p){const t=s.text,[a,b,c,d,e,f]=t.transform,det=a*d-b*c,x=(d*(p.x-e)-c*(p.y-f))/det,y=(-b*(p.x-e)+a*(p.y-f))/det;return x>=0&&y>=0&&x<=t.width&&y<=t.height;}
export function makeText({content,font='sans-serif',fontSize=32,bold=false,italic=false,align='left',color='#203d48',opacity=1,transform=[1,0,0,1,0,0],wrapWidth,lineSpacing=1.4},measure){
  content=content.replace(/\r\n?/g,'\n');
  const wrap=wrapWidth!==undefined;
  if(!Number.isFinite(lineSpacing)||lineSpacing<1||lineSpacing>3||wrap&&(!Number.isFinite(wrapWidth)||!Number.isInteger(wrapWidth)||wrapWidth<100||wrapWidth>1024))fail('Invalid text wrapping or line spacing');
  const t={content,font,fontSize,bold,italic,align,transform:[...transform],width:1,height:1};
  if(wrap)t.wrap=true;
  if(lineSpacing!==1.4)t.lineSpacing=lineSpacing;
  if(wrap){
    const pad=fontSize*.25+4;
    const layout=layoutRichText({content,font,fontSize,maxWidth:wrapWidth-pad*2,lineSpacing,fontCSS:textFont(t),measure});
    t.width=wrapWidth;t.height=layout.height;
  }else{
    const lines=content.split('\n'),widths=lines.map(line=>measure(line,textFont(t)));
    t.width=Math.ceil(Math.max(1,...widths)+fontSize*.5+8);
    t.height=Math.ceil(lines.length*fontSize*lineSpacing+8);
  }
  const s={id:crypto.randomUUID(),brush:'text',color,size:1,opacity,points:textPoints(t),text:t};
  validateText(s);return s;
}
export function drawText(ctx,s){
  const t=s.text;ctx.save();
  try{
    ctx.transform(...t.transform);ctx.beginPath();ctx.rect(0,0,t.width,t.height);ctx.clip();
    ctx.font=textFont(t);ctx.fillStyle=s.color;ctx.globalAlpha=1;ctx.textBaseline='alphabetic';ctx.textAlign=t.align;
    const pad=t.fontSize*.25+4,x=t.align==='left'?pad:t.align==='center'?t.width/2:t.width-pad;
    let lines=t.content.split('\n');
    if(t.wrap)try{
      lines=layoutRichText({content:t.content,font:t.font,fontSize:t.fontSize,maxWidth:Math.max(1,t.width-pad*2),lineSpacing:t.lineSpacing??1.4,fontCSS:textFont(t),measure:(str)=>{const m=ctx.measureText(str);return Math.max(m.width,(m.actualBoundingBoxLeft||0)+(m.actualBoundingBoxRight||0));}}).lines.map(line=>line.text);
    }catch{
      // Missing/substituted device fonts must never prevent older artwork opening.
      // Retain the original content and bounded text clip as the safe render fallback.
      lines=t.content.split('\n');
    }
    lines.forEach((line,i)=>ctx.fillText(line,x,4+t.fontSize+i*t.fontSize*(t.lineSpacing??1.4),Math.max(1,t.width-pad*2)));
  }finally{ctx.restore();}
}
