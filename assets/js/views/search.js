/* Noir Index — unified local search. One query, ranked results from the
   whole directory's local metadata (name/tags/category/note) AND your own
   saved video bookmarks, each card opening straight out to the real link.
   Nothing is embedded or fetched from anywhere else — this is the single
   hub every search runs through. */
(function(){
 function esc(s){return Discovery.escape(s)}
 function norm(s){return String(s||'').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'')}

 function siteCard(s){return `<a class="card richer-card" href="${s.url}" target="_blank" rel="noopener" data-discovery-open="${s.id}"><div class="c-title-row">${NB.siteIcon(s.name,s.url)}<div class="c-name">${esc(s.name)}</div></div>${s.note?`<div class="c-note">${esc(s.note)}</div>`:''}<div class="site-card-meta">${(s.tags||[]).slice(0,4).map(t=>`<span class="site-meta-chip">${esc(t)}</span>`).join('')}</div></a>`}

 function bookmarkMatches(b,q){const hay=norm([b.title,b.note,NB.hostOf(b.url),...(b.tags||[])].join(' '));return hay.includes(norm(q))}
 function bookmarkCard(b){const label=b.title||NB.hostOf(b.url);return `<a class="card richer-card faved" href="${esc(b.url)}" target="_blank" rel="noopener"><button class="c-fav on" data-remove-bm="${esc(b.id)}" title="Remove">✕</button><div class="c-title-row">${NB.siteIcon(label,b.url)}<div class="c-name">${esc(label)}</div></div>${b.note?`<div class="c-note">${esc(b.note)}</div>`:''}<div class="site-card-meta">${(b.tags||[]).slice(0,3).map(t=>`<span class="site-meta-chip">${esc(t)}</span>`).join('')}<span class="site-meta-chip">${esc(NB.hostOf(b.url))}</span></div></a>`}

 function render(container,params){
  const q=(params.get('q')||'').trim();
  Discovery.recordQuery(q);
  const results=q?Discovery.search(q):[],facets=q?Discovery.facets(q):[];
  const bookmarkResults=q?Store.getVideoBookmarks().filter(b=>bookmarkMatches(b,q)):[];

  NB.configureHeader(null);
  container.innerHTML=`<div class="eyebrow" style="margin-bottom:8px">Search</div><h1 style="font-size:1.6rem;margin-bottom:14px">${q?`Results for &ldquo;${esc(q)}&rdquo;`:'Search the entire directory at once'}</h1><div class="hero-search" style="max-width:700px;margin-bottom:10px"><span class="srch-icon">⌕</span><input id="srchInput" type="search" value="${esc(q)}" placeholder="Search sites, tags, categories, your bookmarks…" autocomplete="off"><button class="btn btn-gold hero-search-go" id="srchGo">Search</button></div>${
    !q
      ? `<div class="panel" style="padding:14px 16px"><div class="small">Recent searches</div><div id="recentQ" class="chip-row mt"></div></div><div class="empty"><div class="empty-icon">⌕</div><div class="empty-txt">Type a term to rank every site in the directory instantly — tap a result to open it.</div></div>`
      : `<div class="panel" style="padding:12px 14px;margin-bottom:14px"><div class="small">Smart facets</div><div id="facets" class="chip-row mt">${facets.map(f=>`<button class="chip crimson" data-facet="${esc(f[0])}">${esc(f[0])} <span>${f[1]}</span></button>`).join('')}</div></div>${
          bookmarkResults.length
            ? `<div class="res-hdr">${bookmarkResults.length} of your saved video${bookmarkResults.length===1?'':'s'}</div><div class="card-grid" style="margin-bottom:22px">${bookmarkResults.map(bookmarkCard).join('')}</div>`
            : ''
        }<div class="res-hdr">${results.length} site${results.length===1?'':'s'} ranked by relevance${results[0]?` · top result: <strong>${esc(results[0].name)}</strong>`:''}</div>${
          results.length
            ? `<div class="card-grid" id="discoveryCards">${results.map(siteCard).join('')}</div>`
            : (bookmarkResults.length ? '' : `<div class="empty"><div class="empty-icon">⌕</div><div class="empty-txt">No matches. Try another term or a broader tag.</div></div>`)
        }`
  }`;

  const input=document.getElementById('srchInput'),go=()=>{const term=input.value.trim();if(term)Router.go('/search?q='+encodeURIComponent(term))};
  document.getElementById('srchGo').onclick=go;
  input.onkeydown=e=>{if(e.key==='Enter')go()};

  if(!q){
   const rq=document.getElementById('recentQ');
   Discovery.recentQueries().forEach(x=>{const b=document.createElement('button');b.className='chip crimson';b.textContent=x;b.onclick=()=>Router.go('/search?q='+encodeURIComponent(x));rq.appendChild(b)});
   input.focus();
   return;
  }

  document.querySelectorAll('[data-discovery-open]').forEach(a=>a.addEventListener('click',()=>{Discovery.recordOpen(a.dataset.discoveryOpen);Store.recordVisit(a.dataset.discoveryOpen)}));
  document.querySelectorAll('[data-facet]').forEach(b=>b.onclick=()=>Router.go('/search?q='+encodeURIComponent(b.dataset.facet)));
  document.querySelectorAll('[data-remove-bm]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();Store.removeVideoBookmark(b.dataset.removeBm);toast('Removed');render(container,params)}));
 }
 Router.register('/search',{id:'search',title:'Search — Noir Index',render});
})();
