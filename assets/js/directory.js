/* ============================================================
   directory.js — search, filter, tag, and render engine for
   directory.html. Reads SITES / CATEGORIES from sites.js.
   ============================================================ */
(function () {
  const CROSS_SEARCH_SITES = [
    { n: 'PornHub',   u: 'https://www.pornhub.com/video/search?search=' },
    { n: 'xVideos',   u: 'https://www.xvideos.com/?k=' },
    { n: 'xHamster',  u: 'https://xhamster.com/search/' },
    { n: 'SpankBang', u: 'https://spankbang.com/s/' },
    { n: 'XNXX',      u: 'https://www.xnxx.com/search/' },
    { n: 'EPorner',   u: 'https://www.eporner.com/search/' },
    { n: 'HQPorner',  u: 'https://hqporner.com/search/' },
    { n: 'ThisVid',   u: 'https://thisvid.com/search/videos/?q=' },
  ];

  const S = {
    q: '',
    openCats: new Set(CATEGORIES.map(c => c.id)), // all open by default
    activeTags: new Set(),
    showFavs: false,
  };

  const params = new URLSearchParams(location.search);
  if (params.get('q')) S.q = params.get('q');

  function popularTags(limit) {
    const freq = {};
    SITES.forEach(s => (s.tags || []).forEach(t => freq[t] = (freq[t] || 0) + 1));
    return Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, limit);
  }

  // ── most-visited: real usage overrides curated ordering ──
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
      ${entry.su ? `<button class="c-srch" data-search="${esc(entry.su)}" data-term="${esc(term)}" data-name="${esc(entry.name)}" title="Search this site">⌕</button>` : ''}
    </a>`;
  }

  function sectionBlock(cat, rawItems) {
    const isOpen = S.openCats.has(cat.id);
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
      <div class="sec-hdr${isOpen ? ' open' : ''}" data-toggle="${cat.id}">
        <div>
          <div class="sec-title">${cat.label}</div>
          <div class="small" style="margin-top:2px">${cat.blurb}</div>
        </div>
        <div class="sec-count">${items.length}</div>
        <span class="sec-chev">›</span>
      </div>
      <div class="sec-body${isOpen ? ' open' : ''}" data-body="${cat.id}">
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
        const open = S.openCats.has(id);
        open ? S.openCats.delete(id) : S.openCats.add(id);
        hdr.classList.toggle('open', !open);
        body.classList.toggle('open', !open);
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
    document.querySelectorAll('[data-search]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const q = S.q || btn.dataset.term || '';
        if (!q) { toast('Type a search term first'); return; }
        openSearchResults(q, [{ n: btn.dataset.name || 'Results', u: btn.dataset.search }], 0);
      });
    });
  }

  // ── in-app multi-site search results (iframe viewer, stays in the app) ──
  function openSearchResults(term, sites, startIndex) {
    const view = document.getElementById('sr-view');
    const tabs = document.getElementById('sr-tabs');
    const frame = document.getElementById('sr-frame');
    const extLink = document.getElementById('srExternal');
    const titleEl = document.getElementById('srTerm');

    function load(i) {
      const site = sites[i];
      const url = site.u + encodeURIComponent(term);
      frame.src = url;
      extLink.href = url;
      tabs.querySelectorAll('.sr-tab').forEach((t, idx) => t.classList.toggle('active', idx === i));
    }

    titleEl.textContent = `"${term}"`;
    tabs.innerHTML = sites.map((s, i) => `<button class="sr-tab" data-i="${i}">${s.n}</button>`).join('');
    tabs.querySelectorAll('.sr-tab').forEach(btn => btn.addEventListener('click', () => load(Number(btn.dataset.i))));
    load(startIndex || 0);
    view.classList.add('open');
  }

  function closeSearchResults() {
    document.getElementById('sr-view').classList.remove('open');
    document.getElementById('sr-frame').src = 'about:blank';
  }

  function randomOpen() {
    const pool = filteredEntries();
    if (!pool.length) return;
    const item = pool[Math.floor(Math.random() * pool.length)];
    window.open(item.url, '_blank', 'noopener');
    toast('Opening ' + item.name);
  }

  function openCrossSearch() {
    const modal = document.getElementById('cs-modal');
    const input = document.getElementById('csinput');
    input.value = S.q;
    document.getElementById('cs-grid').innerHTML = CROSS_SEARCH_SITES.map((s, i) =>
      `<button class="chip" data-i="${i}">${s.n}</button>`
    ).join('');
    document.querySelectorAll('#cs-grid [data-i]').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = input.value.trim();
        if (!q) { toast('Enter a search term first'); return; }
        modal.classList.remove('open');
        openSearchResults(q, CROSS_SEARCH_SITES, Number(btn.dataset.i));
      });
    });
    modal.classList.add('open');
    setTimeout(() => { input.select(); input.focus(); }, 80);
  }

  function init() {
    NB.initChrome('directory', {
      search: {
        placeholder: 'Search the directory…',
        initial: S.q,
        onInput: v => { S.q = v; render(); },
      },
      actions: [
        { id: 'csBtn', icon: '⌕', title: 'Search all sites (S)' },
        { id: 'favBtn', icon: '♥', title: 'Saved (F)' },
        { id: 'randBtn', icon: '⚡', title: 'Random (R)' },
      ],
    });

    renderTagChips();
    render();

    document.getElementById('favBtn').addEventListener('click', () => {
      S.showFavs = !S.showFavs;
      document.getElementById('favBtn').classList.toggle('on', S.showFavs);
      render();
    });
    document.getElementById('randBtn').addEventListener('click', randomOpen);
    document.getElementById('csBtn').addEventListener('click', openCrossSearch);
    document.getElementById('cs-modal').addEventListener('click', e => {
      if (e.target.id === 'cs-modal') e.target.classList.remove('open');
    });
    document.getElementById('csClose').addEventListener('click', () => document.getElementById('cs-modal').classList.remove('open'));
    document.getElementById('csinput').addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const q = e.target.value.trim();
      if (!q) { toast('Enter a search term first'); return; }
      document.getElementById('cs-modal').classList.remove('open');
      openSearchResults(q, CROSS_SEARCH_SITES, 0);
    });
    document.getElementById('srClose').addEventListener('click', closeSearchResults);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearchResults(); });

    document.addEventListener('keydown', e => {
      const inInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
      if (inInput) return;
      if (e.key.toLowerCase() === 'f') document.getElementById('favBtn').click();
      if (e.key.toLowerCase() === 'r') randomOpen();
      if (e.key.toLowerCase() === 's') openCrossSearch();
    });

    if (location.hash) {
      const id = location.hash.slice(1);
      if (CATEGORIES.some(c => c.id === id)) {
        S.openCats.add(id);
        render();
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
