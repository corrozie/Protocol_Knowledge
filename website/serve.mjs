import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import './build.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{try{const p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==root&&!p.startsWith(root+path.sep)){res.writeHead(403);return res.end()};const file=p===root?path.join(root,'index.html'):p;res.setHeader('Content-Type',types[path.extname(file)]??'application/octet-stream');res.end(await readFile(file))}catch{res.writeHead(404);res.end('Not found')}});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://localhost:4173'));
