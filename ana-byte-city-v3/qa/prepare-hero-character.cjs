const {chromium}=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'), backgrounds=path.join(root,'assets','backgrounds');
const scenes=[
 {name:'mobile',original:'city-mobile.webp',edit:'source-edits/ana-mobile-generated.png',width:940,height:2156,small:600,smallHeight:1376,quality:.89,feather:15,
  polygon:[[430,440],[565,430],[680,465],[760,550],[820,700],[880,850],[940,875],[940,1140],[320,1140],[325,985],[310,800],[375,680],[400,570]]},
 {name:'desktop',original:'city-desktop.webp',edit:'source-edits/ana-desktop-generated.png',width:2017,height:780,small:1280,smallHeight:495,quality:.9,feather:13,
  polygon:[[1580,210],[1710,205],[1830,270],[1910,420],[1940,550],[1990,630],[2017,740],[1540,760],[1490,690],[1460,530],[1550,390]]}
];
const uri=file=>`data:${file.endsWith('.png')?'image/png':'image/webp'};base64,${fs.readFileSync(path.join(backgrounds,file)).toString('base64')}`;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/crist.PC/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'});
 try{
  const page=await browser.newPage();
  for(const scene of scenes){
   const results=await page.evaluate(async({scene,original,edit})=>{
    const load=async src=>{const image=new Image();image.src=src;await image.decode();return image};
    const [before,after]=await Promise.all([load(original),load(edit)]);
    const {width,height,polygon,feather}=scene;
    const final=document.createElement('canvas');final.width=width;final.height=height;
    const ctx=final.getContext('2d');ctx.imageSmoothingQuality='high';ctx.drawImage(before,0,0,width,height);
    const patch=document.createElement('canvas');patch.width=width;patch.height=height;
    const patchCtx=patch.getContext('2d');patchCtx.imageSmoothingQuality='high';patchCtx.drawImage(after,0,0,width,height);
    const mask=document.createElement('canvas');mask.width=width;mask.height=height;
    const maskCtx=mask.getContext('2d');maskCtx.filter=`blur(${feather}px)`;maskCtx.fillStyle='white';
    maskCtx.beginPath();polygon.forEach(([x,y],i)=>i?maskCtx.lineTo(x,y):maskCtx.moveTo(x,y));maskCtx.closePath();maskCtx.fill();
    patchCtx.globalCompositeOperation='destination-in';patchCtx.drawImage(mask,0,0);
    ctx.drawImage(patch,0,0);
    const small=document.createElement('canvas');small.width=scene.small;small.height=scene.smallHeight;
    const smallCtx=small.getContext('2d');smallCtx.imageSmoothingQuality='high';smallCtx.drawImage(final,0,0,scene.small,scene.smallHeight);
    return [final.toDataURL('image/webp',scene.quality),small.toDataURL('image/webp',scene.quality)];
   },{scene,original:uri(scene.original),edit:uri(scene.edit)});
   const files=[`city-${scene.name}-ana.webp`,`city-${scene.name}-ana-${scene.small}.webp`];
   results.forEach((data,i)=>fs.writeFileSync(path.join(backgrounds,files[i]),Buffer.from(data.split(',')[1],'base64')));
   console.log(scene.name,files.map(f=>`${f} ${fs.statSync(path.join(backgrounds,f)).size} bytes`).join(', '));
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
