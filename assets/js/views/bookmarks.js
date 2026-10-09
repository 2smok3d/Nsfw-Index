/* Noir Index — video bookmarks. The app never fetches or previews these
   links; you paste one in yourself and it's stored locally, nothing more. */
(function(){
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function hostOf(url){try{return new URL(url).hostname.replace(/^www\./,'')}catch(e){return url}}
 function isHttpUrl(s){try{const u=new URL(s);return u.protocol==='http:'||u.protocol==='https:'}catch(e){return false}}

 function card(b){
  const label=b.title||hostOf(b.url);
  return `<a class="card richer-card faved" href="${esc(b.url)}" target="_blank" rel="noopener">
    <button class="c-fav on" data-remove="${esc(b.id)}" title="Remove">✕</button>
    <div class="c-title-row">${NB.siteIcon(label,b.url)}<div class="c-name">${esc(label)}</div></div>
    ${b.note?`<div class="c-note">${esc(b.note)}</div>`:''}
    <div class="site-card-meta"><span class="site-meta-chip">${esc(hostOf(b.url))}</span></div>
  </a>`;
 }

 function render(container){
  NB.configureHeader(null);
  const draw=()=>{
   const list=Store.getVideoBookmarks();
   container.innerHTML=`<div class="eyebrow" style="margin-bottom:8px">Bookmarks</div><h1 style="font-size:1.6rem;margin-bottom:6px">Your saved videos</h1><p class="small" style="max-width:640px;margin-bottom:18px">Paste the link to a specific video you want to find again. Nothing is fetched or previewed — just the link, a title, and an optional note, saved in this browser only.</p>
   <div class="panel" style="padding:16px 18px;margin-bottom:20px">
     <div class="row">
       <div class="field"><label>Video URL</label><input id="bmUrl" type="url" placeholder="https://…" autocomplete="off"></div>
       <div class="field"><label>Title (optional)</label><input id="bmTitle" type="text" placeholder="What is it?" autocomplete="off"></div>
     </div>
     <div class="field" style="margin-top:10px"><label>Note (optional)</label><input id="bmNote" type="text" placeholder="Anything to remember about it" autocomplete="off"></div>
     <button class="btn btn-gold" id="bmAdd" style="width:auto;padding:10px 18px;margin-top:12px">+ Add Bookmark</button>
   </div>
   ${
     list.length
       ? `<div class="res-hdr">${list.length} saved video${list.length===1?'':'s'}</div><div class="card-grid">${list.map(card).join('')}</div>`
       : `<div class="empty"><div class="empty-icon">♥</div><div class="empty-txt">Nothing saved yet — paste a video's link above to bookmark it here.</div></div>`
   }`;

   const urlEl=document.getElementById('bmUrl'),titleEl=document.getElementById('bmTitle'),noteEl=document.getElementById('bmNote');
   const add=()=>{
    const url=urlEl.value.trim();
    if(!isHttpUrl(url)){toast('Paste a valid http(s) video link first');return}
    Store.addVideoBookmark({url,title:titleEl.value,note:noteEl.value});
    toast('Bookmarked ♥','crimson');
    draw();
   };
   document.getElementById('bmAdd').onclick=add;
   [urlEl,titleEl,noteEl].forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter')add()}));

   document.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    Store.removeVideoBookmark(b.dataset.remove);
    toast('Removed');
    draw();
   }));
  };
  draw();
 }
 Router.register('/bookmarks',{id:'bookmarks',title:'Bookmarks — Noir Index',render});
})();
