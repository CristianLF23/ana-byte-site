const {chromium}=require('C:/Users/crist.PC/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const assert=require('assert'),fs=require('fs'),path=require('path');
(async()=>{
 const browser=await chromium.launch();
 const base=process.env.QA_URL||'http://127.0.0.1:4178/';
 const out=path.join(__dirname,'v1-frame-gallery');fs.mkdirSync(out,{recursive:true});
 const p=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.url())});
 await p.goto(base);await p.locator('.byte-entry__start:not([disabled])').click();await p.locator('.byte-entry').waitFor({state:'detached'});
 const go=async name=>{await p.evaluate(n=>{scrollTo({top:['city','works','artist','contact'].indexOf(n)*document.querySelector('.city-viewport').clientHeight,behavior:'instant'});AnaFlight.go(n)},name);await p.waitForFunction(n=>AnaFlight.scene===n&&!AnaFlight.travelling,name);await p.waitForTimeout(400)};
 for(const viewport of [{width:390,height:844},{width:360,height:640},{width:1440,height:900}]){
  await p.setViewportSize(viewport);await p.waitForTimeout(250);await go('works');
  const works=await p.locator('.gallery-facade').boundingBox();
  await p.screenshot({path:path.join(out,viewport.width+'-works.png')});
  await go('artist');const artist=await p.locator('.artist-facade').boundingBox();
  assert(Math.abs(works.y+works.height*.151-(artist.y+artist.height*.133))<2,'Top rails must align');
  assert.equal(await p.locator('.artist-actions a').count(),1);
  const portrait=await p.locator('.artist-image').boundingBox();
  if(viewport.width===390)assert(portrait.height>370,'Portrait should use the removed button space');
  await p.screenshot({path:path.join(out,viewport.width+'-artist.png')});
 }
 await p.setViewportSize({width:390,height:844});await p.locator('.artist-actions a').click();
 const frame=p.frameLocator('.ana-interior-layer__iframe');await frame.locator('.comp-nav a').nth(1).click();
 await frame.locator('.collection-card').first().waitFor();
 await frame.locator('.collection-card').nth(1).scrollIntoViewIfNeeded();await p.waitForTimeout(350);
 await p.screenshot({path:path.join(out,'390-embedded-gallery.png')});
 await frame.locator('.collection-card').nth(1).click();assert(await frame.locator('[data-lightbox-dialog]').evaluate(d=>d.open));
 await p.keyboard.press('Escape');assert(await p.locator('.ana-interior-layer').isVisible());
 await p.locator('.ana-interior-layer__close').click();await p.waitForFunction(()=>document.querySelector('.ana-interior-layer').hidden);
 for(const viewport of [{width:360,height:640},{width:390,height:844},{width:1440,height:900}]){
  await p.setViewportSize(viewport);await p.goto(base+'trabalhos/');
  await p.locator('.collection-card').first().waitFor();
  const cards=await p.locator('.collection-card').evaluateAll(items=>items.map(card=>{
   const image=card.querySelector('img'),caption=card.querySelector('span');
   const i=image.getBoundingClientRect(),c=caption.getBoundingClientRect(),r=card.getBoundingClientRect();
   return {gap:c.top-i.bottom,bottomGap:r.bottom-c.bottom,column:getComputedStyle(caption).flexDirection,overflow:card.scrollWidth>r.width+1};
  }));
  assert.equal(cards.length,19);
  assert(cards.every(c=>Math.abs(c.gap)<1&&Math.abs(c.bottomGap)<1&&c.column==='column'&&!c.overflow),JSON.stringify(cards));
  assert(await p.locator('html').evaluate(el=>el.scrollWidth<=innerWidth));
  await p.locator('.collection-card').nth(1).scrollIntoViewIfNeeded();await p.waitForTimeout(350);
  await p.screenshot({path:path.join(out,viewport.width+'-gallery.png')});
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,alignedFacades:true,largerPortrait:true,cards:19,captionGaps:0,lightbox:true,errors}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
