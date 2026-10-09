const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const evidence=path.join(__dirname,'evidence');fs.mkdirSync(evidence,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1000,height:730},hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.UNRULY_TEST_URL||'http://127.0.0.1:4173/unruly/');
  await page.waitForFunction(()=>/Saved on this device|Copied \\d+ old boards|Recovery warning/.test(document.querySelector('#save')?.textContent),null,{timeout:10000});
  const touch=async(type,ids)=>page.evaluate(({type,ids})=>{const el=document.querySelector('#canvas'),r=el.getBoundingClientRect();ids.forEach((id,i)=>el.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerType:'touch',pointerId:id,clientX:r.left+100+i*25,clientY:r.top+150,button:0,buttons:type==='pointerup'?0:1})));},{type,ids});
  await touch('pointerdown',[101,102,103]);await page.waitForTimeout(730);await touch('pointerup',[101,102,103]);
  assert(await page.locator('body').evaluate(el=>el.classList.contains('focus-mode')),'three-finger held chrome toggle');
  assert(await page.locator('#focus-exit').isVisible(),'keyboard/mouse escape remains');
  await page.screenshot({path:path.join(evidence,'G02B01-focus.png')});
  await page.locator('#focus-exit').click();
  assert(!(await page.locator('body').evaluate(el=>el.classList.contains('focus-mode'))),'exit restores controls');
  assert(await page.locator('header').isVisible());
  await touch('pointerdown',[201,202,203]);await page.waitForTimeout(730);await touch('pointerup',[201,202,203]);
  assert(await page.locator('body').evaluate(el=>el.classList.contains('focus-mode')),'repeat gesture opens focus');
  await touch('pointerdown',[211,212,213]);await page.waitForTimeout(730);await touch('pointerup',[211,212,213]);
  assert(!(await page.locator('body').evaluate(el=>el.classList.contains('focus-mode'))),'repeat gesture exits focus');
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(evidence,'g02-browser-output.json'),JSON.stringify({G02B01:'PASS',G02B02:'PASS',pageErrors:errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
