const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const base=process.env.ANA_QA_URL||'http://127.0.0.1:4183/';
const label=process.argv[2]||'after';
const out=path.join(__dirname,'archive-desktop-audit',label);
fs.mkdirSync(out,{recursive:true});

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
  const results=[];
  try{
    for(const [width,height] of [[390,844],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080],[2560,1080]]){
      const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      const errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.route('https://ipwho.is/**',route=>route.fulfill({status:200,contentType:'application/json',body:'{"success":true,"country_code":"BR"}'}));
      await page.goto(base,{waitUntil:'load'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(300);
      await page.locator('.archive-heading').evaluate(element=>scrollTo({top:element.getBoundingClientRect().top+scrollY-80,behavior:'instant'}));
      await page.waitForTimeout(600);
      await page.screenshot({path:path.join(out,`archive-${width}.png`)});
      const metrics=await page.evaluate(()=>{
        const box=selector=>{const e=document.querySelector(selector);if(!e)return null;const r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)}};
        return {overflow:document.documentElement.scrollWidth-innerWidth,hero:box('.portfolio-hero'),archiveTitle:box('#archive-title'),quote:box('.portfolio-quote'),artwall:box('.archive-artwall'),gallery:box('.portfolio-browser'),heroDepthTransform:getComputedStyle(document.querySelector('.hero-depth')).transform};
      });
      if(label==='after'){
        assert.ok(metrics.overflow<=1,`horizontal overflow ${width}: ${metrics.overflow}`);
        assert.equal(await page.locator('.archive-artwall img').count(),5);
        assert.equal(metrics.heroDepthTransform,'none');
        assert.deepEqual(errors,[]);
      }
      if(width>=1024){
        for(const [name,selector] of [['process','#processo'],['artist','#sobre'],['contact','#contato']]){
          await page.locator(selector).evaluate(element=>scrollTo({top:element.getBoundingClientRect().top+scrollY-25,behavior:'instant'}));
          await page.waitForTimeout(250);
          await page.screenshot({path:path.join(out,`${name}-${width}.png`)});
        }
      }
      results.push({width,height,...metrics,errors});
      await page.close();
    }
    fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(results,null,2));
    console.log(JSON.stringify(results));
  }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
