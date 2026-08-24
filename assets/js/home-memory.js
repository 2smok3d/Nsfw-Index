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

  function favorites(limit = 6) {
    const favs = Store.getFavs();
    return SITES.filter(s => favs.has(s.id)).slice(0, limit);
  }

  function totalVisits() {
    return Object.values(Store.getVisits()).reduce((sum, n) => sum + Number(n || 0), 0);
  }

  return { ranked, favorites, totalVisits };
})();
