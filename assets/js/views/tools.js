/* ============================================================
   views/tools.js — downloaders & self-hosting resources. Static
   content, no state.
   ============================================================ */
(function () {
  function render(container) {
    NB.configureHeader(null);
    container.innerHTML = `
      <div class="eyebrow" style="margin-bottom:8px">Tools</div>
      <h1 style="font-size:1.6rem;margin-bottom:6px">Download &amp; build a permanent archive</h1>
      <p class="small mt-lg" style="max-width:640px">Streaming sites vanish. These are the tools worth knowing for pulling content down and keeping a private, self-hosted archive — feed a downloaded file straight into your Drive library and it'll show up in <a href="#/library" style="color:var(--gold)">My Library</a>.</p>

      <div class="sec mt-lg">
        <div class="sec-hdr open"><div class="sec-title">Downloaders</div><div class="sec-count">6</div></div>
        <div class="sec-body open"><div class="sec-inner"><div class="sec-pad">
          <div class="card-grid">
            <a class="card" href="https://github.com/yt-dlp/yt-dlp" target="_blank" rel="noopener"><div class="c-tag">cli</div><div class="c-name">yt-dlp</div><div class="c-note">The universal downloader — supports nearly every tube site</div></a>
            <a class="card" href="https://jdownloader.org" target="_blank" rel="noopener"><div class="c-tag">gui</div><div class="c-name">JDownloader 2</div><div class="c-note">GUI batch downloader, supports most hosts</div></a>
            <a class="card" href="https://www.4kdownload.com/products/videodownloader" target="_blank" rel="noopener"><div class="c-tag">gui</div><div class="c-name">4K Video Downloader</div><div class="c-note">Simple, polished GUI</div></a>
            <a class="card" href="https://github.com/mikf/gallery-dl" target="_blank" rel="noopener"><div class="c-tag">cli</div><div class="c-name">gallery-dl</div><div class="c-note">Image &amp; gallery scraper</div></a>
            <a class="card" href="https://github.com/nilaoda/N_m3u8DL-RE" target="_blank" rel="noopener"><div class="c-tag">cli</div><div class="c-name">N_m3u8DL-RE</div><div class="c-note">HLS/stream capture for sites yt-dlp can't reach</div></a>
            <a class="card" href="https://github.com/iawia002/lux" target="_blank" rel="noopener"><div class="c-tag">cli</div><div class="c-name">Lux</div><div class="c-note">Fast Go-based CLI downloader</div></a>
          </div>
        </div></div></div>
      </div>

      <div class="sec">
        <div class="sec-hdr open"><div class="sec-title">Self-Hosted Media Servers</div><div class="sec-count">4</div></div>
        <div class="sec-body open"><div class="sec-inner"><div class="sec-pad">
          <div class="card-grid">
            <a class="card" href="https://stashapp.cc" target="_blank" rel="noopener"><div class="c-tag">recommended</div><div class="c-name">Stash</div><div class="c-note">Purpose-built adult media manager, tagging &amp; scraping</div></a>
            <a class="card" href="https://hydrusnetwork.github.io/hydrus/" target="_blank" rel="noopener"><div class="c-tag">local</div><div class="c-name">Hydrus Network</div><div class="c-note">Powerful local image &amp; video tag manager</div></a>
            <a class="card" href="https://jellyfin.org" target="_blank" rel="noopener"><div class="c-tag">server</div><div class="c-name">Jellyfin</div><div class="c-note">Free, open-source media server</div></a>
            <a class="card" href="https://theporndb.net" target="_blank" rel="noopener"><div class="c-tag">metadata</div><div class="c-name">ThePornDB</div><div class="c-note">Scene metadata database, pairs well with Stash</div></a>
          </div>
        </div></div></div>
      </div>

      <div class="sec">
        <div class="sec-hdr open"><div class="sec-title">Playback &amp; Browsing</div><div class="sec-count">5</div></div>
        <div class="sec-body open"><div class="sec-inner"><div class="sec-pad">
          <div class="card-grid">
            <a class="card" href="https://www.videolan.org/vlc/" target="_blank" rel="noopener"><div class="c-tag">player</div><div class="c-name">VLC</div><div class="c-note">Free, plays anything</div></a>
            <a class="card" href="https://github.com/clsid2/mpc-hc/releases/latest" target="_blank" rel="noopener"><div class="c-tag">player</div><div class="c-name">MPC-HC</div><div class="c-note">Lightweight Windows player</div></a>
            <a class="card" href="https://ublockorigin.com" target="_blank" rel="noopener"><div class="c-tag">extension</div><div class="c-name">uBlock Origin</div><div class="c-note">Best-in-class ad blocker — essential for free tubes</div></a>
            <a class="card" href="https://sponsor.ajay.app" target="_blank" rel="noopener"><div class="c-tag">extension</div><div class="c-name">SponsorBlock</div><div class="c-note">Skip sponsored segments</div></a>
            <a class="card" href="https://github.com/xinntao/Real-ESRGAN" target="_blank" rel="noopener"><div class="c-tag">ai</div><div class="c-name">Real-ESRGAN</div><div class="c-note">AI video/image upscaling for older archives</div></a>
          </div>
        </div></div></div>
      </div>

      <div class="panel mt-lg">
        <h2>Feeding your Drive library</h2>
        <div class="sub">A simple loop: download with yt-dlp → drop the file into a Drive folder → set that folder to "Anyone with the link — Viewer" → paste its folder ID into <a href="#/settings" style="color:var(--gold)">Settings</a>. It'll appear in <a href="#/library" style="color:var(--gold)">My Library</a> automatically, taggable and downloadable from any device.</div>
      </div>`;
  }

  Router.register('/tools', { id: 'tools', title: 'Tools — Noir Index', render });
})();
