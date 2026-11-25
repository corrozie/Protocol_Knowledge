import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {marked} from 'marked';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist'); await mkdir(out,{recursive:true});
const dirs=['00_Navigation','01_Foundations','02_Access','03_Transport','04_Web','05_Applications','06_Security','07_Practice'];
const paths=['README.md','PROJECT.md','SOURCES.md'];
for(const dir of dirs) for(const name of await readdir(path.join(root,dir))) if(name.endsWith('.md')) paths.push(`${dir}/${name}`);
const id=p=>p.replace(/\.md$/,'');
const docs=[];
for(const file of paths){
 const raw=await readFile(path.join(root,file),'utf8');
 const body=raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'');
 const title=body.match(/^# (.+)/m)?.[1]??id(file);
 const topic=/^0[1-6]_[^/]+\/(?!README)/.test(file);
 let html=marked.parse(body);
 html=html.replace(/href="([^"]+)"/g,(full,href)=>{
   if(/^(https?:|mailto:|#)/.test(href)) return full;
   const [url,anchor]=href.split('#');
   if(!url.endsWith('.md')) return `href="https://github.com/corrozie/Protocol_Knowledge/blob/main/${path.posix.normalize(path.posix.join(path.posix.dirname(file),url))}"`;
   const target=path.posix.normalize(path.posix.join(path.posix.dirname(file),decodeURIComponent(url)));
   if(!paths.includes(target)) throw Error(`Broken link ${file} -> ${target}`);
   return `href="#/note/${id(target)}${anchor?'?section='+encodeURIComponent(anchor):''}"`;
 });
 const headings=[];let num=0;
 html=html.replace(/<h2>([\s\S]*?)<\/h2>/g,(_,label)=>{const anchor=`section-${++num}`;headings.push({label:label.replace(/<[^>]+>/g,''),anchor});return `<h2 id="${anchor}">${label}</h2>`});
 const description=body.split('## Зачем нужен')[1]?.split('## Место')[0]?.trim()??body.split('\n\n').find(p=>!p.startsWith('#')&&!p.startsWith('['))??'';
 docs.push({id:id(file),file,title,topic,group:file.split('/')[0],html,headings,description,text:body.replace(/[#*`\[\]()]/g,'')});
}
await writeFile(path.join(out,'content.json'),JSON.stringify(docs));
for(const f of ['index.html','style.css','app.js','favicon.svg','refinement.css','motion.js','graph.js','graph.css']) await copyFile(path.join(root,'website',f),path.join(out,f));
// Version assets so repeat visitors receive the current deployment immediately.
const digest=async file=>createHash('sha256').update(await readFile(path.join(out,file))).digest('hex').slice(0,12);
let app=await readFile(path.join(out,'app.js'),'utf8');
for(const file of ['motion.js','graph.js']) app=app.replace(`'./${file}'`,`'./${file}?v=${await digest(file)}'`);
await writeFile(path.join(out,'app.js'),app);
let index=await readFile(path.join(out,'index.html'),'utf8');
for(const file of ['style.css','refinement.css','graph.css','app.js','favicon.svg']) index=index.replaceAll(`./${file}`,`./${file}?v=${await digest(file)}`);
await writeFile(path.join(out,'index.html'),index);
console.log(`Built ${docs.length} pages, ${docs.filter(d=>d.topic).length} protocol notes → dist/`);
