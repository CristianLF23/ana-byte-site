const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=process.env.ANA_QA_URL||'http://127.0.0.1:4183/';
const out=path.join(__dirname,'locale-country-qa');fs.mkdirSync(out,{recursive:true});

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
  const errors=[];
  try{
    for(const [country,expected,width] of [['BR','pt-BR',390],['US','en',375],['US','en',390],['DE','en',768],['DE','en',1280],['DE','en',1440]]){
      const context=await browser.newContext({viewport:{width,height:844},timezoneId:country==='BR'?'America/Sao_Paulo':'Europe/Berlin',locale:'pt-BR'});
      await context.route('https://ipwho.is/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true,country_code:country})}));
      const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
      await page.goto(base,{waitUntil:'load'});
      await page.waitForFunction(()=>window.ANA_LOCALE_READY&&document.documentElement.classList.contains('locale-pending')===false);
      assert.equal(await page.locator('html').getAttribute('lang'),expected);
      assert.equal(await page.locator('[data-language="en"]').getAttribute('aria-pressed'),String(expected==='en'));
      if(expected==='en'){
        assert.match(await page.locator('#hero-title').innerText(),/A PLACE\s+BETWEEN\s+WORLDS/);
        assert.equal(await page.locator('.hero-location').textContent(),'Studio in São Paulo');
        assert.match(await page.locator('#archive-title').innerText(),/LIVING\s+ARCHIVE/);
        assert.match(await page.locator('.project-form').innerText(),/What inspires you\?/i);
        assert.equal(await page.locator('.portfolio-thumb').count(),19);
        assert.equal((await page.locator('.portfolio-thumb').first().locator('strong').innerText()).toLowerCase(),'anatomy of the future');
        await page.screenshot({path:path.join(out,`english-hero-${country}-${width}.png`)});
        await page.locator('[data-filter="tattoo"]').click();
        assert.match(await page.locator('.portfolio-count').innerText(),/works in this selection/);
        await page.locator('.portfolio-thumb:not([hidden])').first().click();
        if(width<768){assert.equal(await page.locator('.art-dialog').evaluate(element=>element.open),true);assert.match(await page.locator('[data-detail-kind]').innerText(),/Original tattoo/i);await page.locator('.dialog-close').click()}
        else assert.match(await page.locator('[data-selected-kind]').innerText(),/Original tattoo/i);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
        if(country==='DE'){
          fs.writeFileSync(path.join(out,'english-copy.txt'),await page.locator('body').innerText());
          fs.writeFileSync(path.join(out,'english-accessible.txt'),(await page.locator('[aria-label],[placeholder],[alt]').evaluateAll(elements=>elements.flatMap(element=>['aria-label','placeholder','alt'].map(name=>element.getAttribute(name)).filter(Boolean)))).join('\n'));
          fs.writeFileSync(path.join(out,'hero-measure.json'),JSON.stringify(await page.evaluate(()=>{const h=document.querySelector('.billboard h1'),line=h.children[1],range=document.createRange();range.selectNodeContents(line);const text=range.getBoundingClientRect(),panel=document.querySelector('.billboard').getBoundingClientRect();return{text:{left:text.left,right:text.right,width:text.width},panel:{left:panel.left,right:panel.right,width:panel.width},font:getComputedStyle(h).fontSize}}),null,2));
        }
        await page.screenshot({path:path.join(out,`english-${country}-${width}.png`)});
      }else{
        assert.match(await page.locator('#hero-title').innerText(),/UM LUGAR\s+ENTRE\s+MUNDOS/);
      }
      if(country==='US'){
        await page.evaluate(()=>{window.open=url=>{window.__whatsappDraft=url;return null}});
        await page.locator('[name="ideia"]').fill('A cybernetic raven with magenta accents');
        await page.locator('[name="regiao"]').selectOption({label:'Arm'});
        await page.locator('[name="tamanho"]').fill('12 cm');
        await page.locator('[name="nome"]').fill('Alex');
        await page.locator('.project-form button[type="submit"]').click();
        const draft=await page.evaluate(()=>new URL(window.__whatsappDraft).searchParams.get('text'));
        assert.match(draft,/My idea: A cybernetic raven/);
        assert.match(draft,/Body placement: Arm/);
        assert.match(await page.locator('.form-status').innerText(),/ready to review in WhatsApp/);
        await page.locator('.menu-toggle').click();
        await page.locator('[data-language="pt"]').click();
        await page.waitForFunction(()=>document.documentElement.lang==='pt-BR'&&document.documentElement.classList.contains('locale-pending')===false);
        assert.match(await page.locator('#hero-title').innerText(),/UM LUGAR/);
        assert.equal(await page.locator('[data-language="pt"]').getAttribute('aria-pressed'),'true');
      }
      await context.close();
    }
    const fallback=await browser.newContext({viewport:{width:390,height:844},timezoneId:'Europe/Berlin',locale:'pt-BR'});
    await fallback.route('https://ipwho.is/**',route=>route.abort());
    const page=await fallback.newPage();page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base,{waitUntil:'load'});await page.waitForFunction(()=>document.documentElement.classList.contains('locale-pending')===false);
    assert.equal(await page.locator('html').getAttribute('lang'),'en');await fallback.close();
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({countries:['BR → PT','US → EN','DE → EN'],manualOverride:'persists',fallback:'outside-Brazil timezone → EN',errors}));
  }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
