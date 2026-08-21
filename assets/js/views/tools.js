/* ============================================================
   views/tools.js — downloaders & self-hosting resources. Static
   content, no state; data-driven purely so each card gets the
   same icon treatment as the directory (see NB.siteIcon).
   ============================================================ */
(function () {
  const SECTIONS = [
    {
      title: 'Downloaders',
      items: [
        { name: 'yt-dlp', url: 'https://github.com/yt-dlp/yt-dlp', tag: 'cli', note: 'The universal downloader — supports nearly every tube site' },
        { name: 'JDownloader 2', url: 'https://jdownloader.org', tag: 'gui', note: 'GUI batch downloader, supports most hosts' },
        { name: '4K Video Downloader', url: 'https://www.4kdownload.com/products/videodownloader', tag: 'gui', note: 'Simple, polished GUI' },
        { name: 'gallery-dl', url: 'https://github.com/mikf/gallery-dl', tag: 'cli', note: 'Image & gallery scraper' },
        { name: 'N_m3u8DL-RE', url: 'https://github.com/nilaoda/N_m3u8DL-RE', tag: 'cli', note: 'HLS/stream capture for sites yt-dlp can’t reach' },
        { name: 'Lux', url: 'https://github.com/iawia002/lux', tag: 'cli', note: 'Fast Go-based CLI downloader' },
      ],
    },
    {
      title: 'Self-Hosted Media Servers',
      items: [
        { name: 'Stash', url: 'https://stashapp.cc', tag: 'recommended', note: 'Purpose-built adult media manager, tagging & scraping' },
        { name: 'Hydrus Network', url: 'https://hydrusnetwork.github.io/hydrus/', tag: 'local', note: 'Powerful local image & video tag manager' },
        { name: 'Jellyfin', url: 'https://jellyfin.org', tag: 'server', note: 'Free, open-source media server' },
        { name: 'ThePornDB', url: 'https://theporndb.net', tag: 'metadata', note: 'Scene metadata database, pairs well with Stash' },
      ],
    },
    {
      title: 'Playback & Browsing',
      items: [
        { name: 'VLC', url: 'https://www.videolan.org/vlc/', tag: 'player', note: 'Free, plays anything' },
        { name: 'MPC-HC', url: 'https://github.com/clsid2/mpc-hc/releases/latest', tag: 'player', note: 'Lightweight Windows player' },
        { name: 'uBlock Origin', url: 'https://ublockorigin.com', tag: 'extension', note: 'Best-in-class ad blocker — essential for free tubes' },
        { name: 'SponsorBlock', url: 'https://sponsor.ajay.app', tag: 'extension', note: 'Skip sponsored segments' },
        { name: 'Real-ESRGAN', url: 'https://github.com/xinntao/Real-ESRGAN', tag: 'ai', note: 'AI video/image upscaling for older archives' },
      ],
    },
  ];

  function card(item) {
    return `<a class="card" href="${item.url}" target="_blank" rel="noopener">
      <div class="c-tag">${item.tag}</div>
      <div class="c-title-row">${NB.siteIcon(item.name, item.url)}<div class="c-name">${item.name}</div></div>
      <div class="c-note">${item.note}</div>
    </a>`;
  }

  function section(sec) {
    return `<div class="sec">
      <div class="sec-hdr open"><div class="sec-title">${sec.title}</div><div class="sec-count">${sec.items.length}</div></div>
      <div class="sec-body open"><div class="sec-inner"><div class="sec-pad">
        <div class="card-grid">${sec.items.map(card).join('')}</div>
      </div></div></div>
    </div>`;
  }

  function render(container) {
    NB.configureHeader(null);
    container.innerHTML = `
      <div class="eyebrow" style="margin-bottom:8px">Tools</div>
      <h1 style="font-size:1.6rem;margin-bottom:6px">Download &amp; build a permanent archive</h1>
      <p class="small mt-lg" style="max-width:640px">Streaming sites vanish. These are the tools worth knowing for pulling content down and keeping a private, self-hosted archive.</p>
      <div class="mt-lg">${SECTIONS.map(section).join('')}</div>`;
  }

  Router.register('/tools', { id: 'tools', title: 'Tools — Noir Index', render });
})();
