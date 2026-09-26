const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path');
const round=process.argv[2]||'round-1';
const out=path.join(__dirname,round);fs.mkdirSync(out,{recursive:true});
const sizes=[[1920,1080],[1600,1000],[1440,900],[1280,900],[1024,1024],[768,1024],[430,932],[390,844],[375,812]];
const base=process.env.ANA_QA_URL||'http://127.0.0.1:4183/';
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
const report=[];
async function visit([width,height]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});const errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url())});
 async function ready(){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.hasAttribute('src')).map(async i=>{i.loading='eager';try{await i.decode()}catch{}}))});await page.waitForTimeout(220)}
 async function shot(name){await page.screenshot({path:path.join(out,`${name}-${width}.png`)});const m=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>i.getAttribute('src')&&!i.closest('dialog')&&(!i.complete||!i.naturalWidth)).map(i=>i.src),heading:[...document.querySelectorAll('h1,h2')].filter(e=>e.checkVisibility()).map(e=>({text:e.textContent,w:e.clientWidth,scroll:e.scrollWidth})),page:document.body.dataset.page}));report.push({width,view:name,...m,errors:[...errors],failed:[...failed]})}
 async function align(id){await page.evaluate(id=>{const el=document.querySelector(id);const top=el.getBoundingClientRect().top+scrollY-(innerWidth<1024?82:0);scrollTo({top,behavior:'instant'})},id);await page.waitForTimeout(900)}
 await page.goto(base,{waitUntil:'networkidle'});await ready();await shot('home');
 for(const [id,name] of [['#trabalhos','archive'],['#sobre','artist'],['#contato','contact'],['.artist-story','story'],['.footer','footer']]){await align(id);await shot(name)}
 await page.goto(new URL('portfolio/',base).href,{waitUntil:'networkidle'});await ready();await shot('portfolio');
 await page.goto(new URL('sobre/',base).href,{waitUntil:'networkidle'});await ready();await shot('about');await align('.artist-story');await shot('about-story');
 await page.close();console.log(`${round}: ${width} captured`);
}
for(let i=0;i<sizes.length;i+=3)await Promise.all(sizes.slice(i,i+3).map(visit));
await browser.close();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({captures:report.length,errors:report.filter(x=>x.errors.length),overflow:report.filter(x=>x.scroll>x.width+1).map(x=>[x.width,x.view,x.scroll]),missing:report.filter(x=>x.broken.length).map(x=>[x.width,x.view,x.broken])}));
})().catch(e=>{console.error(e);process.exit(1)});
