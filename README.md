# Noir Index

A private, self-contained adult site directory — no backend, no accounts, no tracking. A **single-page app**: one HTML shell (`index.html`), every section is a client-side route, navigation never triggers a full page reload. Everything is static HTML/CSS/vanilla JS and every setting lives in your own browser's `localStorage`.

Built around one focus: **step fetish, femdom, and mommy domme** — a curated directory of free webpages and a search that reaches into all of them at once.

## Routes

One page, five sections, addressed by hash (`index.html#/directory`, etc.) so the back/forward buttons and bookmarks work normally without ever reloading the app shell:

| Route | Purpose |
|---|---|
| `#/` | Hub — a big search bar front and center in the hero, the Taboo directory as the primary banner |
| `#/directory` | The curated Taboo directory: text filter, tag chips, favorites, usage-based "Most Visited" ranking — 58 free sites, one card per site, links go to each site's homepage, no paywalled entries |
| `#/search` | In-app multi-site search — type once, flip between every searchable site's live results as tabs, all inside the app (see below) |
| `#/tools` | Downloaders (yt-dlp & friends) and self-hosted media server recommendations |
| `#/settings` | Density/landing-page prefs, JSON backup/restore, full reset |

The old separate files (`directory.html`, `tools.html`, `settings.html`) still exist as one-line redirects to their `index.html#/route` equivalent, so any existing bookmarks or home-screen icons keep working.

## Design

"Noir Boudoir" — obsidian black, antique gold, deep crimson. Serif display type for headings, system fonts throughout (no external font/CDN requests — the whole app works offline once loaded, e.g. via GitHub Pages or a plain `file://` open). Layered shadows, gradient hairlines, and a fine film-grain texture give it depth instead of flat digital gradients.

## Premium features

- **True single-page app** — one load, then every navigation (header nav, mobile tab bar, command palette, in-app links) is instant, client-side, and reload-free. The age gate, header, and tab bar are built once and never re-rendered.
- **In-app multi-site search** (`#/search`) — search once, then flip between every searchable site's results as tabs inside a full-screen viewer. Every card's own "search this site" icon lands here too, pre-selecting that site's tab. 24 sites are wired up with a search URL; **Youjizz and OK.XXX are the two confirmed to actually embed** and load real results right inside the app — every other major tube tested (PornHub, xHamster, SpankBang, XNXX, xVideos, EPorner, HQPorner, Txxx, Beeg, RedTube, YouPorn, DrTuber, PornTrex, Tube8, Xozilla, ZBPorn, iXXX, AnySex, Heavy-R, PornMD, Porndoe, Ask4Porn) sets `X-Frame-Options`/CSP to block being embedded in someone else's page, a platform restriction this app can't override. Those 22 are marked `noFrame` and open a real tab with your search pre-filled instead of showing a dead blank box, with a clear in-app panel explaining why. Youjizz loads first by default since it's confirmed working. The CI smoke test clicks through every claimed-frameable tab on every push and fails the build if one turns out to actually be blocked, so this can't silently regress — that's also how new candidates get verified: add a `su` without `noFrame`, push, and CI's real internet access reports back which ones are genuine.
- **Most Visited** — the directory quietly tracks which sites you actually click (locally, nothing leaves the browser) and promotes them to the top hero row with a "🔥 Most Visited" badge, pushing the rest of the grid into the same order. Curated picks are just the starting point until your own usage takes over.
- **Command palette** (`⌘K` / `Ctrl+K`, anywhere, including a tap on mobile) — jump to any section instantly or fuzzy-search the whole Taboo directory without leaving where you are.
- **Mobile bottom tab bar** — on phones, a persistent native-app-style tab bar (Home / Directory / Search / Tools / Settings) replaces a hamburger. With only five sections, everything fits directly — no "More" bucket needed.

## Notes

- Nothing here is sent to any server other than the destination sites you click through to.
- Age-gated on first visit per browser (`localStorage`-based, not a real verification mechanism).
- All data — favorites, most-visited stats, preferences — can be exported/imported as a single JSON file from Settings.
- Not every directory entry has the in-app "search this site" icon wired up — only sites whose search-URL pattern is confidently known get one, rather than guessing and silently shipping a broken search. Adding it for a specific site is a one-line change in `assets/data/sites.js` (the `su` field) once the right pattern is known.
