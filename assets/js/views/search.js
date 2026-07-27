/* ============================================================
   views/search.js — in-app multi-site search. A first-class,
   bookmarkable page (not a modal): type a term once, then flip
   between every searchable site's live results as tabs, all
   inside the app shell. Reuses each site's own search-url
   pattern (`su` in sites.js) — grows automatically as that list
   grows.
   ============================================================ */
(function () {
  function esc(str) { return String(str).replace(/</g, '&lt;'); }

  function searchableSites() {
    return SITES.filter(s => s.su).map(s => ({ id: s.id, n: s.name, u: s.su }));
  }

  function render(container, params) {
    const q = (params.get('q') || '').trim();
    const preferSite = params.get('site') || '';
    const sites = searchableSites();
    const startIndex = Math.max(0, sites.findIndex(s => s.id === preferSite));

    NB.configureHeader(null);

    container.innerHTML = `
      <div class="eyebrow" style="margin-bottom:8px">Multi-Site Search</div>
      <h1 style="font-size:1.6rem;margin-bottom:14px">${q ? `Results for &ldquo;${esc(q)}&rdquo;` : 'Search across every site at once'}</h1>

      <div class="hero-search" style="max-width:640px;margin-bottom:14px">
        <span class="srch-icon">⌕</span>
        <input id="srchInput" type="search" value="${esc(q)}" placeholder="Search across sites — “femdom”, “stepmom”, “findom”, “4k”…" autocomplete="off">
        <button class="btn btn-gold hero-search-go" id="srchGo">Search</button>
      </div>

      ${q ? `
      <div id="srch-tabs" class="chip-row" style="margin-bottom:14px"></div>
      <div class="small mt" style="margin-bottom:10px">
        Playing inside the app — tap a video and it stays right here.
        <a id="srchExternal" href="#" target="_blank" rel="noopener" style="color:var(--gold);margin-left:8px">Open this site externally ↗</a>
      </div>
      <div id="srch-frame-wrap" style="position:relative;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--border-strong);height:min(72vh,900px);min-height:380px;background:#fff;box-shadow:0 30px 60px -30px rgba(0,0,0,.7)">
        <iframe id="srch-frame" title="Search results" referrerpolicy="no-referrer" style="width:100%;height:100%;border:0"></iframe>
      </div>` : `
      <div class="empty">
        <div class="empty-icon">⌕</div>
        <div class="empty-txt">Type a term above and hit Search — results from ${sites.length} sites open right here, no new tabs.</div>
      </div>`}
    `;

    const input = document.getElementById('srchInput');
    const go = () => {
      const term = input.value.trim();
      if (!term) { toast('Type a search term first'); return; }
      Router.go('/search?q=' + encodeURIComponent(term));
    };
    document.getElementById('srchGo').addEventListener('click', go);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });

    if (!q) { input.focus(); return; }

    const tabsEl = document.getElementById('srch-tabs');
    const frame = document.getElementById('srch-frame');
    const extLink = document.getElementById('srchExternal');

    function load(i) {
      const site = sites[i];
      if (!site) return;
      const url = site.u + encodeURIComponent(q);
      frame.src = url;
      extLink.href = url;
      tabsEl.querySelectorAll('.chip').forEach((t, idx) => t.classList.toggle('on', idx === i));
    }

    tabsEl.innerHTML = sites.map((s, i) => `<button class="chip" data-i="${i}">${s.n}</button>`).join('');
    tabsEl.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => load(Number(btn.dataset.i)));
    });
    load(startIndex);
  }

  Router.register('/search', { id: 'search', title: 'Search — Noir Index', render });
})();
