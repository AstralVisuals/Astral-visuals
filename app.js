/* No dependencies, tracking, accounts, or network services. */
'use strict';
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
let category = 'All';
const library = window.ASTRAL_MODULES || [];
function showModules() {
  const query = $('#module-search').value.trim().toLocaleLowerCase();
  const visible = library.filter(m => (category === 'All' || m.category === category) && `${m.name} ${m.description}`.toLocaleLowerCase().includes(query));
  const fragment = document.createDocumentFragment();
  for (const module of visible) {
    const card = document.createElement('article');card.className = 'module-card';
    const tag = document.createElement('span');tag.className = 'module-category';tag.textContent = module.category;
    const title = document.createElement('h3');title.textContent = module.name;
    const description = document.createElement('p');description.textContent = module.description;
    card.append(tag,title,description);fragment.append(card);
  }
  $('#module-list').replaceChildren(fragment);$('#module-list').scrollTop = 0;
  $('#empty-results').hidden = visible.length !== 0;
  $('#category-heading').textContent = category === 'All' ? 'ALL MODULES' : category.toUpperCase();
  $('#result-count').textContent = `${visible.length} module${visible.length === 1 ? '' : 's'}`;
}
function selectCategory(value) {
  category = value;
  $$('[data-category]').forEach(b => {const active = b.dataset.category === value;b.classList.toggle('selected', active);b.setAttribute('aria-pressed', String(active));});
  showModules();
}
$$('[data-category]').forEach(b => {
  b.querySelector('span').textContent = b.dataset.category === 'All' ? library.length : library.filter(m => m.category === b.dataset.category).length;
  b.addEventListener('click', () => selectCategory(b.dataset.category));
});
$$('[data-jump-category]').forEach(a => a.addEventListener('click', () => {$('#module-search').value = '';selectCategory(a.dataset.jumpCategory);}));
$('#module-search').addEventListener('input', showModules);showModules();

const colors = {carbon:['230,233,239','#e6e9ef'],glacier:['141,205,228','#8dcde4'],ember:['236,167,117','#eca775'],matcha:['166,191,153','#a6bf99']};
let canvasRGB = colors.carbon[0];
$$('[data-theme]').forEach(b => b.addEventListener('click', () => {
  const theme = b.dataset.theme;
  document.documentElement.style.setProperty('--accent',colors[theme][1]);
  document.documentElement.style.setProperty('--accent-rgb',colors[theme][0]);canvasRGB = colors[theme][0];
  $('#theme-name').textContent = theme.toUpperCase();
  $$('[data-theme]').forEach(other => {const active = other === b;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active));});
  drawFrame(time);
}));
$('#copy-folder').addEventListener('click', async () => {
  const path = '%APPDATA%\\.minecraft\\mods';
  try {await navigator.clipboard.writeText(path);$('#copy-status').textContent = 'Copied. Paste into File Explorer.';}
  catch {$('#copy-status').textContent = path;}
});

const canvas = $('#astral-canvas');const ctx = canvas.getContext('2d');
const media = window.matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,time=0,last=0,paused=media.matches,inView=true,raf=0;
const pause = $('#pause-motion');
function updatePause(){pause.setAttribute('aria-pressed',String(paused));pause.replaceChildren(document.createTextNode(paused?'Resume motion  ▷':'Pause motion  Ⅱ'));}
pause.addEventListener('click',()=>{paused=!paused;updatePause();schedule();});updatePause();
media.addEventListener('change',event=>{paused=event.matches;updatePause();schedule();});
function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);drawFrame(time);}
new ResizeObserver(resize).observe(canvas);
function project(x,y,z,rx,ry){const cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry);const a=x*cy-z*sy,b=x*sy+z*cy;const yy=y*cx-b*sx,zz=y*sx+b*cx;const s=400/(400+zz);return [width*.53+a*s, height*.49+yy*s,zz,s];}
function ring(radius,rx,ry,t,alpha){ctx.beginPath();for(let i=0;i<=180;i++){const a=i*Math.PI/90;const p=project(Math.cos(a)*radius,Math.sin(a)*radius,0,rx,ry);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}ctx.strokeStyle=`rgba(${canvasRGB},${alpha})`;ctx.lineWidth=.7;ctx.stroke();
  for(let j=0;j<3;j++){const a=t*.19+j*Math.PI*2/3;const p=project(Math.cos(a)*radius,Math.sin(a)*radius,0,rx,ry);ctx.beginPath();ctx.arc(p[0],p[1],j===0?2.6:1.4,0,Math.PI*2);ctx.fillStyle=`rgba(${canvasRGB},${p[2]>0?.4:.95})`;ctx.fill();}
}
function drawFrame(t){if(!ctx||!width)return;ctx.clearRect(0,0,width,height);const r=Math.min(width*.33,height*.35);const rx=.35+Math.sin(t*.07)*.07,ry=t*.065;
  ctx.strokeStyle='#58616e20';ctx.lineWidth=.5;
  for(let j=0;j<4;j++){const size=r*(.8+j*.24);ctx.beginPath();ctx.ellipse(width*.53,height*.49,size,size*.97,0,0,Math.PI*2);ctx.stroke();}
  const points=[];
  for(let j=0;j<17;j++){const lat=(j/16)*Math.PI;for(let i=0;i<34;i++){const lon=i/34*Math.PI*2;points.push(project(Math.sin(lat)*Math.cos(lon)*r*.48,Math.cos(lat)*r*.48,Math.sin(lat)*Math.sin(lon)*r*.48,rx,ry));}}
  points.sort((a,b)=>b[2]-a[2]);
  points.forEach(p=>{const front=1-(p[2]+r*.5)/r;ctx.beginPath();ctx.arc(p[0],p[1],.35+front*.6,0,Math.PI*2);ctx.fillStyle=`rgba(${canvasRGB},${.09+front*.5})`;ctx.fill();});
  ring(r*.98,1.04,.25+ry*.5,t,.5);ring(r*1.08,.35,1.04+ry*.25,t+11,.35);ring(r*.87,1.4,-.8+ry*.35,-t,.65);
  for(let i=0;i<48;i++){const seed=i*17.31;const a=seed+t*.012;const radius=r*(1.2+(Math.sin(seed*7)+1)*.45);const x=width*.53+Math.cos(a)*radius,y=height*.49+Math.sin(a)*radius*.85;ctx.fillStyle=`rgba(${canvasRGB},${.08+(i%5)*.04})`;ctx.fillRect(x,y,i%6===0?1.5:.8,i%6===0?1.5:.8);}
  ctx.strokeStyle='#8b94a438';ctx.lineWidth=.5;[[width*.1,height*.48],[width*.86,height*.7]].forEach(([x,y])=>{ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.moveTo(x,y-4);ctx.lineTo(x,y+4);ctx.stroke();});
}
function tick(now){raf=0;if(paused||!inView||document.hidden){last=0;return;}if(last)time+=Math.min((now-last)/1000,.04);last=now;drawFrame(time);schedule();}
function schedule(){if(!raf&&!paused&&inView&&!document.hidden)raf=requestAnimationFrame(tick);}
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;last=0;schedule();}).observe(canvas);
document.addEventListener('visibilitychange',()=>{last=0;schedule();});resize();schedule();
