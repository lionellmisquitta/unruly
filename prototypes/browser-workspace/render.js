// Canvas2D reference replay plus retained top-layer live ink. Alpha applied by stage.
const hash=(x,y,seed=173)=>{let n=Math.imul(Math.round(x)*374761393^Math.round(y)*668265263^seed,1274126177);n=(n^(n>>>13))>>>0;return n/4294967296;};
const width=(s,p)=>s.size*(p.pressure===null?1:.15+.85*p.pressure);
function resample(points,step,visit){let budget=0;visit(points[0],0);for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],len=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(1,Math.ceil(len/step));if((budget+=n)>20000)throw Error('Brush replay limit reached');for(let j=1;j<=n;j++){const t=j/n;visit({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,pressure:a.pressure===null||b.pressure===null?null:a.pressure+(b.pressure-a.pressure)*t},Math.atan2(b.y-a.y,b.x-a.x));}}}
function drawStroke(ctx,s){ctx.fillStyle=s.color;ctx.strokeStyle=s.color;ctx.lineCap='round';ctx.lineJoin='round';ctx.globalAlpha=1;
 if(s.brush==='ink'){const a=s.points[0];ctx.beginPath();ctx.arc(a.x,a.y,width(s,a)/2,0,Math.PI*2);ctx.fill();for(let i=1;i<s.points.length;i++){const p=s.points[i-1],q=s.points[i];ctx.lineWidth=(width(s,p)+width(s,q))/2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}return;}
 const step=Math.max(.5,s.size*(s.brush==='pencil'?.22:s.brush==='airbrush'?.3:.2));
 resample(s.points,step,(p,angle)=>{const w=width(s,p);
 if(s.brush==='marker'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-Math.PI/5+angle*.12);ctx.fillRect(-w/2,-w*.18,w,w*.36);ctx.restore();}
 else if(s.brush==='pencil'){for(let k=0;k<12;k++){const a=hash(p.x+k*13,p.y+k*7)*Math.PI*2,r=Math.sqrt(hash(p.x+k*31,p.y-k*17))*w*.48;ctx.globalAlpha=.25+hash(p.y+k,p.x-k)*.55;ctx.fillRect(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,.6,.6);}ctx.globalAlpha=1;}
 else{const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,Math.max(.1,w/2));g.addColorStop(0,s.color+'50');g.addColorStop(1,s.color+'00');ctx.fillStyle=g;ctx.fillRect(p.x-w/2,p.y-w/2,w,w);}
 });
}
function paper(ctx,b,v,w,h){ctx.fillStyle=b.color;ctx.fillRect(0,0,w,h);if(b.kind==='plain')return;ctx.save();ctx.translate(v.x,v.y);ctx.scale(v.scale,v.scale);const space=Math.max(b.spacing,8/v.scale),x0=Math.floor(-v.x/v.scale/space)*space,y0=Math.floor(-v.y/v.scale/space)*space,x1=(w-v.x)/v.scale,y1=(h-v.y)/v.scale;ctx.strokeStyle='#70868b35';ctx.fillStyle='#70868b55';ctx.lineWidth=.7/v.scale;
 if(b.kind==='dotted'){for(let x=x0;x<=x1;x+=space)for(let y=y0;y<=y1;y+=space){ctx.beginPath();ctx.arc(x,y,1/v.scale,0,Math.PI*2);ctx.fill();}}
 else if(b.kind==='textured'){ctx.fillStyle='#6b5b4420';const s=Math.max(5,4/v.scale);for(let x=Math.floor(x0/s)*s;x<=x1;x+=s)for(let y=Math.floor(y0/s)*s;y<=y1;y+=s){const a=hash(x,y,b.seed);ctx.globalAlpha=.15+a*.5;ctx.fillRect(x+a*s,y+hash(y,x,b.seed)*s,.7/v.scale,.7/v.scale);}ctx.globalAlpha=1;}
 else{ctx.beginPath();for(let y=y0;y<=y1;y+=space){ctx.moveTo(x0,y);ctx.lineTo(x1,y);}if(b.kind==='grid')for(let x=x0;x<=x1;x+=space){ctx.moveTo(x,y0);ctx.lineTo(x,y1);}ctx.stroke();}ctx.restore();
}
export const rendererBudget = Object.freeze({surfaces:5, backingBytes:80*1024*1024, maxDimension:4096, maxDpr:2});
export function createRenderer(canvas){
 const layer=document.createElement('canvas'),scratch=document.createElement('canvas');
 const lower=document.createElement('canvas'),retained=document.createElement('canvas');
 const surfaces=[canvas,layer,scratch,lower,retained];
 let cache=null;
 const invalidate=()=>{cache=null;};
 function clear(c){const ctx=c.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.clearRect(0,0,c.width,c.height);return ctx;}
 function geometry(){
  const rect=canvas.getBoundingClientRect(),cssW=Math.max(1,rect.width),cssH=Math.max(1,rect.height),deviceDpr=window.devicePixelRatio||1;
  const d=Math.min(deviceDpr,rendererBudget.maxDpr,rendererBudget.maxDimension/Math.max(cssW,cssH),Math.sqrt(rendererBudget.backingBytes/(surfaces.length*4*cssW*cssH)));
  const w=Math.max(1,Math.floor(cssW*d)),h=Math.max(1,Math.floor(cssH*d));
  if(surfaces.some(c=>c.width!==w||c.height!==h)){
   invalidate();
   // Release every old backing store before reallocating: portrait/landscape
   // assignments must not transiently multiply old height by new width.
   for(const c of surfaces){c.width=1;c.height=1;}
   for(const c of surfaces){c.width=w;c.height=h;}
  }
  return {cssW,cssH,d,w,h,deviceDpr};
 }
 function strokeToLayer(s,v,g){
  if(s.opacity===0)return;
  const sc=clear(scratch);sc.setTransform(g.d*v.scale,0,0,g.d*v.scale,g.d*v.x,g.d*v.y);drawStroke(sc,s);
  const lc=layer.getContext('2d');lc.setTransform(1,0,0,1,0,0);lc.globalAlpha=s.opacity;lc.drawImage(scratch,0,0);
 }
 function replayLayer(l,v,g,live=null){clear(layer);for(const s of l.strokes)strokeToLayer(s,v,g);if(live)strokeToLayer(live,v,g);}
 function composite(target,l){const ctx=target.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=l.opacity;ctx.drawImage(layer,0,0);ctx.globalAlpha=1;}
 function background(target,b,v,g){const ctx=clear(target);ctx.setTransform(g.d,0,0,g.d,0,0);paper(ctx,b.paper,v,g.cssW,g.cssH);}
 function full(board,v,live,g){
  background(canvas,board,v,g);let count=0;
  for(const l of board.layers){if(!l.visible||l.opacity===0)continue;replayLayer(l,v,g,l.id===board.activeLayer?live:null);count+=l.strokes.filter(s=>s.opacity!==0).length;composite(canvas,l);}
  return count;
 }
 function metrics(t,g,mode,count){return {ms:performance.now()-t,mode,completedStrokesReplayed:count,dpr:g.d,backingBytes:surfaces.reduce((n,c)=>n+c.width*c.height*4,0),surfaces:surfaces.map(c=>({width:c.width,height:c.height}))};}
 function renderReference(board,view={x:0,y:0,scale:1},live=null){const t=performance.now();invalidate();const g=geometry();try{return metrics(t,g,'reference',full(board,view,live,g));}catch(e){invalidate();throw e;}}
 function render(board,view={x:0,y:0,scale:1},live=null){
  const t=performance.now(),g=geometry(),index=board.layers.findIndex(l=>l.id===board.activeLayer),active=board.layers[index];
  // Upper-layer blending stays on the reference path; no approximation of opacity/order.
  if(!live||!active?.visible||active.opacity===0||board.layers.slice(index+1).some(l=>l.visible&&l.opacity!==0)){
   invalidate();try{return metrics(t,g,'reference',full(board,view,live,g));}catch(e){invalidate();throw e;}
  }
  const key=[board.revision,board.activeLayer,view.x,view.y,view.scale,g.cssW,g.cssH,g.w,g.h,g.d,g.deviceDpr].join('|');
  let count=0,mode='retained-hit';
  try{
   if(!cache||cache.board!==board||cache.key!==key){
    invalidate();mode='retained-miss';background(lower,board,view,g);
    for(const l of board.layers.slice(0,index)){if(!l.visible||l.opacity===0)continue;replayLayer(l,view,g);count+=l.strokes.filter(s=>s.opacity!==0).length;composite(lower,l);}
    replayLayer(active,view,g);count+=active.strokes.filter(s=>s.opacity!==0).length;
    clear(retained).drawImage(layer,0,0);cache={board,key};
   }
   clear(canvas).drawImage(lower,0,0);
   clear(layer).drawImage(retained,0,0);strokeToLayer(live,view,g);composite(canvas,active);
   return metrics(t,g,mode,count);
  }catch(e){invalidate();throw e;}
 }
 function preview(stroke,width=180,height=56){
  invalidate();width=Math.min(400,Math.max(1,Math.round(width)));height=Math.min(100,Math.max(1,Math.round(height)));
  for(const c of [layer,scratch]){c.width=width;c.height=height;}
  const sc=clear(scratch),lc=clear(layer);sc.setTransform(Math.min(1,width/180),0,0,1,0,0);drawStroke(sc,stroke);lc.fillStyle='#f4f3ef';lc.fillRect(0,0,width,height);lc.globalAlpha=stroke.opacity;lc.drawImage(scratch,0,0);return layer.toDataURL();
 }
 return {render,renderReference,preview,invalidate,surfaces};
}
