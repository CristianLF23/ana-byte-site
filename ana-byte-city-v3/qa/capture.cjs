const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
const path=require('path');
const out=path.join(__dirname,'screens');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
for(const [width,height] of [[1440,900],[390,844]]){
const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4183/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(out,`home-${width}.png`)});
for(const id of ['trabalhos','processo','sobre','contato']){await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(1000);await page.screenshot({path:path.join(out,`${id}-${width}.png`)})}
await page.goto('http://127.0.0.1:4183/portfolio/',{waitUntil:'networkidle'});await page.screenshot({path:path.join(out,`portfolio-${width}.png`)});
await page.locator('.portfolio-thumb').first().click();if(width>767)await page.locator('[data-selected-open]').click();await page.waitForTimeout(500);await page.screenshot({path:path.join(out,`detail-${width}.png`)});
console.log(width,errors);await page.close();}
await browser.close()})().catch(e=>{console.error(e);process.exit(1)});
