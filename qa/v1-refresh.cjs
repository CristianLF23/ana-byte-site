const {chromium}=require('C:/Users/crist.PC/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const fs=require('fs');const path=require('path');const assert=require('assert');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const base=process.env.QA_URL||'http://127.0.0.1:4178/';
 const out=path.join(__dirname,'v1-refresh');fs.mkdirSync(out,{recursive:true});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(700);
 const mid=await page.locator('.byte-entry__progress').getAttribute('aria-valuenow');
 assert(+mid>0 && +mid<100,`Loading intermediate ${mid}`);assert(await page.locator('.byte-entry__start').isDisabled());
 await page.screenshot({path:path.join(out,'01-loading.png')});
 await page.locator('.byte-entry__start:not([disabled])').waitFor();
 assert.equal(await page.locator('.byte-entry__progress').getAttribute('aria-valuenow'),'100');
 await page.waitForTimeout(400);assert.equal(await page.locator('.byte-entry').count(),1);
 await page.locator('.byte-entry__start').click();await page.locator('.byte-entry').waitFor({state:'detached'});
 await page.screenshot({path:path.join(out,'02-city.png')});
 await page.locator('.discover-world').click();
 await page.waitForFunction(()=>window.AnaFlight.scene==='works'&&!window.AnaFlight.travelling);
 await page.waitForFunction(()=>document.querySelector('#portfolio-video').currentTime>0.1);
 assert.equal(await page.locator('#city-flight').evaluate(v=>v.duration),2);
 await page.screenshot({path:path.join(out,'03-works-video.png')});
 await page.locator('#gallery-autoplay').click();assert(await page.locator('#portfolio-video').evaluate(v=>v.paused));
 await page.locator('#gallery-autoplay').click();
 await page.locator('#portfolio-video').evaluate(v=>{v.currentTime=v.duration-.2});
 await page.waitForFunction(()=>!document.querySelector('#gallery-open').classList.contains('is-video'));
 await page.waitForTimeout(250);assert.equal(await page.locator('#work-counter').innerText(),'01 / 19');
 await page.screenshot({path:path.join(out,'04-works-images.png')});
 await page.locator('#open-collection').click();assert.equal(await page.locator('.collection-grid>button').count(),19);await page.locator('#close-collection').click();
 const videoTime=await page.locator('#city-flight').evaluate(v=>v.currentTime);
 await page.locator('.journey-nav [data-destination="artist"]').click();await page.waitForFunction(()=>window.AnaFlight.scene==='artist'&&!window.AnaFlight.travelling);
 assert.equal(await page.locator('#city-flight').evaluate(v=>v.currentTime),videoTime);
 await page.screenshot({path:path.join(out,'05-artist.png')});
 await page.locator('.artist-actions a').first().click();await page.waitForTimeout(1200);
 await page.screenshot({path:path.join(out,'06-interior.png')});
 const returnButton=page.locator('.ana-interior-layer [data-interior-return-button]');
 if(await returnButton.count())await returnButton.click();else await page.keyboard.press('Escape');
 await page.waitForTimeout(1000);
 await page.locator('.journey-nav [data-destination="contact"]').click();await page.waitForFunction(()=>window.AnaFlight.scene==='contact'&&!window.AnaFlight.travelling);
 await page.screenshot({path:path.join(out,'07-contact.png')});
 await page.locator('#open-project-form').click();await page.screenshot({path:path.join(out,'08-form.png')});
 await page.locator('input[name=nome]').fill('Pessoa Teste');await page.locator('input[name=idade]').fill('27');await page.locator('textarea[name=ideia]').fill('Corvo em neon');await page.locator('input[name=local]').fill('Antebraço');await page.locator('input[name=tamanho]').fill('15 cm');
 await page.evaluate(()=>{window.open=(url)=>{window.__testedWhatsApp=url}});
 await page.locator('.project-submit').click();const url=await page.evaluate(()=>window.__testedWhatsApp);assert(url.startsWith('https://wa.me/5511919007582?text='));assert(decodeURIComponent(url).includes('Corvo em neon'));
 await page.keyboard.press('Escape');assert(await page.locator('#open-project-form').evaluate(el=>el===document.activeElement));
 for(const viewport of [{width:360,height:640},{width:1440,height:900}]){
  await page.setViewportSize(viewport);await page.waitForTimeout(250);
  for(const scene of ['city','works','artist','contact']){
   await page.evaluate(s=>window.AnaFlight.go(s),scene);await page.waitForFunction(s=>window.AnaFlight.scene===s&&!window.AnaFlight.travelling,scene);await page.waitForTimeout(100);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.screenshot({path:path.join(out,`${viewport.width}-${scene}.png`)});
  }
 }
 console.log(JSON.stringify({base,loadingMid:mid,works:19,errors,passed:true}));assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
