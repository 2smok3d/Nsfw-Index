/* ============================================================
   sites.js — the curated directory dataset.
   Pure data, no logic. Consumed by views/directory.js and
   views/search.js.

   Two categories — Taboo (step fetish, femdom, mommy domme) and
   Ebony — each a flat list distinguished internally by tags, not
   sections (views/directory.js renders every site in one grid
   regardless of category; CATEGORIES only exists so
   scripts/verify.mjs can catch a typo'd or unregistered category).
   Free sites only — no paywalled/subscription entries.

   Schema per entry:
     id        unique slug
     name      display name
     url       destination — the site's homepage. The in-app search
               (views/search.js) never embeds or fetches another
               site's pages — it only ranks this local metadata and
               links out directly.
     category  'taboo' or 'ebony' — must match an id in CATEGORIES
     tags      string[] — used by the tag filter chips and search
     hot       true → curator pick, used as the hero row until real
               visit data exists (visited sites then take over the
               hero row automatically — see views/directory.js)
     note      short description
     su        (optional) search-base url — when set, views/search.js
               shows an "Open search on this site ↗" link that opens
               `su + encodeURIComponent(query)` in a new tab. This is
               a plain URL, never fetched or embedded by this app —
               only set on sites whose search-URL pattern is
               confidently known (fabricating one would silently
               ship a dead link).
     sq        (optional) default term used with `su` when the
               global search box is empty
   ============================================================ */

const CATEGORIES = [
  { id: 'taboo', label: 'Taboo', blurb: 'Step fetish, femdom, and mommy domme — the whole focus, one list. Free sites only.' },
  { id: 'ebony', label: 'Ebony', blurb: 'Ebony-focused free tubes.' },
];

const SITES = [
  // ── featured ──
  { id: 'momvids', name: 'MomVids', url: 'https://www.momvids.com', category: 'taboo', tags: ['taboo', 'stepmom', 'dedicated', 'free'], hot: true, note: 'Dedicated stepmom tube' },
  { id: 'ph', name: 'PornHub', url: 'https://www.pornhub.com', su: 'https://www.pornhub.com/video/search?search=', sq: 'taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], hot: true, note: 'Massive taboo, stepmom & femdom library' },
  { id: 'xh', name: 'xHamster', url: 'https://xhamster.com', su: 'https://xhamster.com/search/', sq: 'taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], hot: true, note: 'Top taboo category' },
  { id: 'sb', name: 'SpankBang', url: 'https://spankbang.com', su: 'https://spankbang.com/s/', sq: 'taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'joi', 'tube', 'free', 'hd'], hot: true, note: 'Great quality across the board' },
  { id: 'noodle', name: 'Noodlemagazine', url: 'https://noodlemagazine.com', su: 'https://noodlemagazine.com/video/', sq: 'taboo', category: 'taboo', tags: ['taboo', 'tube', 'free', 'hd'], hot: true, note: 'Huge free library, consistently well-rated' },
  { id: 'pornhoarder', name: 'PornHoarder', url: 'https://pornhoarder.tv', category: 'taboo', tags: ['tube', 'free', 'hd'], hot: true, note: 'Curated, harder-to-find full scenes' },
  { id: 'nsfwbase', name: 'NSFWBase', url: 'https://www.nsfwbase.com', category: 'taboo', tags: ['free', 'tube'], hot: true, note: 'Multi-site search — one box searches dozens of tubes at once' },

  // ── major tubes with verified search patterns ──
  { id: 'xnxx', name: 'XNXX', url: 'https://www.xnxx.com', su: 'https://www.xnxx.com/search/', sq: 'taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], note: 'Huge catalog' },
  { id: 'xv', name: 'xVideos', url: 'https://www.xvideos.com', su: 'https://www.xvideos.com/?k=', sq: 'taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], note: 'Massive free library' },
  { id: 'ep', name: 'EPorner', url: 'https://www.eporner.com', su: 'https://www.eporner.com/search/', sq: 'taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'hd', '4k', 'free'], note: 'HD & 4K free' },
  { id: 'hq', name: 'HQPorner', url: 'https://hqporner.com', su: 'https://hqporner.com/?q=', sq: 'taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', '4k', 'free'], note: '4K available' },
  { id: 'txxx', name: 'Txxx', url: 'https://txxx.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Large collection' },
  { id: 'beeg', name: 'Beeg', url: 'https://beeg.com', su: 'https://beeg.com/sex/', sq: 'taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Clean UI' },
  { id: 'redtube', name: 'RedTube', url: 'https://www.redtube.com', su: 'https://www.redtube.com/?search=', sq: 'taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Classic tube' },
  { id: 'youporn', name: 'YouPorn', url: 'https://www.youporn.com', su: 'https://www.youporn.com/search/?query=', sq: 'taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Large catalog' },
  { id: 'drtuber', name: 'DrTuber', url: 'https://www.drtuber.com', su: 'https://www.drtuber.com/search/video?q=', sq: 'taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Good quality' },
  { id: 'porntrex', name: 'PornTrex', url: 'https://www.porntrex.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Big catalog' },
  { id: 'tube8', name: 'Tube8', url: 'https://www.tube8.com', category: 'taboo', tags: ['tube', 'free', 'classic'], note: 'Long-running mainstream tube' },
  { id: 'tnaflix', name: 'TNAFlix', url: 'https://www.tnaflix.com', su: 'https://www.tnaflix.com/search?what=', sq: 'taboo', category: 'taboo', tags: ['tube', 'free', 'classic'], note: 'Classic tube, deep archive' },
  { id: 'youjizz', name: 'Youjizz', url: 'https://www.youjizz.com', category: 'taboo', tags: ['tube', 'free', 'classic', 'amateur'], note: 'Long-running amateur-leaning tube' },
  { id: 'xozilla', name: 'Xozilla', url: 'https://www.xozilla.com', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'Clean modern tube, HD focus' },
  { id: 'zbporn', name: 'ZBPorn', url: 'https://zbporn.com', su: 'https://zbporn.com/search/', sq: 'taboo', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'Well-organized categories, HD' },
  { id: 'ixxx', name: 'iXXX', url: 'https://www.ixxx.com', su: 'https://www.ixxx.com/search/', sq: 'taboo', category: 'taboo', tags: ['tube', 'free'], note: 'Clean aggregator, wide catalog' },
  { id: 'anysex', name: 'AnySex', url: 'https://anysex.com', su: 'https://anysex.com/search/?q=', sq: 'taboo', category: 'taboo', tags: ['tube', 'free', 'classic'], note: 'Long-running general tube' },
  { id: 'ifuqyou', name: 'iFuqYou', url: 'https://enwww.ifuqyou.com', category: 'taboo', tags: ['tube', 'free'], note: 'English-language version' },

  // ── femdom / fetish leaning ──
  { id: 'sxyprn', name: 'SXYPRN', url: 'https://www.sxyprn.com', category: 'taboo', tags: ['femdom', 'fetish', 'amateur', 'free'], note: 'Amateur-heavy, strong femdom & fetish tagging' },
  { id: 'heavyr', name: 'Heavy-R', url: 'https://www.heavy-r.com', category: 'taboo', tags: ['femdom', 'fetish', 'free'], note: 'Fetish-forward tube with a strong femdom section' },
  { id: 'analdin', name: 'Analdin', url: 'https://www.analdin.com', category: 'taboo', tags: ['fetish', 'tube', 'free'], note: 'Niche-focused tube' },

  // ── rest of the free tubes ──
  { id: 'pornmd', name: 'PornMD', url: 'https://www.pornmd.com', su: 'https://www.pornmd.com/search?q=', sq: 'taboo', category: 'taboo', tags: ['tube', 'free', 'search'], note: 'Cross-tube search engine' },
  { id: 'playhdporn', name: 'PlayHDPorn', url: 'https://www.playhdporn.com', su: 'https://playhdporn.com/search/', sq: 'taboo', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'HD-focused tube' },
  { id: 'neporn', name: 'neporn', url: 'https://neporn.com', su: 'https://neporn.com/search/', sq: 'taboo', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'freepornvideos', name: 'FreePornVideos', url: 'https://www.freepornvideos.xxx', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'streamporn', name: 'StreamPorn', url: 'https://streamporn.org', category: 'taboo', tags: ['tube', 'free'], note: 'Streaming-focused tube' },
  { id: 'shyfap', name: 'ShyFap', url: 'https://www.shyfap.net', category: 'taboo', tags: ['tube', 'free', 'amateur'], note: 'Amateur-leaning tube' },
  { id: 'cums', name: 'CUMS', url: 'https://cums.net', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'someporn', name: 'SomePorn', url: 'https://some.porn', su: 'https://some.porn/?search=', sq: 'taboo', category: 'taboo', tags: ['tube', 'free', 'rare'], note: 'Rarer, smaller-catalog tube' },
  { id: 'topvid', name: 'TopVid', url: 'https://topvid.tv', su: 'https://topvid.tv/search?search=', sq: 'taboo', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'okxxx', name: 'OK.XXX', url: 'https://ok.xxx', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'Clean modern tube' },
  { id: 'iporntv', name: 'iPornTV', url: 'https://iporntv.net', su: 'https://iporntv.net/searches.php?word=', sq: 'taboo', category: 'taboo', tags: ['tube', 'free'], note: 'Use an ad blocker here' },
  { id: 'pornobae', name: 'PornoBae', url: 'https://pornobae.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'jizzbunker', name: 'Jizzbunker', url: 'https://www.jizzbunker.com', su: 'https://jizzbunker.com/search?query=', sq: 'taboo', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'pornken', name: 'pornken', url: 'https://pornken.com', su: 'https://pornken.com/list/', sq: 'taboo', category: 'taboo', tags: ['tube', 'free', 'rare'], note: 'Rarer, smaller-catalog tube' },
  { id: 'thepornarea', name: 'ThePornArea', url: 'https://thepornarea.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'porndish', name: 'Porndish', url: 'https://www.porndish.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'xmegadrive', name: 'xMegaDrive', url: 'https://www.xmegadrive.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'porndoe', name: 'Porndoe', url: 'https://porndoe.com', su: 'https://porndoe.com/?keywords=', sq: 'taboo', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'Clean modern tube' },
  { id: 'intporn', name: 'IntPorn', url: 'https://www.intporn.com', category: 'taboo', tags: ['community', 'free', 'amateur'], note: 'Forum & community, deep amateur archives' },
  { id: 'porndig', name: 'Porndig', url: 'https://www.porndig.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'xxdbx', name: 'xxdbx', url: 'https://xxdbx.com', su: 'https://xxdbx.com/search/', sq: 'taboo', category: 'taboo', tags: ['tube', 'free', 'rare'], note: 'Rarer, smaller-catalog tube' },
  { id: 'pornxpert', name: 'PornXpert', url: 'https://www.pornxpert.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'ask4porn', name: 'Ask4Porn', url: 'https://ask4porn.cc', su: 'https://ask4porn.cc/search?q=', sq: 'taboo', category: 'taboo', tags: ['tube', 'free', 'search'], note: 'Aggregator-style search' },
  { id: 'pornhd3x', name: 'PornHD3x', url: 'https://www.pornhd3x.tv', su: 'https://www.pornhd3x.tv/search/', sq: 'taboo', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'HD-focused tube' },
  { id: 'cliphunter', name: 'ClipHunter', url: 'https://www.cliphunter.com', category: 'taboo', tags: ['tube', 'free', 'classic'], note: 'Long-running classic tube' },
  { id: 'sexvid', name: 'SexVid', url: 'https://www.sexvid.pro', su: 'https://www.sexvid.pro/s/', sq: 'taboo', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'superporn', name: 'SuperPorn', url: 'https://www.superporn.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'watchpornto', name: 'WatchPorn.to', url: 'https://watchporn.to', su: 'https://watchporn.to/search/', sq: 'taboo', category: 'taboo', tags: ['tube', 'free', 'rare'], note: 'Rarer streaming-focused tube' },
  { id: 'porninja', name: 'Porninja', url: 'https://www.por.ninja', category: 'taboo', tags: ['tube', 'free', 'rare'], note: 'Rarer, smaller-catalog tube' },
  { id: 'familypornhd', name: 'FamilyPornHD', url: 'https://www.familypornhd.com', category: 'taboo', tags: ['tube', 'free'] },
  { id: 'tabootube', name: 'TabooTube', url: 'https://www.tabootube.xxx', category: 'taboo', tags: ['tube', 'free'] },
  { id: 'taboodaddy', name: 'TabooDaddy', url: 'https://www.taboodaddy.com', category: 'taboo', tags: ['tube', 'free'] },
  { id: 'taboohome', name: 'TabooHome', url: 'https://www.taboohome.net', category: 'taboo', tags: ['tube', 'free'] },
  { id: 'tabooporn', name: 'TabooPorn', url: 'https://www.tabooporn.to', category: 'taboo', tags: ['tube', 'free'] },
  { id: 'ebonypulse', name: 'EbonyPulse', url: 'https://www.ebonypulse.tv', category: 'ebony', tags: ['tube', 'free', 'ebony'] },
  { id: 'ebonygalore', name: 'EbonyGalore', url: 'https://www.ebonygalore.com', category: 'ebony', tags: ['tube', 'free', 'ebony'] },
];
