/* ============================================================
   nav.js — shared chrome: age gate, header/nav, mobile nav,
   toast, scroll-to-top. Injected on every page via NB.initChrome().
   Depends on store.js being loaded first.
   ============================================================ */
const NB = (() => {
  const PAGES = [
    { id: 'index',     href: 'index.html',     label: 'Home',      icon: '⌂' },
    { id: 'directory', href: 'directory.html', label: 'Directory', icon: '⌕' },
    { id: 'library',   href: 'library.html',   label: 'Library',   icon: '▣' },
    { id: 'handy',     href: 'handy.html',     label: 'The Handy', icon: '⚡' },
    { id: 'tools',     href: 'tools.html',     label: 'Tools',     icon: '⬇' },
    { id: 'settings',  href: 'settings.html',  label: 'Settings',  icon: '⚙' },
  ];

  let toastTimer;
  function toast(msg, tone) {
    const t = document.getElementById('nb-toast-inner');
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

  function buildHeader(activeId, opts) {
    const el = document.getElementById('nb-header');
    if (!el) return;
    const links = PAGES.map(p => `<a href="${p.href}" class="${p.id === activeId ? 'active' : ''}">${p.label}</a>`).join('');
    const showSearch = opts && opts.search;
    el.innerHTML = `
      <header id="hdr">
        <div class="hdr-inner">
          <a class="brand" href="index.html">
            <span class="brand-mark">♛</span><span class="brand-word">Noir Index</span>
          </a>
          <nav class="primary">${links}</nav>
          <div class="hdr-spacer"></div>
          ${showSearch ? `
          <div class="srch-wrap">
            <span class="srch-icon">⌕</span>
            <input id="search" type="search" placeholder="${opts.search.placeholder || 'Search…'}" autocomplete="off">
            <button class="srch-clr" id="sclr">✕</button>
          </div>` : ''}
          <div class="hdr-actions">
            <button class="hact" id="cmdkBtn" title="Quick jump (⌘K)">⌘K</button>
            ${(opts && opts.actions || []).map(a => `<button class="hact" id="${a.id}" title="${a.title}">${a.icon}</button>`).join('')}
            <button class="hact" id="navToggle" title="Menu">☰</button>
          </div>
        </div>
      </header>`;

    const cmdkBtn = document.getElementById('cmdkBtn');
    if (cmdkBtn) cmdkBtn.addEventListener('click', () => { if (typeof Palette !== 'undefined') Palette.toggle(); });

    const mob = document.getElementById('nb-mobilenav');
    if (mob) {
      mob.innerHTML = `<div id="mobileNav">${PAGES.map(p =>
        `<a href="${p.href}" class="${p.id === activeId ? 'active' : ''}"><span>${p.icon}</span> ${p.label}</a>`
      ).join('')}</div>`;
      document.getElementById('navToggle').onclick = () => mob.querySelector('#mobileNav').classList.toggle('open');
    }

    if (showSearch) {
      const input = document.getElementById('search');
      const clr = document.getElementById('sclr');
      if (opts.search.initial) input.value = opts.search.initial;
      const fire = () => {
        clr.classList.toggle('vis', !!input.value);
        opts.search.onInput && opts.search.onInput(input.value.trim());
      };
      input.addEventListener('input', fire);
      clr.onclick = () => { input.value = ''; fire(); input.focus(); };
      if (opts.search.onEnter) input.addEventListener('keydown', e => { if (e.key === 'Enter') opts.search.onEnter(input.value.trim()); });
      fire();
    }
  }

  function buildFooter() {
    const el = document.getElementById('nb-footer');
    if (!el) return;
    el.innerHTML = `Noir Index — private, self-hosted, no accounts, no tracking. Data lives in <em>this</em> browser. · <a href="settings.html">Settings</a>`;
  }

  function buildToast() {
    const el = document.getElementById('nb-toast');
    if (!el) return;
    el.innerHTML = `<div id="toast" id="nb-toast-inner"></div>`;
    el.firstElementChild.id = 'nb-toast-inner';
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

  function initChrome(pageId, opts) {
    buildAmbience();
    applyDensity();
    buildGate();
    buildHeader(pageId, opts);
    buildFooter();
    buildToast();
    buildScrollTop();
    window.toast = toast;

    document.addEventListener('keydown', e => {
      const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
      if (e.key === '/' && !inInput) {
        const s = document.getElementById('search');
        if (s) { e.preventDefault(); s.focus(); }
      }
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-bg.open').forEach(m => m.classList.remove('open'));
        const mob = document.getElementById('mobileNav');
        if (mob) mob.classList.remove('open');
      }
    });
  }

  return { PAGES, toast, initChrome };
})();
