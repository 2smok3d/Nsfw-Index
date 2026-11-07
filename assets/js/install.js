/* Noir Index — PWA install affordance. Shows a header button whenever the
   app isn't already running installed. Chrome/Edge/Android fire
   beforeinstallprompt, so there the button triggers a real native install.
   Brave, Firefox desktop, and anything else that never fires that event
   (Brave in particular doesn't, even though it does support installing)
   falls back to a toast with manual steps instead of just hiding the
   button — a hidden button looks like installing isn't possible at all,
   which isn't true, it just isn't automatable on every browser. */
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

  function manualInstructions() {
    if (isIOS()) return 'Tap Share, then "Add to Home Screen"';
    return 'Open your browser\'s menu and look for "Install Noir Index" (or an install icon in the address bar)';
  }

  function init() {
    const b = btn();
    if (!b || isStandalone()) return;

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
    });
    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      hide();
      if (window.toast) toast('Installed ✓', 'gold');
    });

    show(); // always offer it — the click handler falls back to manual steps when there's no native prompt to trigger

    b.addEventListener('click', async () => {
      if (deferredPrompt) {
        const prompt = deferredPrompt;
        deferredPrompt = null;
        prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome !== 'dismissed') hide();
        return;
      }
      if (window.toast) toast(manualInstructions(), 'gold');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
