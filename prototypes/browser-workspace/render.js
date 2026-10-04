// Original Canvas2D replay renderer. Three reusable surfaces, alpha applied by stage.
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
export function createRenderer(canvas){const layer=document.createElement('canvas'),scratch=document.createElement('canvas');const surfaces=[canvas,layer,scratch];
 function render(board,view={x:0,y:0,scale:1},preview=null){const t=performance.now(),rect=canvas.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2,4096/Math.max(1,rect.width),4096/Math.max(1,rect.height)),w=Math.max(1,Math.round(rect.width*d)),h=Math.max(1,Math.round(rect.height*d));for(const c of surfaces)if(c.width!==w||c.height!==h){c.width=w;c.height=h;}const main=canvas.getContext('2d'),lc=layer.getContext('2d'),sc=scratch.getContext('2d');main.setTransform(d,0,0,d,0,0);main.globalAlpha=1;paper(main,board.paper,view,rect.width,rect.height);
 for(const l of board.layers){if(!l.visible||l.opacity===0)continue;lc.setTransform(1,0,0,1,0,0);lc.clearRect(0,0,w,h);const strokes=preview&&l.id===board.activeLayer?[...l.strokes,preview]:l.strokes;for(const s of strokes){if(s.opacity===0)continue;sc.setTransform(1,0,0,1,0,0);sc.clearRect(0,0,w,h);sc.setTransform(d*view.scale,0,0,d*view.scale,d*view.x,d*view.y);drawStroke(sc,s);lc.globalAlpha=s.opacity;lc.drawImage(scratch,0,0);}main.save();main.setTransform(1,0,0,1,0,0);main.globalAlpha=l.opacity;main.drawImage(layer,0,0);main.restore();}
 return {ms:performance.now()-t,surfaces:surfaces.map(c=>({width:c.width,height:c.height}))};}
 return {render,surfaces};
}
