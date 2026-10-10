/* Noir Index — video bookmarks. The app never fetches or previews these
   links; you paste one in yourself and it's stored locally, nothing more. */
(function(){
 const S={q:'',activeTags:new Set()};
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'');
 function isHttpUrl(s){try{const u=new URL(s);return u.protocol==='http:'||u.protocol==='https:'}catch(e){return false}}
 function popularTags(list,n){const f={};list.forEach(b=>(b.tags||[]).forEach(t=>f[t]=(f[t]||0)+1));return Object.keys(f).sort((a,b)=>f[b]-f[a]).slice(0,n)}
 function matches(b,q){if(!q)return true;const hay=norm([b.title,b.note,NB.hostOf(b.url),...(b.tags||[])].join(' '));return hay.includes(norm(q))}
 function filtered(all){let list=all;if(S.activeTags.size)list=list.filter(b=>(b.tags||[]).some(t=>S.activeTags.has(t)));return S.q?list.filter(b=>matches(b,S.q)):list}

 function card(b){
  const label=b.title||NB.hostOf(b.url);
  return `<a class="card richer-card faved" href="${esc(b.url)}" target="_blank" rel="noopener">
    <button class="c-fav on" data-remove="${esc(b.id)}" title="Remove">✕</button>
    <div class="c-title-row">${NB.siteIcon(label,b.url)}<div class="c-name">${esc(label)}</div></div>
    ${b.note?`<div class="c-note">${esc(b.note)}</div>`:''}
    <div class="site-card-meta">${(b.tags||[]).slice(0,3).map(t=>`<span class="site-meta-chip">${esc(t)}</span>`).join('')}<span class="site-meta-chip">${esc(NB.hostOf(b.url))}</span></div>
  </a>`;
 }

 function renderList(){
  const el=document.getElementById('bmList');
  if(!el)return;
  const all=Store.getVideoBookmarks(),list=filtered(all);
  const tagsEl=document.getElementById('bmTags');
  if(tagsEl)tagsEl.innerHTML=popularTags(all,16).map(t=>`<button class="chip crimson${S.activeTags.has(t)?' on':''}" data-tag="${esc(t)}">${esc(t)}</button>`).join('');
  if(!all.length){
   el.innerHTML=`<div class="empty"><div class="empty-icon">♥</div><div class="empty-txt">Nothing saved yet — paste a video's link above to bookmark it here.</div></div>`;
  }else if(!list.length){
   el.innerHTML=`<div class="empty"><div class="empty-icon">⌕</div><div class="empty-txt">No matches. Try another term or clear a filter.</div></div>`;
  }else{
   el.innerHTML=`<div class="res-hdr">${list.length} of ${all.length} saved video${all.length===1?'':'s'}</div><div class="card-grid">${list.map(card).join('')}</div>`;
  }
  wire();
 }

 function wire(){
  document.querySelectorAll('[data-tag]').forEach(b=>b.onclick=()=>{const t=b.dataset.tag;S.activeTags.has(t)?S.activeTags.delete(t):S.activeTags.add(t);renderList()});
  document.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',e=>{
   e.preventDefault();e.stopPropagation();
   Store.removeVideoBookmark(b.dataset.remove);
   toast('Removed');
   renderList();
  }));
 }

 function render(container){
  S.q='';S.activeTags=new Set();
  NB.configureHeader({search:{placeholder:'Filter your saved videos…',initial:'',onInput:v=>{S.q=v;renderList()}}});
  container.innerHTML=`<div class="eyebrow" style="margin-bottom:8px">Bookmarks</div><h1 style="font-size:1.6rem;margin-bottom:6px">Your saved videos</h1><p class="small" style="max-width:640px;margin-bottom:18px">Paste the link to a specific video you want to find again. Nothing is fetched or previewed — just the link, a title, and an optional note, saved in this browser only. These also surface automatically in Search when they match your query.</p>
   <div class="panel" style="padding:16px 18px;margin-bottom:20px">
     <div class="row">
       <div class="field"><label>Video URL</label><input id="bmUrl" type="url" placeholder="https://…" autocomplete="off"></div>
       <div class="field"><label>Title (optional)</label><input id="bmTitle" type="text" placeholder="What is it?" autocomplete="off"></div>
     </div>
     <div class="row">
       <div class="field" style="flex:1"><label>Note (optional)</label><input id="bmNote" type="text" placeholder="Anything to remember about it" autocomplete="off"></div>
       <div class="field" style="flex:1"><label>Tags (optional, comma separated)</label><input id="bmTagsInput" type="text" placeholder="femdom, findom…" autocomplete="off"></div>
     </div>
     <button class="btn btn-gold" id="bmAdd" style="width:auto;padding:10px 18px;margin-top:4px">+ Add Bookmark</button>
   </div>
   <div class="panel" id="bmTagsPanel" style="padding:14px 16px;margin-bottom:14px"><div class="small">Filter by tag</div><div id="bmTags" class="chip-row mt"></div></div>
   <div id="bmList"></div>`;

  const urlEl=document.getElementById('bmUrl'),titleEl=document.getElementById('bmTitle'),noteEl=document.getElementById('bmNote'),tagsInputEl=document.getElementById('bmTagsInput');
  const add=()=>{
   const url=urlEl.value.trim();
   if(!isHttpUrl(url)){toast('Paste a valid http(s) video link first');return}
   Store.addVideoBookmark({url,title:titleEl.value,note:noteEl.value,tags:tagsInputEl.value.split(',')});
   toast('Bookmarked ♥','crimson');
   urlEl.value='';titleEl.value='';noteEl.value='';tagsInputEl.value='';
   renderList();
  };
  document.getElementById('bmAdd').onclick=add;
  [urlEl,titleEl,noteEl,tagsInputEl].forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter')add()}));

  renderList();
 }
 Router.register('/bookmarks',{id:'bookmarks',title:'Bookmarks — Noir Index',render});
})();
