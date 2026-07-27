/* ============================================================
   palette.js — global command palette (Cmd/Ctrl+K). Jump to any
   view instantly, or fuzzy-search the Taboo directory from
   anywhere in the app. SITES is loaded synchronously as part of
   the single-page shell, so no lazy-fetch trick is needed here.
   ============================================================ */
const Palette = (() => {
  const PAGES = NB.PAGES.map(p => ({ label: p.label, icon: p.icon, route: p.route }));

  let modal, input, results, hint;
  let activeIndex = 0;
  let currentItems = [];

  function build() {
    if (document.getElementById('cmdk-modal')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="modal-bg" id="cmdk-modal">
        <div class="sheet cmdk-sheet">
          <input id="cmdk-input" type="text" placeholder="Jump to a page or search the directory…" autocomplete="off">
          <div id="cmdk-results" class="cmdk-results"></div>
          <div class="cmdk-hint small">
            <span class="cmdk-kbd">↑</span><span class="cmdk-kbd">↓</span> navigate &nbsp;
            <span class="cmdk-kbd">↵</span> open &nbsp;
            <span class="cmdk-kbd">esc</span> close
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrap.firstElementChild);
    modal = document.getElementById('cmdk-modal');
    input = document.getElementById('cmdk-input');
    results = document.getElementById('cmdk-results');
    hint = document.querySelector('.cmdk-hint');

    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    input.addEventListener('input', () => render(input.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      if (e.key === 'Enter') { e.preventDefault(); select(); }
      if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
  }

  function move(delta) {
    if (!currentItems.length) return;
    activeIndex = (activeIndex + delta + currentItems.length) % currentItems.length;
    highlight();
  }
  function highlight() {
    [...results.children].forEach((el, i) => el.classList.toggle('active', i === activeIndex));
    const el = results.children[activeIndex];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }
  function select() {
    const item = currentItems[activeIndex];
    if (!item) return;
    if (item.route) Router.go(item.route);
    else if (item.href) window.open(item.href, '_blank', 'noopener');
    close();
  }

  function render(q) {
    q = (q || '').trim().toLowerCase();
    const pageMatches = PAGES.filter(p => !q || p.label.toLowerCase().includes(q));
    const siteMatches = (typeof SITES !== 'undefined' ? SITES : [])
      .filter(s => !q || s.name.toLowerCase().includes(q) || (s.tags || []).some(t => t.includes(q)))
      .slice(0, 8);
    currentItems = [
      ...pageMatches.map(p => ({ label: p.label, icon: p.icon, route: p.route, tag: '' })),
      ...siteMatches.map(s => ({ label: s.name, icon: '↗', href: s.url, tag: 'site' })),
    ];
    activeIndex = 0;

    if (!currentItems.length) {
      results.innerHTML = `<div class="cmdk-empty small">No matches</div>`;
      return;
    }
    results.innerHTML = currentItems.map((item, i) => `
      <button class="cmdk-item${i === 0 ? ' active' : ''}" data-i="${i}">
        <span class="cmdk-icon">${item.icon}</span>
        <span class="cmdk-label">${item.label}</span>
        ${item.tag ? `<span class="cmdk-tag">${item.tag}</span>` : ''}
      </button>`).join('');
    results.querySelectorAll('.cmdk-item').forEach(btn => {
      btn.addEventListener('click', () => { activeIndex = Number(btn.dataset.i); select(); });
      btn.addEventListener('mouseenter', () => { activeIndex = Number(btn.dataset.i); highlight(); });
    });
  }

  function open() {
    build();
    modal.classList.add('open');
    input.value = '';
    render('');
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    if (modal) modal.classList.remove('open');
  }
  function toggle() {
    if (modal && modal.classList.contains('open')) close();
    else open();
  }

  function init() {
    document.addEventListener('keydown', e => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); toggle(); }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  return { open, close, toggle };
})();
