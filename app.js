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
  const y = youtubeId(u); if (y) return `https://i.ytimg.com/vi/${y}/hqdefault.jpg`;
  const id = vimeoId(u);
  if (id){
    if (thumbCache[id]) return thumbCache[id];
    try {
      const r = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent('https://vimeo.com/' + id)}&width=960`);
      if (r.ok){ const j = await r.json(); return thumbCache[id] = j.thumbnail_url; }
    } catch(e){}
  }
  return null;
}

/* ---- grid ---- */
function corner(v){ return CORNERS[v.corner] || Object.values(CORNERS)[hash('c' + v.title) % 4]; }
function tile(v, k){
  const c = FRAMES.includes('--' + v.colour) ? '--' + v.colour : FRAMES[k % FRAMES.length];
  const play = embedUrl(v.link);
  const tag = play || !v.link ? 'button type="button"' : `a href="${esc(v.link)}" target="_blank" rel="noopener"`;
  const end = play || !v.link ? 'button' : 'a';
  return `<${tag} class="item ${corner(v)}" data-i="${ALL.indexOf(v)}" style="--tint:var(${c})" aria-label="${esc(v.title)}">
    <span class="frame"><span class="img"></span><span class="tint"></span><span class="ov"><span class="t">${esc(v.title)}</span></span></span>
    <span class="tb">${esc(v.title)}</span></${end}>`;
}
function grid(list){
  setTimeout(() => main.querySelectorAll('.item').forEach(async el => {
    const src = await thumbnail(ALL[el.dataset.i]);
    if (src) el.querySelector('.img').style.backgroundImage = `url("${src}")`;
  }));
  return `<div class="grid">${list.map(tile).join('')}</div>`;
}
function filters(id){
  return `<ul class="filters">` + [['work','All'], ...CATS.map(c => [c.id, c.title])]
    .map(([k,l]) => `<li><a href="#${k}"${k === id ? ' aria-current="page"' : ''}>${esc(l)}</a></li>`).join('') + `</ul>`;
}

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
      <ul class="social">${(c.links || []).map(l => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)}</a></li>`).join('')}</ul></section>`;
  } else if (id === 'work'){
    main.innerHTML = filters(id) + grid(ALL);
  } else {
    main.innerHTML = filters(id) + grid(ALL.filter(v => v.cat === id));
  }
}

/* ---- pop-up player ---- */
const modal = document.getElementById('modal'), screen = document.getElementById('screen');
let last;
main.addEventListener('click', e => {
  const b = e.target.closest('button.item'); if (!b) return;
  const v = ALL[b.dataset.i], src = embedUrl(v.link); if (!src) return;
  last = b;
  screen.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${esc(v.title)}"></iframe>`;
  document.getElementById('mt').textContent = v.title;
  document.getElementById('mtag').textContent = v.tagline || '';
  const tint = b.style.getPropertyValue('--tint');                 /* same colour as this film's triangle */
  const light = ['--green','--lime','--rose','--mauve'].some(c => tint.includes(c + ')'));
  const bar = document.querySelector('.pinfo');
  bar.style.setProperty('--bar', tint);
  bar.style.setProperty('--bartext', light ? 'var(--ink)' : 'var(--bg)');
  modal.hidden = false;
  document.getElementById('mclose').focus();
});
function close(){ modal.hidden = true; screen.innerHTML = ''; last && last.focus(); }
document.getElementById('mclose').onclick = close;
modal.addEventListener('click', e => { if (e.target === modal) close(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
window.addEventListener('hashchange', () => { render(); window.scrollTo(0,0); });

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
