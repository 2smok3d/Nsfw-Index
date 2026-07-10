/* ============================================================
   library.js — Google Drive-backed personal video library.
   Read-only, API-key auth against the public Drive v3 REST API.
   Your Drive folder(s) must be shared "Anyone with the link —
   Viewer" for this to work (configured in settings.html).
   ============================================================ */
(function () {
  const FOLDER_MIME = 'application/vnd.google-apps.folder';
  const S = { root: null, stack: [], files: [], q: '', tag: '', loading: false, error: '' };

  function apiKey() { return Store.getSettings().driveApiKey; }
  function folders() { return Store.getSettings().driveFolders || []; }

  function fileUrl(id, params) {
    return `https://www.googleapis.com/drive/v3/files/${id}?key=${encodeURIComponent(apiKey())}&${params}`;
  }
  function downloadUrl(id) { return fileUrl(id, 'alt=media'); }
  function previewUrl(id) { return `https://drive.google.com/file/d/${id}/preview`; }
  function viewUrl(id) { return `https://drive.google.com/file/d/${id}/view`; }

  async function listChildren(folderId) {
    const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
    const fields = encodeURIComponent('files(id,name,mimeType,thumbnailLink,createdTime,videoMediaMetadata,size)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${encodeURIComponent(apiKey())}&fields=${fields}&pageSize=1000&orderBy=folder,name`;
    const res = await fetch(url);
    if (!res.ok) {
      let msg = `Drive API error (${res.status})`;
      try { const j = await res.json(); if (j.error && j.error.message) msg = j.error.message; } catch (e) {}
      throw new Error(msg);
    }
    const data = await res.json();
    return data.files || [];
  }

  function fmtSize(bytes) {
    if (!bytes) return '';
    const n = Number(bytes);
    if (n > 1e9) return (n / 1e9).toFixed(1) + ' GB';
    if (n > 1e6) return (n / 1e6).toFixed(0) + ' MB';
    return (n / 1e3).toFixed(0) + ' KB';
  }

  function renderRootChips() {
    const el = document.getElementById('rootChips');
    const roots = folders();
    if (!roots.length) { el.innerHTML = ''; return; }
    el.innerHTML = roots.map(f =>
      `<button class="chip${S.root && S.root.id === f.id ? ' on' : ''}" data-root="${f.id}" data-label="${f.label}">${f.label}</button>`
    ).join('');
    el.querySelectorAll('[data-root]').forEach(btn => {
      btn.addEventListener('click', () => openFolder({ id: btn.dataset.root, name: btn.dataset.label }, true));
    });
  }

  function renderBreadcrumb() {
    const el = document.getElementById('crumb');
    el.innerHTML = S.stack.map((f, i) =>
      `<a href="#" data-crumb="${i}">${f.name}</a>`
    ).join('<span class="small"> / </span>');
    el.querySelectorAll('[data-crumb]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const i = Number(a.dataset.crumb);
        S.stack = S.stack.slice(0, i + 1);
        loadCurrent();
      });
    });
  }

  async function openFolder(folder, isRoot) {
    if (isRoot) { S.root = folder; S.stack = [folder]; }
    else { S.stack.push(folder); }
    renderRootChips();
    await loadCurrent();
  }

  async function loadCurrent() {
    S.loading = true; S.error = ''; S.q = ''; S.tag = '';
    const sEl = document.getElementById('search'); if (sEl) sEl.value = '';
    renderBreadcrumb();
    render();
    try {
      const cur = S.stack[S.stack.length - 1];
      S.files = await listChildren(cur.id);
    } catch (err) {
      S.error = err.message || String(err);
      S.files = [];
    }
    S.loading = false;
    render();
  }

  function tagsFor(id) { return (Store.getTags()[id] || []); }

  function matchesFilter(f) {
    if (S.q && !f.name.toLowerCase().includes(S.q.toLowerCase())) return false;
    if (S.tag && !tagsFor(f.id).includes(S.tag)) return false;
    return true;
  }

  function allTagsInView() {
    const set = new Set();
    S.files.forEach(f => tagsFor(f.id).forEach(t => set.add(t)));
    return [...set].sort();
  }

  function fileCard(f) {
    const isFolder = f.mimeType === FOLDER_MIME;
    const favId = 'drive:' + f.id;
    const fav = Store.getFavs().has(favId);
    const tags = tagsFor(f.id);
    if (isFolder) {
      return `<div class="card" data-open="${f.id}" data-name="${f.name.replace(/"/g,'&quot;')}" style="cursor:pointer">
        <div class="c-tag">Folder</div>
        <div class="c-name">▣ ${f.name}</div>
      </div>`;
    }
    const thumb = f.thumbnailLink ? `<img src="${f.thumbnailLink}" alt="" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px;margin-bottom:8px;display:block;background:var(--s3)">` : `<div style="width:100%;aspect-ratio:16/9;border-radius:8px;margin-bottom:8px;background:var(--s3);display:flex;align-items:center;justify-content:center;color:var(--t3);font-size:1.4rem">▶</div>`;
    return `<div class="card${fav ? ' faved' : ''}" style="padding:10px 10px 12px;cursor:default">
      <div data-preview="${f.id}" style="cursor:pointer">${thumb}</div>
      <div class="c-name" style="padding-right:0">${f.name}</div>
      <div class="c-note">${fmtSize(f.size)}${f.videoMediaMetadata && f.videoMediaMetadata.durationMillis ? ' · ' + Math.round(f.videoMediaMetadata.durationMillis / 60000) + ' min' : ''}</div>
      ${tags.length ? `<div class="chip-row mt" style="gap:4px">${tags.map(t => `<span class="chip" style="padding:3px 9px;font-size:.68rem;cursor:default">${t}</span>`).join('')}</div>` : ''}
      <div class="row" style="margin:10px 0 0;gap:6px">
        <button class="btn btn-ghost" style="width:auto;padding:7px 12px;font-size:.75rem" data-preview="${f.id}">▶ Preview</button>
        <a class="btn btn-ghost" style="width:auto;padding:7px 12px;font-size:.75rem;text-decoration:none" href="${downloadUrl(f.id)}" target="_blank" rel="noopener">⬇ Download</a>
        <button class="btn btn-ghost" style="width:auto;padding:7px 10px;font-size:.75rem" data-fav="${favId}">${fav ? '♥' : '♡'}</button>
        <button class="btn btn-ghost" style="width:auto;padding:7px 10px;font-size:.75rem" data-tag-edit="${f.id}">🏷</button>
      </div>
    </div>`;
  }

  function render() {
    const el = document.getElementById('content');
    const hasFolders = folders().length > 0;
    document.getElementById('folderState').style.display = hasFolders ? 'none' : 'block';
    document.getElementById('rootPanel').style.display = hasFolders ? 'block' : 'none';
    if (!hasFolders) { el.innerHTML = ''; return; }

    if (!S.root) {
      el.innerHTML = `<div class="empty"><div class="empty-icon">▣</div><div class="empty-txt">Choose a library folder above to begin</div></div>`;
      return;
    }
    if (S.loading) { el.innerHTML = `<div class="empty"><div class="empty-icon">◌</div><div class="empty-txt">Loading from Drive…</div></div>`; return; }
    if (S.error) {
      el.innerHTML = `<div class="panel" style="border-color:var(--crimson-bright)">
        <h2>Couldn't load this folder</h2>
        <div class="sub">${S.error}</div>
        <div class="small">Make sure the folder is shared as <strong>"Anyone with the link — Viewer"</strong> and that your Drive API key is correct in <a href="settings.html">Settings</a>.</div>
      </div>`;
      return;
    }

    const visible = S.files.filter(matchesFilter);
    const tagChips = allTagsInView();
    const tagChipsHtml = tagChips.length ? `<div class="chip-row mt" id="libTagChips">${tagChips.map(t =>
      `<button class="chip${S.tag === t ? ' on' : ''}" data-libtag="${t}">${t}</button>`).join('')}</div>` : '';

    if (!visible.length) {
      el.innerHTML = tagChipsHtml + `<div class="empty"><div class="empty-icon">⌕</div><div class="empty-txt">Nothing here matches</div></div>`;
    } else {
      el.innerHTML = tagChipsHtml + `<div class="res-hdr mt">${visible.length} item${visible.length === 1 ? '' : 's'}</div><div class="card-grid">${visible.map(fileCard).join('')}</div>`;
    }
    wire();
  }

  function wire() {
    document.querySelectorAll('[data-open]').forEach(c => {
      c.addEventListener('click', () => openFolder({ id: c.dataset.open, name: c.dataset.name }, false));
    });
    document.querySelectorAll('[data-libtag]').forEach(btn => {
      btn.addEventListener('click', () => { S.tag = S.tag === btn.dataset.libtag ? '' : btn.dataset.libtag; render(); });
    });
    document.querySelectorAll('[data-fav]').forEach(btn => {
      btn.addEventListener('click', () => { const on = Store.toggleFav(btn.dataset.fav); toast(on ? 'Saved ♥' : 'Removed'); render(); });
    });
    document.querySelectorAll('[data-preview]').forEach(el => {
      el.addEventListener('click', () => openPreview(el.dataset.preview));
    });
    document.querySelectorAll('[data-tag-edit]').forEach(btn => {
      btn.addEventListener('click', () => openTagEditor(btn.dataset.tagEdit));
    });
  }

  function openPreview(id) {
    const modal = document.getElementById('preview-modal');
    document.getElementById('previewFrame').src = previewUrl(id);
    document.getElementById('previewOpen').href = viewUrl(id);
    document.getElementById('previewDownload').href = downloadUrl(id);
    modal.classList.add('open');
  }
  function closePreview() {
    document.getElementById('preview-modal').classList.remove('open');
    document.getElementById('previewFrame').src = '';
  }

  function openTagEditor(id) {
    const modal = document.getElementById('tag-modal');
    document.getElementById('tagInput').value = tagsFor(id).join(', ');
    document.getElementById('tagSave').onclick = () => {
      const tags = document.getElementById('tagInput').value.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      Store.setTagsFor(id, tags);
      modal.classList.remove('open');
      toast('Tags saved', 'gold');
      render();
    };
    modal.classList.add('open');
  }

  function init() {
    NB.initChrome('library', {
      search: {
        placeholder: 'Filter this folder…',
        onInput: v => { S.q = v; render(); },
      },
    });

    renderRootChips();
    render();

    document.getElementById('previewClose').addEventListener('click', closePreview);
    document.getElementById('preview-modal').addEventListener('click', e => { if (e.target.id === 'preview-modal') closePreview(); });
    document.getElementById('tagClose').addEventListener('click', () => document.getElementById('tag-modal').classList.remove('open'));
    document.getElementById('tag-modal').addEventListener('click', e => { if (e.target.id === 'tag-modal') e.target.classList.remove('open'); });

    if (!apiKey() || !folders().length) {
      // handled by render()'s folderState panel
    } else if (folders().length === 1) {
      openFolder({ id: folders()[0].id, name: folders()[0].label }, true);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
