/* ============================================================
   views/home.js — the hub. Search is the primary action: typing
   a term and hitting Enter/Search jumps straight into the in-app
   multi-site search view (#/search), not just a local filter.
   ============================================================ */
(function () {
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
        <a class="feat-card accent-gold" href="#/search">
          <span class="feat-icon">🔍</span>
          <h3>Multi-Site Search</h3>
          <p>Search once, flip through every site's results as tabs — videos play right inside the app on the sites that allow it.</p>
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
