/* ============================================================
   views/search.js — in-app multi-site search. A first-class,
   bookmarkable page (not a modal): type a term once, then flip
   between every searchable site's live results as tabs, all
   inside the app shell. Reuses each site's own search-url
   pattern (`su` in sites.js) — grows automatically as that list
   grows.

   Some sites block being embedded in someone else's page
   (X-Frame-Options / CSP frame-ancestors) — that's a platform
   restriction this app can't override. Sites confirmed to block
   framing are marked `noFrame: true` in sites.js; for those, this
   view skips the iframe attempt entirely and opens a real tab
   instead of leaving a dead blank box in the app.
   ============================================================ */
(function () {
  function esc(str) { return String(str).replace(/</g, '&lt;'); }

  function searchableSites() {
    return SITES.filter(s => s.su).map(s => ({ id: s.id, n: s.name, u: s.su, noFrame: !!s.noFrame }));
  }

  function render(container, params) {
    const q = (params.get('q') || '').trim();
    const preferSite = params.get('site') || '';
    const sites = searchableSites();
    let startIndex = sites.findIndex(s => s.id === preferSite);
    if (startIndex === -1) startIndex = sites.findIndex(s => !s.noFrame);
    if (startIndex === -1) startIndex = 0;

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
        Playing inside the app where the site allows it — sites marked ↗ block embedding and open in a new tab instead.
        <a id="srchExternal" href="#" target="_blank" rel="noopener" style="color:var(--gold);margin-left:8px">Open current site externally ↗</a>
      </div>
      <div id="srch-frame-wrap" style="position:relative;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--border-strong);height:min(72vh,900px);min-height:380px;background:#fff;box-shadow:0 30px 60px -30px rgba(0,0,0,.7)">
        <iframe id="srch-frame" title="Search results" referrerpolicy="no-referrer" style="width:100%;height:100%;border:0"></iframe>
        <div id="srch-blocked" style="display:none;position:absolute;inset:0;background:var(--s1);flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:14px;padding:30px">
          <div style="font-size:2rem">↗</div>
          <div style="font-family:var(--serif);font-size:1.15rem;font-weight:700;color:var(--text)" id="srch-blocked-name"></div>
          <div class="small" style="max-width:360px;color:var(--t2)">This site blocks embedding in other pages — opened it in a new tab instead. Pick another tab above, or reopen it here:</div>
          <a class="btn btn-gold" id="srch-blocked-open" target="_blank" rel="noopener" style="width:auto;padding:10px 20px">Open Externally ↗</a>
        </div>
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
    const blocked = document.getElementById('srch-blocked');
    const blockedName = document.getElementById('srch-blocked-name');
    const blockedOpen = document.getElementById('srch-blocked-open');

    function load(i, opts) {
      const site = sites[i];
      if (!site) return;
      const url = site.u + encodeURIComponent(q);
      extLink.href = url;
      tabsEl.querySelectorAll('.chip').forEach((t, idx) => t.classList.toggle('on', idx === i));

      if (site.noFrame) {
        frame.style.display = 'none';
        blocked.style.display = 'flex';
        blockedName.textContent = site.n;
        blockedOpen.href = url;
        if (!opts || !opts.silent) window.open(url, '_blank', 'noopener');
      } else {
        blocked.style.display = 'none';
        frame.style.display = 'block';
        frame.src = url;
      }
    }

    tabsEl.innerHTML = sites.map((s, i) => `<button class="chip" data-i="${i}">${s.n}${s.noFrame ? ' ↗' : ''}</button>`).join('');
    tabsEl.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => load(Number(btn.dataset.i)));
    });
    // don't auto-open a new tab on first load — only when the user actively picks a noFrame tab
    load(startIndex, { silent: true });
  }

  Router.register('/search', { id: 'search', title: 'Search — Noir Index', render });
})();
