const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../prototypes/browser-foundation');let updated=false;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
http.createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost');
 if(u.pathname==='/__qa/update'&&req.method==='POST'){updated=true;res.end('QA worker revision installed');return;}
 if(!u.pathname.startsWith('/unruly/')){res.writeHead(404);res.end();return;}
 let name=decodeURIComponent(u.pathname.slice('/unruly/'.length))||'index.html';
 if(name.includes('/')||name.includes('\\')||!fs.existsSync(path.join(root,name))){res.writeHead(404);res.end();return;}
 let data=fs.readFileSync(path.join(root,name));
 if(name==='sw.js'&&updated)data=Buffer.from(data.toString().replace('unruly-web-f1-v1','unruly-web-f1-qa-update'));
 res.setHeader('Content-Type',types[path.extname(name)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(data);
}).listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('QA fixture server ready'));
