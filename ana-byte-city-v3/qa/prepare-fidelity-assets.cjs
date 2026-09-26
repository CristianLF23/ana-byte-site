const sharp = require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const generated = 'C:/Users/crist.PC/.codex/generated_images/01a0c614-ebfb-7a53-a3f7-1e4594d7e148/';
(async () => {
  const desktop = generated + 'exec-1f56f3db-41d3-4f6c-afe1-132ca15dba43.png';
  const mobile = generated + 'exec-12c2cdcb-d00f-46b2-bb30-2e66f2839ef9.png';
  await sharp(desktop).webp({quality:91}).toFile(path.join(root,'assets/backgrounds/city-desktop.webp'));
  await sharp(desktop).resize(1280).webp({quality:87}).toFile(path.join(root,'assets/backgrounds/city-1280.webp'));
  await sharp(mobile).resize(940).webp({quality:90}).toFile(path.join(root,'assets/backgrounds/city-mobile.webp'));
  await sharp(mobile).resize(600).webp({quality:87}).toFile(path.join(root,'assets/backgrounds/city-mobile-600.webp'));
  // Isolate the supplied lettering, preserving its silhouette. No substitute font.
  const source='C:/Users/crist.PC/AppData/Local/Temp/codex-clipboard-5b1cbad9-ce33-43e2-8b79-416ca3afcc58.png';
  const {data,info}=await sharp(source).extract({left:31,top:19,width:112,height:111}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const rgba=Buffer.alloc(info.width*info.height*4);
  for(let i=0;i<info.width*info.height;i++){
    const r=data[i*3],g=data[i*3+1],b=data[i*3+2];
    const alpha=Math.max(0,Math.min(255,(r-Math.max(g*1.8,b*.9)-8)*2.1));
    rgba[i*4]=255;rgba[i*4+1]=43;rgba[i*4+2]=154;rgba[i*4+3]=alpha;
  }
  await sharp(rgba,{raw:{width:info.width,height:info.height,channels:4}}).png().toFile(path.join(root,'assets/ui/ana-byte-mark.png'));
  console.log('Prepared city compositions and reference lettering. Original photographs unchanged.');
})();
