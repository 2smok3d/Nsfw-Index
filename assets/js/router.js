/* ============================================================
   router.js — tiny hash-based SPA router. One HTML shell
   (index.html), every "page" is a view module that renders into
   #view. No full page reloads between sections of the app.
   ============================================================ */
const Router = (() => {
  const routes = {};
  let defaultPath = '/';
  let cleanup = null;

  function register(path, cfg) { routes[path] = cfg; }
  function setDefault(path) { defaultPath = path; }

  function parseHash() {
    const raw = location.hash.slice(1) || defaultPath;
    const [path, qs] = raw.split('?');
    return { path: path || defaultPath, params: new URLSearchParams(qs || '') };
  }

  function current() { return parseHash().path; }

  function go(path) {
    if (location.hash.slice(1) === path) { render(); return; }
    location.hash = path;
  }

  function render() {
    if (typeof cleanup === 'function') { try { cleanup(); } catch (e) {} }
    cleanup = null;

    const { path, params } = parseHash();
    const route = routes[path] || routes[defaultPath];
    const container = document.getElementById('view');
    if (!container || !route) return;
    document.title = route.title || 'Noir Index';
    if (typeof NB !== 'undefined' && NB.setActive) NB.setActive(route.id);
    window.scrollTo(0, 0);
    container.innerHTML = '';
    // a view's render() may return a cleanup function, run before the next navigation
    cleanup = route.render(container, params) || null;

    // restart the page-load reveal animation (see theme.css .view-enter) —
    // removing then re-adding the class forces the browser to treat it as
    // a fresh animation instead of a no-op on an already-applied class
    container.classList.remove('view-enter');
    void container.offsetWidth;
    container.classList.add('view-enter');
  }

  window.addEventListener('hashchange', render);

  return { register, setDefault, go, current, render };
})();
