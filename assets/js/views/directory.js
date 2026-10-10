/* Directory — every free site, one flat grid, instant local filtering */
(function(){
  const S={q:''};
  const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\p{M}]/gu,'');
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function withVisits(list){const v=Store.getVisits();return list.map(x=>({...x,_visits:v[x.id]||0}))}
  function matches(e,q){if(!q)return true;const hay=norm([e.name,e.note,e.category,...(e.tags||[])].join(' '));return hay.includes(norm(q))}
  function filtered(){return S.q?SITES.filter(e=>matches(e,S.q)):SITES}
  function meta(e){const tags=(e.tags||[]).slice(0,3).map(t=>`<span class="site-meta-chip">${esc(t)}</span>`).join('');return `<div class="site-card-meta">${tags}${e._visits?`<span class="site-meta-chip site-meta-hot">🔥 ${e._visits}</span>`:''}</div>`}
  function card(e){return `<a class="card richer-card" href="${e.url}" target="_blank" rel="noopener noreferrer" data-visit="${e.id}"><div class="c-title-row">${NB.siteIcon(e.name,e.url)}<div class="c-name">${esc(e.name)}</div></div>${e.note?`<div class="c-note">${esc(e.note)}</div>`:''}${meta(e)}</a>`}
  function render(){
    const el=document.getElementById('content'),data=withVisits(filtered()).sort((a,b)=>b._visits-a._visits||a.name.localeCompare(b.name));
    if(!data.length){el.innerHTML='<div class="empty"><div class="empty-icon">⌕</div><div class="empty-txt">No matches. Try another term.</div></div>';return}
    el.innerHTML=`<div class="res-hdr">${data.length} site${data.length===1?'':'s'}${S.q?` matching <span>"${esc(S.q)}"</span>`:''}</div><div class="card-grid">${data.map(card).join('')}</div>`;
    wire();
  }
  function wire(){document.querySelectorAll('[data-visit]').forEach(a=>a.onclick=()=>Store.recordVisit(a.dataset.visit))}
  function randomOpen(){const p=filtered();if(!p.length)return;const x=p[Math.floor(Math.random()*p.length)];Store.recordVisit(x.id);window.open(x.url,'_blank','noopener,noreferrer');toast('Opening '+x.name)}
  function render_(container,params){
    S.q=params.get('q')||'';
    container.innerHTML=`<div id="content"></div>`;
    NB.configureHeader({search:{placeholder:'Filter — name, tags, category…',initial:S.q,onInput:v=>{S.q=v;render()}},actions:[{id:'randBtn',icon:'⚡',title:'Random (R)',onClick:randomOpen}]});
    render();
    function key(e){if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;if(e.key.toLowerCase()==='r')randomOpen()}
    document.addEventListener('keydown',key);
    return()=>document.removeEventListener('keydown',key);
  }
  Router.register('/directory',{id:'directory',title:'Directory — Noir Index',render:render_});
})();
