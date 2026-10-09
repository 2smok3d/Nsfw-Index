/* Noir Index — unified local search. One query, ranked results from the
   whole directory's local metadata (name/tags/category/note), each card
   opening straight out to the real site. Nothing is embedded or fetched
   from anywhere else — this is the single hub every search runs through. */
(function(){
 function esc(s){return Discovery.escape(s)}
 function card(s){const fav=Store.getFavs().has(s.id);return `<a class="card richer-card${fav?' faved':''}" href="${s.url}" target="_blank" rel="noopener" data-discovery-open="${s.id}"><button class="c-fav${fav?' on':''}" data-fav="${s.id}" title="${fav?'Unsave':'Save'}">♥</button><div class="c-title-row">${NB.siteIcon(s.name,s.url)}<div class="c-name">${esc(s.name)}</div></div>${s.note?`<div class="c-note">${esc(s.note)}</div>`:''}<div class="site-card-meta">${(s.tags||[]).slice(0,4).map(t=>`<span class="site-meta-chip">${esc(t)}</span>`).join('')}</div></a>`}
 function render(container,params){
  const q=(params.get('q')||'').trim();
  Discovery.recordQuery(q);
  const results=q?Discovery.search(q):[],facets=q?Discovery.facets(q):[];

  NB.configureHeader(null);
  container.innerHTML=`<div class="eyebrow" style="margin-bottom:8px">Search</div><h1 style="font-size:1.6rem;margin-bottom:14px">${q?`Results for &ldquo;${esc(q)}&rdquo;`:'Search the entire directory at once'}</h1><div class="hero-search" style="max-width:700px;margin-bottom:10px"><span class="srch-icon">⌕</span><input id="srchInput" type="search" value="${esc(q)}" placeholder="Search sites, tags, categories…" autocomplete="off"><button class="btn btn-gold hero-search-go" id="srchGo">Search</button></div>${
    !q
      ? `<div class="panel" style="padding:14px 16px"><div class="small">Recent searches</div><div id="recentQ" class="chip-row mt"></div></div><div class="empty"><div class="empty-icon">⌕</div><div class="empty-txt">Type a term to rank every site in the directory instantly — tap a result to open it.</div></div>`
      : `<div class="panel" style="padding:12px 14px;margin-bottom:14px"><div class="small">Smart facets</div><div id="facets" class="chip-row mt">${facets.map(f=>`<button class="chip crimson" data-facet="${esc(f[0])}">${esc(f[0])} <span>${f[1]}</span></button>`).join('')}</div></div><div class="res-hdr">${results.length} match${results.length===1?'':'es'} ranked by relevance${results[0]?` · top result: <strong>${esc(results[0].name)}</strong>`:''}</div>${
          results.length
            ? `<div class="card-grid" id="discoveryCards">${results.map(card).join('')}</div>`
            : `<div class="empty"><div class="empty-icon">⌕</div><div class="empty-txt">No matches. Try another term or a broader tag.</div></div>`
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
  document.querySelectorAll('[data-fav]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const on=Store.toggleFav(b.dataset.fav);toast(on?'Saved ♥':'Removed from saved',on?'crimson':null);render(container,params)}));
 }
 Router.register('/search',{id:'search',title:'Search — Noir Index',render});
})();
