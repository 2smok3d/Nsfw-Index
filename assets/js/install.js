/* Noir Index — PWA install affordance. Shows a header button when the
   browser can install the app (Chrome/Edge/Android fire beforeinstallprompt),
   or gives iOS Safari users the manual "Add to Home Screen" steps since
   that platform never fires the event. Does nothing once already running
   installed (display-mode: standalone). */
(function () {
  let deferredPrompt = null;

  function isStandalone() {
    return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  }
  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }
  function btn() { return document.getElementById('installBtn'); }
  function show() { const b = btn(); if (b) b.style.display = ''; }
  function hide() { const b = btn(); if (b) b.style.display = 'none'; }

  function init() {
    const b = btn();
    if (!b || isStandalone()) return;

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
      show();
    });
    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      hide();
      if (window.toast) toast('Installed ✓', 'gold');
    });

    if (isIOS()) show(); // no beforeinstallprompt on iOS — offer manual steps instead

    b.addEventListener('click', async () => {
      if (deferredPrompt) {
        const prompt = deferredPrompt;
        deferredPrompt = null;
        prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome === 'dismissed') show();
        else hide();
        return;
      }
      if (isIOS() && window.toast) toast('Tap Share, then "Add to Home Screen"', 'gold');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
