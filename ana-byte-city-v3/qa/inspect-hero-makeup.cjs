const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const path=require('node:path');
const backgrounds=path.resolve(__dirname,'../assets/backgrounds');
const out=path.resolve(__dirname,'round-makeup');fs.mkdirSync(out,{recursive:true});
const scenes=[
 {name:'mobile',box:[465,515,135,160],files:['city-mobile-ana-face.webp','city-mobile-ana-natural.webp']},
 {name:'desktop',box:[1585,245,145,135],files:['city-desktop-ana-face.webp','city-desktop-ana-natural.webp']}
];
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
 try{
  const page=await browser.newPage();
  for(const scene of scenes){
   const images=scene.files.map(file=>`data:image/webp;base64,${fs.readFileSync(path.join(backgrounds,file)).toString('base64')}`);
   const data=await page.evaluate(async({images,box})=>{
    const load=async src=>{const im=new Image();im.src=src;await im.decode();return im};
    const ims=await Promise.all(images.map(load));const [x,y,w,h]=box;
    const can=document.createElement('canvas');can.width=w*4*ims.length;can.height=h*4;
    const ctx=can.getContext('2d');ctx.imageSmoothingQuality='high';
    ims.forEach((im,i)=>ctx.drawImage(im,x,y,w,h,w*4*i,0,w*4,h*4));
    return can.toDataURL('image/png');
   },{images,box:scene.box});
   fs.writeFileSync(path.join(out,`${scene.name}-before-after.png`),Buffer.from(data.split(',')[1],'base64'));
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
