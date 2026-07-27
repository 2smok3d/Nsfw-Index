/* ============================================================
   sites.js — the curated directory dataset.
   Pure data, no logic. Consumed by views/directory.js and
   views/search.js.

   One category by design — Taboo (step fetish, femdom, mommy
   domme all live here, distinguished by tags, not sections).
   Free sites only — no paywalled/subscription entries.

   Schema per entry:
     id        unique slug
     name      display name
     url       destination — always the site's homepage, not a
               taboo-tagged search/category deep link (use `su`/`sq`
               for that instead, or the in-app multi-site search)
     category  always 'taboo'
     tags      string[] — used by the tag filter chips
     hot       true → curator pick, used as the hero row until real
               visit data exists (visited sites then take over the
               hero row automatically — see views/directory.js)
     note      short description
     su        (optional) search-base url — powers both the per-card
               "search this site" icon and the in-app multi-site
               search (views/search.js). Only set on sites whose
               search-URL pattern is confidently known — fabricating
               one for an unverified site would silently ship a
               broken search, so plenty of entries below intentionally
               don't have it yet. Tell Claude the right pattern for
               any of these and it's a one-line addition.
     sq        (optional) default term used with `su` when the
               global search box is empty
     noFrame   (optional) true → this site's X-Frame-Options/CSP
               blocks it from being embedded, confirmed by hitting
               a real blank iframe. views/search.js skips the iframe
               attempt entirely for these and opens a new tab
               instead, rather than leaving a dead blank box in the
               app. Only mark this from an actual confirmed failure —
               most su sites are simply unverified either way.
   ============================================================ */

const CATEGORIES = [
  { id: 'taboo', label: 'Taboo', blurb: 'Step fetish, femdom, and mommy domme — the whole focus, one list. Free sites only.' },
];

const SITES = [
  // ── featured ──
  { id: 'momvids', name: 'MomVids', url: 'https://www.momvids.com', category: 'taboo', tags: ['taboo', 'stepmom', 'dedicated', 'free'], hot: true, note: 'Dedicated stepmom tube' },
  { id: 'ph', name: 'PornHub', url: 'https://www.pornhub.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], hot: true, note: 'Massive taboo, stepmom & femdom library', su: 'https://www.pornhub.com/video/search?search=', sq: 'taboo', noFrame: true },
  { id: 'xh', name: 'xHamster', url: 'https://xhamster.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], hot: true, note: 'Top taboo category', su: 'https://xhamster.com/search/', sq: 'taboo', noFrame: true },
  { id: 'sb', name: 'SpankBang', url: 'https://spankbang.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'joi', 'tube', 'free', 'hd'], hot: true, note: 'Great quality across the board', su: 'https://spankbang.com/s/', sq: 'taboo', noFrame: true },
  { id: 'noodle', name: 'Noodlemagazine', url: 'https://noodlemagazine.com', category: 'taboo', tags: ['taboo', 'tube', 'free', 'hd'], hot: true, note: 'Huge free library, consistently well-rated' },
  { id: 'pornhoarder', name: 'PornHoarder', url: 'https://pornhoarder.tv', category: 'taboo', tags: ['tube', 'free', 'hd'], hot: true, note: 'Curated, harder-to-find full scenes' },
  { id: 'nsfwbase', name: 'NSFWBase', url: 'https://www.nsfwbase.com', category: 'taboo', tags: ['free', 'tube'], hot: true, note: 'Multi-site search — one box searches dozens of tubes at once' },

  // ── major tubes with verified search patterns ──
  { id: 'xnxx', name: 'XNXX', url: 'https://www.xnxx.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], note: 'Huge catalog', su: 'https://www.xnxx.com/search/', sq: 'taboo', noFrame: true },
  { id: 'xv', name: 'xVideos', url: 'https://www.xvideos.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], note: 'Massive free library', su: 'https://www.xvideos.com/?k=', sq: 'taboo', noFrame: true },
  { id: 'ep', name: 'EPorner', url: 'https://www.eporner.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'hd', '4k', 'free'], note: 'HD & 4K free', su: 'https://www.eporner.com/search/', sq: 'taboo', noFrame: true },
  { id: 'hq', name: 'HQPorner', url: 'https://hqporner.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', '4k', 'free'], note: '4K available', su: 'https://hqporner.com/search/', sq: 'taboo', noFrame: true },
  { id: 'txxx', name: 'Txxx', url: 'https://txxx.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Large collection', su: 'https://txxx.com/search/', sq: 'taboo', noFrame: true },
  { id: 'beeg', name: 'Beeg', url: 'https://beeg.com', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Clean UI', su: 'https://beeg.com/sex/', sq: 'taboo', noFrame: true },
  { id: 'redtube', name: 'RedTube', url: 'https://www.redtube.com', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Classic tube', su: 'https://www.redtube.com/?search=', sq: 'taboo', noFrame: true },
  { id: 'youporn', name: 'YouPorn', url: 'https://www.youporn.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Large catalog', su: 'https://www.youporn.com/search/?query=', sq: 'taboo', noFrame: true },
  { id: 'drtuber', name: 'DrTuber', url: 'https://www.drtuber.com', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Good quality', su: 'https://www.drtuber.com/search/video?q=', sq: 'taboo', noFrame: true },
  { id: 'porntrex', name: 'PornTrex', url: 'https://www.porntrex.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Big catalog', su: 'https://www.porntrex.com/search/', sq: 'taboo', noFrame: true },
  { id: 'tube8', name: 'Tube8', url: 'https://www.tube8.com', category: 'taboo', tags: ['tube', 'free', 'classic'], note: 'Long-running mainstream tube' },
  { id: 'tnaflix', name: 'TNAFlix', url: 'https://www.tnaflix.com', category: 'taboo', tags: ['tube', 'free', 'classic'], note: 'Classic tube, deep archive' },
  { id: 'youjizz', name: 'Youjizz', url: 'https://www.youjizz.com', category: 'taboo', tags: ['tube', 'free', 'classic', 'amateur'], note: 'Long-running amateur-leaning tube' },
  { id: 'xozilla', name: 'Xozilla', url: 'https://www.xozilla.com', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'Clean modern tube, HD focus' },
  { id: 'zbporn', name: 'ZBPorn', url: 'https://zbporn.com', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'Well-organized categories, HD' },
  { id: 'ixxx', name: 'iXXX', url: 'https://www.ixxx.com', category: 'taboo', tags: ['tube', 'free'], note: 'Clean aggregator, wide catalog' },
  { id: 'anysex', name: 'AnySex', url: 'https://anysex.com', category: 'taboo', tags: ['tube', 'free', 'classic'], note: 'Long-running general tube' },
  { id: 'ifuqyou', name: 'iFuqYou', url: 'https://enwww.ifuqyou.com', category: 'taboo', tags: ['tube', 'free'], note: 'English-language version' },

  // ── femdom / fetish leaning ──
  { id: 'sxyprn', name: 'SXYPRN', url: 'https://www.sxyprn.com', category: 'taboo', tags: ['femdom', 'fetish', 'amateur', 'free'], note: 'Amateur-heavy, strong femdom & fetish tagging' },
  { id: 'heavyr', name: 'Heavy-R', url: 'https://www.heavy-r.com', category: 'taboo', tags: ['femdom', 'fetish', 'free'], note: 'Fetish-forward tube with a strong femdom section' },
  { id: 'analdin', name: 'Analdin', url: 'https://www.analdin.com', category: 'taboo', tags: ['fetish', 'tube', 'free'], note: 'Niche-focused tube' },

  // ── rest of the free tubes ──
  { id: 'pornmd', name: 'PornMD', url: 'https://www.pornmd.com', category: 'taboo', tags: ['tube', 'free', 'search'], note: 'Cross-tube search engine' },
  { id: 'playhdporn', name: 'PlayHDPorn', url: 'https://www.playhdporn.com', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'HD-focused tube' },
  { id: 'neporn', name: 'neporn', url: 'https://neporn.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'freepornvideos', name: 'FreePornVideos', url: 'https://www.freepornvideos.xxx', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'streamporn', name: 'StreamPorn', url: 'https://streamporn.org', category: 'taboo', tags: ['tube', 'free'], note: 'Streaming-focused tube' },
  { id: 'shyfap', name: 'ShyFap', url: 'https://www.shyfap.net', category: 'taboo', tags: ['tube', 'free', 'amateur'], note: 'Amateur-leaning tube' },
  { id: 'cums', name: 'CUMS', url: 'https://cums.net', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'someporn', name: 'SomePorn', url: 'https://some.porn', category: 'taboo', tags: ['tube', 'free', 'rare'], note: 'Rarer, smaller-catalog tube' },
  { id: 'topvid', name: 'TopVid', url: 'https://topvid.tv', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'okxxx', name: 'OK.XXX', url: 'https://ok.xxx', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'Clean modern tube' },
  { id: 'iporntv', name: 'iPornTV', url: 'https://iporntv.net', category: 'taboo', tags: ['tube', 'free'], note: 'Use an ad blocker here' },
  { id: 'pornobae', name: 'PornoBae', url: 'https://pornobae.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'jizzbunker', name: 'Jizzbunker', url: 'https://www.jizzbunker.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'pornken', name: 'pornken', url: 'https://pornken.com', category: 'taboo', tags: ['tube', 'free', 'rare'], note: 'Rarer, smaller-catalog tube' },
  { id: 'thepornarea', name: 'ThePornArea', url: 'https://thepornarea.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'porndish', name: 'Porndish', url: 'https://www.porndish.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'xmegadrive', name: 'xMegaDrive', url: 'https://www.xmegadrive.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'porndoe', name: 'Porndoe', url: 'https://porndoe.com', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'Clean modern tube' },
  { id: 'intporn', name: 'IntPorn', url: 'https://www.intporn.com', category: 'taboo', tags: ['community', 'free', 'amateur'], note: 'Forum & community, deep amateur archives' },
  { id: 'siska', name: 'Siska', url: 'https://siska.video', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'porndig', name: 'Porndig', url: 'https://www.porndig.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'xxdbx', name: 'xxdbx', url: 'https://xxdbx.com', category: 'taboo', tags: ['tube', 'free', 'rare'], note: 'Rarer, smaller-catalog tube' },
  { id: 'pornxpert', name: 'PornXpert', url: 'https://www.pornxpert.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'ask4porn', name: 'Ask4Porn', url: 'https://ask4porn.cc', category: 'taboo', tags: ['tube', 'free', 'search'], note: 'Aggregator-style search' },
  { id: 'pornhd3x', name: 'PornHD3x', url: 'https://www.pornhd3x.tv', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'HD-focused tube' },
  { id: 'cliphunter', name: 'ClipHunter', url: 'https://www.cliphunter.com', category: 'taboo', tags: ['tube', 'free', 'classic'], note: 'Long-running classic tube' },
  { id: 'sexvid', name: 'SexVid', url: 'https://www.sexvid.pro', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'superporn', name: 'SuperPorn', url: 'https://www.superporn.com', category: 'taboo', tags: ['tube', 'free'], note: 'General free tube' },
  { id: 'watchpornto', name: 'WatchPorn.to', url: 'https://watchporn.to', category: 'taboo', tags: ['tube', 'free', 'rare'], note: 'Rarer streaming-focused tube' },
  { id: 'porninja', name: 'Porninja', url: 'https://www.por.ninja', category: 'taboo', tags: ['tube', 'free', 'rare'], note: 'Rarer, smaller-catalog tube' },
];
