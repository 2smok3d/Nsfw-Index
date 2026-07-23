/* ============================================================
   sites.js — the curated directory dataset.
   Pure data, no logic. Consumed by directory.js.

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
               hero row automatically — see directory.js)
     note      short description
     su        (optional) search-base url — a "search this site"
                icon appears on the card; clicking appends the
                current query (or `sq` default) via encodeURIComponent
     sq        (optional) default term used with `su` when the
                global search box is empty
   ============================================================ */

const CATEGORIES = [
  { id: 'taboo', label: 'Taboo', blurb: 'Step fetish, femdom, and mommy domme — the whole focus, one list. Free sites only.' },
];

const SITES = [
  // ── featured ──
  { id: 'momvids', name: 'MomVids', url: 'https://www.momvids.com', category: 'taboo', tags: ['taboo', 'stepmom', 'dedicated', 'free'], hot: true, note: 'Dedicated stepmom tube' },
  { id: 'ph', name: 'PornHub', url: 'https://www.pornhub.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], hot: true, note: 'Massive taboo, stepmom & femdom library', su: 'https://www.pornhub.com/video/search?search=', sq: 'taboo' },
  { id: 'xh', name: 'xHamster', url: 'https://xhamster.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], hot: true, note: 'Top taboo category', su: 'https://xhamster.com/search/', sq: 'taboo' },
  { id: 'sb', name: 'SpankBang', url: 'https://spankbang.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'joi', 'tube', 'free', 'hd'], hot: true, note: 'Great quality across the board', su: 'https://spankbang.com/s/', sq: 'taboo' },

  // ── the rest of the free tubes ──
  { id: 'xnxx', name: 'XNXX', url: 'https://www.xnxx.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], note: 'Huge catalog', su: 'https://www.xnxx.com/search/', sq: 'taboo' },
  { id: 'xv', name: 'xVideos', url: 'https://www.xvideos.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], note: 'Massive free library', su: 'https://www.xvideos.com/?k=', sq: 'taboo' },
  { id: 'ep', name: 'EPorner', url: 'https://www.eporner.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'hd', '4k', 'free'], note: 'HD & 4K free', su: 'https://www.eporner.com/search/', sq: 'taboo' },
  { id: 'hq', name: 'HQPorner', url: 'https://hqporner.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', '4k', 'free'], note: '4K available', su: 'https://hqporner.com/search/', sq: 'taboo' },
  { id: 'txxx', name: 'Txxx', url: 'https://txxx.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Large collection', su: 'https://txxx.com/search/', sq: 'taboo' },
  { id: 'thisvid', name: 'ThisVid', url: 'https://thisvid.com', category: 'taboo', tags: ['taboo', 'femdom', 'fetish', 'tube', 'free'], note: 'Deep fetish tagging', su: 'https://thisvid.com/search/videos/?q=', sq: 'taboo' },
  { id: 'beeg', name: 'Beeg', url: 'https://beeg.com', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Clean UI', su: 'https://beeg.com/sex/', sq: 'taboo' },
  { id: 'vporn', name: 'VPorn', url: 'https://www.vporn.com', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Good catalog', su: 'https://www.vporn.com/search/?q=', sq: 'taboo' },
  { id: 'bravotube', name: 'BravoTube', url: 'https://bravotube.net', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Fast & clean', su: 'https://bravotube.net/search/', sq: 'taboo' },
  { id: 'redtube', name: 'RedTube', url: 'https://www.redtube.com', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Classic tube', su: 'https://www.redtube.com/?search=', sq: 'taboo' },
  { id: 'youporn', name: 'YouPorn', url: 'https://www.youporn.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Large catalog', su: 'https://www.youporn.com/search/?query=', sq: 'taboo' },
  { id: 'hotmovs', name: 'HotMovs', url: 'https://hotmovs.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free', 'hd'], note: 'HD free', su: 'https://hotmovs.com/search/?q=', sq: 'taboo' },
  { id: 'drtuber', name: 'DrTuber', url: 'https://www.drtuber.com', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Good quality', su: 'https://www.drtuber.com/search/video?q=', sq: 'taboo' },
  { id: 'pornflip', name: 'PornFlip', url: 'https://pornflip.com', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free', 'hd'], note: 'HD streaming', su: 'https://pornflip.com/search/', sq: 'taboo' },
  { id: 'porntrex', name: 'PornTrex', url: 'https://www.porntrex.com', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Big catalog', su: 'https://www.porntrex.com/search/', sq: 'taboo' },
  { id: 'fuq', name: 'Fuq', url: 'https://www.fuq.com', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free', 'hd'], note: 'Free HD', su: 'https://www.fuq.com/search/?q=', sq: 'taboo' },

  // ── expansion: higher quality, more popular & rarer free finds ──
  { id: 'noodle', name: 'Noodlemagazine', url: 'https://noodlemagazine.com', category: 'taboo', tags: ['taboo', 'tube', 'free', 'hd'], hot: true, note: 'Huge free library, consistently well-rated' },
  { id: 'pornhoarder', name: 'PornHoarder', url: 'https://pornhoarder.tv', category: 'taboo', tags: ['tube', 'free', 'hd'], hot: true, note: 'Curated, harder-to-find full scenes' },
  { id: 'nsfwbase', name: 'NSFWBase', url: 'https://www.nsfwbase.com', category: 'taboo', tags: ['free', 'tube'], hot: true, note: 'Multi-site search — one box searches dozens of tubes at once' },
  { id: 'sxyprn', name: 'SXYPRN', url: 'https://www.sxyprn.com', category: 'taboo', tags: ['femdom', 'fetish', 'amateur', 'free'], note: 'Amateur-heavy, strong femdom & fetish tagging' },
  { id: 'heavyr', name: 'Heavy-R', url: 'https://www.heavy-r.com', category: 'taboo', tags: ['femdom', 'fetish', 'free'], note: 'Fetish-forward tube with a strong femdom section' },
  { id: 'ixxx', name: 'iXXX', url: 'https://www.ixxx.com', category: 'taboo', tags: ['tube', 'free'], note: 'Clean aggregator, wide catalog' },
  { id: 'tube8', name: 'Tube8', url: 'https://www.tube8.com', category: 'taboo', tags: ['tube', 'free', 'classic'], note: 'Long-running mainstream tube' },
  { id: 'tnaflix', name: 'TNAFlix', url: 'https://www.tnaflix.com', category: 'taboo', tags: ['tube', 'free', 'classic'], note: 'Classic tube, deep archive' },
  { id: 'youjizz', name: 'Youjizz', url: 'https://www.youjizz.com', category: 'taboo', tags: ['tube', 'free', 'classic', 'amateur'], note: 'Long-running amateur-leaning tube' },
  { id: 'xozilla', name: 'Xozilla', url: 'https://www.xozilla.com', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'Clean modern tube, HD focus' },
  { id: 'zbporn', name: 'ZBPorn', url: 'https://zbporn.com', category: 'taboo', tags: ['tube', 'free', 'hd'], note: 'Well-organized categories, HD' },
  { id: 'ifuqyou', name: 'iFuqYou', url: 'https://enwww.ifuqyou.com', category: 'taboo', tags: ['tube', 'free'], note: 'English-language version' },
];
