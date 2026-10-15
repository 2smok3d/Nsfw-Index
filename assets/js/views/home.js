/* Noir Index — home IS the search: one query ranks the whole directory
   locally, checks your own bookmarked videos, and offers one-tap buttons
   that open the same query on every site's own real search. Nothing is
   ever embedded or fetched from anywhere else. */
(function(){
 function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 function norm(s){return String(s||'').toLowerCase().normalize('NFKD').replace(/[\p{M}]/gu,'')}

 function memCard(s,label){return `<a class="memory-card" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" data-reco="${esc(s.id)}">${NB.siteIcon(s.name,s.url)}<span class="memory-copy"><strong>${esc(s.name)}</strong><small>${esc(label)}</small></span><span class="memory-arrow">↗</span></a>`}
 function memBookmarkCard(b){const label=b.title||NB.hostOf(b.url);return `<a class="memory-card" href="${esc(b.url)}" target="_blank" rel="noopener noreferrer">${NB.siteIcon(label,b.url)}<span class="memory-copy"><strong>${esc(label)}</strong><small>Bookmarked</small></span><span class="memory-arrow">↗</span></a>`}
 function discovery(){const recent=Discovery.recent().slice(0,4),vis=Store.getVisits();const mostVisited=SITES.filter(s=>vis[s.id]>0).sort((a,b)=>vis[b.id]-vis[a.id])[0];let seed=recent[0]||mostVisited,rec=seed?Discovery.recommend(seed.id,6):[];if(!rec.length)return '';return `<section class="memory-panel discovery-panel"><div class="memory-head"><div><div class="eyebrow">Local intelligence</div><h2>Because you liked ${esc(seed.name)}</h2></div><div class="memory-stat"><strong>Local</strong><span>no tracking</span></div></div><div class="memory-grid">${rec.map(s=>memCard(s,'Recommended for you')).join('')}</div>${recent.length?`<div class="memory-label" style="margin-top:16px">Recently opened</div><div class="memory-grid">${recent.map(s=>memCard(s,'Recent')).join('')}</div>`:''}</section>`}
 function memory(){const ranked=HomeMemory.ranked(4),bookmarks=HomeMemory.bookmarks(4),total=HomeMemory.totalVisits();if(!ranked.length&&!bookmarks.length)return '';const q=ranked.map(x=>memCard(x.site,`${x.count} visit${x.count===1?'':'s'}`)).join('');return `<section class="memory-panel"><div class="memory-head"><div><div class="eyebrow">Your local index</div><h2>Pick up where you left off</h2></div><div class="memory-stat"><strong>${total}</strong><span>local visits</span></div></div><div class="memory-columns">${ranked.length?`<div><div class="memory-label">Most visited</div><div class="memory-grid">${q}</div></div>`:''}${bookmarks.length?`<div><div class="memory-label">Bookmarked videos</div><div class="memory-grid">${bookmarks.map(memBookmarkCard).join('')}</div></div>`:''}</div></section>`}

 function siteCard(s){return `<a class="card richer-card" href="${s.url}" target="_blank" rel="noopener noreferrer" data-discovery-open="${s.id}"><div class="c-title-row">${NB.siteIcon(s.name,s.url)}<div class="c-name">${esc(s.name)}</div></div>${s.note?`<div class="c-note">${esc(s.note)}</div>`:''}<div class="site-card-meta">${(s.tags||[]).slice(0,4).map(t=>`<span class="site-meta-chip">${esc(t)}</span>`).join('')}</div></a>`}
 function bookmarkMatches(b,q){const hay=norm([b.title,b.note,NB.hostOf(b.url),...(b.tags||[])].join(' '));return hay.includes(norm(q))}
 function bookmarkCard(b){const label=b.title||NB.hostOf(b.url);return `<a class="card richer-card faved" href="${esc(b.url)}" target="_blank" rel="noopener noreferrer"><button class="c-fav on" data-remove-bm="${esc(b.id)}" title="Remove" aria-label="Remove ${esc(label)} from saved">✕</button><div class="c-title-row">${NB.siteIcon(label,b.url)}<div class="c-name">${esc(label)}</div></div>${b.note?`<div class="c-note">${esc(b.note)}</div>`:''}<div class="site-card-meta">${(b.tags||[]).slice(0,3).map(t=>`<span class="site-meta-chip">${esc(t)}</span>`).join('')}<span class="site-meta-chip">${esc(NB.hostOf(b.url))}</span></div></a>`}
 function searchable(){const v=Store.getVisits();return SITES.filter(s=>s.su).sort((a,b)=>(v[b.id]||0)-(v[a.id]||0)||a.name.localeCompare(b.name))}
 function searchBtn(s,q){const url=s.su+encodeURIComponent(q||s.sq||'');return `<a class="chip" href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-fanout="${esc(s.id)}">${NB.siteIcon(s.name,s.url)}${esc(s.name)} ↗</a>`}
 function fanoutPanel(sites,q){
  if(!sites.length)return '';
  const VISIBLE=10,head=sites.slice(0,VISIBLE),rest=sites.slice(VISIBLE);
  return `<div class="panel" style="padding:12px 14px;margin-bottom:14px">
    <div class="small">Open this search on every site — sorted by how often you use them, each opens the real results page in a new tab</div>
    <div class="chip-row mt">${head.map(s=>searchBtn(s,q)).join('')}${rest.length?`<span id="fanoutMore" style="display:none">${rest.map(s=>searchBtn(s,q)).join('')}</span><button class="chip crimson" id="fanoutToggle" aria-expanded="false" aria-controls="fanoutMore">+${rest.length} more ↓</button>`:''}</div>
  </div>`;
 }

 function render(container,params){
  const q=((params&&params.get('q'))||'').trim();
  Discovery.recordQuery(q);
  const results=q?Discovery.search(q):[];
  const bookmarkResults=q?Store.getVideoBookmarks().filter(b=>bookmarkMatches(b,q)):[];
  const fanoutSites=searchable();

  NB.configureHeader(null);
  container.innerHTML=`<div class="noir-header"><div class="noir-brand"><span class="noir-brand-mark">⌕</span><span class="noir-brand-word">Noir Index</span></div><div class="eyebrow">Private Collection · 18+</div></div><div class="hero-search" style="max-width:700px;margin-bottom:16px"><span class="srch-icon">⌕</span><input id="srchInput" type="search" value="${esc(q)}" placeholder="Search sites, tags, your bookmarks…" aria-label="Search sites, tags, and your bookmarks" autocomplete="off"><button class="btn btn-gold hero-search-go" id="srchGo">Search</button></div>${
    !q
      ? `<div class="panel" style="padding:14px 16px;margin-bottom:18px"><div class="small">Recent searches</div><div id="recentQ" class="chip-row mt"></div></div>${memory()}${discovery()}`
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

  const input=document.getElementById('srchInput'),go=()=>{const term=input.value.trim();Router.go('/'+(term?'?q='+encodeURIComponent(term):''))};
  document.getElementById('srchGo').onclick=go;
  input.onkeydown=e=>{if(e.key==='Enter')go()};

  if(!q){
   const rq=document.getElementById('recentQ');
   Discovery.recentQueries().forEach(x=>{const b=document.createElement('button');b.className='chip crimson';b.textContent=x;b.onclick=()=>Router.go('/?q='+encodeURIComponent(x));rq.appendChild(b)});
   document.querySelectorAll('[data-reco]').forEach(a=>a.onclick=()=>Discovery.recordOpen(a.dataset.reco));
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
    fanoutToggle.setAttribute('aria-expanded',open?'false':'true');
   };
  }
 }
 Router.register('/',{id:'home',title:'Noir Index',render});
})();
