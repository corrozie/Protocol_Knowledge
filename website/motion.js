// A deterministic spherical network. Animation never changes document layout.
export function mountScene(){
 const canvas=document.querySelector('#network-canvas');
 if(!canvas)return ()=>{};
 const ctx=canvas.getContext('2d');if(!ctx)return ()=>{};
 const scene=canvas.parentElement,button=document.querySelector('#motion-toggle');
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,paused=preference.matches,visible=true,rotation=.38,last=0,w=0,h=0,pointer=0,tilt=-.18,dead=false;
 const points=Array.from({length:170},(_,i)=>{const y=1-2*(i+.5)/170,r=Math.sqrt(1-y*y),angle=i*Math.PI*(3-Math.sqrt(5));return [Math.cos(angle)*r,y,Math.sin(angle)*r]});
 const edges=[];
 for(let a=0;a<points.length;a++)for(let b=a+1;b<points.length;b++){const distance=points[a].reduce((sum,v,i)=>sum+(v-points[b][i])**2,0);if(distance<.115)edges.push([a,b])}
 function size(){const rect=canvas.getBoundingClientRect();w=rect.width;h=rect.height;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);draw()}
 function draw(){
  if(!w||!h)return;
  const light=document.documentElement.dataset.theme==='light';
  const color=light?'64,79,120':'164,178,225';
  ctx.clearRect(0,0,w,h);
  const radius=Math.min(w*.38,h*.36),cx=w*.52,cy=h*.48;
  const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,radius*1.35);glow.addColorStop(0,`rgba(${color},.065)`);glow.addColorStop(1,`rgba(${color},0)`);ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  // Fine orbital rings give the mesh depth without a raster background.
  ctx.strokeStyle=`rgba(${color},.1)`;ctx.lineWidth=.7;
  for(const multiplier of [1.09,1.22]){ctx.beginPath();ctx.ellipse(cx,cy,radius*multiplier,radius*.37, -.38,0,Math.PI*2);ctx.stroke()}
  const projected=points.map(([x,y,z])=>{const rx=x*Math.cos(rotation)+z*Math.sin(rotation),rz=z*Math.cos(rotation)-x*Math.sin(rotation);const ry=y*Math.cos(tilt)-rz*Math.sin(tilt),depth=y*Math.sin(tilt)+rz*Math.cos(tilt);const perspective=3.6/(3.6-depth);return [cx+rx*radius*perspective,cy+ry*radius*perspective,depth]});
  for(const [a,b]of edges){const p=projected[a],q=projected[b],depth=(p[2]+q[2])/2;ctx.strokeStyle=`rgba(${color},${.06+(depth+1)*.105})`;ctx.lineWidth=.65+(depth+1)*.2;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke()}
  for(let i=0;i<projected.length;i++){const [x,y,z]=projected[i];ctx.fillStyle=`rgba(${color},${.18+(z+1)*.3})`;ctx.beginPath();ctx.arc(x,y,1+(z+1)*.65,0,Math.PI*2);ctx.fill()}
  // Packets follow existing mesh edges. Paused/reduced motion keeps a still frame.
  const t=rotation*3;
  for(let i=0;i<8;i++){const edge=edges[(i*53+19)%edges.length],p=projected[edge[0]],q=projected[edge[1]],fraction=(t+i*.173)%1;const x=p[0]+(q[0]-p[0])*fraction,y=p[1]+(q[1]-p[1])*fraction;ctx.fillStyle=i%3===0?'#e3b394':light?'#394d98':'#d4dcff';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,2.4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
 }
 function tick(time){frame=0;if(dead||paused||!visible||document.hidden)return;const dt=last?Math.min(time-last,50):16;last=time;rotation+=dt*.000045;tilt+=((-.18+pointer*.12)-tilt)*.03;draw();frame=requestAnimationFrame(tick)}
 function sync(){cancelAnimationFrame(frame);frame=0;last=0;button.textContent=paused?'Продолжить':'Пауза';button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Продолжить анимацию':'Остановить анимацию');scene.classList.toggle('scene-paused',paused);draw();if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick)}
 const toggle=()=>{paused=!paused;sync()},reduce=()=>{paused=preference.matches;sync()},visibility=()=>sync();
 const move=e=>{if(!paused)pointer=(e.clientX-canvas.getBoundingClientRect().left)/Math.max(w,1)-.5};
 const resize=new ResizeObserver(size);resize.observe(canvas);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.05});observer.observe(canvas);
 canvas.addEventListener('pointermove',move);button.addEventListener('click',toggle);preference.addEventListener('change',reduce);document.addEventListener('visibilitychange',visibility);window.addEventListener('protocol-theme-change',draw);size();sync();
 return ()=>{dead=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();canvas.removeEventListener('pointermove',move);button.removeEventListener('click',toggle);preference.removeEventListener('change',reduce);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('protocol-theme-change',draw)};
}
