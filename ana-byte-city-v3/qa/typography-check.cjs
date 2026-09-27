const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const base=process.env.ANA_QA_URL||'http://127.0.0.1:4183/';
const out=path.join(__dirname,'round-typography');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
 const report=[];
 try{
  for(const width of [320,390,768,1024,1440,1920]){
   const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
   await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const result=await page.evaluate(()=>{
    const rect=s=>document.querySelector(s)?.getBoundingClientRect();
    const size=s=>Number.parseFloat(getComputedStyle(document.querySelector(s)).fontSize);
    const within=(parent,child)=>{const a=rect(parent),b=rect(child);return !!(a&&b&&b.bottom<=a.bottom+2&&b.left>=a.left-2&&b.right<=a.right+2)};
    return {overflow:document.documentElement.scrollWidth-innerWidth,
      heroSub:size('.hero-sub'),archiveIntro:size('.archive-transposed .archive-heading .tracked'),
      processCopy:size('.process-intro>p:not(.tracked):not(.eyebrow)'),
      artistCopy:size('.artist-copy>p:not(.tracked):not(.eyebrow)'),
      contactCopy:size('.contact-description'),formInput:size('.project-form input'),
      artistButtonFits:within('.artist-composition','.artist-copy>a:last-child'),
      archiveCopyFits:within('.archive-transposed .archive-heading','.archive-transposed .archive-heading>div:nth-child(2)')};
   });
   assert.ok(result.overflow<=1,`horizontal overflow at ${width}: ${result.overflow}`);
   assert.ok(result.artistButtonFits,`artist copy clipped at ${width}`);
   assert.ok(result.archiveCopyFits,`archive copy clipped at ${width}`);
   if(width<768)assert.ok(result.formInput>=16,`mobile form input shrank at ${width}`);
   if(width===320||width===768){await page.locator('.hero').screenshot({path:path.join(out,`hero-${width}.png`)})}
   if(width===390||width===1440){
    for(const [label,selector] of [['archive','.archive-transposed .archive-heading'],['process','#processo'],['artist','.artist-composition'],['story','.artist-story'],['contact','#contato']]){
     await page.locator(selector).screenshot({path:path.join(out,`${label}-${width}.png`)});
    }
   }
   report.push({width,...result});await page.close();
  }
  console.log(JSON.stringify(report,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
