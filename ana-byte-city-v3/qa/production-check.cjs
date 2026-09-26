const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(__dirname,'production');fs.mkdirSync(out,{recursive:true});
const base=process.env.ANA_QA_URL||'https://cristianlf23.github.io/ana-byte-site/ana-byte-city-v3/';
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
  const report={date:new Date().toISOString(),base,assets:[],views:[],errors:[]};
  try{
    const context=await browser.newContext();
    for(const file of ['assets/backgrounds/city-desktop.webp','assets/backgrounds/city-mobile.webp','assets/backgrounds/city-mobile-600.webp','assets/ui/ana-byte-mark.png','assets/fonts/Orbitron-Variable.ttf','assets/artist/15-ana-working.jpg','assets/artist/23-ana-studio.jpg','assets/fidelity.css','assets/v3.js']){
      const response=await context.request.get(new URL(file,base).href);assert.equal(response.status(),200,file);
      const remote=await response.body(),local=fs.readFileSync(path.join(root,file));
      const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
      // Git publishes LF text while the Windows checkout may use CRLF.
      const textFile=/\.(css|js)$/.test(file),canonical=b=>textFile?Buffer.from(b.toString('utf8').replace(/\r\n/g,'\n')):b;
      assert.equal(hash(canonical(remote)),hash(canonical(local)),file);
      report.assets.push({file,status:response.status(),sha256:hash(remote),comparison:textFile?'content with normalized line endings':'byte identical'});
    }
    await context.close();
    for(const [width,height] of [[1440,900],[390,844]]){
      const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      page.on('pageerror',e=>report.errors.push(e.message));
      page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url())});
      for(const [route,label] of [['','home'],['portfolio/','portfolio'],['sobre/','about']]){
        const response=await page.goto(new URL(route,base).href,{waitUntil:'networkidle'});assert.equal(response.status(),200);
        await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.getAttribute('src')&&i.checkVisibility()).map(i=>i.decode().catch(()=>{})))});
        const metrics=await page.evaluate(()=>({title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,badImages:[...document.images].filter(i=>i.getAttribute('src')&&i.checkVisibility()&&(!i.complete||!i.naturalWidth)).map(i=>i.src),heading:document.querySelector('h1')?.textContent}));
        assert.ok(metrics.scrollWidth<=width+1);assert.deepEqual(metrics.badImages,[]);
        await page.screenshot({path:path.join(out,`${label}-${width}.png`)});
        report.views.push({route,width,status:200,...metrics});
        if(label==='home')for(const [selector,view] of [['#trabalhos','archive'],['.artist-story','story'],['.footer','footer']]){
          await page.locator(selector).evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-(innerWidth<1024?82:0),behavior:'instant'}));
          await page.waitForTimeout(900);
          await page.evaluate(async()=>Promise.all([...document.images].filter(i=>i.getAttribute('src')&&i.checkVisibility()).map(i=>i.decode().catch(()=>{}))));
          await page.screenshot({path:path.join(out,`${view}-${width}.png`)});
          report.views.push({route,width,status:200,view});
        }
      }
      await page.close();
    }
    assert.deepEqual(report.errors,[]);
    fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify({views:report.views.length,assetsVerified:report.assets.length,errors:report.errors}));
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
