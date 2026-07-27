/* ============================================================
   views/settings.js — central config: Drive keys/folders, Handy
   key, density, tag manager, backup/restore of everything above.
   ============================================================ */
(function () {
  function renderFolders() {
    const s = Store.getSettings();
    const el = document.getElementById('folderList');
    if (!el) return;
    if (!s.driveFolders.length) { el.innerHTML = `<div class="small">No folders added yet.</div>`; return; }
    el.innerHTML = s.driveFolders.map((f, i) => `
      <div class="row" style="align-items:center;margin-bottom:8px">
        <div style="flex:2"><strong>${f.label}</strong><div class="small">${f.id}</div></div>
        <button class="btn btn-crimson" style="width:auto;padding:8px 14px;flex:0" data-rm="${i}">Remove</button>
      </div>`).join('');
    el.querySelectorAll('[data-rm]').forEach(btn => btn.addEventListener('click', () => {
      const s2 = Store.getSettings();
      s2.driveFolders.splice(Number(btn.dataset.rm), 1);
      Store.setSettings({ driveFolders: s2.driveFolders });
      renderFolders();
      toast('Folder removed');
    }));
  }

  function renderTags() {
    const el = document.getElementById('tagManager');
    if (!el) return;
    const all = Store.getTags();
    const freq = {};
    Object.values(all).forEach(arr => arr.forEach(t => freq[t] = (freq[t] || 0) + 1));
    const tags = Object.keys(freq).sort();
    if (!tags.length) { el.innerHTML = `<div class="small">No tags yet — add some from My Library.</div>`; return; }
    el.innerHTML = tags.map(t => `
      <div class="chip" style="cursor:default">${t} <span class="small">(${freq[t]})</span> <button data-deltag="${t}" style="background:none;border:none;color:var(--crimson-bright);cursor:pointer;margin-left:4px">✕</button></div>
    `).join('');
    el.querySelectorAll('[data-deltag]').forEach(btn => btn.addEventListener('click', () => {
      const t = btn.dataset.deltag;
      const map = Store.getTags();
      Object.keys(map).forEach(id => {
        map[id] = map[id].filter(x => x !== t);
        if (!map[id].length) delete map[id];
      });
      Store.set('tags', map);
      renderTags();
      toast('Tag removed everywhere');
    }));
  }

  function loadForm() {
    const s = Store.getSettings();
    document.getElementById('driveApiKey').value = s.driveApiKey || '';
    document.getElementById('handyKey').value = s.handyKey || '';
    document.getElementById('handyBaseUrl').value = s.handyBaseUrl || '';
    document.getElementById('landingPage').value = s.landingPage || '/';
    document.getElementById('density').value = s.density || 'comfortable';
    renderFolders();
    renderTags();
  }

  function render(container) {
    NB.configureHeader(null);
    container.innerHTML = `
      <div class="eyebrow" style="margin-bottom:8px">Settings</div>
      <h1 style="font-size:1.6rem;margin-bottom:14px">Everything lives here, and only here</h1>
      <p class="small" style="max-width:640px;margin-bottom:20px">No accounts, no server, no analytics. Every key and preference below is saved to this browser's local storage only. Clear your browser data and it's gone — back it up below if that matters to you.</p>

      <div class="panel">
        <h2>Google Drive Library</h2>
        <div class="sub">A free API key with Drive API enabled. <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener" style="color:var(--gold)">Create one in Google Cloud Console</a> — restrict it to the Drive API for safety. Folders must be shared as "Anyone with the link — Viewer".</div>
        <div class="field">
          <label>Drive API Key</label>
          <input id="driveApiKey" type="password" placeholder="AIza…">
        </div>
        <button class="btn btn-gold" id="saveDrive" style="width:auto;padding:10px 18px">Save Key</button>

        <div class="mt-lg" style="border-top:1px solid var(--border);padding-top:18px">
          <div class="field" style="margin-bottom:10px">
            <label>Add a library folder</label>
            <div class="row">
              <input id="newFolderLabel" type="text" placeholder="Label, e.g. Femdom">
              <input id="newFolderId" type="text" placeholder="Drive folder ID (from the folder's URL)">
            </div>
          </div>
          <button class="btn btn-ghost" id="addFolder" style="width:auto;padding:10px 18px">Add Folder</button>
          <div class="mt" id="folderList"></div>
        </div>
      </div>

      <div class="panel">
        <h2>The Handy</h2>
        <div class="sub">Your Connection Key, from the Handy app under Settings.</div>
        <div class="row">
          <div class="field">
            <label>Connection Key</label>
            <input id="handyKey" type="password" placeholder="e.g. AbCdEf12">
          </div>
          <div class="field">
            <label>API Base URL</label>
            <input id="handyBaseUrl" type="text" placeholder="https://www.handyfeeling.com/api/handy/v2">
          </div>
        </div>
        <button class="btn btn-gold" id="saveHandy" style="width:auto;padding:10px 18px">Save Handy Settings</button>
      </div>

      <div class="panel">
        <h2>Preferences</h2>
        <div class="row">
          <div class="field">
            <label>Landing page</label>
            <select id="landingPage">
              <option value="/">Home</option>
              <option value="/directory">Directory</option>
              <option value="/library">My Library</option>
              <option value="/handy">The Handy</option>
            </select>
          </div>
          <div class="field">
            <label>Density</label>
            <select id="density">
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
        </div>
        <button class="btn btn-gold" id="savePrefs" style="width:auto;padding:10px 18px">Save Preferences</button>
      </div>

      <div class="panel">
        <h2>Tag Manager</h2>
        <div class="sub">Every tag currently used in My Library.</div>
        <div class="chip-row" id="tagManager"></div>
      </div>

      <div class="panel">
        <h2>Backup &amp; Reset</h2>
        <div class="sub">Export everything (keys, favorites, tags) as a JSON file, or restore from one.</div>
        <div class="row">
          <button class="btn btn-ghost" id="exportBtn">⬇ Export Backup</button>
          <label class="btn btn-ghost" style="cursor:pointer">
            ⬆ Import Backup
            <input id="importFile" type="file" accept="application/json" style="display:none">
          </label>
          <button class="btn btn-crimson" id="resetBtn">Reset Everything</button>
        </div>
      </div>`;

    loadForm();

    document.getElementById('saveDrive').addEventListener('click', () => {
      Store.setSettings({ driveApiKey: document.getElementById('driveApiKey').value.trim() });
      toast('Drive API key saved', 'gold');
    });

    document.getElementById('addFolder').addEventListener('click', () => {
      const id = document.getElementById('newFolderId').value.trim();
      const label = document.getElementById('newFolderLabel').value.trim() || 'Library';
      if (!id) { toast('Paste a folder ID first'); return; }
      const s = Store.getSettings();
      s.driveFolders.push({ id, label });
      Store.setSettings({ driveFolders: s.driveFolders });
      document.getElementById('newFolderId').value = '';
      document.getElementById('newFolderLabel').value = '';
      renderFolders();
      toast('Folder added', 'gold');
    });

    document.getElementById('saveHandy').addEventListener('click', () => {
      Store.setSettings({
        handyKey: document.getElementById('handyKey').value.trim(),
        handyBaseUrl: document.getElementById('handyBaseUrl').value.trim() || 'https://www.handyfeeling.com/api/handy/v2',
      });
      toast('Handy settings saved', 'gold');
    });

    document.getElementById('savePrefs').addEventListener('click', () => {
      Store.setSettings({
        landingPage: document.getElementById('landingPage').value,
        density: document.getElementById('density').value,
      });
      NB.applyDensity && NB.applyDensity();
      toast('Preferences saved', 'gold');
    });

    document.getElementById('exportBtn').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(Store.exportAll(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'noir-index-backup.json';
      a.click();
      toast('Backup downloaded', 'gold');
    });

    document.getElementById('importFile').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          Store.importAll(JSON.parse(reader.result));
          toast('Backup restored — reloading…', 'gold');
          setTimeout(() => location.reload(), 900);
        } catch (err) { toast('That file was not a valid backup'); }
      };
      reader.readAsText(file);
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      if (!confirm('This clears every setting, favorite and tag stored in this browser. Continue?')) return;
      Store.resetAll();
      toast('All local data cleared');
      setTimeout(() => location.reload(), 700);
    });
  }

  Router.register('/settings', { id: 'settings', title: 'Settings — Noir Index', render });
})();
