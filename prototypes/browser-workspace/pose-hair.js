// Original procedural drawing scaffolds, in head-local radius units (+Z = face).
export const hairStyles={none:'None',spiky:'Short spiky',pixie:'Pixie / cropped',bob:'Bob',long:'Long flowing',curly:'Curly clumps',ponytail:'Ponytail',pigtails:'Pigtails',bun:'Bun'};
export const defaultHair={style:'none',volume:1,length:1,part:0,bangs:.6};
export function validateHair(input){const h=input===undefined?{...defaultHair}:structuredClone(input);if(!h||!Object.hasOwn(hairStyles,h.style))throw Error('Invalid hairstyle');for(const [k,lo,hi]of [['volume',.7,1.8],['length',.4,2],['part',-1,1],['bangs',0,1]])if(typeof h[k]!=='number'||!Number.isFinite(h[k])||h[k]<lo||h[k]>hi)throw Error('Invalid hair '+k);return h;}
export function hairGeometry(input){const h=validateHair(input),faces=[];if(h.style==='none')return faces;
 const tri=(a,b,c)=>faces.push([a,b,c]);
 function sphere(center,radii,segments=14,rings=7,cap=false){const grid=[];for(let i=0;i<=rings;i++){const row=[];for(let j=0;j<=segments;j++){const phi=j/segments*Math.PI*2,front=Math.max(0,Math.cos(phi)),theta=i/rings*(cap?1.85-.55*front:Math.PI);row.push([center[0]+radii[0]*Math.sin(theta)*Math.sin(phi),center[1]+radii[1]*Math.cos(theta),center[2]+radii[2]*Math.sin(theta)*Math.cos(phi)]);}grid.push(row);}for(let i=0;i<rings;i++)for(let j=0;j<segments;j++){tri(grid[i][j],grid[i+1][j],grid[i][j+1]);tri(grid[i][j+1],grid[i+1][j],grid[i+1][j+1]);}}
 function clump(path,width){const rings=path.map((p,i)=>{const t=i/(path.length-1),r=width*(1-.93*t);return Array.from({length:5},(_,j)=>[p[0]+Math.cos(j/5*Math.PI*2)*r,p[1],p[2]+Math.sin(j/5*Math.PI*2)*r*.65]);});for(let i=0;i<rings.length-1;i++)for(let j=0;j<5;j++){const k=(j+1)%5;tri(rings[i][j],rings[i+1][j],rings[i][k]);tri(rings[i][k],rings[i+1][j],rings[i+1][k]);}}
 const v=h.volume;sphere([0,.07,0],[.87*v,1.06*v,.83*v],12,4,true);
 // Back and side locks leave the face open; lengths are exaggerated for readability.
 if(['bob','long','curly'].includes(h.style)){const len=(h.style==='long'?2.3:h.style==='curly'?1.1:.85)*h.length;const count=h.style==='curly'?9:13;for(let j=0;j<count;j++){const phi=Math.PI*.3+j/(count-1)*Math.PI*1.4,x=Math.sin(phi),z=Math.cos(phi);clump([[x*.78*v,.55*v,z*.75*v],[x*.94*v,-.2,z*.92*v],[x*(.9+len*.12)*v,-.5-len,z*(.88+len*.09)*v]],.2*v);if(h.style==='curly')for(let k=0;k<2;k++)sphere([x*(.9+k*.04)*v,.2-k*len*.45,z*.9*v],[.27*v,.25*v,.25*v],6,2);}}
 if(['spiky','pixie'].includes(h.style))for(let j=0;j<12;j++){const phi=j/12*Math.PI*2,len=(h.style==='spiky'?.65:.22)*h.length;clump([[Math.sin(phi)*.65*v,.65*v,Math.cos(phi)*.65*v],[Math.sin(phi)*(.9+len*.2)*v,(.8+len*.3)*v,Math.cos(phi)*(.9+len*.2)*v],[Math.sin(phi)*(1+len*.65)*v,(.7+len*(.5+.3*Math.cos(j*2)))*v,Math.cos(phi)*(1+len*.65)*v]],.19*v);}
 if(h.style==='ponytail')clump([[0,.55*v,-.82*v],[.12*v,.3,-1.3*v],[.25*v,-.7*h.length,-1.55*v],[.35*v,-1.8*h.length,-1.1*v]],.4*v);
 if(h.style==='pigtails')for(const sign of [-1,1])clump([[sign*.8*v,.4,-.35*v],[sign*1.25*v,.05,-.55*v],[sign*1.45*v,-.8*h.length,-.5*v],[sign*1.2*v,-1.6*h.length,-.3*v]],.33*v);
 if(h.style==='bun')sphere([h.part*.2,1.0*v,-.75*v],[.55*v,.55*h.length,.5*v],12,6);
 if(h.bangs>0)for(let j=0;j<5;j++){const x=(j-2)*.29,root=h.part*.45;clump([[root,.98*v,.3*v],[(x+root)*.55,.65*v,.83*v],[x*v,(.45-h.bangs*.9+(j%2)*.12)*v,.86*v]],.2*v);}
 if(faces.length>1000||faces.some(f=>f.some(p=>p.some(n=>!Number.isFinite(n)||Math.abs(n)>6.2))))throw Error('Hair geometry exceeds safe bounds');return faces;
}
