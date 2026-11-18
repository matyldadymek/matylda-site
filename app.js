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
  return `<button type="button" class="item ${corner(v)}" data-i="${ALL.indexOf(v)}" style="--tint:var(${c})${FRAMES.includes('--' + v.title_colour) ? `;--tt:var(--${v.title_colour})` : ''}" aria-label="${esc(v.title)}">
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
    { rootMargin: '-49% 0px -49% 0px' });   /* a thin band across the middle of the screen */
  main.querySelectorAll('.item').forEach(el => centreObs.observe(el));
}
/* at the very bottom of the page the last film can never reach the middle, so reveal it there */
window.addEventListener('scroll', () => {
  if (!touch.matches) return;
  const items = main.querySelectorAll('.item'); if (!items.length) return;
  const last = items[items.length - 1];
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  const r = last.getBoundingClientRect();
  if (atBottom && r.top < window.innerHeight && r.bottom > 0){
    items.forEach(el => el.classList.toggle('on', el === last));
  }
}, { passive: true });
function filters(id){
  return `<ul class="filters">` + CATS.map(c => [c.id, c.title])
    .map(([k,l]) => `<li><a href="#${k}"${k === id ? ' aria-current="page"' : ''}>${esc(l)}</a></li>`).join('') + `</ul>`;
}

/* social links shown as a logo instead of a word (matched by the link's name in site.yml) */
const ICONS = {
  linkedin: `<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>`
};

/* films without a video link go to the end, everything else keeps its order */
const lastIfNoLink = list => [...list.filter(v => v.link), ...list.filter(v => !v.link)];

/* "Work" in the menu opens the first section */
function setWorkLink(){ const w = nav.querySelector('a[data-top="work"]'); if (w && CATS[0]) w.href = '#' + CATS[0].id; }

const IG_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"/></svg>`;

/* ";)" in the contact text is drawn as a small wink face in the site's colours */
const WINK = `<svg class="wink" viewBox="0 0 24 24" role="img" aria-label="wink"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8.6" cy="9.6" r="1.35" fill="currentColor"/><path d="M13.6 9.8q1.8-1.5 3.6 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7.6 14.2q4.4 4 8.8 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

/* looping "hello" animation (After Effects) on the contact page.
   Phones and tablets get an animated image: they always play and loop it, even in Low Power Mode.
   Computers get a small video instead, because Safari on a Mac plays the animated image too slowly.
   People who switched off animations on their device see a still frame instead. */
const STILL = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DESKTOP = matchMedia('(hover: hover) and (pointer: fine)').matches;
const HELLO_VIDEO = STILL
  ? `<img class="hello" src="media/hello-poster-2.jpg" width="540" height="960" alt="Hello, cześć, hej, salut">`
  : DESKTOP
  ? `<video class="hello" src="media/hello-loop-2.mp4" poster="media/hello-poster-2.jpg" width="540" height="960" autoplay muted loop playsinline disablepictureinpicture aria-label="Hello, cześć, hej, salut"></video>`
  : `<img class="hello" src="media/hello-loop-2.webp" width="540" height="960" alt="Hello, cześć, hej, salut">`;
function keepLooping(){
  const v = main.querySelector('video.hello'); if (!v) return;
  v.muted = true; const p = v.play(); if (p) p.catch(() => {});
}

/* ---- pages ---- */
function render(){
  const ids = CATS.map(c => c.id);
  let id = location.hash.slice(1);
  if (!['home','work','contact',...ids].includes(id)) id = 'home';
  const top = (id === 'work' || ids.includes(id)) ? 'work' : id;
  nav.querySelectorAll('a').forEach(a => a.dataset.top === top ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'));

  if (id === 'home'){
    main.innerHTML = grid(ALL.filter(v => v.featured).sort((a,b) => a.featured - b.featured));
  } else if (id === 'contact'){
    const c = SITE.contact || {};
    main.innerHTML = `<section class="contact">${c.email ? `<a class="hello-link" href="mailto:${esc(c.email)}" title="Email me" aria-label="Email ${esc(c.email)}">${HELLO_VIDEO}</a>` : HELLO_VIDEO}<h1>${esc(c.headline)}</h1><p>${esc(c.text).replace(/;-?\)/g, WINK)}</p>
      ${c.email ? `<a class="email" href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ''}
      <ul class="social">${(c.links || []).map(l => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener"${ICONS[l.name.toLowerCase()] ? ` class="icon" aria-label="${esc(l.name)}" title="${esc(l.name)}">${ICONS[l.name.toLowerCase()]}` : `>${esc(l.name)}`}</a></li>`).join('')}</ul></section>`;
    keepLooping();
  } else if (id === 'work'){
    /* there is no "All" page any more: old links open the first section */
    location.replace('#' + CATS[0].id); return;
  } else {
    main.innerHTML = filters(id) + grid(lastIfNoLink(ALL.filter(v => v.cat === id)));
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
  if (src && !v.mature && !v.vimeo_only){
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
    /* mature films: Vimeo won't play them inside other sites, so send viewers to Vimeo to confirm their age.
       vimeo_only films: their owner doesn't allow them to play on other sites, so the button opens them on Vimeo. */
    const img = await thumbnail(v);
    screen.innerHTML = (img ? `<img src="${esc(img)}" alt="">` : '') +
      (v.mature ? `<a class="notice" href="${esc(v.link)}" target="_blank" rel="noopener">
         <span class="badge">18+</span>
         <strong>${esc(v.mature_note || 'This film is for adult audiences')}</strong>
         <span>Click through to watch on Vimeo, where you'll be asked to confirm you're 18 or over.</span>
         <span class="go">Watch on Vimeo →</span></a>` : '');
    go.href = v.link; go.hidden = false;
    const ig = /instagram\.com/.test(v.link);
    go.innerHTML = v.mature || /vimeo\.com/.test(v.link) ? 'Watch on Vimeo'
                 : ig ? 'Watch on ' + IG_ICON : 'Go to site';
    go.setAttribute('aria-label', ig ? 'Watch on Instagram' : go.textContent);
  }
  document.getElementById('mt').textContent = v.title;
  /* bar text: type of project and its full length, e.g. "Fiction feature (45 min) · excerpt".
     Until a film has a type, its old short description is shown instead. */
  const clip = v.clip || (v.excerpt ? 'excerpt' : '');
  const info = v.type ? [v.type + (v.length ? ` (${v.length})` : ''), clip].filter(Boolean).join(' · ')
                      : (v.tagline || '');
  document.getElementById('mtag').textContent = info;
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
    setWorkLink();
    render();
  } catch (err){
    main.innerHTML = `<p class="loading">Something went wrong loading the site. ${esc(err.message)}</p>`;
  }
})();
