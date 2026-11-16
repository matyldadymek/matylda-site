/* Matylda Dymek – site behaviour.
   Everything you edit lives in the content/ folder; this file only reads it. */

const FRAMES = ['--green','--clay','--sage','--rose','--forest','--lime','--plum','--olive','--mauve','--ink'];
const CORNERS = { 'top-left':'tl', 'top-right':'tr', 'bottom-left':'bl', 'bottom-right':'br' };
const main = document.getElementById('main');
const nav = document.querySelector('nav');
let SITE, CATS = [], ALL = [];

const esc = s => String(s ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
function hash(s){ let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }

async function load(path){
  const r = await fetch(path, { cache: 'no-cache' });
  if (!r.ok) throw new Error('Could not load ' + path);
  return jsyaml.load(await r.text());
}

/* ---- video links ---- */
function youtubeId(u){ const m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/); return m && m[1]; }
function vimeoId(u){ const m = u.match(/vimeo\.com\/(?:video\/|manage\/videos\/)?(\d+)/); return m && m[1]; }
function embedUrl(u){
  if (!u) return null;
  const y = youtubeId(u); if (y) return `https://www.youtube-nocookie.com/embed/${y}?autoplay=1&rel=0`;
  const v = vimeoId(u);   if (v) return `https://player.vimeo.com/video/${v}?autoplay=1&title=0&byline=0&portrait=0`;
  return null; /* other sites open in a new tab */
}
const thumbCache = {};
async function thumbnail(v){
  if (v.image) return v.image;
  const u = v.link || '';
  const y = youtubeId(u);
  if (y){
    /* full-HD frame when YouTube has one (1280x720), otherwise the standard one */
    const hd = `https://i.ytimg.com/vi/${y}/maxresdefault.jpg`;
    const ok = await new Promise(res => { const im = new Image(); im.onload = () => res(im.naturalWidth > 200); im.onerror = () => res(false); im.src = hd; });
    return ok ? hd : `https://i.ytimg.com/vi/${y}/hqdefault.jpg`;
  }
  const id = vimeoId(u);
  if (id){
    if (thumbCache[id]) return thumbCache[id];
    try {
      const r = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent('https://vimeo.com/' + id)}&width=1920`);
      if (r.ok){ const j = await r.json(); return thumbCache[id] = j.thumbnail_url; }
    } catch(e){}
  }
  return null;
}

/* the shape of a video (width / height); Vimeo tells us, YouTube is 16:9 */
const ratioCache = {};
async function videoRatio(u){
  const id = vimeoId(u || ''); if (!id) return 16/9;
  if (ratioCache[id]) return ratioCache[id];
  try {
    const r = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent('https://vimeo.com/' + id)}`);
    if (r.ok){ const j = await r.json(); if (j.width && j.height) return ratioCache[id] = j.width / j.height; }
  } catch(e){}
  return 16/9;
}

/* ---- grid ---- */
function corner(v){ return CORNERS[v.corner] || Object.values(CORNERS)[hash('c' + v.title) % 4]; }
/* Colours: a film's own `colour` wins. The others are picked so they never match the three tiles before them
   (that covers the tile beside it and the one above it, with 2 or 3 columns), and they leave the colours you chose to your chosen films. */
function colours(list){
  const own = list.map(v => FRAMES.includes('--' + v.colour) ? '--' + v.colour : null);
  const out = [];
  list.forEach((v, k) => {
    if (own[k]) { out.push(own[k]); return; }
    const near = [...out.slice(Math.max(0, k - 3)), ...own.slice(k + 1, k + 4), ...own.filter(Boolean)];   /* chosen colours stay special */
    let c = FRAMES[k % FRAMES.length];
    for (let n = 0; n < FRAMES.length && near.includes(c); n++) c = FRAMES[(k + n + 1) % FRAMES.length];
    out.push(c);
  });
  return out;
}
function tile(v, k, c){
  return `<button type="button" class="item ${corner(v)}" data-i="${ALL.indexOf(v)}" style="--tint:var(${c})" aria-label="${esc(v.title)}">
    <span class="frame"><span class="img"></span><span class="tint"></span><span class="ov"><span class="t">${esc(v.title)}</span></span></span>
    <span class="tb">${esc(v.title)}</span></button>`;
}
function grid(list){
  setTimeout(() => main.querySelectorAll('.item').forEach(async el => {
    const src = await thumbnail(ALL[el.dataset.i]);
    if (src) el.querySelector('.img').style.backgroundImage = `url("${src}")`;
  }));
  setTimeout(watchCentre);
  const cs = colours(list);
  return `<div class="grid">${list.map((v, k) => tile(v, k, cs[k])).join('')}</div>`;
}

/* Phones have no hover: the film nearest the middle of the screen slides its triangle away and shows its title. */
const touch = matchMedia('(hover: none)');
let centreObs;
function watchCentre(){
  centreObs && centreObs.disconnect();
  if (!touch.matches || !('IntersectionObserver' in window)) return;
  centreObs = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('on', e.isIntersecting)),
    { rootMargin: '-45% 0px -45% 0px' });   /* a thin band across the middle of the screen */
  main.querySelectorAll('.item').forEach(el => centreObs.observe(el));
}
function filters(id){
  return `<ul class="filters">` + [['work','All'], ...CATS.map(c => [c.id, c.title])]
    .map(([k,l]) => `<li><a href="#${k}"${k === id ? ' aria-current="page"' : ''}>${esc(l)}</a></li>`).join('') + `</ul>`;
}

/* social links shown as a logo instead of a word (matched by the link's name in site.yml) */
const ICONS = {
  linkedin: `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>`
};

/* ---- pages ---- */
function render(){
  const ids = CATS.map(c => c.id);
  let id = location.hash.slice(1);
  if (!['home','work','contact',...ids].includes(id)) id = 'home';
  const top = (id === 'work' || ids.includes(id)) ? 'work' : id;
  nav.querySelectorAll('a').forEach(a => a.getAttribute('href') === '#' + top ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'));

  if (id === 'home'){
    main.innerHTML = grid(ALL.filter(v => v.featured).sort((a,b) => a.featured - b.featured));
  } else if (id === 'contact'){
    const c = SITE.contact || {};
    main.innerHTML = `<section class="contact"><h1>${esc(c.headline)}</h1><p>${esc(c.text)}</p>
      ${c.email ? `<a class="email" href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ''}
      <ul class="social">${(c.links || []).map(l => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener"${ICONS[l.name.toLowerCase()] ? ` class="icon" aria-label="${esc(l.name)}" title="${esc(l.name)}">${ICONS[l.name.toLowerCase()]}` : `>${esc(l.name)}`}</a></li>`).join('')}</ul></section>`;
  } else if (id === 'work'){
    main.innerHTML = filters(id) + grid(ALL);
  } else {
    main.innerHTML = filters(id) + grid(ALL.filter(v => v.cat === id));
  }
}

/* ---- pop-up player ---- */
const modal = document.getElementById('modal'), screen = document.getElementById('screen');
let last;
const go = document.getElementById('mgo');
main.addEventListener('click', async e => {
  const b = e.target.closest('button.item'); if (!b) return;
  const v = ALL[b.dataset.i]; if (!v.link) return;
  const src = embedUrl(v.link);
  last = b;
  const panel = document.querySelector('.panel');
  let ratio = 16/9;
  if (src && !v.mature){
    /* Vimeo / YouTube: play the film here, in a frame shaped like the video itself */
    const r = await videoRatio(v.link);
    screen.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${esc(v.title)}"></iframe>`;
    const f = screen.firstChild;
    if (v.fill && r < 16/9){
      /* fill: keep a 16:9 frame and zoom past black bars baked into an old 4:3 file */
      const h = (16/9) / r * 100;
      f.style.height = h + '%'; f.style.top = -(h - 100) / 2 + '%';
    } else ratio = r;
    go.hidden = true;
  } else {
    /* any other site: show the film's image, with a button to open the site */
    /* mature films: Vimeo won't play them inside other sites, so send viewers to Vimeo to confirm their age */
    const img = await thumbnail(v);
    screen.innerHTML = (img ? `<img src="${esc(img)}" alt="">` : '') +
      (v.mature ? `<p class="notice">This film is for adult audiences.<br>Vimeo will ask you to confirm your age before it plays.</p>` : '');
    go.href = v.link; go.hidden = false;
    go.textContent = v.mature || /vimeo\.com/.test(v.link) ? 'Watch on Vimeo' : 'Go to site';
  }
  document.getElementById('mt').textContent = v.title;
  document.getElementById('mtag').textContent = v.tagline || '';
  screen.style.aspectRatio = ratio;
  panel.style.maxWidth = `calc(82vh * ${ratio})`;   /* tall videos never run off the screen */
  const tint = b.style.getPropertyValue('--tint');                 /* same colour as this film's triangle */
  const light = ['--green','--lime','--rose','--mauve'].some(c => tint.includes(c + ')'));
  const bar = document.querySelector('.pinfo');
  bar.style.setProperty('--bar', tint);
  screen.style.background = screen.innerHTML ? '#000' : tint;       /* no image yet: fill with the film's colour */
  bar.style.setProperty('--bartext', light ? 'var(--ink)' : 'var(--bg)');
  modal.hidden = false;
  document.getElementById('mclose').focus();
});
function close(){ modal.hidden = true; screen.innerHTML = ''; last && last.focus(); }
document.getElementById('mclose').onclick = close;
modal.addEventListener('click', e => { if (e.target === modal) close(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
window.addEventListener('hashchange', () => { render(); window.scrollTo(0,0); });

/* ---- name: each letter takes a random palette colour while the mouse is over it ---- */
(function(){
  const link = document.querySelector('.name a');
  const text = link.textContent;
  link.setAttribute('aria-label', text);
  link.innerHTML = [...text].map(ch => ch === ' ' ? ' ' : `<span class="ch" aria-hidden="true">${esc(ch)}</span>`).join('');
  link.querySelectorAll('.ch').forEach(s => {
    s.addEventListener('mouseenter', () => {
      const pick = FRAMES.filter(c => c !== s.dataset.c);
      s.dataset.c = pick[Math.floor(Math.random() * pick.length)];
      s.style.color = `var(${s.dataset.c})`;
    });
    s.addEventListener('mouseleave', () => { s.style.color = ''; s.dataset.c = ''; });   /* back to dark green */
  });
})();

/* ---- start ---- */
(async () => {
  try {
    SITE = await load('content/site.yml');
    CATS = await load('content/categories.yml');
    for (const c of CATS){
      const vids = (await load(`content/videos/${c.id}.yml`)) || [];
      vids.forEach(v => ALL.push({ ...v, cat: c.id }));
    }
    render();
  } catch (err){
    main.innerHTML = `<p class="loading">Something went wrong loading the site. ${esc(err.message)}</p>`;
  }
})();
