/* Noir Index — unified local search. One query:
   1) ranks the whole directory's local metadata (name/tags/category/note)
   2) checks your own saved video bookmarks (title/note/tags/host)
   3) offers one-tap buttons that open that same query on every site whose
      search-URL pattern is known — each in a new tab, on the real site,
      sorted by how often you actually visit it.
   Nothing is ever embedded or fetched from anywhere else — every result
   or button here opens the real destination directly. */
(function(){
 function esc(s){return Discovery.escape(s)}
 function norm(s){return String(s||'').toLowerCase().normalize('NFKD').replace(/[\p{M}]/gu,'')}

 function siteCard(s){return `<a class="card richer-card" href="${s.url}" target="_blank" rel="noopener noreferrer" data-discovery-open="${s.id}"><div class="c-title-row">${NB.siteIcon(s.name,s.url)}<div class="c-name">${esc(s.name)}</div></div>${s.note?`<div class="c-note">${esc(s.note)}</div>`:''}<div class="site-card-meta">${(s.tags||[]).slice(0,4).map(t=>`<span class="site-meta-chip">${esc(t)}</span>`).join('')}</div></a>`}

 function bookmarkMatches(b,q){const hay=norm([b.title,b.note,NB.hostOf(b.url),...(b.tags||[])].join(' '));return hay.includes(norm(q))}
 function bookmarkCard(b){const label=b.title||NB.hostOf(b.url);return `<a class="card richer-card faved" href="${esc(b.url)}" target="_blank" rel="noopener noreferrer"><button class="c-fav on" data-remove-bm="${esc(b.id)}" title="Remove">✕</button><div class="c-title-row">${NB.siteIcon(label,b.url)}<div class="c-name">${esc(label)}</div></div>${b.note?`<div class="c-note">${esc(b.note)}</div>`:''}<div class="site-card-meta">${(b.tags||[]).slice(0,3).map(t=>`<span class="site-meta-chip">${esc(t)}</span>`).join('')}<span class="site-meta-chip">${esc(NB.hostOf(b.url))}</span></div></a>`}

 // sources, sorted by your own visit count — the sites you actually use
 // float to the top instead of a fixed curated order
 function searchable(){const v=Store.getVisits();return SITES.filter(s=>s.su).sort((a,b)=>(v[b.id]||0)-(v[a.id]||0)||a.name.localeCompare(b.name))}
 function searchBtn(s,q){const url=s.su+encodeURIComponent(q||s.sq||'');return `<a class="chip" href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-fanout="${esc(s.id)}">${NB.siteIcon(s.name,s.url)}${esc(s.name)} ↗</a>`}
 function fanoutPanel(sites,q){
  if(!sites.length)return '';
  const VISIBLE=10,head=sites.slice(0,VISIBLE),rest=sites.slice(VISIBLE);
  return `<div class="panel" style="padding:12px 14px;margin-bottom:14px">
    <div class="small">Open this search on every site — sorted by how often you use them, each opens the real results page in a new tab</div>
    <div class="chip-row mt">${head.map(s=>searchBtn(s,q)).join('')}${rest.length?`<span id="fanoutMore" style="display:none">${rest.map(s=>searchBtn(s,q)).join('')}</span><button class="chip crimson" id="fanoutToggle">+${rest.length} more ↓</button>`:''}</div>
  </div>`;
 }

 function render(container,params){
  const q=(params.get('q')||'').trim();
  Discovery.recordQuery(q);
  const results=q?Discovery.search(q):[];
  const bookmarkResults=q?Store.getVideoBookmarks().filter(b=>bookmarkMatches(b,q)):[];
  const fanoutSites=searchable();

  NB.configureHeader(null);
  container.innerHTML=`<div class="eyebrow" style="margin-bottom:8px">Search</div><h1 style="font-size:1.6rem;margin-bottom:14px">${q?`Results for &ldquo;${esc(q)}&rdquo;`:'One search, every site'}</h1><div class="hero-search" style="max-width:700px;margin-bottom:10px"><span class="srch-icon">⌕</span><input id="srchInput" type="search" value="${esc(q)}" placeholder="Search sites, tags, your bookmarks…" autocomplete="off"><button class="btn btn-gold hero-search-go" id="srchGo">Search</button></div>${
    !q
      ? `<div class="panel" style="padding:14px 16px"><div class="small">Recent searches</div><div id="recentQ" class="chip-row mt"></div></div><div class="empty"><div class="empty-icon">⌕</div><div class="empty-txt">Type a term to rank every site instantly — tap a result to open it.</div></div>`
      : `${fanoutPanel(fanoutSites,q)}${
          bookmarkResults.length
            ? `<div class="res-hdr">${bookmarkResults.length} of your saved video${bookmarkResults.length===1?'':'s'}</div><div class="card-grid" style="margin-bottom:22px">${bookmarkResults.map(bookmarkCard).join('')}</div>`
            : ''
        }<div class="res-hdr">${results.length} site${results.length===1?'':'s'} ranked by relevance${results[0]?` · top result: <strong>${esc(results[0].name)}</strong>`:''}</div>${
          results.length
            ? `<div class="card-grid" id="discoveryCards">${results.map(siteCard).join('')}</div>`
            : (bookmarkResults.length ? '' : `<div class="empty"><div class="empty-icon">⌕</div><div class="empty-txt">No matches. Try another term.</div></div>`)
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
  document.querySelectorAll('[data-remove-bm]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();Store.removeVideoBookmark(b.dataset.removeBm);toast('Removed');render(container,params)}));
  document.querySelectorAll('[data-fanout]').forEach(a=>a.addEventListener('click',()=>Store.recordVisit(a.dataset.fanout)));
  const fanoutToggle=document.getElementById('fanoutToggle');
  if(fanoutToggle){
   fanoutToggle.dataset.collapsedLabel=fanoutToggle.textContent;
   fanoutToggle.onclick=()=>{
    const more=document.getElementById('fanoutMore'),open=more.style.display!=='none';
    more.style.display=open?'none':'contents';
    fanoutToggle.textContent=open?fanoutToggle.dataset.collapsedLabel:'Show fewer ↑';
   };
  }
 }
 Router.register('/search',{id:'search',title:'Search — Noir Index',render});
})();
