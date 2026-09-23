const { chromium } = require('C:/Users/crist.PC/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const assert = require('assert');
const base = process.env.QA_URL || 'http://127.0.0.1:4178/';
(async () => {
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(base);
  await p.locator('.byte-entry__start:not([disabled])').click();
  await p.locator('.byte-entry').waitFor({ state: 'detached' });
  const settle = name => p.waitForFunction(n => AnaFlight.scene === n && !AnaFlight.travelling, name);
  await p.mouse.move(190, 420);
  await p.mouse.wheel(0, 650);
  await settle('works');
  await p.waitForFunction(() => document.querySelector('#portfolio-video').currentTime > .1);
  assert(await p.evaluate(() => scrollY > 0 && document.querySelector('.city-viewport').getBoundingClientRect().top === 0));
  for (const selector of ['.scene-back', '.scene-next']) {
    const r = await p.locator(selector).boundingBox();
    assert(r.y > 730 && r.y + r.height <= 844, JSON.stringify(r));
    assert.notEqual(await p.locator(selector).evaluate(el => getComputedStyle(el).boxShadow), 'none');
  }
  await p.mouse.wheel(0, 844); await settle('artist');
  await p.mouse.wheel(0, 844); await settle('contact');
  assert(await p.locator('.scene-next').isHidden());
  await p.locator('.scene-back').click(); await settle('artist');
  assert.equal(await p.evaluate(() => scrollY), 1688);
  await p.locator('.artist-actions a').first().click();
  await p.waitForFunction(() => document.querySelector('.ana-interior-layer').classList.contains('content-ready'));
  const before = await p.evaluate(() => scrollY);
  await p.frameLocator('.ana-interior-layer__iframe').locator('.artist-feature').scrollIntoViewIfNeeded();
  assert.equal(await p.evaluate(() => scrollY), before);
  await p.locator('.ana-interior-layer__close').click();
  await p.waitForFunction(() => document.querySelector('.ana-interior-layer').hidden);
  assert.equal(await p.evaluate(() => scrollY), before);
  await p.mouse.wheel(0, -844); await settle('works');
  await p.mouse.wheel(0, -844); await settle('city');

  // Native touch scrolling, including a gesture starting over the media panel.
  const session = await p.context().newCDPSession(p);
  async function swipe() {
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 690 }] });
    for (let y = 650; y >= 130; y -= 40) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 190, y }] });
      await p.waitForTimeout(22);
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await swipe(); await settle('works');
  await p.locator('.scene-next').click(); await settle('artist');
  await p.locator('.scene-back').click(); await settle('works');
  await swipe(); await settle('artist');
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ passed: true, nativeWheel: true, nativeTouch: true, bottomNeonControls: true, interiorScrollPreserved: true, errors }));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
