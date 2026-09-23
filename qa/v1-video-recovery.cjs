const { chromium } = require('C:/Users/crist.PC/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const assert = require('assert');
const base = process.env.QA_URL || 'http://127.0.0.1:4178/';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  async function page(mode) {
    const p = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    p.on('pageerror', e => errors.push(e.message));
    if (mode === 'failed') await p.route('**/ana-portfolio.mp4', route => route.abort());
    if (mode === 'blocked' || mode === 'interrupted') await p.addInitScript(mode => {
      const play = HTMLMediaElement.prototype.play;
      let first = true;
      HTMLMediaElement.prototype.play = function () {
        if (this.id === 'portfolio-video' && first) {
          first = false;
          if (mode === 'blocked') return Promise.reject(new DOMException('User gesture required', 'NotAllowedError'));
          play.call(this).catch(() => {});
          return new Promise((resolve, reject) => { window.rejectOldPlay = () => reject(new DOMException('Interrupted', 'AbortError')); });
        }
        return play.call(this);
      };
    }, mode);
    await p.goto(base);
    await p.locator('.byte-entry__start:not([disabled])').click();
    await p.locator('.byte-entry').waitFor({ state: 'detached' });
    await p.locator('.discover-world').click();
    await p.waitForFunction(() => AnaFlight.scene === 'works' && !AnaFlight.travelling);
    return p;
  }
  const blocked = await page('blocked');
  await blocked.locator('.video-hint').waitFor({ state: 'visible' });
  assert((await blocked.locator('#portfolio-video').getAttribute('poster')).includes('19-neon-portrait.jpg'));
  await blocked.locator('#gallery-open').click();
  await blocked.waitForFunction(() => document.querySelector('#portfolio-video').currentTime > .2);
  assert(await blocked.locator('.video-hint').isHidden());
  await blocked.close();

  const failed = await page('failed');
  await failed.waitForFunction(() => !document.querySelector('#gallery-open').classList.contains('is-video'));
  await failed.waitForFunction(() => document.querySelector('#work-counter').textContent === '01 / 19');
  assert.equal(await failed.locator('#work-counter').innerText(), '01 / 19');
  assert((await failed.locator('#gallery-image').getAttribute('src')).includes('19-neon-portrait.jpg'));
  assert(await failed.locator('.artist-image').isHidden());
  await failed.close();

  const interrupted = await page('interrupted');
  await interrupted.locator('.scene-next').click();
  await interrupted.waitForFunction(() => AnaFlight.scene === 'artist' && !AnaFlight.travelling);
  await interrupted.locator('.scene-back').click();
  await interrupted.waitForFunction(() => AnaFlight.scene === 'works' && !AnaFlight.travelling);
  await interrupted.evaluate(() => window.rejectOldPlay());
  await interrupted.waitForTimeout(400);
  assert(!(await interrupted.locator('#portfolio-video').evaluate(v => v.paused)));
  assert(await interrupted.locator('.video-hint').isHidden());
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ passed: true, blockedAutoplayRecovery: true, missingVideoFallback: true, stalePlayIgnored: true, errors }));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
