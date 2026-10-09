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

  function ageVerified() { return get('age_ok', false) === true; }
  function setAgeVerified() { set('age_ok', true); }

  return {
    get, set, remove,
    getFavs, toggleFav,
    getVisits, recordVisit,
    ageVerified, setAgeVerified,
  };
})();
