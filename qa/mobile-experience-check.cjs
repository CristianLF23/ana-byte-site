const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/crist.PC/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');

const BASE = 'http://127.0.0.1:4178/';
const VIEWPORT = { width: 390, height: 844 };
const results = { viewport: VIEWPORT, base: BASE, checks: [], pageErrors: [], notes: [] };

function check(name, pass, evidence, extra) {
  results.checks.push({ name, pass: !!pass, evidence, ...(extra || {}) });
}

async function waitForIntroGone(page) {
  await page.waitForTimeout(180);
  if (await page.locator('.ana-intro').count()) {
    await page.locator('.ana-intro__enter').click({ timeout: 5000 });
    await page.locator('.ana-intro').waitFor({ state: 'detached', timeout: 1500 });
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const context = await browser.newContext({ viewport: VIEWPORT, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  page.on('pageerror', error => results.pageErrors.push({ message: error.message, url: page.url() }));
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.locator('.ana-intro').waitFor({ state: 'visible', timeout: 3000 });

  await page.keyboard.press('Tab');
  const tabTarget = await page.evaluate(() => ({ tag: document.activeElement && document.activeElement.tagName, text: document.activeElement && document.activeElement.textContent.trim() }));
  check('intro Tab trap from body', tabTarget.tag === 'BUTTON' && tabTarget.text === 'Entrar agora', `active=${JSON.stringify(tabTarget)}`);

  await page.keyboard.press('Escape');
  await page.locator('.ana-intro').waitFor({ state: 'detached', timeout: 1500 });
  const restored = await page.evaluate(() => ({
    intro: !!document.querySelector('.ana-intro'),
    bodyOpen: document.body.classList.contains('ana-intro-open'),
    headerInert: !!document.querySelector('header')?.inert,
    skipTabindex: document.querySelector('.skip-link')?.getAttribute('tabindex') || null
  }));
  check('intro Escape restores background', !restored.intro && !restored.bodyOpen && !restored.headerInert && restored.skipTabindex === null, JSON.stringify(restored));

  const menu = page.locator('[data-menu-toggle]');
  await menu.tap();
  const menuOpen = await menu.getAttribute('aria-expanded');
  await menu.tap();
  const menuClosed = await menu.getAttribute('aria-expanded');
  await page.waitForTimeout(450);
  check('mobile menu opens and closes', menuOpen === 'true' && menuClosed === 'false', `open=${menuOpen} closed=${menuClosed}`);

  const dotTwo = page.locator('[data-tour-go="1"]');
  await page.locator('.tour').evaluate(element => window.scrollTo(0, element.offsetTop + 100));
  await page.waitForTimeout(500);
  await dotTwo.tap();
  await page.waitForTimeout(80);
  const dotCurrent = await page.locator('.tour-dock a[aria-current="step"]').getAttribute('data-tour-go');
  check('tour dot navigation', dotCurrent === '1', `aria-current data-tour-go=${dotCurrent}`);
  await page.locator('.dock-next').tap();
  await page.waitForTimeout(80);
  const nextCurrent = await page.locator('.tour-dock a[aria-current="step"]').getAttribute('data-tour-go');
  check('tour next control', nextCurrent === '2', `aria-current data-tour-go=${nextCurrent}`);

  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(180);
  const tourOffset = await page.locator('.tour').evaluate(element => element.offsetTop);
  await page.evaluate(offset => window.scrollTo(0, offset + 450), tourOffset);
  await page.waitForTimeout(180);
  const stageBefore = await page.evaluate(() => ({ top: document.querySelector('.stop-stage')?.getBoundingClientRect().top, transform: getComputedStyle(document.querySelector('.stop-image')).transform }));
  await page.evaluate(offset => window.scrollTo(0, offset + 700), tourOffset);
  await page.waitForTimeout(180);
  const stageAfter = await page.evaluate(() => ({ top: document.querySelector('.stop-stage')?.getBoundingClientRect().top, transform: getComputedStyle(document.querySelector('.stop-image')).transform }));
  check('mobile stage remains top64 and image transforms', Math.abs((stageAfter.top || 999) - 64) < 2 && stageBefore.transform !== stageAfter.transform, `before=${JSON.stringify(stageBefore)} after=${JSON.stringify(stageAfter)}`);

  await page.locator('.tour').evaluate(element => window.scrollTo(0, element.offsetTop + 450));
  await page.waitForTimeout(300);
  await page.locator('.tour-dock [data-tour-go="0"]').tap();
  await page.waitForTimeout(120);
  const artworkBox = await page.locator('.artwork-open').first().boundingBox();
  const client = await context.newCDPSession(page);
  let swipeEvidence = 'no artwork bounding box';
  let swipeCurrent = null;
  if (artworkBox) {
    const y = artworkBox.y + Math.min(artworkBox.height / 2, 120);
    const x1 = artworkBox.x + artworkBox.width * .72;
    const x2 = artworkBox.x + artworkBox.width * .2;
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y }] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x2, y }] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(120);
    swipeCurrent = await page.locator('.tour-dock a[aria-current="step"]').getAttribute('data-tour-go');
    swipeEvidence = `from=${Math.round(x1)} to=${Math.round(x2)} current=${swipeCurrent}`;
  }
  check('horizontal touch swipe advances tour', swipeCurrent === '1', swipeEvidence);

  const inspect = page.locator('.inspect-trigger').first();
  await inspect.tap();
  const panel = page.locator('.insight-panel').first();
  const panelOpen = !(await panel.isHidden());
  const panelFocus = await page.evaluate(() => document.activeElement?.textContent?.trim() || '');
  await panel.locator('button').tap();
  const panelClosed = await panel.isHidden();
  const inspectFocus = await page.evaluate(() => document.activeElement?.className || '');
  check('hotspot opens and closes', panelOpen && panelClosed && panelFocus === 'Voltar à obra' && inspectFocus === 'inspect-trigger', `open=${panelOpen} focus=${panelFocus} closed=${panelClosed} restoredFocus=${inspectFocus}`);

  const artwork = page.locator('.artwork-open').first();
  await artwork.tap();
  const dialog = page.locator('[data-lightbox-dialog]');
  const dialogOpen = await dialog.evaluate(node => node.hasAttribute('open'));
  await page.locator('[data-lightbox-close]').tap();
  const dialogClosed = !(await dialog.evaluate(node => node.hasAttribute('open')));
  const modalFocus = await page.evaluate(() => document.activeElement?.className || '');
  check('image modal closes and restores focus', dialogOpen && dialogClosed && modalFocus === 'stop-zoom', `open=${dialogOpen} closed=${dialogClosed} restoredFocus=${modalFocus}`);

  const range = page.locator('#skin-range');
  await range.scrollIntoViewIfNeeded();
  await range.focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  const rangeAfterKey = await range.inputValue();
  const frame = page.locator('.transfer-frame');
  const box = await frame.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * .35, box.y + box.height * .5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * .78, box.y + box.height * .5, { steps: 4 });
    await page.mouse.up();
  }
  const rangeAfterPointer = await range.inputValue();
  check('slider keyboard and pointer input', Number(rangeAfterKey) > 0 && Number(rangeAfterPointer) !== Number(rangeAfterKey), `key=${rangeAfterKey} pointer=${rangeAfterPointer}`);

  const firstToggle = page.locator('.effects-toggle');
  await firstToggle.click();
  const pausedNow = await page.evaluate(() => ({ className: document.body.classList.contains('effects-paused'), label: document.querySelector('.effects-toggle')?.textContent.trim() }));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  const pausedReload = await page.evaluate(() => ({ className: document.body.classList.contains('effects-paused'), label: document.querySelector('.effects-toggle')?.textContent.trim(), intro: !!document.querySelector('.ana-intro') }));
  check('pause lights persists through reload', pausedNow.className && pausedReload.className && pausedReload.label === 'Ativar luzes', `beforeReload=${JSON.stringify(pausedNow)} afterReload=${JSON.stringify(pausedReload)}`);
  check('session reload skips blocking intro', !pausedReload.intro, `intro=${pausedReload.intro}`);

  const resizeErrors = [];
  page.on('pageerror', error => resizeErrors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(500);
  const desktopState = await page.evaluate(() => ({ horizontal: document.body.classList.contains('tour-horizontal'), mobile: document.body.classList.contains('mobile-immersive') }));
  await page.setViewportSize(VIEWPORT);
  await page.waitForTimeout(500);
  const mobileState = await page.evaluate(() => ({ horizontal: document.body.classList.contains('tour-horizontal'), mobile: document.body.classList.contains('mobile-immersive') }));
  check('responsive scene classes survive 390 to 1440 to 390', desktopState.horizontal && !desktopState.mobile && !mobileState.horizontal && mobileState.mobile && resizeErrors.length === 0, `desktop=${JSON.stringify(desktopState)} mobile=${JSON.stringify(mobileState)} errors=${JSON.stringify(resizeErrors)}`);

  check('no page errors in primary flow', results.pageErrors.length === 0, results.pageErrors.length ? JSON.stringify(results.pageErrors) : 'none');
  await context.close();

  const blockedContext = await browser.newContext({ viewport: VIEWPORT, isMobile: true, hasTouch: true });
  await blockedContext.route('**/assets/images/*', route => route.abort());
  const blockedPage = await blockedContext.newPage();
  const blockedErrors = [];
  blockedPage.on('pageerror', error => blockedErrors.push(error.message));
  await blockedPage.goto(BASE, { waitUntil: 'domcontentloaded' });
  await blockedPage.waitForTimeout(3400);
  const blockedState = await blockedPage.evaluate(() => ({ intro: !!document.querySelector('.ana-intro'), inert: !!document.querySelector('main')?.inert }));
  check('failed hero images release intro', !blockedState.intro && !blockedState.inert && blockedErrors.length === 0, `state=${JSON.stringify(blockedState)} errors=${JSON.stringify(blockedErrors)}`);
  await blockedContext.close();

  const slowContext = await browser.newContext({ viewport: VIEWPORT, isMobile: true, hasTouch: true });
  await slowContext.route('**/assets/images/*', async route => {
    await new Promise(resolve => setTimeout(resolve, 3200));
    await route.abort();
  });
  const slowPage = await slowContext.newPage();
  const slowErrors = [];
  slowPage.on('pageerror', error => slowErrors.push(error.message));
  await slowPage.goto(BASE, { waitUntil: 'domcontentloaded' });
  await slowPage.waitForTimeout(3400);
  const slowState = await slowPage.evaluate(() => ({ intro: !!document.querySelector('.ana-intro'), inert: !!document.querySelector('main')?.inert }));
  check('slow requests release intro at timeout', !slowState.intro && !slowState.inert && slowErrors.length === 0, `state=${JSON.stringify(slowState)} errors=${JSON.stringify(slowErrors)}`);
  await slowContext.close();

  const reducedContext = await browser.newContext({ viewport: VIEWPORT, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  const reducedErrors = [];
  reducedPage.on('pageerror', error => reducedErrors.push(error.message));
  await reducedPage.goto(BASE, { waitUntil: 'domcontentloaded' });
  await reducedPage.waitForTimeout(500);
  const reducedState = await reducedPage.evaluate(() => ({ intro: !!document.querySelector('.ana-intro'), overflow: getComputedStyle(document.body).overflow }));
  check('reduced motion intro exits quickly', !reducedState.intro && reducedState.overflow !== 'hidden', JSON.stringify(reducedState));
  check('reduced motion page errors', reducedErrors.length === 0, reducedErrors.length ? JSON.stringify(reducedErrors) : 'none');
  await reducedContext.close();

  const noJsContext = await browser.newContext({ viewport: VIEWPORT, isMobile: true, hasTouch: true, javaScriptEnabled: false });
  const noJsPage = await noJsContext.newPage();
  await noJsPage.goto(BASE, { waitUntil: 'domcontentloaded' });
  const noJsState = await noJsPage.evaluate(() => ({ intro: !!document.querySelector('.ana-intro'), bodyText: document.body.innerText.length, hero: !!document.querySelector('.entry') }));
  check('no JS keeps content available without overlay', !noJsState.intro && noJsState.bodyText > 100 && noJsState.hero, JSON.stringify(noJsState));
  await noJsContext.close();
  await browser.close();

  const outputPath = path.join(__dirname, 'mobile-experience-results.json');
  fs.writeFileSync(outputPath, JSON.stringify({ ...results, pass: results.checks.every(item => item.pass) }, null, 2));
  console.log(JSON.stringify({ pass: results.checks.every(item => item.pass), checks: results.checks, pageErrors: results.pageErrors }, null, 2));
  process.exitCode = results.checks.every(item => item.pass) ? 0 : 1;
}

run().catch(error => {
  results.checks.push({ name: 'QA runner', pass: false, evidence: error.stack || error.message });
  fs.writeFileSync(path.join(__dirname, 'mobile-experience-results.json'), JSON.stringify({ ...results, pass: false }, null, 2));
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
