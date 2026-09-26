const sharp=require('C:/Users/crist.PC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const path=require('path');const fs=require('fs');
const dir=path.join(__dirname,process.argv[2]||'round-1');
(async()=>{
const sets=[['desktop',[1920,1600,1440,1280],2,560],['tablet',[1024,768],2,450],['mobile',[430,390,375],3,300]];
for(const name of ['home','archive','artist','contact','portfolio','about','story','footer','about-story'])for(const [group,widths,cols,tileW] of sets){
 const rows=Math.ceil(widths.length/cols),tiles=[];let maxH=0;
 for(const w of widths){const p=path.join(dir,`${name}-${w}.png`);if(!fs.existsSync(p))continue;const b=await sharp(p).resize(tileW).toBuffer();const m=await sharp(b).metadata();tiles.push({b,w,h:m.height});maxH=Math.max(maxH,m.height)}
 if(!tiles.length)continue;const composites=[];
 tiles.forEach((t,i)=>{const x=(i%cols)*(tileW+12),y=Math.floor(i/cols)*(maxH+42);const label=Buffer.from(`<svg width="${tileW}" height="28"><rect width="100%" height="100%" fill="#13202b"/><text x="10" y="19" font-family="Arial" font-size="13" fill="#e7edf2">${name} / ${t.w}px</text></svg>`);composites.push({input:label,left:x,top:y},{input:t.b,left:x,top:y+30})});
 await sharp({create:{width:cols*(tileW+12)-12,height:rows*(maxH+42),channels:3,background:'#03060b'}}).composite(composites).png().toFile(path.join(dir,`sheet-${name}-${group}.png`));
}console.log('Visual comparison sheets ready');
})();
