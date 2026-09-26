const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const {chromium} = require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const base = process.env.ANA_QA_URL || 'http://127.0.0.1:4183/';
const results = [], errors = [];
const source = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data/catalog.js'),'utf8'), source);
const catalog = JSON.parse(JSON.stringify(source.window.ANA_CATALOG));
const exe = 'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
let browser;

async function check(name, fn) {
  try { const evidence = await fn(); results.push({name,pass:true,evidence}); console.log('PASS '+name); }
  catch (e) { results.push({name,pass:false,error:e.message}); console.error('FAIL '+name+': '+e.message); }
}
async function pageAt(route='', opts={}) {
  const context=await browser.newContext({viewport:{width:1440,height:900},...opts});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
  await page.goto(new URL(route,base).href,{waitUntil:'networkidle'});
  return {page,close:()=>context.close()};
}
const visibleIds=page=>page.locator('.portfolio-thumb:visible').evaluateAll(els=>els.map(el=>el.dataset.art));

(async()=>{
  browser=await chromium.launch({headless:true,executablePath:exe});
  await check('22 arquivos reais preservados byte a byte',async()=>{
    const files=[...catalog.map(w=>w.src),...source.window.ANA_ARTIST.photos.map(w=>w.src)];
    for(const file of files){
      const dest=fs.readFileSync(path.join(root,file));
      const original=fs.readFileSync(path.join(root,'../assets/images',path.basename(file)));
      assert.equal(crypto.createHash('sha256').update(dest).digest('hex'),crypto.createHash('sha256').update(original).digest('hex'),file);
    }
    return {count:files.length};
  });
  await check('Acervo paginado: 19 obras sem perdas ou duplicatas',async()=>{
    const {page,close}=await pageAt('portfolio/');
    try{
      const seen=[],counts=[];
      for(let i=0;i<4;i++){
        const ids=await visibleIds(page);seen.push(...ids);counts.push(ids.length);
        assert.equal(await page.locator('[data-page-count]').textContent(),`0${i+1} / 04`);
        if(i<3)await page.locator('.page-next').click();
      }
      assert.deepEqual(counts,[6,6,6,1]);assert.equal(new Set(seen).size,19);
      assert.deepEqual(seen,catalog.map(w=>w.id));
      assert.equal(await page.locator('.page-next').isDisabled(),true);
      await page.locator('.page-prev').click();
      assert.equal(new URL(page.url()).searchParams.get('pagina'),'3');
      await page.reload({waitUntil:'networkidle'});
      assert.deepEqual(await visibleIds(page),catalog.slice(12,18).map(w=>w.id));
      return {counts,total:seen.length};
    }finally{await close()}
  });
  await check('Filtros, ordenação e links diretos restauram a seleção',async()=>{
    const {page,close}=await pageAt('portfolio/');
    try{
      const counts={};
      for(const kind of ['tattoo','process','digital']){
        await page.locator(`[data-filter="${kind}"]`).click();
        const expected=catalog.filter(w=>kind==='process'?w.kind==='Processo real':kind==='tattoo'?w.kind==='Tatuagem autoral':w.category===kind);
        assert.deepEqual(await visibleIds(page),expected.slice(0,6).map(w=>w.id));counts[kind]=expected.length;
        assert.equal(await page.locator(`[data-filter="${kind}"]`).getAttribute('aria-pressed'),'true');
        assert.equal(new URL(page.url()).searchParams.get('tipo'),kind);
      }
      await page.selectOption('#portfolio-sort','title');
      const names=catalog.filter(w=>w.category==='digital').sort((a,b)=>a.title.localeCompare(b.title,'pt-BR')).map(w=>w.id);
      assert.deepEqual(await visibleIds(page),names);
      await page.reload({waitUntil:'networkidle'});assert.deepEqual(await visibleIds(page),names);
      await page.goto(new URL('portfolio/?tipo=process',base).href,{waitUntil:'networkidle'});
      assert.equal((await visibleIds(page)).length,6);
      return counts;
    }finally{await close()}
  });
  await check('Destaque desktop e ampliação com anotações reais',async()=>{
    const {page,close}=await pageAt('portfolio/');
    try{
      await page.locator('.portfolio-thumb').nth(2).click();
      assert.equal(await page.locator('[data-selected-title]').textContent(),catalog[2].title);
      assert.equal(await page.locator('.art-dialog').evaluate(d=>d.open),false);
      await page.locator('.selected-next').click();
      assert.equal(await page.locator('[data-selected-title]').textContent(),catalog[3].title);
      await page.locator('[data-selected-open]').click();
      assert.equal(await page.locator('.art-dialog').evaluate(d=>d.open),true);
      assert.equal(await page.locator('[data-detail-technique]').textContent(),catalog[3].technique);
      assert.equal(await page.locator('[data-detail-difference]').textContent(),catalog[3].difference);
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('[data-detail-title]').textContent(),catalog[4].title);
      const wa=new URL(await page.locator('[data-detail-contact]').getAttribute('href'));
      assert.equal(wa.hostname,'wa.me');assert.ok(wa.searchParams.get('text').includes(catalog[4].title));
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.art-dialog').evaluate(d=>d.open),false);
      assert.equal(await page.locator('[data-selected-open]').evaluate(el=>el===document.activeElement),true);
      return {selected:catalog[3].title,next:catalog[4].title,focusRestored:true};
    }finally{await close()}
  });
  await check('Modal mobile: teclado, foco contido e retorno ao cartão',async()=>{
    const {page,close}=await pageAt('portfolio/',{viewport:{width:390,height:844},hasTouch:true});
    try{
      const card=page.locator('.portfolio-thumb').first();await card.focus();await page.keyboard.press('Enter');
      assert.equal(await page.locator('.art-dialog').evaluate(d=>d.open),true);
      for(let i=0;i<15;i++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>!!document.activeElement.closest('.art-dialog')),true)}
      await page.keyboard.press('Escape');
      assert.equal(await card.evaluate(el=>el===document.activeElement),true);
      await page.goto(new URL('portfolio/#obra=o-voo-da-noite',base).href,{waitUntil:'networkidle'});
      assert.equal(await page.locator('[data-detail-title]').textContent(),'O voo da noite');
      return {tabChecks:15,directLink:true};
    }finally{await close()}
  });
  await check('Navegação mobile, pausa da atmosfera e scroll nativo',async()=>{
    const {page,close}=await pageAt('',{viewport:{width:390,height:844},hasTouch:true});
    try{
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
      await page.locator('.menu-effects').click();
      assert.equal(await page.locator('html').evaluate(el=>el.classList.contains('effects-paused')),true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
      assert.equal(await page.locator('.menu-toggle').evaluate(el=>el===document.activeElement),true);
      await page.mouse.wheel(0,800);await page.waitForTimeout(450);
      assert.ok(await page.evaluate(()=>scrollY)>200);
      assert.equal(await page.locator('.rail').evaluate(el=>el.classList.contains('is-scrolled')),true);
      return {nativeScroll:await page.evaluate(()=>scrollY)};
    }finally{await close()}
  });
  await check('Formulário valida e prepara rascunho sem enviar mensagem',async()=>{
    const {page,close}=await pageAt();
    try{
      await page.evaluate(()=>{window.__opened=[];window.open=(url)=>{window.__opened.push(url);return null}});
      const form=page.locator('.project-form');
      assert.equal(await form.evaluate(el=>el.checkValidity()),false);
      await form.locator('[name=ideia]').fill('Um corvo com circuitos e cores da Ana.');
      await form.locator('[name=regiao]').selectOption({label:'Antebraço'});
      await form.locator('[name=tamanho]').fill('12,5 x 8 cm');
      await form.locator('[name=nome]').fill('Teste de validação');
      await form.locator('[name=telefone]').fill('(11) 99999 0000');
      assert.equal(await form.evaluate(el=>el.checkValidity()),true);
      await form.locator('button[type=submit]').click();
      const opened=await page.evaluate(()=>window.__opened);assert.equal(opened.length,1);
      const url=new URL(opened[0]);assert.equal(url.origin+url.pathname,'https://wa.me/5511919007582');
      const message=url.searchParams.get('text');
      for(const text of ['Teste de validação','Um corvo com circuitos','Antebraço','12,5 x 8 cm','(11) 99999 0000'])assert.ok(message.includes(text),text);
      assert.equal(await form.locator('.form-status a').getAttribute('href'),opened[0]);
      assert.equal(await page.evaluate(()=>Object.keys(localStorage).length),0);
      return {externalCalls:0,draftFields:5,stored:false};
    }finally{await close()}
  });
  await check('Vídeo por escolha, controles nativos e pausa ao fechar',async()=>{
    const {page,close}=await pageAt('portfolio/');
    try{
      assert.equal(await page.locator('video').evaluate(v=>v.paused&&!v.autoplay&&v.preload==='none'),true);
      await page.locator('.watch-film').click();
      await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
      const video=await page.locator('video').evaluate(v=>({controls:v.controls,duration:v.duration,paused:v.paused}));
      assert.equal(video.controls,true);assert.ok(video.duration>1);assert.equal(video.paused,false);
      await page.keyboard.press('Escape');
      await page.waitForFunction(()=>document.querySelector('video').paused);
      assert.equal(await page.locator('video').evaluate(v=>v.paused),true);
      assert.equal(await page.locator('.watch-film').evaluate(el=>el===document.activeElement),true);
      return video;
    }finally{await close()}
  });
  await check('Movimento reduzido desliga chuva, parallax e animação de scroll',async()=>{
    const {page,close}=await pageAt('',{reducedMotion:'reduce'});
    try{
      assert.equal(await page.locator('.city-rain').evaluate(el=>getComputedStyle(el).display),'none');
      assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().length),0);
      assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).scrollBehavior),'auto');
      assert.equal(await page.locator('.floating-whatsapp').evaluate(el=>getComputedStyle(el,'::after').animationName),'none');
      return {scrollTriggers:0,rain:false,animatedScroll:false};
    }finally{await close()}
  });
  await check('Sem JavaScript: conteúdo, 19 obras e links continuam acessíveis',async()=>{
    const sizes=[1440,390],proof=[];
    for(const width of sizes){
      const {page,close}=await pageAt('portfolio/',{javaScriptEnabled:false,viewport:{width,height:900}});
      try{
        assert.equal(await page.locator('.portfolio-thumb:visible').count(),19);
        assert.equal(await page.locator('#main-nav a:visible').count(),5);
        assert.equal(await page.locator('h1').textContent(),'ARQUIVOVIVO.');
        assert.equal(await page.locator('.portfolio-thumb').first().getAttribute('href'),'../'+catalog[0].src);
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false);
        proof.push({width,works:19,navLinks:5});
      }finally{await close()}
    }
    return proof;
  });
  await check('Rótulos de controles, títulos e âncoras internas',async()=>{
    const proof=[];
    for(const route of ['','portfolio/','sobre/']){
      const {page,close}=await pageAt(route);
      try{
        assert.equal(await page.locator('h1').count(),1);
        const issues=await page.evaluate(()=>{
          const bad=[];
          for(const el of document.querySelectorAll('button,a,input,select,textarea')){
            if(!el.checkVisibility()||el.closest('dialog:not([open])'))continue;
            const label=el.getAttribute('aria-label')||el.textContent.trim()||el.closest('label')?.textContent||el.querySelector('img')?.alt;
            if(!label)bad.push('Sem rótulo: '+el.outerHTML.slice(0,180));
          }
          for(const a of document.querySelectorAll('a[href^="#"]')){
            const id=a.getAttribute('href').slice(1);if(id&&!id.startsWith('obra=')&&!document.getElementById(id))bad.push('Âncora ausente: '+id);
          }
          return bad;
        });assert.deepEqual(issues,[]);proof.push({route,issues:0});
      }finally{await close()}
    }
    return proof;
  });
  await check('Carregamento progressivo e amostra local de movimento',async()=>{
    const {page,close}=await pageAt();
    try{
      const stats=await page.evaluate(async()=>{
        await document.fonts.ready;
        const resources=performance.getEntriesByType('resource');
        const frames=[];await new Promise(resolve=>{let last=performance.now();const tick=now=>{frames.push(now-last);last=now;if(frames.length>=120)resolve();else requestAnimationFrame(tick)};requestAnimationFrame(tick)});
        frames.sort((a,b)=>a-b);
        return {initialBytes:resources.reduce((n,r)=>n+r.transferSize,0),requests:resources.length,videoRequests:resources.filter(r=>r.name.endsWith('.mp4')).length,frameMedianMs:Number(frames[60].toFixed(2)),frameP95Ms:Number(frames[114].toFixed(2)),lazyImages:document.querySelectorAll('img[loading=lazy]').length};
      });assert.equal(stats.videoRequests,0);assert.ok(stats.lazyImages>8);return stats;
    }finally{await close()}
  });
  await check('Acervo ampliado padrão na home e filtros sem mudança de página',async()=>{
    for(const width of [1440,390]){
      const {page,close}=await pageAt('',{viewport:{width,height:900}});
      try{
        assert.equal(await page.locator('#trabalhos .portfolio-grid').count(),1);
        assert.equal((await visibleIds(page)).length,6);
        const pathname=new URL(page.url()).pathname;
        for(const filter of ['tattoo','process','digital']){
          await page.locator(`[data-filter="${filter}"]`).click();
          assert.equal(new URL(page.url()).pathname,pathname);
          assert.equal(new URL(page.url()).searchParams.get('tipo'),filter);
        }
        if(width>767)assert.equal(await page.locator('.selected-work').isVisible(),true);
        else {await page.locator('.portfolio-thumb:visible').first().click();assert.equal(await page.locator('.art-dialog').evaluate(d=>d.open),true)}
      }finally{await close()}
    }
    return {widths:[1440,390],inlineFilters:3};
  });
  await check('Mesma logo no rodapé, segunda foto real e tamanho em texto livre',async()=>{
    const proof=[];
    for(const route of ['','portfolio/','sobre/']){
      const {page,close}=await pageAt(route);
      try{
        const logo=await page.locator('.brand .wordmark img').evaluate(img=>img.src);
        assert.equal(await page.locator('.footer-brand img').evaluate(img=>img.src),logo);
        if(route!=='portfolio/'){
          assert.equal(await page.locator('.artist-story-portrait img').count(),1);
          assert.ok((await page.locator('.artist-story-copy').textContent()).includes('cinco anos'));
          const field=page.locator('[name=tamanho]');assert.equal(await field.getAttribute('type'),'text');
          for(const value of ['12 cm','12,5 x 8 cm','Aproximadamente 18 centímetros','Ainda quero decidir']){await field.fill(value);assert.equal(await field.evaluate(el=>el.checkValidity()),true)}
        }
        proof.push(route||'home');
      }finally{await close()}
    }
    return {pages:proof,freeText:true};
  });
  await check('Parallax real com rolagem e pausa reversível em todas as páginas',async()=>{
    const proof=[];
    for(const width of [1440,390]){
      const {page,close}=await pageAt('',{viewport:{width,height:900}});
      try{
        const before=await page.locator('.hero-depth').evaluate(el=>el.style.transform);
        await page.evaluate(()=>scrollTo({top:250,behavior:'instant'}));await page.waitForTimeout(950);
        const after=await page.locator('.hero-depth').evaluate(el=>el.style.transform);assert.notEqual(after,before);
        await page.locator('.motion-switch').click();
        assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().length),0);
        assert.equal(await page.locator('.light-rail i').first().evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
        await page.locator('.motion-switch').click();assert.ok(await page.evaluate(()=>ScrollTrigger.getAll().length)>0);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
        proof.push({width,before,after});
      }finally{await close()}
    }
    const {page,close}=await pageAt('sobre/');
    try{await page.locator('.motion-switch').click();assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().length),0)}finally{await close()}
    return proof;
  });
  await check('Nenhum erro de execução ou resposta HTTP ausente',async()=>{assert.deepEqual(errors,[]);return {errors:0}});
  await browser.close();
  const summary={date:new Date().toISOString(),base,engine:'Chromium 1243 headless, Windows',passed:results.filter(x=>x.pass).length,total:results.length,results};
  fs.writeFileSync(path.join(__dirname,'check-report.json'),JSON.stringify(summary,null,2));
  console.log(JSON.stringify({passed:summary.passed,total:summary.total}));
  if(summary.passed!==summary.total)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;browser?.close()});
