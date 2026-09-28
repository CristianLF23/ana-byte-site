const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.ANA_QA_URL||'http://127.0.0.1:4183/';
const out=path.join(__dirname,process.argv[2]||'chapter-motion-qa');fs.mkdirSync(out,{recursive:true});

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
  const errors=[],report=[];
  try{
    for(const [width,height] of [[1440,900],[390,844]]){
      const page=await browser.newPage({viewport:{width,height}});
      page.on('pageerror',error=>errors.push(error.message));
      page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`)});
      await page.goto(base,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>window.ScrollTrigger?.getAll().some(trigger=>trigger.vars.id==='chapter-launch-0'));
      assert.equal(await page.locator('.motion-title-frame').count(),5);
      const frame=page.locator('#process-title').locator('xpath=..');
      const position=async fraction=>{
        await frame.evaluate((element,viewportFraction)=>window.scrollTo({top:element.getBoundingClientRect().top+scrollY-innerHeight*viewportFraction,behavior:'instant'}),fraction);
        await page.waitForTimeout(850);
        return page.locator('#process-title').evaluate(element=>Number(gsap.getProperty(element,'y')));
      };
      const before=await position(.98);
      const settled=await position(width<768?.56:.38);
      assert.ok(before>settled+20,`title must rise with scroll at ${width}px: ${before} -> ${settled}`);
      await page.screenshot({path:path.join(out,`process-${width}.png`)});
      const reversed=await position(.98);
      assert.ok(reversed>settled+20,`title must reverse with scroll at ${width}px`);

      const proof=page.locator('.process-proof').first();
      const window=proof.locator('a');
      await proof.evaluate(element=>scrollTo({top:element.getBoundingClientRect().top+scrollY-innerHeight*.98,behavior:'instant'}));await page.waitForTimeout(850);
      const imageBefore=await window.evaluate(element=>Number(gsap.getProperty(element,'y')));
      await proof.evaluate(element=>scrollTo({top:element.getBoundingClientRect().top+scrollY-innerHeight*.42,behavior:'instant'}));await page.waitForTimeout(850);
      const imageAfter=await window.evaluate(element=>Number(gsap.getProperty(element,'y')));
      assert.ok(imageBefore>imageAfter+15,`process image must travel within its frame at ${width}px`);
      const story=page.locator('.artist-story'),portrait=page.locator('.artist-story-portrait');
      await story.evaluate(element=>scrollTo({top:element.getBoundingClientRect().top+scrollY-innerHeight*.98,behavior:'instant'}));await page.waitForTimeout(850);
      const portraitBefore=await portrait.evaluate(element=>({y:Number(gsap.getProperty(element,'y')),clip:getComputedStyle(element).clipPath}));
      await story.evaluate(element=>scrollTo({top:element.getBoundingClientRect().top+scrollY-innerHeight*.3,behavior:'instant'}));await page.waitForTimeout(850);
      const portraitAfter=await portrait.evaluate(element=>({y:Number(gsap.getProperty(element,'y')),clip:getComputedStyle(element).clipPath}));
      assert.ok(portraitBefore.y>portraitAfter.y+15,`artist portrait must arrive from below at ${width}px`);
      assert.notEqual(portraitBefore.clip,portraitAfter.clip,'artist portrait aperture must open');
      await page.screenshot({path:path.join(out,`artist-${width}.png`)});
      await page.evaluate(()=>document.querySelector('.motion-switch').click());
      assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().length),0,'pause effects must remove scroll motion');
      assert.equal(await page.locator('#process-title').evaluate(element=>getComputedStyle(element).opacity),'1');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
      report.push({width,title:{before,settled,reversed},image:{before:imageBefore,after:imageAfter},portrait:{before:portraitBefore.y,after:portraitAfter.y},paused:true});
      await page.close();

      const deepLink=await browser.newPage({viewport:{width,height}});
      await deepLink.goto(new URL('index.html#processo',base).href,{waitUntil:'load'});
      await deepLink.waitForTimeout(900);
      assert.ok(await deepLink.locator('#process-title').evaluate(element=>Number(getComputedStyle(element).opacity)>.9),`direct process link must reveal its title at ${width}px`);
      await deepLink.close();
    }

    const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
    await reduced.goto(base,{waitUntil:'load'});
    assert.equal(await reduced.evaluate(()=>ScrollTrigger.getAll().length),0);
    assert.equal(await reduced.locator('#process-title').evaluate(element=>getComputedStyle(element).opacity),'1');
    assert.equal(await reduced.locator('.process-proof').first().locator('a').isVisible(),true);
    await reduced.close();
    assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({base,report,reducedMotion:'static and readable',errors},null,2));
    console.log(JSON.stringify({report,reducedMotion:'static and readable',errors}));
  }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
