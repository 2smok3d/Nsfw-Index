/* ============================================================
   nav.js — shared chrome: age gate, header/nav, tab bar, toast,
   scroll-to-top. Built ONCE by NB.initChrome() when the app boots
   (single-page shell — see router.js). Individual views
   reconfigure the header search/actions via NB.configureHeader()
   on every navigation instead of the whole chrome being rebuilt.
   Depends on store.js being loaded first.
   ============================================================ */
const NB = (() => {
  const PAGES = [
    { id: 'home',      route: '/',          label: 'Home',      icon: '⌂' },
    { id: 'directory', route: '/directory', label: 'Directory', icon: '⌕' },
    { id: 'search',    route: '/search',    label: 'Search',    icon: '🔍' },
    { id: 'bookmarks', route: '/bookmarks', label: 'Saved',      icon: '♥' },
  ];

  let activeId = null;
  let toastTimer;

  function toast(msg, tone) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.style.borderColor = tone === 'crimson' ? 'rgba(201,47,91,.5)' : tone === 'gold' ? 'var(--gold)' : '';
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function buildGate() {
    const el = document.getElementById('nb-gate');
    if (!el) return;
    el.innerHTML = `
      <div id="gate" class="${Store.ageVerified() ? 'hidden' : ''}">
        <div class="gate-box">
          <div class="gate-crest">♛</div>
          <div class="gate-logo">Noir&nbsp;Index</div>
          <div class="eyebrow gate-eyebrow">Adults Only · 18+ · Private</div>
          <div class="gate-msg">A private, self-hosted directory of adult sites. By entering you confirm you are 18 or older and that explicit content is legal to view in your jurisdiction. Nothing you do here is tracked or sent anywhere — everything lives in this browser only.</div>
          <button class="btn btn-gold gate-enter" id="gate-enter">Enter — I am 18+</button>
          <button class="btn btn-ghost" id="gate-exit">Take me elsewhere</button>
        </div>
      </div>`;
    document.getElementById('gate-enter').onclick = () => {
      Store.setAgeVerified();
      document.getElementById('gate').classList.add('hidden');
    };
    document.getElementById('gate-exit').onclick = () => location.href = 'https://www.google.com';
  }

  function buildHeader() {
    const el = document.getElementById('nb-header');
    if (!el) return;
    const links = PAGES.map(p => `<a href="#${p.route}" data-route="${p.route}">${p.label}</a>`).join('');
    el.innerHTML = `
      <header id="hdr">
        <div class="hdr-inner">
          <a class="brand" href="#/">
            <span class="brand-mark">♛</span><span class="brand-word">Noir Index</span>
          </a>
          <nav class="primary" id="navPrimary">${links}</nav>
          <div class="hdr-spacer"></div>
          <div class="srch-wrap" id="hdrSearchWrap" style="display:none">
            <span class="srch-icon">⌕</span>
            <input id="search" type="search" autocomplete="off">
            <button class="srch-clr" id="sclr">✕</button>
          </div>
          <div class="hdr-actions">
            <span id="hdrPageActions" style="display:contents"></span>
            <button class="hact" id="cmdkBtn" title="Quick jump (⌘K)">⌘K</button>
          </div>
        </div>
      </header>`;

    document.getElementById('cmdkBtn').addEventListener('click', () => {
      if (typeof Palette !== 'undefined') Palette.toggle();
    });
  }

  function buildTabBar() {
    let bar = document.getElementById('tabbar');
    const html = PAGES.map(p =>
      `<a href="#${p.route}" data-route="${p.route}" class="tabbar-item"><span class="ti-icon">${p.icon}</span><span>${p.label}</span></a>`
    ).join('');
    if (!bar) {
      bar = document.createElement('nav');
      bar.id = 'tabbar';
      bar.setAttribute('aria-label', 'Primary');
      document.body.appendChild(bar);
    }
    bar.innerHTML = html;
  }

  // Called on every route change — updates .active classes on the
  // header nav and tab bar without rebuilding either (avoids
  // re-wiring listeners on every navigation).
  function setActive(routeId) {
    activeId = routeId;
    const page = PAGES.find(p => p.id === routeId);
    document.querySelectorAll('#navPrimary a').forEach(a => {
      a.classList.toggle('active', !!(page && a.dataset.route === page.route));
    });
    document.querySelectorAll('.tabbar-item[data-route]').forEach(a => {
      a.classList.toggle('active', !!(page && a.dataset.route === page.route));
    });
  }

  // Called by each view's render() to configure the shared header
  // search box and page-specific action buttons for that view.
  // Passing null/omitting a field hides/clears it.
  function configureHeader(opts) {
    opts = opts || {};
    const wrap = document.getElementById('hdrSearchWrap');
    const showSearch = !!opts.search;
    wrap.style.display = showSearch ? 'flex' : 'none';
    if (showSearch) {
      // clone to strip any listeners from the previous view
      const oldInput = document.getElementById('search');
      const input = oldInput.cloneNode(true);
      oldInput.parentNode.replaceChild(input, oldInput);
      const oldClr = document.getElementById('sclr');
      const clr = oldClr.cloneNode(true);
      oldClr.parentNode.replaceChild(clr, oldClr);

      input.placeholder = opts.search.placeholder || 'Search…';
      input.value = opts.search.initial || '';
      const fire = () => {
        clr.classList.toggle('vis', !!input.value);
        opts.search.onInput && opts.search.onInput(input.value.trim());
      };
      input.addEventListener('input', fire);
      clr.onclick = () => { input.value = ''; fire(); input.focus(); };
      if (opts.search.onEnter) input.addEventListener('keydown', e => { if (e.key === 'Enter') opts.search.onEnter(input.value.trim()); });
      fire();
    }

    const actionsEl = document.getElementById('hdrPageActions');
    const actions = opts.actions || [];
    actionsEl.innerHTML = actions.map(a => `<button class="hact${a.on ? ' on' : ''}" id="${a.id}" title="${a.title}">${a.icon}</button>`).join('');
    actions.forEach(a => {
      const btn = document.getElementById(a.id);
      if (btn && a.onClick) btn.addEventListener('click', a.onClick);
    });
  }

  function buildFooter() {
    const el = document.getElementById('nb-footer');
    if (!el) return;
    el.innerHTML = `Noir Index — private, self-hosted, no accounts, no tracking. Data lives in <em>this</em> browser.`;
  }

  function buildToast() {
    const el = document.getElementById('nb-toast');
    if (!el) return;
    el.innerHTML = `<div id="toast"></div>`;
  }

  function buildScrollTop() {
    const btn = document.getElementById('nb-stb');
    if (!btn) return;
    btn.textContent = '↑';
    btn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => btn.classList.toggle('vis', scrollY > 500), { passive: true });
  }

  // ── site icons ──────────────────────────────────────────────
  // A small favicon per card beats a wall of identical text rows.
  // Fetched from Google's public favicon service — the one request
  // in this app that leaves the browser — with a deterministically
  // colored monogram as the fallback when a fetch fails, so every
  // card still reads as visually distinct at a glance.
  function hueFor(seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
    return h;
  }
  function siteIcon(name, url) {
    const letter = (name || '?').trim().charAt(0).toUpperCase();
    const hue = hueFor(name || url || '');
    const fallback = `<span class="icon-fallback" style="--hue:${hue}">${letter}</span>`;
    let img = '';
    try {
      const host = new URL(url).hostname;
      img = `<img src="https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(host)}" alt="" loading="lazy">`;
    } catch (e) { /* not a real URL — fall through to monogram-only */ }
    return `<span class="site-icon">${img}${fallback}</span>`;
  }
  // <img> error events don't bubble, but they do fire in the capture
  // phase — one delegated listener on document handles every icon
  // across every render instead of re-wiring per card.
  function bindIconFallback() {
    document.addEventListener('error', e => {
      if (e.target.tagName === 'IMG' && e.target.closest('.site-icon')) e.target.remove();
    }, true);
  }

  // spotlight hover (see theme.css .card::after etc.) — a single
  // delegated listener sets --mx/--my on whichever card is under the
  // cursor, so it keeps working across every render without being
  // re-wired per card.
  function bindSpotlight() {
    document.addEventListener('pointermove', e => {
      const el = e.target.closest && e.target.closest('.card,.hcard,.feat-card,.feat-primary,.memory-card,.panel');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    }, { passive: true });
  }

  function buildAmbience() {
    if (document.querySelector('.ambience')) return;
    const div = document.createElement('div');
    div.className = 'ambience';
    document.body.insertBefore(div, document.body.firstChild);
  }

  function initChrome() {
    buildAmbience();
    buildGate();
    buildHeader();
    buildTabBar();
    buildFooter();
    buildToast();
    buildScrollTop();
    bindSpotlight();
    bindIconFallback();
    window.toast = toast;

    document.addEventListener('keydown', e => {
      const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
      if (e.key === '/' && !inInput) {
        const s = document.getElementById('search');
        if (s && document.getElementById('hdrSearchWrap').style.display !== 'none') { e.preventDefault(); s.focus(); }
      }
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-bg.open').forEach(m => m.classList.remove('open'));
      }
    });
  }

  return { PAGES, toast, initChrome, setActive, configureHeader, siteIcon };
})();
