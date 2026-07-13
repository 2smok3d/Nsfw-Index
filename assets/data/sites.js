/* ============================================================
   sites.js — the curated directory dataset.
   Pure data, no logic. Consumed by directory.js.

   One category by design — Taboo (step fetish, femdom, mommy
   domme all live here, distinguished by tags, not sections).
   Free sites only — no paywalled/subscription entries.

   Schema per entry:
     id        unique slug
     name      display name
     url       destination
     category  always 'taboo'
     tags      string[] — used by the tag filter chips
     hot       true → rendered as a large hero card at top
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
  { id: 'mrbonham', name: 'MrBonham', url: 'https://www.mrbonham.com', category: 'taboo', tags: ['taboo', 'stepmom', 'classic', 'free'], hot: true, note: 'Classic taboo site' },
  { id: 'ph', name: 'PornHub · Taboo', url: 'https://www.pornhub.com/category/taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], hot: true, note: 'Massive taboo, stepmom & femdom library', su: 'https://www.pornhub.com/video/search?search=', sq: 'taboo' },
  { id: 'xh', name: 'xHamster · Taboo', url: 'https://xhamster.com/categories/taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], hot: true, note: 'Top taboo category', su: 'https://xhamster.com/search/', sq: 'taboo' },
  { id: 'goodporn', name: 'GoodPorn · Stepmom', url: 'https://goodporn.to/?tag=stepmom', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], hot: true, note: 'Ad-light & clean', su: 'https://goodporn.to/?s=', sq: 'taboo' },
  { id: 'sb', name: 'SpankBang · Taboo', url: 'https://spankbang.com/tag/taboo/', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'joi', 'tube', 'free', 'hd'], hot: true, note: 'Great quality across the board', su: 'https://spankbang.com/s/', sq: 'taboo' },

  // ── the rest of the free tubes ──
  { id: 'xnxx', name: 'XNXX', url: 'https://www.xnxx.com/search/taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], note: 'Huge catalog', su: 'https://www.xnxx.com/search/', sq: 'taboo' },
  { id: 'xv', name: 'xVideos', url: 'https://www.xvideos.com/?k=taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'milf', 'tube', 'free'], note: 'Massive free library', su: 'https://www.xvideos.com/?k=', sq: 'taboo' },
  { id: 'ep', name: 'EPorner', url: 'https://www.eporner.com/search/taboo/', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'hd', '4k', 'free'], note: 'HD & 4K free', su: 'https://www.eporner.com/search/', sq: 'taboo' },
  { id: 'hq', name: 'HQPorner', url: 'https://hqporner.com/search/taboo/', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', '4k', 'free'], note: '4K available', su: 'https://hqporner.com/search/', sq: 'taboo' },
  { id: 'txxx', name: 'Txxx', url: 'https://txxx.com/search/taboo/', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Large collection', su: 'https://txxx.com/search/', sq: 'taboo' },
  { id: 'thisvid', name: 'ThisVid', url: 'https://thisvid.com/search/videos/?q=taboo', category: 'taboo', tags: ['taboo', 'femdom', 'fetish', 'tube', 'free'], note: 'Deep fetish tagging', su: 'https://thisvid.com/search/videos/?q=', sq: 'taboo' },
  { id: 'beeg', name: 'Beeg', url: 'https://beeg.com/videos/?q=taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Clean UI', su: 'https://beeg.com/sex/', sq: 'taboo' },
  { id: 'vporn', name: 'VPorn', url: 'https://www.vporn.com/search/?q=taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Good catalog', su: 'https://www.vporn.com/search/?q=', sq: 'taboo' },
  { id: 'bravotube', name: 'BravoTube', url: 'https://bravotube.net/search/taboo/', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Fast & clean', su: 'https://bravotube.net/search/', sq: 'taboo' },
  { id: 'redtube', name: 'RedTube', url: 'https://www.redtube.com/?search=taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Classic tube', su: 'https://www.redtube.com/?search=', sq: 'taboo' },
  { id: 'youporn', name: 'YouPorn', url: 'https://www.youporn.com/search/?query=taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Large catalog', su: 'https://www.youporn.com/search/?query=', sq: 'taboo' },
  { id: 'hotmovs', name: 'HotMovs', url: 'https://hotmovs.com/search/?q=taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free', 'hd'], note: 'HD free', su: 'https://hotmovs.com/search/?q=', sq: 'taboo' },
  { id: 'drtuber', name: 'DrTuber', url: 'https://www.drtuber.com/search/video?q=taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free'], note: 'Good quality', su: 'https://www.drtuber.com/search/video?q=', sq: 'taboo' },
  { id: 'pornflip', name: 'PornFlip', url: 'https://pornflip.com/search/taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free', 'hd'], note: 'HD streaming', su: 'https://pornflip.com/search/', sq: 'taboo' },
  { id: 'porntrex', name: 'PornTrex', url: 'https://www.porntrex.com/search/taboo/', category: 'taboo', tags: ['taboo', 'stepmom', 'femdom', 'tube', 'free'], note: 'Big catalog', su: 'https://www.porntrex.com/search/', sq: 'taboo' },
  { id: 'fuq', name: 'Fuq', url: 'https://www.fuq.com/search/?q=taboo', category: 'taboo', tags: ['taboo', 'stepmom', 'tube', 'free', 'hd'], note: 'Free HD', su: 'https://www.fuq.com/search/?q=', sq: 'taboo' },
];
