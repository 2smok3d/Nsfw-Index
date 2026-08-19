/* ============================================================
   views/settings.js — preferences and backup/restore. Everything
   here is saved to this browser's local storage only.
   ============================================================ */
(function () {
  function loadForm() {
    const s = Store.getSettings();
    document.getElementById('landingPage').value = s.landingPage || '/';
    document.getElementById('density').value = s.density || 'comfortable';
  }

  function render(container) {
    NB.configureHeader(null);
    container.innerHTML = `
      <div class="eyebrow" style="margin-bottom:8px">Settings</div>
      <h1 style="font-size:1.6rem;margin-bottom:14px">Everything lives here, and only here</h1>
      <p class="small" style="max-width:640px;margin-bottom:20px">No accounts, no server, no analytics. Every preference below is saved to this browser's local storage only. Clear your browser data and it's gone — back it up below if that matters to you.</p>

      <div class="panel">
        <h2>Preferences</h2>
        <div class="row">
          <div class="field">
            <label>Landing page</label>
            <select id="landingPage">
              <option value="/">Home</option>
              <option value="/directory">Directory</option>
              <option value="/search">Search</option>
              <option value="/tools">Tools</option>
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
        <h2>Backup &amp; Reset</h2>
        <div class="sub">Export everything (favorites, most-visited stats, preferences) as a JSON file, or restore from one.</div>
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
      if (!confirm('This clears every setting and favorite stored in this browser. Continue?')) return;
      Store.resetAll();
      toast('All local data cleared');
      setTimeout(() => location.reload(), 700);
    });
  }

  Router.register('/settings', { id: 'settings', title: 'Settings — Noir Index', render });
})();
