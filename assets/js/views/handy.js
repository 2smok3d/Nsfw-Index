/* ============================================================
   views/handy.js — control panel for The Handy, talking directly
   to the official public REST API v2 (handyfeeling.com). Your
   Connection Key never leaves the browser except to Handy's own
   servers, exactly as the official app does.
   Reference: https://handyfeeling.com/api/handy/v2/docs
   ============================================================ */
(function () {
  function base() { return (Store.getSettings().handyBaseUrl || 'https://www.handyfeeling.com/api/handy/v2').replace(/\/$/, ''); }
  function key() { return document.getElementById('hkey').value.trim() || Store.getSettings().handyKey; }
  function headers() { return { 'Content-Type': 'application/json', 'X-Connection-Key': key() }; }

  async function hGet(path) {
    const r = await fetch(`${base()}/${path}`, { headers: headers() });
    if (!r.ok) throw new Error(`GET /${path} → ${r.status}`);
    return r.json().catch(() => ({}));
  }
  async function hPut(path, body) {
    const r = await fetch(`${base()}/${path}`, { method: 'PUT', headers: headers(), body: body !== undefined ? JSON.stringify(body) : undefined });
    if (!r.ok) throw new Error(`PUT /${path} → ${r.status}`);
    return r.json().catch(() => ({}));
  }

  function setStatus(state, label) {
    const badge = document.getElementById('connBadge');
    badge.className = 'badge ' + (state === 'ok' ? 'badge-ok' : state === 'warn' ? 'badge-warn' : 'badge-off');
    badge.innerHTML = `<span class="dot"></span> ${label}`;
  }

  async function connect() {
    if (!key()) { toast('Enter your Connection Key first'); setStatus('off', 'No key'); return; }
    setStatus('warn', 'Connecting…');
    try {
      const r = await hGet('connected');
      if (r.connected) { setStatus('ok', 'Connected'); toast('Handy connected', 'gold'); Store.setSettings({ handyKey: key() }); }
      else { setStatus('warn', 'Key valid, device offline'); }
    } catch (e) {
      setStatus('off', 'Not connected');
      toast('Could not reach Handy API — check your key');
    }
  }

  async function setMode(mode) {
    try { await hPut('mode', { mode }); toast('Mode set', 'gold'); }
    catch (e) { toast('Mode change failed: ' + e.message); }
  }

  async function hampStart() {
    try {
      await hPut('mode', { mode: 0 });
      await hPut('hamp/start');
      toast('Started', 'gold');
    } catch (e) { toast('Start failed: ' + e.message); }
  }
  async function hampStop() {
    try { await hPut('hamp/stop'); toast('Stopped'); }
    catch (e) { toast('Stop failed: ' + e.message); }
  }
  async function hampVelocity(v) {
    try { await hPut('hamp/velocity', { velocity: Number(v) }); }
    catch (e) { toast('Velocity update failed: ' + e.message); }
  }

  async function applyRange() {
    const min = Number(document.getElementById('slideMin').value);
    const max = Number(document.getElementById('slideMax').value);
    try { await hPut('slide', { min, max }); toast('Stroke range applied', 'gold'); }
    catch (e) { toast('Range update failed: ' + e.message); }
  }

  async function scriptPlay() {
    const url = document.getElementById('scriptUrl').value.trim();
    if (!url) { toast('Paste a script or video URL first'); return; }
    try {
      await hPut('mode', { mode: 1 });
      await hPut('hssp/setup', { url, loop: document.getElementById('scriptLoop').checked });
      await hPut('hssp/play', {});
      toast('Script playback started (best-effort sync)', 'gold');
    } catch (e) { toast('Script setup failed: ' + e.message); }
  }
  async function scriptStop() {
    try { await hPut('hssp/stop'); toast('Script stopped'); }
    catch (e) { toast('Stop failed: ' + e.message); }
  }

  function render(container) {
    NB.configureHeader(null);
    container.innerHTML = `
      <div class="eyebrow" style="margin-bottom:8px">The Handy</div>
      <h1 style="font-size:1.6rem;margin-bottom:14px">Device control center</h1>

      <div class="panel">
        <div class="row" style="align-items:flex-end">
          <div class="field" style="flex:2">
            <label>Connection Key</label>
            <input id="hkey" type="text" placeholder="e.g. AbCdEf12">
            <div class="hint">Found in the Handy app under Settings → Connection Key. Stored only in this browser.</div>
          </div>
          <div style="flex:1;display:flex;gap:10px;align-items:center;padding-bottom:22px">
            <button class="btn btn-gold" id="connectBtn" style="width:auto;padding:11px 20px">Connect</button>
            <span class="badge badge-off" id="connBadge"><span class="dot"></span> Not connected</span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="panel" style="flex:1;min-width:280px">
          <h2>Manual Mode</h2>
          <div class="sub">Direct oscillation control (HAMP).</div>
          <div class="field">
            <label>Mode</label>
            <select id="modeSelect">
              <option value="0">HAMP — Manual</option>
              <option value="1">HSSP — Script Sync</option>
              <option value="2">HDSP — Direct Position</option>
            </select>
          </div>
          <div class="field">
            <label>Velocity — <span id="velocityLabel">50%</span></label>
            <input id="velocity" type="range" min="0" max="100" value="50" style="width:100%;height:auto;accent-color:#c9a24b">
          </div>
          <div class="row">
            <button class="btn btn-gold" id="hampStart">▶ Start</button>
            <button class="btn btn-crimson" id="hampStop">■ Stop</button>
          </div>
        </div>

        <div class="panel" style="flex:1;min-width:280px">
          <h2>Stroke Range</h2>
          <div class="sub">Set the min/max travel of the stroke, 0–100.</div>
          <div class="row">
            <div class="field">
              <label>Min</label>
              <input id="slideMin" type="number" min="0" max="100" value="0">
            </div>
            <div class="field">
              <label>Max</label>
              <input id="slideMax" type="number" min="0" max="100" value="100">
            </div>
          </div>
          <button class="btn btn-gold" id="applyRange">Apply Range</button>
        </div>
      </div>

      <div class="panel">
        <h2>Script Sync (HSSP)</h2>
        <div class="sub">Load a funscript-hosting URL and play. This is a best-effort start — for frame-accurate sync use the official Handy app or a player from the resources below.</div>
        <div class="field">
          <label>Script or interactive video URL</label>
          <input id="scriptUrl" type="text" placeholder="https://…">
        </div>
        <label class="small" style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
          <input id="scriptLoop" type="checkbox" style="width:auto;height:auto"> Loop
        </label>
        <div class="row">
          <button class="btn btn-gold" id="scriptPlay">▶ Load &amp; Play</button>
          <button class="btn btn-crimson" id="scriptStop">■ Stop</button>
        </div>
      </div>

      <div class="sec">
        <div class="sec-hdr open">
          <div class="sec-title">Interactive Sources &amp; Femdom/JOI Scripts</div>
          <div class="sec-count">11</div>
        </div>
        <div class="sec-body open"><div class="sec-inner"><div class="sec-pad">
          <div class="card-grid">
            <a class="card" href="https://www.handyfeeling.com" target="_blank" rel="noopener"><div class="c-tag">official</div><div class="c-name">HandyFeeling</div><div class="c-note">Official site, firmware &amp; free content</div></a>
            <a class="card" href="https://www.thehandy.com" target="_blank" rel="noopener"><div class="c-tag">official</div><div class="c-name">TheHandy.com</div><div class="c-note">Product site &amp; app downloads</div></a>
            <a class="card" href="https://www.pornhub.com/video?filter=interactive" target="_blank" rel="noopener"><div class="c-tag">free</div><div class="c-name">PornHub Interactive</div><div class="c-note">Free pre-synced videos</div></a>
            <a class="card" href="https://www.xvideos.com/c/interactive-213" target="_blank" rel="noopener"><div class="c-tag">free</div><div class="c-name">xVideos Interactive</div><div class="c-note">Free interactive videos</div></a>
            <a class="card" href="https://discuss.eroscripts.com" target="_blank" rel="noopener"><div class="c-tag">community</div><div class="c-name">EroScripts</div><div class="c-note">The funscript community — search "femdom" &amp; "JOI" tags for this niche</div></a>
            <a class="card" href="https://scriptaxis.com" target="_blank" rel="noopener"><div class="c-tag">database</div><div class="c-name">Scriptaxis</div><div class="c-note">Script repository &amp; database</div></a>
            <a class="card" href="https://feelme.ai" target="_blank" rel="noopener"><div class="c-tag">ai</div><div class="c-name">FeelMe AI</div><div class="c-note">AI-generated sync for any video</div></a>
            <a class="card" href="https://xtoys.app" target="_blank" rel="noopener"><div class="c-tag">platform</div><div class="c-name">XToys</div><div class="c-note">Interactive toy control platform</div></a>
            <a class="card" href="https://github.com/FredTungsten/ScriptPlayer" target="_blank" rel="noopener"><div class="c-tag">local</div><div class="c-name">ScriptPlayer</div><div class="c-note">Local funscript playback, frame-accurate</div></a>
            <a class="card" href="https://github.com/Yoooi0/MultiFunPlayer" target="_blank" rel="noopener"><div class="c-tag">local</div><div class="c-name">MultiFunPlayer</div><div class="c-note">Multi-device sync player</div></a>
            <a class="card" href="https://intiface.com/central/" target="_blank" rel="noopener"><div class="c-tag">hub</div><div class="c-name">Intiface Central</div><div class="c-note">Universal device connection hub</div></a>
          </div>
        </div></div></div>
      </div>`;

    const s = Store.getSettings();
    document.getElementById('hkey').value = s.handyKey || '';

    document.getElementById('connectBtn').addEventListener('click', connect);
    document.getElementById('hkey').addEventListener('change', () => Store.setSettings({ handyKey: key() }));
    document.getElementById('modeSelect').addEventListener('change', e => setMode(Number(e.target.value)));
    document.getElementById('hampStart').addEventListener('click', hampStart);
    document.getElementById('hampStop').addEventListener('click', hampStop);
    const vel = document.getElementById('velocity');
    const velLabel = document.getElementById('velocityLabel');
    vel.addEventListener('input', () => velLabel.textContent = vel.value + '%');
    vel.addEventListener('change', () => hampVelocity(vel.value));
    document.getElementById('applyRange').addEventListener('click', applyRange);
    document.getElementById('scriptPlay').addEventListener('click', scriptPlay);
    document.getElementById('scriptStop').addEventListener('click', scriptStop);

    setStatus('off', 'Not connected');
  }

  Router.register('/handy', { id: 'handy', title: 'The Handy — Noir Index', render });
})();
