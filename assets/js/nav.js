/* ============================================================
   nav.js — shared chrome: age gate, header/nav, mobile nav, tab
   bar, toast, scroll-to-top. Built ONCE by NB.initChrome() when
   the app boots (single-page shell — see router.js). Individual
   views reconfigure the header search/actions via
   NB.configureHeader() on every navigation instead of the whole
   chrome being rebuilt.
   Depends on store.js being loaded first.
   ============================================================ */
const NB = (() => {
  const PAGES = [
    { id: 'home',      route: '/',          label: 'Home',      icon: '⌂' },
    { id: 'directory', route: '/directory', label: 'Directory', icon: '⌕' },
    { id: 'library',   route: '/library',   label: 'Library',   icon: '▣' },
    { id: 'handy',     route: '/handy',     label: 'The Handy', icon: '⚡' },
    { id: 'tools',     route: '/tools',     label: 'Tools',     icon: '⬇' },
    { id: 'settings',  route: '/settings',  label: 'Settings',  icon: '⚙' },
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
          <div class="gate-msg">A private, self-hosted collection of adult links and tools. By entering you confirm you are 18 or older and that explicit content is legal to view in your jurisdiction. Nothing you do here is tracked or sent anywhere — everything lives in this browser only.</div>
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

    const mob = document.getElementById('nb-mobilenav');
    if (mob) {
      mob.innerHTML = `<div id="mobileNav">
        <button type="button" class="mobilenav-search" id="mobNavSearch"><span>⌕ Quick Search</span><span class="cmdk-kbd">⌘K</span></button>
        ${PAGES.map(p => `<a href="#${p.route}" data-route="${p.route}"><span>${p.icon}</span> ${p.label}</a>`).join('')}
      </div>`;
      document.getElementById('mobNavSearch').onclick = () => {
        mob.querySelector('#mobileNav').classList.remove('open');
        if (typeof Palette !== 'undefined') Palette.toggle();
      };
      mob.querySelectorAll('#mobileNav a').forEach(a => {
        a.addEventListener('click', () => mob.querySelector('#mobileNav').classList.remove('open'));
      });
    }
  }

  function buildTabBar() {
    let bar = document.getElementById('tabbar');
    const mainItems = PAGES.slice(0, 4);
    const html = mainItems.map(p =>
      `<a href="#${p.route}" data-route="${p.route}" class="tabbar-item"><span class="ti-icon">${p.icon}</span><span>${p.label.replace('The ', '')}</span></a>`
    ).join('') + `<button type="button" class="tabbar-item" id="tabbarMore"><span class="ti-icon">☰</span><span>More</span></button>`;
    if (!bar) {
      bar = document.createElement('nav');
      bar.id = 'tabbar';
      bar.setAttribute('aria-label', 'Primary');
      document.body.appendChild(bar);
    }
    bar.innerHTML = html;
    document.getElementById('tabbarMore').addEventListener('click', () => {
      const mob = document.getElementById('nb-mobilenav');
      if (mob) mob.querySelector('#mobileNav').classList.toggle('open');
    });
  }

  // Called on every route change — updates .active classes on the
  // header nav, mobile nav, and tab bar without rebuilding any of
  // them (avoids re-wiring listeners on every navigation).
  function setActive(routeId) {
    activeId = routeId;
    const page = PAGES.find(p => p.id === routeId);
    const inMainNav = page && PAGES.slice(0, 4).some(p => p.id === routeId);
    document.querySelectorAll('#navPrimary a, #mobileNav a').forEach(a => {
      a.classList.toggle('active', !!(page && a.dataset.route === page.route));
    });
    document.querySelectorAll('.tabbar-item[data-route]').forEach(a => {
      a.classList.toggle('active', !!(page && a.dataset.route === page.route));
    });
    const more = document.getElementById('tabbarMore');
    if (more) more.classList.toggle('active', !inMainNav);
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
    el.innerHTML = `Noir Index — private, self-hosted, no accounts, no tracking. Data lives in <em>this</em> browser. · <a href="#/settings">Settings</a>`;
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

  function buildAmbience() {
    if (document.querySelector('.ambience')) return;
    const div = document.createElement('div');
    div.className = 'ambience';
    document.body.insertBefore(div, document.body.firstChild);
  }

  function applyDensity() {
    document.body.classList.toggle('density-compact', Store.getSettings().density === 'compact');
  }

  function initChrome() {
    buildAmbience();
    applyDensity();
    buildGate();
    buildHeader();
    buildTabBar();
    buildFooter();
    buildToast();
    buildScrollTop();
    window.toast = toast;

    document.addEventListener('keydown', e => {
      const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
      if (e.key === '/' && !inInput) {
        const s = document.getElementById('search');
        if (s && document.getElementById('hdrSearchWrap').style.display !== 'none') { e.preventDefault(); s.focus(); }
      }
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-bg.open').forEach(m => m.classList.remove('open'));
        const mob = document.getElementById('mobileNav');
        if (mob) mob.classList.remove('open');
      }
    });
  }

  return { PAGES, toast, initChrome, setActive, configureHeader, applyDensity };
})();
