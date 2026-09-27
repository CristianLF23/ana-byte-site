const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.ANA_QA_URL||'http://127.0.0.1:4183/';
const out=path.join(__dirname,'round-motion-navigation');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
 const report=[],errors=[];
 try{
  for(const width of [320,375,390,430,768,1024,1440]){
   const page=await browser.newPage({viewport:{width,height:900}});
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:path.join(out,`hero-${width}.png`)});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow at ${width}`);
   assert.equal(await page.locator('.reading-progress').getAttribute('aria-valuenow'),'0');
   const label=width<1024?page.locator('.rail-location'):page.locator('.hero-location');
   assert.equal(await label.isVisible(),true);
   assert.equal((await label.textContent()).trim(),'Studio em São Paulo');
   let parallaxShift=null;
   if(width===390){
    const measure=()=>page.evaluate(()=>{const m=new DOMMatrix(getComputedStyle(document.querySelector('.hero-depth')).transform);return {y:m.m42,scale:m.a}});
    const before=await measure();
    await page.evaluate(()=>scrollTo({top:document.querySelector('.hero').offsetHeight*.55,behavior:'instant'}));
    await page.waitForTimeout(850);
    const after=await measure();
    parallaxShift=Math.round(after.y-before.y);
    assert.ok(parallaxShift>23,`mobile city depth did not move enough: ${JSON.stringify({before,after})}`);
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(850);
   }
   if(width<1024){
    const positions=await page.evaluate(()=>Object.fromEntries(['.brand','.rail-location','.menu-toggle'].map(key=>{const r=document.querySelector(key).getBoundingClientRect();return[key,{left:r.left,right:r.right,top:r.top,bottom:r.bottom}]})));
    assert.ok(await label.evaluate(el=>el.getBoundingClientRect().height<=parseFloat(getComputedStyle(el).fontSize)*1.6),`studio label wraps at ${width}`);
    assert.ok(positions['.rail-location'].left>=positions['.brand'].right-1,`location overlaps logo at ${width}: ${JSON.stringify(positions)}`);
    assert.ok(positions['.rail-location'].right<=positions['.menu-toggle'].left+1,`location overlaps menu at ${width}`);
    const labelCenter=(positions['.rail-location'].top+positions['.rail-location'].bottom)/2;
    const menuCenter=(positions['.menu-toggle'].top+positions['.menu-toggle'].bottom)/2;
    assert.ok(Math.abs(labelCenter-menuCenter)<2,`studio label is not aligned with menu at ${width}: ${JSON.stringify(positions)}`);
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
    if(width===390)assert.ok(await page.evaluate(()=>gsap.getTweensOf(document.querySelector('#main-nav')).length>0));
    await page.waitForTimeout(440);await page.screenshot({path:path.join(out,`menu-${width}.png`)});
    assert.equal(await page.locator('#main-nav').isVisible(),true);
    await page.keyboard.press('Escape');await page.waitForTimeout(260);
    assert.equal(await page.locator('#main-nav').isVisible(),false);
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    await page.locator('.menu-toggle').click();await page.locator('.menu-toggle').click();await page.locator('.menu-toggle').click();await page.waitForTimeout(440);
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
    await page.locator('.menu-toggle').click();await page.waitForTimeout(260);
   }
   await page.evaluate(()=>scrollTo({top:(document.documentElement.scrollHeight-innerHeight)/2,behavior:'instant'}));await page.waitForTimeout(120);
   const middle=Number(await page.locator('.reading-progress').getAttribute('aria-valuenow'));
   assert.ok(middle>35&&middle<65,`mid progress ${width}: ${middle}`);
   await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(120);
   assert.equal(await page.locator('.reading-progress').getAttribute('aria-valuenow'),'100');
   await page.locator('[data-filter=tattoo]').click();await page.waitForTimeout(480);
   assert.equal(await page.locator('[data-filter=tattoo]').getAttribute('aria-pressed'),'true');
   assert.ok(await page.locator('.portfolio-thumb:visible').count()>0);
   await page.locator('[data-filter=all]').click();await page.waitForTimeout(480);
   if(width===390){
    await page.locator('[data-filter=process]').click();
    assert.ok(await page.evaluate(()=>gsap.getTweensOf(document.querySelector('.portfolio-thumb:not([hidden])')).length>0));
    await page.locator('[data-filter=all]').click();await page.waitForTimeout(480);
   }
   const first=await page.locator('[data-page-count]').textContent();
   await page.locator('.page-next').click();await page.waitForTimeout(480);
   assert.notEqual(await page.locator('[data-page-count]').textContent(),first);
   assert.ok(await page.locator('.portfolio-thumb:visible').count()>0);
   await page.screenshot({path:path.join(out,`gallery-${width}.png`)});
   report.push({width,progress:[0,middle,100],menu:width<1024?'open, Escape, rapid toggles':'desktop nav',gallery:'filters and pagination',parallaxShift});
   await page.close();
  }
  const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await reduced.goto(base,{waitUntil:'networkidle'});
  await reduced.locator('.menu-toggle').click();
  assert.equal(await reduced.locator('#main-nav').isVisible(),true);
  await reduced.locator('.menu-toggle').click();
  assert.equal(await reduced.locator('#main-nav').isVisible(),false);
  await reduced.locator('[data-filter=tattoo]').click();
  assert.equal(await reduced.locator('[data-filter=tattoo]').getAttribute('aria-pressed'),'true');
  await reduced.close();
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({report,reducedMotion:'instant controls',errors},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
