const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const path=require('node:path');
const backgrounds=path.resolve(__dirname,'../assets/backgrounds');
const out=path.resolve(__dirname,'round-cheek');
fs.mkdirSync(out,{recursive:true});
const scenes=[
 {name:'mobile',width:940,height:2156,box:[455,485,170,220],files:['city-mobile.webp','city-mobile-ana.webp','source-edits/ana-mobile-cheek-generated.png','city-mobile-ana-face.webp']},
 {name:'desktop',width:2017,height:780,box:[1575,225,220,200],files:['city-desktop.webp','city-desktop-ana.webp','source-edits/ana-desktop-cheek-generated.png','city-desktop-ana-face.webp']}
];
const uri=file=>`data:${file.endsWith('.png')?'image/png':'image/webp'};base64,${fs.readFileSync(path.join(backgrounds,file)).toString('base64')}`;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
 try{
  const page=await browser.newPage();
  for(const scene of scenes){
   const images=scene.files.map(uri);
   const data=await page.evaluate(async({images,box,width,height})=>{
    const load=async src=>{const im=new Image();im.src=src;await im.decode();return im};
    const ims=await Promise.all(images.map(load));
    const [x,y,w,h]=box;
    const can=document.createElement('canvas');can.width=w*3*images.length;can.height=h*3;
    const ctx=can.getContext('2d');ctx.imageSmoothingQuality='high';
    ims.forEach((im,i)=>{
     const scaled=document.createElement('canvas');scaled.width=width;scaled.height=height;
     const sc=scaled.getContext('2d');sc.imageSmoothingQuality='high';sc.drawImage(im,0,0,width,height);
     ctx.drawImage(scaled,x,y,w,h,w*3*i,0,w*3,h*3);
    });
    return can.toDataURL('image/png');
   },{images,box:scene.box,width:scene.width,height:scene.height});
   fs.writeFileSync(path.join(out,`${scene.name}-compare.png`),Buffer.from(data.split(',')[1],'base64'));
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
