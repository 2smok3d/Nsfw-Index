/* ============================================================
   handy.js — control panel for The Handy, talking directly to
   the official public REST API v2 (handyfeeling.com). Your
   Connection Key never leaves the browser except to Handy's
   own servers, exactly as the official app does.

   Reference: https://handyfeeling.com/api/handy/v2/docs
   Endpoint/body shapes below follow the documented v2 contract;
   if your firmware behaves slightly differently, the interactive
   docs above are the ground truth.
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

  function init() {
    NB.initChrome('handy');
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

  document.addEventListener('DOMContentLoaded', init);
})();
