/* Noir Index — video bookmarks. The app never fetches or previews these
   links; you paste one in yourself (or capture it with the bookmarklet
   below, which reads the page you're already on) and it's stored
   locally, nothing more. */
(function(){
 const S={activeTags:new Set()};
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function isHttpUrl(s){try{const u=new URL(s);return u.protocol==='http:'||u.protocol==='https:'}catch(e){return false}}
 function popularTags(list,n){const f={};list.forEach(b=>(b.tags||[]).forEach(t=>f[t]=(f[t]||0)+1));return Object.keys(f).sort((a,b)=>f[b]-f[a]).slice(0,n)}
 function filtered(all){return S.activeTags.size?all.filter(b=>(b.tags||[]).some(t=>S.activeTags.has(t))):all}

 // The bookmarklet: dragged to the browser's bookmarks bar, it runs
 // IN the page you're currently viewing — so reading that page's own
 // <title>/og: tags isn't a cross-origin fetch, it's the browser's
 // native same-page access, triggered by you. It only ever opens this
 // app's own Bookmarks page with those values as a prefilled draft;
 // nothing is sent anywhere and nothing auto-saves.
 function bookmarkletHref(){
  const target=location.origin+location.pathname+'#/bookmarks';
  const src=[
   '(function(){',
   'var d=document;',
   'function og(p){var m=d.querySelector(\'meta[property="og:\'+p+\'"]\');return m?m.content:""}',
   'var t=og("title")||d.title||"";',
   'var n=og("description")||"";',
   'var u=location.href;',
   'var b='+JSON.stringify(target)+';',
   'var q="?add=1&url="+encodeURIComponent(u)+"&title="+encodeURIComponent(t)+"&note="+encodeURIComponent(n);',
   'window.open(b+q,"_blank");',
   '})();',
  ].join('');
  return 'javascript:'+encodeURIComponent(src);
 }

 function card(b){
  const label=b.title||NB.hostOf(b.url);
  return `<a class="card richer-card faved" href="${esc(b.url)}" target="_blank" rel="noopener noreferrer">
    <button class="c-fav on" data-remove="${esc(b.id)}" title="Remove" aria-label="Remove ${esc(label)} from saved">✕</button>
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
   el.innerHTML=`<div class="empty"><div class="empty-icon">♥</div><div class="empty-txt">Nothing saved yet — paste a video's link below, or drag the bookmarklet above into your bookmarks bar.</div></div>`;
  }else if(!list.length){
   el.innerHTML=`<div class="empty"><div class="empty-icon">⌕</div><div class="empty-txt">No matches for that tag filter. Clear it to see everything.</div></div>`;
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

 function render(container,params){
  S.activeTags=new Set();
  NB.configureHeader(null);

  const prefill=params&&params.get('add')==='1'?{
   url:params.get('url')||'', title:params.get('title')||'', note:params.get('note')||'',
  }:null;

  container.innerHTML=`<div class="eyebrow" style="margin-bottom:8px">Bookmarks</div><h1 style="font-size:1.6rem;margin-bottom:6px">Your saved videos</h1><p class="small" style="max-width:640px;margin-bottom:18px">Nothing is fetched or previewed by this app — just the link, a title, and an optional note, saved in this browser only. These also surface automatically on Home when they match your search.</p>

   <div class="panel" style="padding:16px 18px;margin-bottom:16px">
     <div class="small" style="margin-bottom:10px">⇥ Bookmarklet — drag this to your bookmarks bar, then click it while viewing any video to pull in its real title automatically</div>
     <a class="btn btn-ghost" style="width:auto;padding:9px 16px;cursor:grab" href="${bookmarkletHref()}" onclick="return false" title="Drag me to your bookmarks bar">♥ Save to Noir Index</a>
   </div>

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
  if(prefill){
   urlEl.value=prefill.url;titleEl.value=prefill.title;noteEl.value=prefill.note;
   if(prefill.url)toast('Review the captured details, then Add Bookmark','gold');
   history.replaceState(null,'',location.pathname+location.search+'#/bookmarks');
  }
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
