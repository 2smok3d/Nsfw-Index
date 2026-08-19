/* ============================================================
   store.js — tiny namespaced localStorage wrapper shared by
   every page. Nothing here ever leaves the browser.
   ============================================================ */
const Store = (() => {
  const PREFIX = 'nbx.';

  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch (e) { /* storage unavailable / full — fail silently */ }
  }
  function remove(key) {
    try { localStorage.removeItem(PREFIX + key); } catch (e) {}
  }

  // ── favorites (directory + library) ──
  function getFavs() { return new Set(get('favs', [])); }
  function toggleFav(id) {
    const favs = getFavs();
    const had = favs.has(id);
    had ? favs.delete(id) : favs.add(id);
    set('favs', [...favs]);
    return !had;
  }

  // ── visit counts (directory — drives "most visited" ordering) ──
  function getVisits() { return get('visits', {}); } // { siteId: count }
  function recordVisit(id) {
    const v = getVisits();
    v[id] = (v[id] || 0) + 1;
    set('visits', v);
    return v[id];
  }

  // ── settings (prefs — all local only) ──
  const DEFAULT_SETTINGS = {
    density: 'comfortable', // comfortable | compact
    landingPage: '/',
  };
  // pre-SPA builds stored landingPage as a filename ("directory.html");
  // transparently upgrade it to the equivalent route on read. library.html
  // and handy.html no longer exist (those sections were removed), so they
  // fall back to home rather than a dead route.
  const LEGACY_LANDING = { 'index.html': '/', 'directory.html': '/directory', 'library.html': '/', 'handy.html': '/', 'tools.html': '/tools', 'settings.html': '/settings' };
  function getSettings() {
    const s = Object.assign({}, DEFAULT_SETTINGS, get('settings', {}));
    if (s.landingPage in LEGACY_LANDING) s.landingPage = LEGACY_LANDING[s.landingPage];
    return s;
  }
  function setSettings(patch) {
    const cur = getSettings();
    const next = Object.assign({}, cur, patch);
    set('settings', next);
    return next;
  }

  function ageVerified() { return get('age_ok', false) === true; }
  function setAgeVerified() { set('age_ok', true); }

  function exportAll() {
    const out = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) out[k.slice(PREFIX.length)] = get(k.slice(PREFIX.length));
    }
    return out;
  }
  function importAll(obj) {
    Object.keys(obj || {}).forEach(k => set(k, obj[k]));
  }
  function resetAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }

  return {
    get, set, remove,
    getFavs, toggleFav,
    getVisits, recordVisit,
    getSettings, setSettings,
    ageVerified, setAgeVerified,
    exportAll, importAll, resetAll,
  };
})();
