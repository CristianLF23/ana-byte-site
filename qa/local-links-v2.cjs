const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..');
let count=0;const failures=[];
for(const rel of ['index.html','trabalhos/index.html','sobre/index.html','orcamento/index.html','trabalhos/circuito-organico/index.html']){
 const file=path.join(root,rel),html=fs.readFileSync(file,'utf8');
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=m[1];if(/^(?:https?:|data:|#|mailto:|tel:)/.test(url))continue;
  const target=path.resolve(path.dirname(file),url.split(/[?#]/)[0]);count++;
  if(!fs.existsSync(target))failures.push({file:rel,url});
 }
}
fs.writeFileSync(path.join(__dirname,'v2-local-links.json'),JSON.stringify({count,failures},null,2));
if(failures.length)throw Error(JSON.stringify(failures));console.log('PASS '+count+' local file references.');
