/* Directory — every free site, one flat grid, browse only.
   The one search bar lives on Home — this page is just the full list. */
(function(){
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function withVisits(list){const v=Store.getVisits();return list.map(x=>({...x,_visits:v[x.id]||0}))}
  function meta(e){const tags=(e.tags||[]).slice(0,3).map(t=>`<span class="site-meta-chip">${esc(t)}</span>`).join('');return `<div class="site-card-meta">${tags}${e._visits?`<span class="site-meta-chip site-meta-hot">🔥 ${e._visits}</span>`:''}</div>`}
  function card(e){return `<a class="card richer-card" href="${e.url}" target="_blank" rel="noopener noreferrer" data-visit="${e.id}"><div class="c-title-row">${NB.siteIcon(e.name,e.url)}<div class="c-name">${esc(e.name)}</div></div>${e.note?`<div class="c-note">${esc(e.note)}</div>`:''}${meta(e)}</a>`}
  function render(){
    const el=document.getElementById('content'),data=withVisits(SITES).sort((a,b)=>b._visits-a._visits||a.name.localeCompare(b.name));
    el.innerHTML=`<div class="res-hdr">${data.length} sites</div><div class="card-grid">${data.map(card).join('')}</div>`;
    document.querySelectorAll('[data-visit]').forEach(a=>a.onclick=()=>Store.recordVisit(a.dataset.visit));
  }
  function randomOpen(){const x=SITES[Math.floor(Math.random()*SITES.length)];Store.recordVisit(x.id);window.open(x.url,'_blank','noopener,noreferrer');toast('Opening '+x.name)}
  function render_(container){
    container.innerHTML=`<div id="content"></div>`;
    NB.configureHeader({actions:[{id:'randBtn',icon:'⚡',title:'Random (R)',onClick:randomOpen}]});
    render();
    function key(e){if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;if(e.key.toLowerCase()==='r')randomOpen()}
    document.addEventListener('keydown',key);
    return()=>document.removeEventListener('keydown',key);
  }
  Router.register('/directory',{id:'directory',title:'Directory — Noir Index',render:render_});
})();
