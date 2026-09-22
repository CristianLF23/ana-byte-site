const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
 try {
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end('Not found');return;}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400).end('Bad request');}
}).listen(4178,'127.0.0.1',()=>console.log('Ana Byte: http://127.0.0.1:4178'));
