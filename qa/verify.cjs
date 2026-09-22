const { chromium } = require('C:/Users/crist.PC/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
 const browser = await chromium.launch({headless:true});
 const results = [];
 const routes = ['', 'trabalhos/', 'sobre/', 'orcamento/', 'trabalhos/circuito-organico/'];
 const output = __dirname;
 for (const width of [390, 1440]) {
  const page = await browser.newPage({viewport:{width,height:900}, reducedMotion:'reduce'});
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  for(const route of routes) {
   const response = await page.goto('http://127.0.0.1:4178/'+route);
   assert.equal(response.status(),200);
   await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,15));}scrollTo(0,0);});
   await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.filter(i=>i.getAttribute('src')).map(i=>i.decode().catch(()=>{}))));
   const state = await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth, broken:[...document.images].filter(i=>i.getAttribute('src')&&(!i.complete||!i.naturalWidth)).length, h1:document.querySelectorAll('h1').length, whatsapp:[...document.querySelectorAll('a[href*="wa.me"]')].map(a=>new URL(a.href).pathname)}));
   assert.equal(state.overflow,false,`Overflow ${width} ${route}`);assert.equal(state.broken,0);assert.equal(state.h1,1);
   assert(state.whatsapp.every(n=>n==='/5511919007582'));
   await page.screenshot({path:path.join(output,`${width}-${route.replaceAll('/','_')||'home'}.png`),fullPage:true});
   await page.screenshot({path:path.join(output,`${width}-${route.replaceAll('/','_')||'home'}-viewport.png`)});
   results.push({width,route,...state});
  }
  await page.goto('http://127.0.0.1:4178/trabalhos/');
  const first=page.locator('[data-lightbox]').first();await first.click();assert(await page.locator('dialog').evaluate(d=>d.open));
  const before=await page.locator('[data-lightbox-image]').getAttribute('src');await page.keyboard.press('ArrowRight');assert.notEqual(await page.locator('[data-lightbox-image]').getAttribute('src'),before);
  await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);assert(await first.evaluate(a=>a===document.activeElement));
  if(width===390){await page.locator('[data-menu-toggle]').click();assert(await page.locator('main').evaluate(m=>m.inert));await page.keyboard.press('Escape');assert.equal(await page.locator('main').evaluate(m=>m.inert),false);}
  assert.deepEqual(errors,[]);await page.close();
 }
 const plain=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await plain.goto('http://127.0.0.1:4178/');assert.equal(await plain.locator('h1').evaluate(e=>getComputedStyle(e.closest('[data-reveal]')).opacity),'1');
 await plain.close();
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({results,interactionChecks:'passed',noJavascriptContent:'passed'},null,2));
 await browser.close();console.log('PASS: 10 route/viewport checks, gallery keyboard, focus return, mobile menu, no-JS visibility.');
})().catch(e=>{console.error(e);process.exit(1)});
