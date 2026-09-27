const { chromium } = require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  const errors = [];
  for (const width of [390, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4183/', { waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('#processo .process-proof').count(), 3);
    const titles = await page.evaluate(() => Object.fromEntries(window.ANA_CATALOG.map(work => [work.id, work.title])));
    assert.equal(titles['entre-nos'], 'Cait & Vi');
    assert.equal(titles['entre-pele-e-circuito'], 'Jinx');
    assert.equal(titles['instinto-em-neon'], 'EVA 01');
    assert.equal(titles['instinto-sintetico'], 'O oitavo passageiro');
    assert.equal(titles['outra-forma-de-existir'], 'Despertar do EVA 01');
    assert.equal(titles['depois-da-meia-noite'], 'Drácula: senhor das trevas');
    assert.equal(titles['coracao-exposto'], 'Relic 2077');
    await page.locator('#processo').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    assert.match(await page.locator('#processo .process-intro').evaluate(el => getComputedStyle(el, '::before').backgroundImage), /process-neon-v1\.jpg/);
    await page.locator('#processo .process-intro').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `qa/process-intro-${width}.png` });
    const first = page.locator('#processo .process-proof').first();
    await first.scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    const reveal = await first.locator('.process-curtain').evaluate(el => ({ display: getComputedStyle(el).display, transform: getComputedStyle(el).transform }));
    assert.equal(reveal.display, 'block', `process reveal should be active at ${width}px`);
    assert.notEqual(reveal.transform, 'none');
    const size = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert.ok(size.document <= size.viewport + 1, `horizontal overflow at ${width}px`);
    await page.screenshot({ path: `qa/process-motion-${width}.png` });
    if (width === 1440) {
      const card = page.locator('.portfolio-thumb').first();
      await card.scrollIntoViewIfNeeded();
      await card.hover({ position: { x: 55, y: 80 } });
      await page.waitForTimeout(500);
      assert.match(await card.evaluate(el => el.style.getPropertyValue('--glow-x')), /%/);
      assert.equal(await card.evaluate(el => getComputedStyle(el, '::before').opacity), '1');
      await page.screenshot({ path: 'qa/card-light-1440.png' });
    }
    await page.close();
  }
  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto('http://127.0.0.1:4183/', { waitUntil: 'domcontentloaded' });
  assert.equal(await reduced.locator('.process-curtain').first().evaluate(el => getComputedStyle(el).display), 'none');
  await reduced.close();
  await browser.close();
  assert.deepEqual(errors, []);
  console.log('PASS process scroll reveal, responsive layout, pointer light, reduced motion, no page errors');
})().catch(error => { console.error(error); process.exitCode = 1; });
