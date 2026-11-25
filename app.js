import { graphPage, mountGraph } from './graph.js?v=6c9befc0084b';
import { mountScene } from './motion.js?v=29bc17d3c329';
let disposeScene=()=>{};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groups=[
 ['01_Foundations','Адресация и службы','Как найти узел и построить путь к нему.','IP · DNS · DHCP · BGP'],
 ['02_Access','Доступ к сети','От локального канала до подключения к провайдеру.','Ethernet · Wi-Fi · PPPoE'],
 ['03_Transport','Транспорт','Как данные доходят до нужного приложения.','TCP · UDP · QUIC'],
 ['04_Web','Веб и посредники','Запросы, ответы и постоянные соединения.','HTTP · HTTPS · WebSocket'],
 ['05_Applications','Прикладные системы','Почта, файлы, звонки и видеопотоки.','SMTP · WebRTC · SMB'],
 ['06_Security','Защита и доверие','Что шифруется и кому можно доверять.','TLS · SSH · VPN']
];
let docs=[],byId=new Map();
const href=id=>'#/note/'+id;
const short=d=>d.title.split(' — ')[0];
const icon=i=>`<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">${['<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="m11 7-5 9m7-9 5 9M8 18h8"/>','<path d="M3 8a15 15 0 0 1 18 0M6 12a10 10 0 0 1 12 0m-9 4a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r="1"/>','<path d="M3 8h18M3 16h18m-4-12 4 4-4 4M7 12l-4 4 4 4"/>','<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 6.5h1m3 0h1M8 14l-2 2 2 2m8-4 2 2-2 2"/>','<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>','<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>'][i]}</svg>`;
function sidebar(){
 $('#sections').innerHTML=groups.map(([id,name])=>`<details data-group="${id}"><summary>${name}</summary><div><a href="#/group/${id}">Обзор раздела</a>${docs.filter(d=>d.topic&&d.group===id).map(d=>`<a href="${href(d.id)}">${esc(short(d))}</a>`).join('')}</div></details>`).join('');
}
const network=()=>`<div class="network-scene"><div class="scene-top"><span>ТОПОЛОГИЯ / ОБМЕН ДАННЫМИ</span></div><canvas id="network-canvas" role="img" aria-label="Стилизованная объёмная сеть: узлы связаны каналами, по которым движутся пакеты данных"></canvas><div class="scene-coordinate" aria-hidden="true">УЗЛЫ И КАНАЛЫ<br>УСЛОВНАЯ МОДЕЛЬ</div><div class="scene-links"><a href="#/note/01_Foundations/DNS">DNS<span>имя</span></a><a href="#/note/03_Transport/TCP">TCP<span>доставка</span></a><a href="#/note/06_Security/TLS">TLS<span>защита</span></a><a href="#/note/04_Web/HTTP">HTTP<span>запрос</span></a></div></div>`;
function home(){
 return `<div class="enter"><section class="hero"><div><div class="eyebrow">СЕТЕВЫЕ ПРОТОКОЛЫ / БАЗА ЗНАНИЙ</div><h1>Как устроен<br><span>интернет.</span></h1><p>От Ethernet до WebRTC: устройство протоколов, порядок обмена и связи между уровнями сети.</p><a class="primary" href="${href('00_Navigation/Start')}">Начать изучение</a><div class="hero-meta">Протоколы · Практика · Самопроверка</div></div>${network()}</section><div class="stats"><div class="stat"><strong>39</strong><span>тем и технологий</span></div><div class="stat"><strong>6</strong><span>разделов</span></div><div class="stat"><strong>43</strong><span>понятия в словаре</span></div></div><section><div class="section-heading"><h2>Разделы базы</h2><span>Выберите тему для чтения</span></div><div class="categories">${groups.map(([id,name,desc,sub],i)=>`<a class="category" href="#/group/${id}"><span class="category-icon">${icon(i)}</span><div><h3>${name}</h3><p>${desc}</p><p style="margin-top:8px;font-size:11px">${sub}</p></div><span class="count">${docs.filter(d=>d.topic&&d.group===id).length}</span></a>`).join('')}</div></section><section class="learning"><div><h2>Путь запроса: от браузера до сервера</h2><p>Разберите открытие HTTPS-страницы по этапам: от настройки сети до получения ответа.</p></div><a href="${href('07_Practice/Open_Website')}">Открыть разбор</a></section></div>`;
}
function groupPage(id){const g=groups.find(g=>g[0]===id);if(!g)return missing();return `<div class="eyebrow">Тематический раздел</div><h1 class="page-title">${g[1]}</h1><p class="page-desc">${g[2]}</p><div class="topic-list">${docs.filter(d=>d.topic&&d.group===id).map(d=>`<a class="topic-row" href="${href(d.id)}"><h2>${esc(d.title)}</h2><p>${esc(d.description)}</p></a>`).join('')}</div>`}
function notePage(id){const d=byId.get(id);if(!d)return missing();return `<div class="article-layout enter"><div><article class="article">${d.html}</article><div class="article-tools"><button id="copy-link">Скопировать ссылку</button><a href="https://github.com/corrozie/Protocol_Knowledge/blob/main/${d.file}" target="_blank" rel="noopener">Открыть Markdown ↗</a></div></div><aside class="toc" aria-label="На этой странице"><p>НА ЭТОЙ СТРАНИЦЕ</p>${d.headings.map(h=>`<a href="#${h.anchor}" data-scroll="${h.anchor}">${esc(h.label)}</a>`).join('')}</aside></div>`}
const missing=()=>'<h1 class="page-title">Заметка не найдена</h1><p>Возможно, адрес изменился. Откройте поиск или вернитесь в обзор базы.</p><a class="primary" href="#/">Открыть обзор</a>';
function connections(){return graphPage(docs,groups)}
function closeMenu(){ $('#sidebar').classList.remove('open');$('#scrim').hidden=true;$('#menu').setAttribute('aria-expanded','false') }
function route(){
 disposeScene();
 const url=location.hash.slice(1)||'/';const clean=url.split('?')[0];const id=decodeURIComponent(clean.replace('/note/',''));
 $('#main').innerHTML=clean==='/'?home():clean.startsWith('/group/')?groupPage(clean.slice(7)):clean==='/connections'?connections():clean.startsWith('/note/')?notePage(id):missing();
 const d=byId.get(id);document.title=(d?.title??(clean==='/connections'?'Карта связей':'База знаний о сетях'))+' · Protocol';
 $('#breadcrumb').textContent='Библиотека / '+(d?short(d):clean.startsWith('/group/')?groups.find(g=>g[0]===clean.slice(7))?.[1]??'Раздел':clean==='/connections'?'Карта связей':'Обзор');
 document.querySelectorAll('.sidebar a').forEach(a=>{const active=a.getAttribute('href')==='#'+clean;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 if(d?.topic){const detail=document.querySelector(`[data-group="${d.group}"]`);if(detail)detail.open=true}
 closeMenu();window.scrollTo(0,0);
 if(clean==='/') disposeScene=mountScene();
 if(clean==='/connections') disposeScene=mountGraph(docs,groups);
 if(document.activeElement?.closest('#main, .sidebar')) $('#main').focus({preventScroll:true});
 $('#copy-link')?.addEventListener('click',async e=>{try{await navigator.clipboard.writeText(location.href);e.target.textContent='Ссылка скопирована'}catch{e.target.textContent='Скопируйте адрес из строки браузера'}});
 document.querySelectorAll('[data-scroll]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.getElementById(a.dataset.scroll)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}));
 if($('#search-dialog').open)$('#search-dialog').close();
}
function search(){const q=$('#search').value.trim().toLocaleLowerCase('ru');if(!q){$('#search-status').textContent='Популярные темы';$('#search-results').innerHTML=['01_Foundations/DNS','03_Transport/TCP','04_Web/HTTPS','06_Security/TLS','05_Applications/WebRTC'].map(id=>result(byId.get(id))).join('');return}
 const tokens=q.split(/\s+/);const found=docs.filter(d=>tokens.every(t=>(d.title+' '+d.text).toLocaleLowerCase('ru').includes(t))).sort((a,b)=>Number(b.title.toLowerCase().includes(q))-Number(a.title.toLowerCase().includes(q))||Number(b.topic)-Number(a.topic));
 $('#search-status').textContent=found.length?`Найдено материалов: ${found.length}`:'Ничего не найдено';$('#search-results').innerHTML=found.length?found.slice(0,30).map(result).join(''):'<p class="empty">Попробуйте другое слово: например, «почта», «DNS» или «шифрование».</p>';
}
function result(d){return `<a class="search-result" href="${href(d.id)}"><strong>${esc(d.title)}</strong><span>${esc(d.description.slice(0,130))}${d.description.length>130?'…':''}</span></a>`}
function openSearch(){$('#search-dialog').showModal();search();$('#search').focus()}
$('#search-open').addEventListener('click',openSearch);$('#search-close').addEventListener('click',()=>$('#search-dialog').close());$('#search').addEventListener('input',search);
$('#search-results').addEventListener('click',e=>{if(e.target.closest('a')){const same=e.target.closest('a').getAttribute('href')===location.hash;$('#search-dialog').close();if(same)$('#main').focus()}});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(!$('#search-dialog').open)openSearch()}if(e.key==='Escape')closeMenu()});
$('#menu').addEventListener('click',()=>{const open=$('#sidebar').classList.toggle('open');$('#scrim').hidden=!open;$('#menu').setAttribute('aria-expanded',String(open))});$('#scrim').addEventListener('click',closeMenu);
function setTheme(theme){document.documentElement.dataset.theme=theme;document.body.classList.toggle('dark',theme==='dark');$('#theme').setAttribute('aria-label',theme==='dark'?'Включить светлую тему':'Включить тёмную тему');window.dispatchEvent(new Event('protocol-theme-change'))}
setTheme(document.documentElement.dataset.theme||'dark');
$('#theme').addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';setTheme(theme);try{localStorage.setItem('protocol-theme-v2',theme)}catch{}});
window.addEventListener('hashchange',route);
fetch('./content.json').then(r=>{if(!r.ok)throw Error('Content unavailable');return r.json()}).then(data=>{docs=data;byId=new Map(docs.map(d=>[d.id,d]));sidebar();route()}).catch(()=>{$('#main').innerHTML='<h1 class="page-title">Не удалось загрузить материалы</h1><p>Проверьте соединение и обновите страницу.</p>'});

$(".skip").addEventListener("click",e=>{e.preventDefault();$("#main").focus();$("#main").scrollIntoView()});
