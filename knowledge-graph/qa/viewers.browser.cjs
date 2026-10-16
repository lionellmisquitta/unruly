const {chromium}=require(require('path').resolve('application/tests/browser-workspace/node_modules/playwright'));
const fs=require('fs'),assert=require('assert/strict');
(async()=>{
 const out='knowledge-graph/qa/evidence';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true});const results=[];
 for(const [name,viewport] of [['2d',{width:1240,height:800}],['2d-phone',{width:360,height:800}],['onair',{width:1240,height:800}]]){
  const page=await browser.newPage({viewport});const errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173/'))external.push(r.url())});
  console.log('START',name);const onair=name==='onair';await page.goto('http://127.0.0.1:4173/'+(onair?'OnAir%20-%20unruly.html':'graph-explorer.html'));
  if(onair){await page.locator('#noCam').click();await page.waitForFunction(()=>getComputedStyle(document.getElementById('cover')).display==='none')}
  else assert(await page.locator('#nodes .node').count()>0,'2D overview renders cards');
  console.log('LOADED',name);await page.locator('#search').fill('Lasso selection and enclosure fill');
  await page.locator(onair?'#results .result':'#results button').filter({hasText:'Lasso selection and enclosure fill'}).first().click();
  await page.locator('#content h2').filter({hasText:'Lasso selection and enclosure fill'}).waitFor({state:'visible'});
  assert.match(await page.locator('#content').innerText(),/blank artwork/);
  assert.equal(await page.locator('#content details').evaluate(e=>e.open),false,'Raw developer detail collapsed');
  if(!onair) await page.locator('#closePanel').click();
  await page.locator('#search').fill('TIME1 published baseline');
  await page.locator(onair?'#results .result':'#results button').filter({hasText:'TIME1 published baseline'}).first().click();
  await page.locator('#content h2').filter({hasText:'TIME1 published baseline'}).waitFor({state:'visible'});
  assert.match(await page.locator('#content').innerText(),/2000 states/);
  console.log('INSPECTED',name);await page.screenshot({path:out+'/'+name+'-time1-inspector.png',fullPage:true});
  if(!onair){
   await page.locator('#closePanel').click();const z=await page.locator('#zoomLabel').innerText();await page.locator('#zoomIn').click();assert.notEqual(await page.locator('#zoomLabel').innerText(),z);
   await page.locator('[data-lens="technical"]').click();assert(await page.locator('#nodes .node').count()>0);
   await page.locator('#reset').click();assert.equal(await page.locator('#side').evaluate(e=>e.hidden),true);
  }else{
   const painted=await page.locator('#stage').evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;for(let i=0;i<d.length;i+=4)if(d[i]+d[i+1]+d[i+2]>100)return true;return false});assert(painted,'OnAir canvas renders graph');
  }
  assert.deepEqual(errors,[]);assert.deepEqual(external,[],'No camera or external dependency needed');
  results.push({id:name,status:'PASS',viewport,search:true,inspector:true,developerDetailsCollapsed:true,pageErrors:errors,externalRequests:external});await page.close();
 }
 fs.writeFileSync(out+'/viewer-results.json',JSON.stringify({browser:browser.version(),results},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
