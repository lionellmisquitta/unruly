const NORMAL_PREFIX='unruly-workspace-u1-normal-';
const CACHE=NORMAL_PREFIX+'v3-20261007-u3-2';
const FILES=['./','./index.html','./style.css','./selection.js','./brushes.js','./u2.js','./gestures.js','./shapes.js','./model.js','./render.js','./storage.js','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(NORMAL_PREFIX)&&k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.open(CACHE).then(async c=>(await c.match(e.request))||fetch(e.request)));});

