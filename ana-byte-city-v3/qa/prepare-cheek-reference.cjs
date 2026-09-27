const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const path=require('node:path');
const backgrounds=path.resolve(__dirname,'../assets/backgrounds');
const scenes=[
 {name:'mobile',source:'city-mobile-ana-face.webp',box:[435,465,250,250]},
 {name:'desktop',source:'city-desktop-ana-face.webp',box:[1545,190,260,260]}
];
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
 try{
  const page=await browser.newPage();
  for(const scene of scenes){
   const source=`data:image/webp;base64,${fs.readFileSync(path.join(backgrounds,scene.source)).toString('base64')}`;
   const data=await page.evaluate(async({source,box})=>{
    const im=new Image();im.src=source;await im.decode();
    const can=document.createElement('canvas');can.width=1024;can.height=1024;
    const ctx=can.getContext('2d');ctx.imageSmoothingQuality='high';ctx.drawImage(im,...box,0,0,1024,1024);
    return can.toDataURL('image/png');
   },{source,box:scene.box});
   const file=path.join(__dirname,'round-makeup',`ana-${scene.name}-makeup-input.png`);
   fs.mkdirSync(path.dirname(file),{recursive:true});
   fs.writeFileSync(file,Buffer.from(data.split(',')[1],'base64'));
   console.log(file);
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
