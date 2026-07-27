/* ============================================================
   views/directory.js — browse/filter/tag the curated site list.
   Actual content search across sites lives in views/search.js —
   this view is for browsing which sites exist, not searching
   inside them.
   ============================================================ */
(function () {
  const S = {
    q: '',
    activeTags: new Set(),
    showFavs: false,
    open: true,
  };

  function popularTags(limit) {
    const freq = {};
    SITES.forEach(s => (s.tags || []).forEach(t => freq[t] = (freq[t] || 0) + 1));
    return Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, limit);
  }

  function withVisits(list) {
    const v = Store.getVisits();
    return list.map(x => Object.assign({ _visits: v[x.id] || 0 }, x));
  }
  function byVisitsDesc(a, b) { return b._visits - a._visits; }

  function matches(entry, q) {
    if (!q) return true;
    const hay = (entry.name + ' ' + (entry.note || '') + ' ' + (entry.tags || []).join(' ')).toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function filteredEntries() {
    const favs = Store.getFavs();
    let list = SITES;
    if (S.showFavs) list = list.filter(e => favs.has(e.id));
    if (S.activeTags.size) list = list.filter(e => (e.tags || []).some(t => S.activeTags.has(t)));
    if (S.q) list = list.filter(e => matches(e, S.q));
    return list;
  }

  function esc(str) { return String(str).replace(/'/g, "\\'"); }

  function hcard(entry) {
    const fav = Store.getFavs().has(entry.id);
    const visited = entry._visits > 0;
    return `<a class="hcard" href="${entry.url}" target="_blank" rel="noopener" data-visit="${entry.id}">
      <div class="hc-badge${visited ? ' hc-badge-hot' : ''}">${visited ? '🔥 Most Visited' : 'Featured'}</div>
      <button class="hc-fav${fav ? ' on' : ''}" data-fav="${entry.id}" title="${fav ? 'Unsave' : 'Save'}">♥</button>
      <div class="hc-name">${entry.name}</div>
      ${entry.note ? `<div class="hc-note">${entry.note}</div>` : ''}
    </a>`;
  }

  function card(entry) {
    const fav = Store.getFavs().has(entry.id);
    const term = entry.sq || S.q || '';
    const visited = entry._visits > 0;
    return `<a class="card${fav ? ' faved' : ''}" href="${entry.url}" target="_blank" rel="noopener" data-visit="${entry.id}">
      <button class="c-fav${fav ? ' on' : ''}" data-fav="${entry.id}" title="${fav ? 'Unsave' : 'Save'}">♥</button>
      <div class="c-tag">${visited ? '🔥 visited' : (entry.tags && entry.tags[0] ? entry.tags[0] : entry.category)}</div>
      <div class="c-name">${entry.name}</div>
      ${entry.note ? `<div class="c-note">${entry.note}</div>` : ''}
      ${entry.su ? `<button class="c-srch" data-siteid="${entry.id}" data-term="${esc(term)}" title="Search this site">⌕</button>` : ''}
    </a>`;
  }

  function sectionBlock(cat, rawItems) {
    const items = withVisits(rawItems);
    const HERO_N = 6;
    const visitedSorted = items.filter(x => x._visits > 0).sort(byVisitsDesc);

    let heroes, rest;
    if (visitedSorted.length) {
      heroes = visitedSorted.slice(0, HERO_N);
      const heroIds = new Set(heroes.map(x => x.id));
      if (heroes.length < HERO_N) {
        const pad = items.filter(x => x.hot && !heroIds.has(x.id)).slice(0, HERO_N - heroes.length);
        pad.forEach(x => heroIds.add(x.id));
        heroes = heroes.concat(pad);
      }
      rest = items.filter(x => !heroIds.has(x.id)).sort(byVisitsDesc);
    } else {
      heroes = items.filter(x => x.hot);
      const heroIds = new Set(heroes.map(x => x.id));
      rest = items.filter(x => !heroIds.has(x.id));
    }

    return `<div class="sec" id="${cat.id}">
      <div class="sec-hdr${S.open ? ' open' : ''}" data-toggle="${cat.id}">
        <div>
          <div class="sec-title">${cat.label}</div>
          <div class="small" style="margin-top:2px">${cat.blurb}</div>
        </div>
        <div class="sec-count">${items.length}</div>
        <span class="sec-chev">›</span>
      </div>
      <div class="sec-body${S.open ? ' open' : ''}" data-body="${cat.id}">
        <div class="sec-inner"><div class="sec-pad">
          ${heroes.length ? `<div class="hero-grid">${heroes.map(hcard).join('')}</div>` : ''}
          ${rest.length ? `<div class="card-grid">${rest.map(card).join('')}</div>` : ''}
        </div></div>
      </div>
    </div>`;
  }

  function render() {
    const el = document.getElementById('content');
    const data = filteredEntries();

    if (!data.length) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">⌕</div><div class="empty-txt">No results — try a different term or clear the tag filters</div></div>`;
      wire();
      return;
    }

    if (S.showFavs) {
      const sorted = withVisits(data).sort(byVisitsDesc);
      el.innerHTML = `<div class="res-hdr">Showing <strong>${data.length} saved</strong> sites</div>
        <div class="card-grid">${sorted.map(card).join('')}</div>`;
      wire();
      return;
    }

    if (S.q || S.activeTags.size) {
      const bits = [];
      if (S.q) bits.push(`matching <span>"${S.q}"</span>`);
      if (S.activeTags.size) bits.push(`tagged <span>${[...S.activeTags].join(', ')}</span>`);
      const sorted = withVisits(data).sort(byVisitsDesc);
      el.innerHTML = `<div class="res-hdr">Showing <strong>${data.length} sites</strong> ${bits.join(' &amp; ')}</div>
        <div class="card-grid">${sorted.map(card).join('')}</div>`;
      wire();
      return;
    }

    el.innerHTML = CATEGORIES.map(cat => {
      const items = SITES.filter(s => s.category === cat.id);
      return items.length ? sectionBlock(cat, items) : '';
    }).join('');
    wire();
  }

  function renderTagChips() {
    const el = document.getElementById('tagChips');
    const tags = popularTags(18);
    el.innerHTML = tags.map(t =>
      `<button class="chip crimson${S.activeTags.has(t) ? ' on crimson' : ''}" data-tag="${t}">${t}</button>`
    ).join('');
    el.querySelectorAll('[data-tag]').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.tag;
        S.activeTags.has(t) ? S.activeTags.delete(t) : S.activeTags.add(t);
        renderTagChips();
        render();
      });
    });
  }

  function wire() {
    document.querySelectorAll('[data-visit]').forEach(a => {
      a.addEventListener('click', () => Store.recordVisit(a.dataset.visit));
    });
    document.querySelectorAll('[data-toggle]').forEach(hdr => {
      hdr.addEventListener('click', () => {
        const id = hdr.dataset.toggle;
        const body = document.querySelector(`[data-body="${id}"]`);
        S.open = !S.open;
        hdr.classList.toggle('open', S.open);
        body.classList.toggle('open', S.open);
      });
    });
    document.querySelectorAll('[data-fav]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const on = Store.toggleFav(btn.dataset.fav);
        toast(on ? 'Saved ♥' : 'Removed from saved', on ? 'crimson' : null);
        render();
      });
    });
    document.querySelectorAll('[data-siteid]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const q = S.q || btn.dataset.term || '';
        if (!q) { toast('Type a search term first'); return; }
        Router.go('/search?q=' + encodeURIComponent(q) + '&site=' + encodeURIComponent(btn.dataset.siteid));
      });
    });
  }

  function randomOpen() {
    const pool = filteredEntries();
    if (!pool.length) return;
    const item = pool[Math.floor(Math.random() * pool.length)];
    Store.recordVisit(item.id);
    window.open(item.url, '_blank', 'noopener');
    toast('Opening ' + item.name);
  }

  function render_(container, params) {
    S.q = params.get('q') || '';
    S.activeTags = new Set();
    S.showFavs = false;
    S.open = true;

    container.innerHTML = `
      <div class="eyebrow" style="margin-bottom:8px">The Directory</div>
      <h1 style="font-size:1.6rem;margin-bottom:14px">Taboo — one search box, free sites only</h1>
      <div class="panel" style="padding:16px 18px">
        <div class="small">Filter by tag:</div>
        <div class="chip-row mt" id="tagChips"></div>
      </div>
      <div id="content"></div>`;

    NB.configureHeader({
      search: {
        placeholder: 'Filter the directory…',
        initial: S.q,
        onInput: v => { S.q = v; render(); },
      },
      actions: [
        { id: 'searchAllBtn', icon: '⌕', title: 'Search all sites (S)', onClick: () => Router.go('/search' + (S.q ? '?q=' + encodeURIComponent(S.q) : '')) },
        { id: 'favBtn', icon: '♥', title: 'Saved (F)', onClick: () => { S.showFavs = !S.showFavs; document.getElementById('favBtn').classList.toggle('on', S.showFavs); render(); } },
        { id: 'randBtn', icon: '⚡', title: 'Random (R)', onClick: randomOpen },
      ],
    });

    renderTagChips();
    render();

    function onKeydown(e) {
      const inInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
      if (inInput) return;
      if (e.key.toLowerCase() === 'f') document.getElementById('favBtn').click();
      if (e.key.toLowerCase() === 'r') randomOpen();
      if (e.key.toLowerCase() === 's') Router.go('/search' + (S.q ? '?q=' + encodeURIComponent(S.q) : ''));
    }
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }

  Router.register('/directory', { id: 'directory', title: 'Directory — Noir Index', render: render_ });
})();
