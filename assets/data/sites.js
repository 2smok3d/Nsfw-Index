/* ============================================================
   sites.js — the curated multi-site directory dataset.
   Pure data, no logic. Consumed by directory.js.

   Schema per entry:
     id        unique slug
     name      display name
     url       destination
     category  'stepfetish' | 'femdom' | 'mommydom' | 'stream' | 'clips'
     tags      string[] — used by the tag filter chips
     hot       true → rendered as a large hero card at top of section
     note      short description
     su        (optional) search-base url — a "search this site" icon
                appears on the card; clicking appends the current
                query (or `sq` default) via encodeURIComponent
     sq        (optional) default term used with `su` when the global
                search box is empty
   ============================================================ */

const CATEGORIES = [
  { id: 'stepfetish', label: 'Step Fetish & Taboo Family',   blurb: 'Stepmom, stepsis, taboo roleplay — the core obsession.' },
  { id: 'femdom',     label: 'Femdom & Domination',          blurb: 'Female-led power exchange, JOI, findom, humiliation.' },
  { id: 'mommydom',   label: 'Mommy Domme',                  blurb: 'Where MILF energy and domination collide.' },
  { id: 'stream',     label: 'Free Streaming',                blurb: 'General-purpose free tubes, worth keeping on hand.' },
  { id: 'clips',      label: 'Clips, Reels & GIFs',           blurb: 'Short-form, endless-scroll, and loopable content.' },
];

const SITES = [
  // ══════════════════ STEP FETISH & TABOO FAMILY ══════════════════
  { id:'sf-momvids', name:'MomVids', url:'https://www.momvids.com', category:'stepfetish', tags:['stepmom','dedicated'], hot:true, note:'Dedicated stepmom tube' },
  { id:'sf-mrbonham', name:'MrBonham', url:'https://www.mrbonham.com', category:'stepfetish', tags:['stepmom','classic'], hot:true, note:'Classic taboo site' },
  { id:'sf-mompov', name:'MomPOV', url:'https://www.mompov.com', category:'stepfetish', tags:['stepmom','pov'], hot:true, note:'POV stepmom focus' },
  { id:'sf-familystrokes', name:'FamilyStrokes', url:'https://familystrokes.com', category:'stepfetish', tags:['stepmom','premium','studio'], hot:true, note:'Premium taboo roleplay series' },
  { id:'sf-ph', name:'PornHub · Step Mom', url:'https://www.pornhub.com/category/step-mom', category:'stepfetish', tags:['stepmom','tube','free'], hot:true, note:'Massive stepmom library', su:'https://www.pornhub.com/video/search?search=', sq:'stepmom' },
  { id:'sf-xh', name:'xHamster · Stepmom', url:'https://xhamster.com/categories/stepmom', category:'stepfetish', tags:['stepmom','tube','free'], hot:true, note:'Top stepmom category', su:'https://xhamster.com/search/', sq:'stepmom' },
  { id:'sf-gp', name:'GoodPorn · Stepmom', url:'https://goodporn.to/?tag=stepmom', category:'stepfetish', tags:['stepmom','tube','free'], note:'Ad-light & clean', su:'https://goodporn.to/?s=', sq:'stepmom' },
  { id:'sf-sb', name:'SpankBang · Stepmom', url:'https://spankbang.com/tag/stepmom/', category:'stepfetish', tags:['stepmom','tube','free','hd'], note:'Great quality', su:'https://spankbang.com/s/', sq:'stepmom' },
  { id:'sf-sbtaboo', name:'SpankBang · Taboo', url:'https://spankbang.com/tag/taboo/', category:'stepfetish', tags:['taboo','tube','free'], note:'Broader taboo tag', su:'https://spankbang.com/s/', sq:'taboo' },
  { id:'sf-xnxx', name:'XNXX · Stepmom', url:'https://www.xnxx.com/search/stepmom', category:'stepfetish', tags:['stepmom','tube','free'], note:'Huge catalog', su:'https://www.xnxx.com/search/', sq:'stepmom' },
  { id:'sf-xnxxmilf', name:'XNXX · MILF', url:'https://www.xnxx.com/search/milf', category:'stepfetish', tags:['milf','tube','free'], note:'Massive MILF catalog', su:'https://www.xnxx.com/search/', sq:'milf' },
  { id:'sf-xv', name:'xVideos · Stepmom', url:'https://www.xvideos.com/?k=stepmom', category:'stepfetish', tags:['stepmom','tube','free'], note:'Large library', su:'https://www.xvideos.com/?k=', sq:'stepmom' },
  { id:'sf-xvmilf', name:'xVideos · MILF', url:'https://www.xvideos.com/?k=milf', category:'stepfetish', tags:['milf','tube','free'], note:'Massive MILF', su:'https://www.xvideos.com/?k=', sq:'milf' },
  { id:'sf-ep', name:'EPorner · Stepmom', url:'https://www.eporner.com/category/step-mom/', category:'stepfetish', tags:['stepmom','hd','4k','free'], note:'HD & 4K free', su:'https://www.eporner.com/search/', sq:'stepmom' },
  { id:'sf-epmilf', name:'EPorner · MILF', url:'https://www.eporner.com/category/milf/', category:'stepfetish', tags:['milf','hd','4k','free'], note:'HD & 4K free', su:'https://www.eporner.com/search/', sq:'milf' },
  { id:'sf-hq', name:'HQPorner · Stepmom', url:'https://hqporner.com/category/step-mom/', category:'stepfetish', tags:['stepmom','4k','free'], note:'4K available', su:'https://hqporner.com/search/', sq:'stepmom' },
  { id:'sf-hqmilf', name:'HQPorner · MILF', url:'https://hqporner.com/category/milf/', category:'stepfetish', tags:['milf','4k','free'], note:'4K available', su:'https://hqporner.com/search/', sq:'milf' },
  { id:'sf-phtaboo', name:'PornHub · Taboo', url:'https://www.pornhub.com/category/taboo', category:'stepfetish', tags:['taboo','tube','free'], note:'Taboo category', su:'https://www.pornhub.com/video/search?search=', sq:'taboo' },
  { id:'sf-phmilf', name:'PornHub · MILF', url:'https://www.pornhub.com/category/milf', category:'stepfetish', tags:['milf','tube','free'], note:'Massive MILF library', su:'https://www.pornhub.com/video/search?search=', sq:'milf' },
  { id:'sf-xhtaboo', name:'xHamster · Taboo', url:'https://xhamster.com/categories/taboo', category:'stepfetish', tags:['taboo','tube','free'], note:'Taboo collection', su:'https://xhamster.com/search/', sq:'taboo' },
  { id:'sf-xhmilf', name:'xHamster · MILF', url:'https://xhamster.com/categories/milf', category:'stepfetish', tags:['milf','tube','free'], note:'Top MILF category', su:'https://xhamster.com/search/', sq:'milf' },
  { id:'sf-txxx', name:'Txxx · Stepmom', url:'https://txxx.com/categories/stepmom/', category:'stepfetish', tags:['stepmom','tube','free'], note:'Large collection', su:'https://txxx.com/search/', sq:'stepmom' },
  { id:'sf-beeg', name:'Beeg · Stepmom', url:'https://beeg.com/videos/?q=stepmom', category:'stepfetish', tags:['stepmom','tube','free'], note:'Clean UI', su:'https://beeg.com/sex/', sq:'stepmom' },
  { id:'sf-vporn', name:'VPorn · Stepmom', url:'https://www.vporn.com/search/?q=stepmom', category:'stepfetish', tags:['stepmom','tube','free'], note:'Good catalog', su:'https://www.vporn.com/search/?q=', sq:'stepmom' },
  { id:'sf-bravo', name:'BravoTube · Stepmom', url:'https://bravotube.net/search/stepmom/', category:'stepfetish', tags:['stepmom','tube','free'], note:'Fast & clean', su:'https://bravotube.net/search/', sq:'stepmom' },
  { id:'sf-redtube', name:'RedTube · Stepmom', url:'https://www.redtube.com/?search=stepmom', category:'stepfetish', tags:['stepmom','tube','free'], note:'Classic tube', su:'https://www.redtube.com/?search=', sq:'stepmom' },
  { id:'sf-youporn', name:'YouPorn · Stepmom', url:'https://www.youporn.com/search/?query=stepmom', category:'stepfetish', tags:['stepmom','tube','free'], note:'Large catalog', su:'https://www.youporn.com/search/?query=', sq:'stepmom' },
  { id:'sf-hotmovs', name:'HotMovs · Stepmom', url:'https://hotmovs.com/search/?q=stepmom', category:'stepfetish', tags:['stepmom','tube','free','hd'], note:'HD free', su:'https://hotmovs.com/search/?q=', sq:'stepmom' },
  { id:'sf-drtuber', name:'DrTuber · Stepmom', url:'https://www.drtuber.com/search/video?q=stepmom', category:'stepfetish', tags:['stepmom','tube','free'], note:'Good quality', su:'https://www.drtuber.com/search/video?q=', sq:'stepmom' },
  { id:'sf-pornflip', name:'PornFlip · Stepmom', url:'https://pornflip.com/search/stepmom', category:'stepfetish', tags:['stepmom','tube','free','hd'], note:'HD streaming', su:'https://pornflip.com/search/', sq:'stepmom' },
  { id:'sf-porntrex', name:'PornTrex · Stepmom', url:'https://www.porntrex.com/search/stepmom/', category:'stepfetish', tags:['stepmom','tube','free'], note:'Big catalog', su:'https://www.porntrex.com/search/', sq:'stepmom' },
  { id:'sf-fuq', name:'Fuq · Stepmom', url:'https://www.fuq.com/search/?q=stepmom', category:'stepfetish', tags:['stepmom','tube','free','hd'], note:'Free HD', su:'https://www.fuq.com/search/?q=', sq:'stepmom' },

  // ══════════════════ FEMDOM & DOMINATION ══════════════════
  { id:'fd-c4s', name:'Clips4Sale', url:'https://www.clips4sale.com', category:'femdom', tags:['femdom','clip-store','findom','joi','premium'], hot:true, note:'The femdom & fetish clip marketplace — deepest catalog anywhere', su:'https://www.clips4sale.com/studios/search?keywords=', sq:'femdom' },
  { id:'fd-iwc', name:'iWantClips', url:'https://iwantclips.com', category:'femdom', tags:['femdom','clip-store','findom','joi','premium'], hot:true, note:'Findom, JOI & domination clips, huge creator base', su:'https://iwantclips.com/search?q=', sq:'femdom' },
  { id:'fd-kink', name:'Kink · Divine Bitches', url:'https://www.kink.com/channel/divinebitches', category:'femdom', tags:['femdom','studio','premium','bdsm'], hot:true, note:'Legendary dedicated femdom studio (subscription)' },
  { id:'fd-ph', name:'PornHub · Femdom', url:'https://www.pornhub.com/video/search?search=femdom', category:'femdom', tags:['femdom','tube','free'], hot:true, note:'Free femdom category', su:'https://www.pornhub.com/video/search?search=', sq:'femdom' },
  { id:'fd-xh', name:'xHamster · Femdom', url:'https://xhamster.com/categories/femdom', category:'femdom', tags:['femdom','tube','free'], note:'Top femdom category', su:'https://xhamster.com/search/', sq:'femdom' },
  { id:'fd-xhfindom', name:'xHamster · Findom', url:'https://xhamster.com/search/findom', category:'femdom', tags:['findom','tube','free'], note:'Financial domination clips', su:'https://xhamster.com/search/', sq:'findom' },
  { id:'fd-sb', name:'SpankBang · Femdom', url:'https://spankbang.com/tag/femdom/', category:'femdom', tags:['femdom','tube','free','hd'], note:'Great quality', su:'https://spankbang.com/s/', sq:'femdom' },
  { id:'fd-sbjoi', name:'SpankBang · JOI', url:'https://spankbang.com/tag/joi/', category:'femdom', tags:['joi','tube','free'], note:'Jerk-off instruction tag', su:'https://spankbang.com/s/', sq:'joi' },
  { id:'fd-xnxx', name:'XNXX · Femdom', url:'https://www.xnxx.com/search/femdom', category:'femdom', tags:['femdom','tube','free'], note:'Huge catalog', su:'https://www.xnxx.com/search/', sq:'femdom' },
  { id:'fd-xv', name:'xVideos · Femdom', url:'https://www.xvideos.com/?k=femdom', category:'femdom', tags:['femdom','tube','free'], note:'Large library', su:'https://www.xvideos.com/?k=', sq:'femdom' },
  { id:'fd-ep', name:'EPorner · Femdom', url:'https://www.eporner.com/search/femdom/', category:'femdom', tags:['femdom','hd','free'], note:'HD & 4K free', su:'https://www.eporner.com/search/', sq:'femdom' },
  { id:'fd-hq', name:'HQPorner · Femdom', url:'https://hqporner.com/search/femdom/', category:'femdom', tags:['femdom','4k','free'], note:'4K available', su:'https://hqporner.com/search/', sq:'femdom' },
  { id:'fd-txxx', name:'Txxx · Femdom', url:'https://txxx.com/search/femdom/', category:'femdom', tags:['femdom','tube','free'], note:'Large collection', su:'https://txxx.com/search/', sq:'femdom' },
  { id:'fd-thisvid', name:'ThisVid · Femdom', url:'https://thisvid.com/search/videos/?q=femdom', category:'femdom', tags:['femdom','tube','free','fetish'], note:'Deep fetish tagging', su:'https://thisvid.com/search/videos/?q=', sq:'femdom' },
  { id:'fd-manyvids', name:'ManyVids', url:'https://www.manyvids.com', category:'femdom', tags:['femdom','clip-store','creator','joi'], note:'Creator marketplace with a strong femdom scene', su:'https://www.manyvids.com/Search/Videos/?query=', sq:'femdom' },
  { id:'fd-loyalfans', name:'LoyalFans', url:'https://www.loyalfans.com', category:'femdom', tags:['femdom','creator','findom','subscription'], note:'Creator subscriptions, big findom/femdom presence' },
  { id:'fd-fetlife', name:'FetLife', url:'https://fetlife.com', category:'femdom', tags:['community','bdsm','findom'], note:'The kink community hub — not tube content, but essential' },
  { id:'fd-redtube', name:'RedTube · Femdom', url:'https://www.redtube.com/?search=femdom', category:'femdom', tags:['femdom','tube','free'], note:'Classic tube', su:'https://www.redtube.com/?search=', sq:'femdom' },
  { id:'fd-youporn', name:'YouPorn · Femdom', url:'https://www.youporn.com/search/?query=femdom', category:'femdom', tags:['femdom','tube','free'], note:'Large catalog', su:'https://www.youporn.com/search/?query=', sq:'femdom' },
  { id:'fd-hotmovs', name:'HotMovs · Femdom', url:'https://hotmovs.com/search/?q=femdom', category:'femdom', tags:['femdom','tube','free','hd'], note:'HD free', su:'https://hotmovs.com/search/?q=', sq:'femdom' },
  { id:'fd-bravo', name:'BravoTube · Femdom', url:'https://bravotube.net/search/femdom/', category:'femdom', tags:['femdom','tube','free'], note:'Fast & clean', su:'https://bravotube.net/search/', sq:'femdom' },
  { id:'fd-porntrex', name:'PornTrex · Femdom', url:'https://www.porntrex.com/search/femdom/', category:'femdom', tags:['femdom','tube','free'], note:'Big catalog', su:'https://www.porntrex.com/search/', sq:'femdom' },

  // ══════════════════ MOMMY DOMME ══════════════════
  { id:'md-ph', name:'PornHub · Mommy Domme', url:'https://www.pornhub.com/video/search?search=mommy+domme', category:'mommydom', tags:['mommydom','femdom','milf','tube','free'], hot:true, note:'The exact intersection, curated', su:'https://www.pornhub.com/video/search?search=', sq:'mommy domme' },
  { id:'md-xh', name:'xHamster · Mommy Domme', url:'https://xhamster.com/search/mommy%20domme', category:'mommydom', tags:['mommydom','femdom','milf','tube','free'], hot:true, note:'Strong niche tagging', su:'https://xhamster.com/search/', sq:'mommy domme' },
  { id:'md-c4s', name:'Clips4Sale · Mommy Domme', url:'https://www.clips4sale.com/studios/search?keywords=mommy%20domme', category:'mommydom', tags:['mommydom','clip-store','premium'], hot:true, note:'Deepest catalog for this exact niche', su:'https://www.clips4sale.com/studios/search?keywords=', sq:'mommy domme' },
  { id:'md-iwc', name:'iWantClips · Mommy Domme', url:'https://iwantclips.com/search?q=mommy%20domme', category:'mommydom', tags:['mommydom','clip-store','findom'], note:'Findom-leaning mommy content', su:'https://iwantclips.com/search?q=', sq:'mommy domme' },
  { id:'md-sb', name:'SpankBang · Mommy', url:'https://spankbang.com/s/mommy/', category:'mommydom', tags:['mommydom','tube','free','hd'], note:'Great quality', su:'https://spankbang.com/s/', sq:'mommy domme' },
  { id:'md-xnxx', name:'XNXX · Mommy Domme', url:'https://www.xnxx.com/search/mommy+domme', category:'mommydom', tags:['mommydom','tube','free'], note:'Huge catalog', su:'https://www.xnxx.com/search/', sq:'mommy domme' },
  { id:'md-xv', name:'xVideos · Mommy Domme', url:'https://www.xvideos.com/?k=mommy+domme', category:'mommydom', tags:['mommydom','tube','free'], note:'Large library', su:'https://www.xvideos.com/?k=', sq:'mommy domme' },
  { id:'md-ep', name:'EPorner · Mommy', url:'https://www.eporner.com/search/mommy/', category:'mommydom', tags:['mommydom','hd','free'], note:'HD & 4K free', su:'https://www.eporner.com/search/', sq:'mommy domme' },
  { id:'md-hq', name:'HQPorner · Mommy Domme', url:'https://hqporner.com/search/mommy%20domme/', category:'mommydom', tags:['mommydom','4k','free'], note:'4K available', su:'https://hqporner.com/search/', sq:'mommy domme' },
  { id:'md-txxx', name:'Txxx · Mommy', url:'https://txxx.com/search/mommy/', category:'mommydom', tags:['mommydom','tube','free'], note:'Large collection', su:'https://txxx.com/search/', sq:'mommy domme' },
  { id:'md-thisvid', name:'ThisVid · Mommy Domme', url:'https://thisvid.com/search/videos/?q=mommy+domme', category:'mommydom', tags:['mommydom','fetish','free'], note:'Deep fetish tagging', su:'https://thisvid.com/search/videos/?q=', sq:'mommy domme' },
  { id:'md-redtube', name:'RedTube · Mommy Domme', url:'https://www.redtube.com/?search=mommy+domme', category:'mommydom', tags:['mommydom','tube','free'], note:'Classic tube', su:'https://www.redtube.com/?search=', sq:'mommy domme' },
  { id:'md-youporn', name:'YouPorn · Mommy Domme', url:'https://www.youporn.com/search/?query=mommy+domme', category:'mommydom', tags:['mommydom','tube','free'], note:'Large catalog', su:'https://www.youporn.com/search/?query=', sq:'mommy domme' },
  { id:'md-hotmovs', name:'HotMovs · Mommy Domme', url:'https://hotmovs.com/search/?q=mommy+domme', category:'mommydom', tags:['mommydom','tube','free','hd'], note:'HD free', su:'https://hotmovs.com/search/?q=', sq:'mommy domme' },
  { id:'md-mompov', name:'MomPOV', url:'https://www.mompov.com', category:'mommydom', tags:['mommydom','pov','milf'], note:'POV mommy content, dedicated site' },
  { id:'md-familystrokes', name:'FamilyStrokes', url:'https://familystrokes.com', category:'mommydom', tags:['mommydom','premium','studio'], note:'Premium taboo/domme-adjacent roleplay' },

  // ══════════════════ FREE STREAMING ══════════════════
  { id:'st-ph', name:'PornHub', url:'https://www.pornhub.com', category:'stream', tags:['tube','free','general'], hot:true, note:"World's largest", su:'https://www.pornhub.com/video/search?search=' },
  { id:'st-xv', name:'xVideos', url:'https://www.xvideos.com', category:'stream', tags:['tube','free','general'], hot:true, note:'Massive free library', su:'https://www.xvideos.com/?k=' },
  { id:'st-xh', name:'xHamster', url:'https://xhamster.com', category:'stream', tags:['tube','free','general'], hot:true, su:'https://xhamster.com/search/' },
  { id:'st-gp', name:'GoodPorn', url:'https://goodporn.to', category:'stream', tags:['tube','free','general'], hot:true, note:'Ad-light · HD quality', su:'https://goodporn.to/?s=' },
  { id:'st-sb', name:'SpankBang', url:'https://spankbang.com', category:'stream', tags:['tube','free','hd'], su:'https://spankbang.com/s/' },
  { id:'st-xnxx', name:'XNXX', url:'https://www.xnxx.com', category:'stream', tags:['tube','free','general'], su:'https://www.xnxx.com/search/' },
  { id:'st-ep', name:'EPorner', url:'https://www.eporner.com', category:'stream', tags:['tube','free','4k'], note:'Free 4K', su:'https://www.eporner.com/search/' },
  { id:'st-hq', name:'HQPorner', url:'https://hqporner.com', category:'stream', tags:['tube','free','4k'], note:'HD/4K focus', su:'https://hqporner.com/search/' },
  { id:'st-beeg', name:'Beeg', url:'https://beeg.com', category:'stream', tags:['tube','free'], note:'Clean UI', su:'https://beeg.com/sex/' },
  { id:'st-txxx', name:'Txxx', url:'https://txxx.com', category:'stream', tags:['tube','free'], su:'https://txxx.com/search/' },
  { id:'st-vporn', name:'VPorn', url:'https://www.vporn.com', category:'stream', tags:['tube','free'], su:'https://www.vporn.com/search/?q=' },
  { id:'st-redtube', name:'RedTube', url:'https://www.redtube.com', category:'stream', tags:['tube','free'], note:'Classic tube' },
  { id:'st-youporn', name:'YouPorn', url:'https://www.youporn.com', category:'stream', tags:['tube','free'] },
  { id:'st-hotmovs', name:'HotMovs', url:'https://hotmovs.com', category:'stream', tags:['tube','free','hd'], note:'HD free' },
  { id:'st-nuvid', name:'Nuvid', url:'https://nuvid.com', category:'stream', tags:['tube','free'] },
  { id:'st-fuq', name:'Fuq', url:'https://www.fuq.com', category:'stream', tags:['tube','free'] },
  { id:'st-bravo', name:'BravoTube', url:'https://bravotube.net', category:'stream', tags:['tube','free'], note:'Clean & fast' },
  { id:'st-pornflip', name:'PornFlip', url:'https://pornflip.com', category:'stream', tags:['tube','free','hd'], note:'HD streaming' },
  { id:'st-pornerbros', name:'PornerBros', url:'https://www.pornerbros.com', category:'stream', tags:['tube','free'] },
  { id:'st-4tube', name:'4Tube', url:'https://www.4tube.com', category:'stream', tags:['tube','free'] },
  { id:'st-watchporn', name:'WatchPorn', url:'https://watchporn.to', category:'stream', tags:['tube','free','hd'], note:'Free HD streaming' },
  { id:'st-noodle', name:'Noodlemagazine', url:'https://noodlemagazine.com', category:'stream', tags:['tube','free'], note:'Fast HD · no account needed', su:'https://noodlemagazine.com/search/' },
  { id:'st-tnaflix', name:'TNAFlix', url:'https://www.tnaflix.com', category:'stream', tags:['tube','free'], note:'Classic big tube', su:'https://www.tnaflix.com/search/' },
  { id:'st-drtuber', name:'DrTuber', url:'https://www.drtuber.com', category:'stream', tags:['tube','free'], note:'Good quality catalog', su:'https://www.drtuber.com/search/video?q=' },
  { id:'st-porndoe', name:'Porndoe', url:'https://porndoe.com', category:'stream', tags:['tube','free','hd'], note:'HD focus', su:'https://porndoe.com/search/' },
  { id:'st-analdin', name:'Analdin', url:'https://analdin.com', category:'stream', tags:['tube','free'], note:'Large free catalog', su:'https://analdin.com/search/?q=' },
  { id:'st-youjizz', name:'Youjizz', url:'https://youjizz.com', category:'stream', tags:['tube','free'], note:'Classic tube' },
  { id:'st-ixxx', name:'iXXX', url:'https://ixxx.com', category:'stream', tags:['tube','free','meta-search'], note:'Multi-site search', su:'https://ixxx.com/search/?q=' },
  { id:'st-xozilla', name:'Xozilla', url:'https://www.xozilla.com', category:'stream', tags:['tube','free','hd'], note:'Free HD tube' },
  { id:'st-anysex', name:'AnySex', url:'https://anysex.com', category:'stream', tags:['tube','free'], note:'Big free catalog', su:'https://anysex.com/search/?q=' },
  { id:'st-cliphunter', name:'ClipHunter', url:'https://www.cliphunter.com', category:'stream', tags:['tube','free'], note:'Clips & full videos', su:'https://www.cliphunter.com/search?q=' },
  { id:'st-sexyporn', name:'SexyPorn', url:'https://sexyporn.tv', category:'stream', tags:['tube','free','hd'], note:'Free HD', su:'https://sexyporn.tv/search/' },
  { id:'st-pornmd', name:'PornMD', url:'https://www.pornmd.com', category:'stream', tags:['tube','free','meta-search'], note:'Multi-site meta-search', su:'https://www.pornmd.com/search?search=' },
  { id:'st-okxxx', name:'OK.XXX', url:'https://ok.xxx', category:'stream', tags:['tube','free'], note:'Free streaming', su:'https://ok.xxx/search/' },
  { id:'st-iporntv', name:'iPornTV', url:'https://iporntv.net', category:'stream', tags:['tube','free'], note:'Free tube · use an ad-blocker' },
  { id:'st-hotmovix', name:'Hotmovix', url:'https://hotmovix.com', category:'stream', tags:['tube','free','hd'], note:'Free HD streaming' },
  { id:'st-porndig', name:'Porndig', url:'https://porndig.com', category:'stream', tags:['tube','free'], note:'Free tube', su:'https://porndig.com/search/' },
  { id:'st-shyfap', name:'ShyFap', url:'https://shyfap.com', category:'stream', tags:['tube','free','hd'], note:'Free HD tube' },
  { id:'st-mrjerk', name:'MrJerk', url:'https://www.mrjerk.com', category:'stream', tags:['tube','free'], note:'Free tube' },
  { id:'st-porninja', name:'Porninja', url:'https://porninja.com', category:'stream', tags:['tube','free'], note:'Premium-style free streaming' },
  { id:'st-sexvid', name:'SexVid', url:'https://www.sexvid.xxx', category:'stream', tags:['tube','free'], note:'Free clips & videos' },
  { id:'st-pornhoarder', name:'PornHoarder', url:'https://pornhoarder.tv', category:'stream', tags:['tube','free','hd'], note:'Free HD catalog' },
  { id:'st-erotic', name:'EroticMovies', url:'https://www.eroticmovies.xxx', category:'stream', tags:['tube','free','softcore'], note:'Softcore & erotic' },
  { id:'st-playhd', name:'PlayHDPorn', url:'https://playhdporn.com', category:'stream', tags:['tube','free','hd'], note:'HD free streaming' },

  // ══════════════════ CLIPS, REELS & GIFS ══════════════════
  { id:'cl-redgifs', name:'RedGIFs', url:'https://www.redgifs.com', category:'clips', tags:['gifs','clips','free'], hot:true, note:'GIFs & short clips', su:'https://www.redgifs.com/search/' },
  { id:'cl-scrolller', name:'Scrolller', url:'https://scrolller.com/r/nsfw', category:'clips', tags:['scroll','free'], note:'Infinite NSFW scroll' },
  { id:'cl-thisvid', name:'ThisVid', url:'https://thisvid.com', category:'clips', tags:['tube','fetish','free'], su:'https://thisvid.com/search/videos/?q=' },
  { id:'cl-pmvhaven', name:'PMV Haven', url:'https://pmvhaven.com', category:'clips', tags:['pmv','edits','free'], note:'Music video edits' },
  { id:'cl-tube8', name:'Tube8', url:'https://www.tube8.com', category:'clips', tags:['clips','free'], note:'Short clips' },
  { id:'cl-porntrex', name:'PornTrex', url:'https://www.porntrex.com', category:'clips', tags:['tube','free'] },
];
