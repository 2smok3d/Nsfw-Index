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

  // ── video bookmarks — specific videos you paste a link to, not
  // whole sites. The app never fetches these URLs; it only stores
  // what you typed in and links out to it. ──
  function getVideoBookmarks() { return get('video_bookmarks', []); } // [{id,url,title,note,tags,addedAt}]
  function addVideoBookmark({ url, title, note, tags }) {
    const list = getVideoBookmarks();
    const entry = {
      id: 'vb_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      url, title: (title || '').trim(), note: (note || '').trim(),
      tags: (tags || []).map(t => t.trim()).filter(Boolean),
      addedAt: Date.now(),
    };
    list.unshift(entry);
    set('video_bookmarks', list);
    return entry;
  }
  function removeVideoBookmark(id) {
    set('video_bookmarks', getVideoBookmarks().filter(b => b.id !== id));
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
    getVideoBookmarks, addVideoBookmark, removeVideoBookmark,
    getVisits, recordVisit,
    ageVerified, setAgeVerified,
  };
})();
