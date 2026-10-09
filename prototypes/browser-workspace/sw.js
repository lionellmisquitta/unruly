const NORMAL_PREFIX='unruly-workspace-u1-normal-';
const CACHE=NORMAL_PREFIX+'v3-20261010-size-percent-1';
const FILES=['./','./index.html','./style.css','./selection.js','./brushes.js','./brush-size.js','./u2.js','./pen-input.js','./pressure-ui.js','./gestures.js','./shapes.js','./model.js','./render.js','./storage.js','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(path=>new Request(path,{cache:'reload'}))))));
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(NORMAL_PREFIX)&&k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.open(CACHE).then(async c=>(await c.match(e.request))||fetch(e.request)));});

