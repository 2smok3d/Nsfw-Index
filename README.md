# Noir Index

A private, self-contained adult link index — no backend, no accounts, no tracking. A **single-page app**: one HTML shell (`index.html`), every section is a client-side route, navigation never triggers a full page reload. Everything is static HTML/CSS/vanilla JS and every setting lives in your own browser's `localStorage`.

Built around one focus: **step fetish, femdom, and mommy domme**, with a personal Google Drive-backed library and full Handy device control alongside it.

## Routes

One page, six sections, addressed by hash (`index.html#/directory`, etc.) so the back/forward buttons and bookmarks work normally without ever reloading the app shell:

| Route | Purpose |
|---|---|
| `#/` | Hub — a big search bar front and center in the hero, the Taboo directory as the primary banner, everything else (Library/Handy/Tools) secondary |
| `#/directory` | The curated Taboo directory: text filter, tag chips, favorites, usage-based "Most Visited" ranking — 58 free sites, one card per site, links go to each site's homepage, no paywalled entries |
| `#/search` | In-app multi-site search — type once, flip between every searchable site's live results as tabs, all inside the app (see below) |
| `#/library` | Your own video library, read live from Google Drive — folder browsing, inline preview, per-file tags, direct download |
| `#/handy` | Full control panel for The Handy over its official public REST API (manual mode, stroke range, script sync), plus curated interactive/script resources |
| `#/tools` | Downloaders (yt-dlp & friends) and self-hosted media server recommendations |
| `#/settings` | Drive API key & folders, Handy connection key, density/landing-page prefs, tag manager, JSON backup/restore, full reset |

The old separate files (`directory.html`, `library.html`, `handy.html`, `tools.html`, `settings.html`) still exist as one-line redirects to their `index.html#/route` equivalent, so any existing bookmarks or home-screen icons keep working.

## Design

"Noir Boudoir" — obsidian black, antique gold, deep crimson. Serif display type for headings, system fonts throughout (no external font/CDN requests — the whole app works offline once loaded, e.g. via GitHub Pages or a plain `file://` open). Layered shadows, gradient hairlines, and a fine film-grain texture give it depth instead of flat digital gradients.

## Premium features

- **True single-page app** — one load, then every navigation (header nav, mobile tab bar, command palette, in-app links) is instant, client-side, and reload-free. The age gate, header, and tab bar are built once and never re-rendered.
- **In-app multi-site search** (`#/search`) — search once, then flip between every searchable site's results as tabs inside a full-screen viewer. Every card's own "search this site" icon lands here too, pre-selecting that site's tab. 24 sites are wired up with a search URL; **Youjizz and OK.XXX are the two confirmed to actually embed** and load real results right inside the app — every other major tube tested (PornHub, xHamster, SpankBang, XNXX, xVideos, EPorner, HQPorner, Txxx, Beeg, RedTube, YouPorn, DrTuber, PornTrex, Tube8, Xozilla, ZBPorn, iXXX, AnySex, Heavy-R, PornMD, Porndoe, Ask4Porn) sets `X-Frame-Options`/CSP to block being embedded in someone else's page, a platform restriction this app can't override. Those 22 are marked `noFrame` and open a real tab with your search pre-filled instead of showing a dead blank box, with a clear in-app panel explaining why. Youjizz loads first by default since it's confirmed working. The CI smoke test clicks through every claimed-frameable tab on every push and fails the build if one turns out to actually be blocked, so this can't silently regress — that's also how new candidates get verified: add a `su` without `noFrame`, push, and CI's real internet access reports back which ones are genuine.
- **Most Visited** — the directory quietly tracks which sites you actually click (locally, nothing leaves the browser) and promotes them to the top hero row with a "🔥 Most Visited" badge, pushing the rest of the grid into the same order. Curated picks are just the starting point until your own usage takes over.
- **Command palette** (`⌘K` / `Ctrl+K`, anywhere) — jump to any section instantly or fuzzy-search the whole Taboo directory without leaving where you are.
- **Continue Watching** — the homepage surfaces your in-progress videos from My Library with a Netflix-style progress bar.
- **Bulk tagging** — tag every visible video in My Library in one action instead of one file at a time.
- **Mobile bottom tab bar** — on phones, a persistent native-app-style tab bar (Home / Directory / Library / Handy / More) replaces a hamburger. "More" opens a full sheet with Tools, Settings, and a one-tap Quick Search into the command palette.

## Setting up your Drive library

1. Create a Google Cloud API key restricted to the **Drive API** ([console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)).
2. Share your Drive folder(s) as **"Anyone with the link — Viewer."**
3. In Settings, paste the API key and add each folder's ID (the string after `/folders/` in its URL).
4. Open My Library — your videos load directly from Drive, client-side. Nothing passes through any third-party server.

## Setting up The Handy

1. Open the Handy app, copy your Connection Key from Settings.
2. Paste it into The Handy or Settings.
3. Control manual mode, stroke range, and best-effort script sync directly from the browser, using Handy's own public API (`handyfeeling.com/api/handy/v2`).

## Notes

- Nothing here is sent to any server other than the ones you explicitly configure (Google Drive, Handy) or the destination sites you click through to.
- Age-gated on first visit per browser (`localStorage`-based, not a real verification mechanism).
- All data — favorites, tags, keys — can be exported/imported as a single JSON file from Settings.
- Not every directory entry has the in-app "search this site" icon wired up — only sites whose search-URL pattern is confidently known get one, rather than guessing and silently shipping a broken search. Adding it for a specific site is a one-line change in `assets/data/sites.js` (the `su` field) once the right pattern is known.
