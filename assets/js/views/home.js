/* ============================================================
   views/home.js — the hub. Search is the primary action: typing
   a term and hitting Enter/Search jumps straight into the in-app
   multi-site search view (#/search), not just a local filter.
   ============================================================ */
(function () {
  function renderContinueWatching() {
    const pos = Store.get('playpos', {});
    const entries = Object.values(pos)
      .filter(v => v && typeof v === 'object' && v.time > 15 && v.name)
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, 6);
    if (!entries.length) return '';
    return `
      <section style="margin-bottom:28px">
        <div class="eyebrow" style="margin-bottom:8px">Pick up where you left off</div>
        <h2 style="font-family:var(--serif);font-size:1.2rem;margin-bottom:14px">Continue Watching</h2>
        <div class="card-grid">
          ${entries.map(v => {
            const pct = v.durationSec ? Math.min(100, Math.round((v.time / v.durationSec) * 100)) : 0;
            return `<a class="card" href="#/library" style="padding:10px 10px 12px">
              <div class="thumb-wrap" style="margin-bottom:8px">
                <div style="width:100%;aspect-ratio:16/9;background:var(--s3)"></div>
                ${v.thumbnailLink ? `<img src="${v.thumbnailLink}" alt="" loading="lazy" onerror="this.remove()" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">` : ''}
                <div class="play-badge" style="opacity:.85">▶</div>
                <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(0,0,0,.45)">
                  <div style="width:${pct}%;height:100%;background:var(--grad-gold)"></div>
                </div>
              </div>
              <div class="c-name" style="padding-right:0">${v.name}</div>
              <div class="c-note">${v.rootLabel || 'My Library'} · ${pct}% watched</div>
            </a>`;
          }).join('')}
        </div>
      </section>`;
  }

  function render(container) {
    NB.configureHeader(null);
    container.innerHTML = `
      <section class="hero">
        <div class="eyebrow">Private Collection · 18+</div>
        <h1 class="hero-title">Curated for one obsession:<br><em>step fetish, femdom &amp; mommy domme.</em></h1>
        <p class="hero-sub">Free sites, one search box. No paid sites, no accounts, no tracking — nothing leaves this browser.</p>
        <div class="hero-search">
          <span class="srch-icon">⌕</span>
          <input id="quickSearch" type="search" placeholder="Search across sites — “femdom”, “stepmom”, “findom”, “4k”…" autocomplete="off">
          <button class="btn btn-gold hero-search-go" id="heroGo">Search</button>
        </div>
        <div class="hero-actions">
          <a class="btn btn-ghost" href="#/directory" style="width:auto;padding:10px 20px">Browse all sites →</a>
        </div>
      </section>

      ${renderContinueWatching()}

      <a class="feat-primary" href="#/directory">
        <span class="feat-primary-icon">♛</span>
        <div>
          <div class="feat-primary-eyebrow">The Directory</div>
          <h2>Browse the full Taboo list</h2>
          <p>Step fetish, femdom &amp; mommy domme — free sites only, tagged and searchable, with a live "most visited" row that learns what you actually use.</p>
        </div>
        <span class="feat-primary-arrow">→</span>
      </a>

      <div class="feat-secondary-label">Also here</div>
      <section class="feat-grid">
        <a class="feat-card accent-gold" href="#/library">
          <span class="feat-icon">▣</span>
          <h3>My Library</h3>
          <p>Your own saved collection, pulled live from Google Drive — searchable, taggable, downloadable.</p>
        </a>
        <a class="feat-card accent-gold" href="#/handy">
          <span class="feat-icon">⚡</span>
          <h3>The Handy</h3>
          <p>Full control panel for your device — manual mode, stroke range, script sync, and a curated feed of scripts.</p>
        </a>
        <a class="feat-card" href="#/tools">
          <span class="feat-icon">⬇</span>
          <h3>Download &amp; Self-Host</h3>
          <p>yt-dlp and friends, media servers, and everything you need to build a permanent local archive.</p>
        </a>
      </section>`;

    const qs = document.getElementById('quickSearch');
    const goToSearch = () => {
      if (qs.value.trim()) Router.go('/search?q=' + encodeURIComponent(qs.value.trim()));
    };
    qs.addEventListener('keydown', e => { if (e.key === 'Enter') goToSearch(); });
    document.getElementById('heroGo').addEventListener('click', goToSearch);
  }

  Router.register('/', { id: 'home', title: 'Noir Index', render });
})();
