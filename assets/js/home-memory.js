/* Home-memory: lightweight local-only personalization for the hub. */
const HomeMemory = (() => {
  function ranked(limit = 6) {
    const visits = Store.getVisits();
    return Object.entries(visits)
      .map(([id, count]) => ({ site: SITES.find(s => s.id === id), count }))
      .filter(x => x.site)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  function bookmarks(limit = 6) {
    return Store.getVideoBookmarks().slice(0, limit);
  }

  function totalVisits() {
    return Object.values(Store.getVisits()).reduce((sum, n) => sum + Number(n || 0), 0);
  }

  return { ranked, bookmarks, totalVisits };
})();
