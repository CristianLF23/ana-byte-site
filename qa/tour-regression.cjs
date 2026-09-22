const {chromium}=require('C:/Users/crist.PC/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true}),results=[],errors=[];
 const routes=['','trabalhos/','sobre/','orcamento/','trabalhos/circuito-organico/'];
 for(const width of [360,390,430,768,1440]){
  const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){
   const response=await page.goto('http://127.0.0.1:4178/'+route);assert.equal(response.status(),200);
   await page.waitForFunction(()=>!document.querySelector('.ana-intro'));
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
   const state=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.getAttribute('src')&&!i.naturalWidth).map(i=>i.src),h1:document.querySelectorAll('h1').length,phone:[...document.querySelectorAll('a[href*="wa.me"]')].map(a=>new URL(a.href).pathname)}));
   assert.equal(state.overflow,false,`${width} ${route} overflow`);assert.deepEqual(state.broken,[]);assert.equal(state.h1,1);assert(state.phone.every(p=>p==='/5511919007582'));results.push({route,...state});
  }await page.close();
 }
 for(const [width,height] of [[360,740],[375,667],[430,932],[768,1024],[1440,900]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:width<600,hasTouch:width<600});page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4178/');await page.waitForFunction(()=>!document.querySelector('.ana-intro'));
  await page.locator('.tour-enter').first().click();await page.waitForTimeout(600);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`normal ${width} overflow`);
  await page.screenshot({path:path.join(__dirname,`v2-tour-${width}x${height}.png`)});
  if(width<600){
   const before=await page.locator('#obra-1 .stop-image').evaluate(el=>({top:el.closest('.stop-stage').getBoundingClientRect().top,transform:getComputedStyle(el).transform}));
   await page.evaluate(()=>scrollBy({top:400,behavior:'instant'}));await page.waitForTimeout(600);
   const after=await page.locator('#obra-1 .stop-image').evaluate(el=>({top:el.closest('.stop-stage').getBoundingClientRect().top,transform:getComputedStyle(el).transform}));
   assert(Math.abs(after.top-64)<2,'mobile stage not sticky');assert.notEqual(after.transform,before.transform,'scroll effect unchanged');
   await page.screenshot({path:path.join(__dirname,`v2-tour-progress-${width}.png`)});
   results.push({viewport:[width,height],sticky:after.top,scrollChangesPhoto:true});
  }
  await page.close();
 }
 const noJS=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await noJS.goto('http://127.0.0.1:4178/');assert.equal(await noJS.locator('.tour-stop').count(),5);assert.equal(await noJS.locator('.ana-intro').count(),0);assert.equal(await noJS.locator('h1').evaluate(el=>getComputedStyle(el).opacity),'1');assert.equal(await noJS.locator('.stop-description').first().evaluate(el=>getComputedStyle(el).display==='none'),false);await noJS.close();
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'v2-regression-results.json'),JSON.stringify({pass:true,results,errors,noJS:'content visible'},null,2));await browser.close();console.log('PASS 25 route/viewports, five normal-motion viewports, sticky photo motion, no-JS.');
})().catch(e=>{console.error(e);process.exit(1)});
