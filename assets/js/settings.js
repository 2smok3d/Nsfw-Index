/* ============================================================
   settings.js — central config: Drive keys/folders, Handy key,
   density, tag manager, backup/restore of everything above.
   ============================================================ */
(function () {
  function renderFolders() {
    const s = Store.getSettings();
    const el = document.getElementById('folderList');
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
    document.getElementById('landingPage').value = s.landingPage || 'index.html';
    document.getElementById('density').value = s.density || 'comfortable';
    renderFolders();
    renderTags();
  }

  function init() {
    NB.initChrome('settings');
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

  document.addEventListener('DOMContentLoaded', init);
})();
