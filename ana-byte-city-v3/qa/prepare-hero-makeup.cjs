const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const path=require('node:path');
const backgrounds=path.resolve(__dirname,'../assets/backgrounds');
const scenes=[
 {name:'mobile',base:'city-mobile-ana-face.webp',edit:'source-edits/ana-mobile-makeup-generated.png',crop:[435,465,250,250],width:940,height:2156,small:600,smallHeight:1376,quality:.9,ellipse:[540,612,43,52],feather:11},
 {name:'desktop',base:'city-desktop-ana-face.webp',edit:'source-edits/ana-desktop-makeup-generated.png',crop:[1545,190,260,260],width:2017,height:780,small:1280,smallHeight:495,quality:.91,ellipse:[1665,325,47,49],feather:10}
];
const uri=file=>`data:${file.endsWith('.png')?'image/png':'image/webp'};base64,${fs.readFileSync(path.join(backgrounds,file)).toString('base64')}`;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
 try{
  const page=await browser.newPage();
  for(const scene of scenes){
   const data=await page.evaluate(async({scene,base,edit})=>{
    const load=async src=>{const im=new Image();im.src=src;await im.decode();return im};
    const [before,after]=await Promise.all([load(base),load(edit)]);
    const {width,height,crop,ellipse,feather,small,smallHeight,quality}=scene;
    const final=document.createElement('canvas');final.width=width;final.height=height;
    const ctx=final.getContext('2d');ctx.imageSmoothingQuality='high';ctx.drawImage(before,0,0,width,height);
    const patch=document.createElement('canvas');patch.width=width;patch.height=height;
    const pc=patch.getContext('2d');pc.imageSmoothingQuality='high';pc.drawImage(after,...crop);
    const mask=document.createElement('canvas');mask.width=width;mask.height=height;
    const mc=mask.getContext('2d');mc.filter=`blur(${feather}px)`;mc.fillStyle='#fff';
    mc.beginPath();mc.ellipse(...ellipse,0,0,Math.PI*2);mc.fill();
    pc.globalCompositeOperation='destination-in';pc.drawImage(mask,0,0);
    ctx.drawImage(patch,0,0);
    const scaled=document.createElement('canvas');scaled.width=small;scaled.height=smallHeight;
    const sc=scaled.getContext('2d');sc.imageSmoothingQuality='high';sc.drawImage(final,0,0,small,smallHeight);
    return [final.toDataURL('image/webp',quality),scaled.toDataURL('image/webp',quality)];
   },{scene,base:uri(scene.base),edit:uri(scene.edit)});
   const files=[`city-${scene.name}-ana-natural.webp`,`city-${scene.name}-ana-natural-${scene.small}.webp`];
   data.forEach((entry,index)=>fs.writeFileSync(path.join(backgrounds,files[index]),Buffer.from(entry.split(',')[1],'base64')));
   console.log(`${scene.name}: ${files.join(', ')}`);
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
