/* Noir Index — saved/bookmarked sites. Pure localStorage, nothing leaves the browser. */
(function(){
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function card(e){const v=Store.getVisits()[e.id]||0;return `<a class="card richer-card faved" href="${e.url}" target="_blank" rel="noopener" data-visit="${e.id}"><button class="c-fav on" data-fav="${e.id}" title="Unsave">♥</button><div class="c-title-row">${NB.siteIcon(e.name,e.url)}<div class="c-name">${esc(e.name)}</div></div>${e.note?`<div class="c-note">${esc(e.note)}</div>`:''}<div class="site-card-meta">${(e.tags||[]).slice(0,4).map(t=>`<span class="site-meta-chip">${esc(t)}</span>`).join('')}${v?`<span class="site-meta-chip site-meta-hot">🔥 ${v}</span>`:''}</div></a>`}
 function render(container){
  NB.configureHeader(null);
  const draw=()=>{
   const favs=Store.getFavs();
   const list=SITES.filter(s=>favs.has(s.id));
   container.innerHTML=`<div class="eyebrow" style="margin-bottom:8px">Bookmarks</div><h1 style="font-size:1.6rem;margin-bottom:14px">Your saved sites</h1>${
     list.length
       ? `<div class="res-hdr">${list.length} saved site${list.length===1?'':'s'}</div><div class="card-grid">${list.map(card).join('')}</div>`
       : `<div class="empty"><div class="empty-icon">♥</div><div class="empty-txt">Nothing saved yet — tap the ♥ on any site in the Directory or Search to bookmark it here.</div></div>`
   }`;
   document.querySelectorAll('[data-visit]').forEach(a=>a.onclick=()=>Store.recordVisit(a.dataset.visit));
   document.querySelectorAll('[data-fav]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();Store.toggleFav(b.dataset.fav);toast('Removed from saved');draw()}));
  };
  draw();
 }
 Router.register('/bookmarks',{id:'bookmarks',title:'Bookmarks — Noir Index',render});
})();
