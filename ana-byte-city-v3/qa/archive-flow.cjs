const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.ANA_QA_URL||'http://127.0.0.1:4183/';
const out=path.join(__dirname,process.argv[2]||'round-archive-film-1');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
 const errors=[],report=[];
 try{
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:900}});
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
   await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const video=page.locator('#archive-video');
   assert.equal(await video.evaluate(v=>v.paused&&v.preload==='none'),true);
   assert.equal(await page.locator('#trabalhos .portfolio-portrait img').count(),1);
   await page.locator('#trabalhos').evaluate(el=>scrollTo({top:el.offsetTop-(innerWidth<1024?82:0),behavior:'instant'}));await page.waitForTimeout(800);
   await page.screenshot({path:path.join(out,`archive-header-${width}.png`)});
   await video.evaluate(v=>v.scrollIntoView({block:'center',behavior:'instant'}));
   await page.waitForFunction(()=>{const v=document.querySelector('#archive-video');return !v.paused&&v.currentTime>.5},{timeout:15000});
   const state=await video.evaluate(v=>({duration:v.duration,inline:v.playsInline,muted:v.muted,controls:v.controls,width:v.videoWidth,height:v.videoHeight}));
   assert.ok(state.duration>20);assert.equal(state.inline,true);assert.equal(state.muted,true);assert.equal(state.controls,true);
   assert.equal(await page.locator('dialog[open]').count(),0);
   await page.screenshot({path:path.join(out,`archive-film-${width}.png`)});
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(300);assert.equal(await video.evaluate(v=>v.paused),true);
   await video.evaluate(v=>v.scrollIntoView({block:'center',behavior:'instant'}));await page.waitForFunction(()=>!document.querySelector('#archive-video').paused);
   await video.evaluate(v=>v.pause());await page.waitForTimeout(100);
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(200);
   await video.evaluate(v=>v.scrollIntoView({block:'center',behavior:'instant'}));await page.waitForTimeout(300);assert.equal(await video.evaluate(v=>v.paused),true,'manual pause must survive scrolling');
   await video.evaluate(v=>v.play());
   const before=await page.locator('.selected-image').boundingBox();
   await video.evaluate(v=>{v.currentTime=v.duration-.15});
   await page.waitForFunction(()=>!document.querySelector('.portfolio-browser').classList.contains('is-film'));
   const after=await page.locator('.selected-image').boundingBox();assert.ok(Math.abs(before.height-after.height)<2,'no jump when the film becomes a photo');
   assert.equal(await page.locator('[data-selected-open]').isVisible(),true);assert.equal(await page.locator('dialog[open]').count(),0);
   const pathname=new URL(page.url()).pathname;await page.evaluate(()=>window.__archiveDocument='same');
   for(const filter of ['tattoo','process','digital','all']){
    await page.locator(`[data-filter=${filter}]`).click();
    assert.equal(new URL(page.url()).pathname,pathname);assert.equal(await page.evaluate(()=>window.__archiveDocument),'same');assert.equal(await page.locator('dialog[open]').count(),0);
   }
   await page.locator('#trabalhos').evaluate(el=>scrollTo({top:el.offsetTop-(innerWidth<1024?82:0),behavior:'instant'}));await page.waitForTimeout(700);
   await page.screenshot({path:path.join(out,`archive-gallery-${width}.png`)});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.locator('.archive-replay').click();await page.waitForFunction(()=>!document.querySelector('#archive-video').paused);
   assert.equal(new URL(page.url()).pathname,pathname);assert.equal(await page.locator('dialog[open]').count(),0);
   report.push({width,video:state,inlineFilters:true,manualPause:true,stableTransition:true});
   await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto(new URL('portfolio/?tipo=process',base).href,{waitUntil:'networkidle'});
  assert.ok(new URL(page.url()).pathname.endsWith('/index.html'));assert.equal(new URL(page.url()).hash,'#trabalhos');assert.equal(await page.locator('[data-filter=process]').getAttribute('aria-pressed'),'true');
  await page.goto(base,{waitUntil:'networkidle'});await page.locator('#archive-video').evaluate(v=>v.scrollIntoView({block:'center',behavior:'instant'}));await page.waitForTimeout(400);
  assert.equal(await page.locator('#archive-video').evaluate(v=>v.paused),true);
  await page.locator('.archive-replay').click();await page.waitForFunction(()=>!document.querySelector('#archive-video').paused);
  await page.close();report.push({legacyLinks:'canonical home archive',reducedMotion:'manual playback works'});
  const blocked=await browser.newPage({viewport:{width:390,height:844}});
  await blocked.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;let attempt=0;HTMLMediaElement.prototype.play=function(){if(!attempt++)return Promise.reject(new DOMException('Autoplay blocked','NotAllowedError'));return play.call(this)}});
  await blocked.goto(base,{waitUntil:'networkidle'});await blocked.locator('#archive-video').evaluate(v=>v.scrollIntoView({block:'center',behavior:'instant'}));await blocked.waitForTimeout(600);
  assert.equal(await blocked.locator('#archive-video').evaluate(v=>v.paused&&v.controls&&!!v.poster),true);
  await blocked.locator('.archive-replay').click();await blocked.waitForFunction(()=>!document.querySelector('#archive-video').paused);
  await blocked.close();report.push({autoplayBlocked:'poster and manual playback available'});
  const failed=await browser.newPage({viewport:{width:390,height:844}});
  await failed.route('**/ana-portfolio.mp4',route=>route.fulfill({status:404,body:'Unavailable'}));
  await failed.goto(base,{waitUntil:'networkidle'});await failed.locator('#archive-video').evaluate(v=>v.scrollIntoView({block:'center',behavior:'instant'}));
  await failed.locator('.film-error').waitFor({state:'visible'});
  await failed.locator('[data-filter=tattoo]').click();assert.equal(await failed.locator('.portfolio-thumb:visible').count(),6);
  await failed.close();report.push({videoUnavailable:'gallery remains usable'});
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({base,report,errors},null,2));
  console.log(JSON.stringify({report,errors}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
