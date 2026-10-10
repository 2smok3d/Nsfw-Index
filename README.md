# Noir Index

A private, self-contained adult site directory — no backend, no accounts, no tracking. A **single-page app**: one HTML shell (`index.html`), every section is a client-side route, navigation never triggers a full page reload. Everything is static HTML/CSS/vanilla JS and every preference lives in your own browser's `localStorage`.

Built around one focus: **step fetish, femdom, and mommy domme**, with two things at the center of the app — **search** (rank every free site locally, or fan out to each site's own real search in a tap) and **bookmarks** (save specific videos you find, including one-click capture via a bookmarklet).

## Routes

One page, four sections, addressed by hash (`index.html#/directory`, etc.) so the back/forward buttons and bookmarks work normally without ever reloading the app shell:

| Route | Purpose |
|---|---|
| `#/` | Hub — a big search bar front and center in the hero, pointing straight at Search and Bookmarks |
| `#/search` | The app's single search box: ranks every site in the directory locally by relevance, surfaces any of your own bookmarked videos that match, and offers one-tap links that open the same query on every site's own real search, each in a new tab |
| `#/bookmarks` | Save specific videos — paste a link, or drag the bookmarklet into your bookmarks bar and click it on any video page to capture its real title automatically. Tag and filter them as the list grows. |
| `#/directory` | The curated Taboo directory: text filter, tag chips, usage-based "Most Visited" ranking — 57 free sites, one card per site, links go to each site's homepage, no paywalled entries |

The old separate files (`directory.html`, `tools.html`, `settings.html`) still exist as one-line redirects, so any existing bookmarks or home-screen icons keep working — the retired Tools and Settings sections now redirect to the home route.

## Design

"Noir Boudoir" — obsidian black, antique gold, deep crimson. Serif display type for headings, system fonts throughout (no external font/CDN requests — the whole app works offline once loaded, e.g. via GitHub Pages or a plain `file://` open). Layered shadows, gradient hairlines, and a fine film-grain texture give it depth instead of flat digital gradients.

## Premium features

- **True single-page app** — one load, then every navigation (header nav, mobile tab bar, command palette, in-app links) is instant, client-side, and reload-free. The age gate, header, and tab bar are built once and never re-rendered.
- **One search, two ways out** (`#/search`) — a local index (names, tags, categories, notes, plus your own bookmarked videos) ranks results instantly, no fetching or embedding involved. Alongside it, "open this search on every site" turns the same query into one real link per site (`known search-URL pattern + your term`), each opening that site's own live results in a new tab — the app never loads another site's page itself, it just hands you the door.
- **Bookmarks with a bookmarklet** (`#/bookmarks`) — paste a video's link to save it, or drag the "♥ Save to Noir Index" bookmarklet into your bookmarks bar once; clicking it while viewing any video reads that page's own `<title>`/`og:` tags (same-origin, in your browser, triggered by you — not a fetch this app performs) and opens the bookmark form here pre-filled. Tag bookmarks and filter by tag as the list grows. Saved videos also surface automatically in Search when they match your query.
- **Most Visited** — the directory quietly tracks which sites you actually click (locally, nothing leaves the browser) and promotes them to the top hero row with a "🔥 Most Visited" badge, pushing the rest of the grid into the same order. Curated picks are just the starting point until your own usage takes over.
- **Command palette** (`⌘K` / `Ctrl+K`, anywhere, including a tap on mobile) — jump to any section instantly or fuzzy-search the whole Taboo directory without leaving where you are.
- **Mobile bottom tab bar** — on phones, a persistent native-app-style tab bar (Home / Directory / Search / Saved) replaces a hamburger. With only four sections, everything fits directly — no "More" bucket needed.

## Notes

- Nothing here is sent to any server other than the destination sites you click through to (and a best-effort favicon request per site icon, from Google's public favicon service).
- The multi-site "open search" links only ever construct a URL and open it in a new tab — this app never fetches, embeds, or displays another site's content itself.
- Age-gated on first visit per browser (`localStorage`-based, not a real verification mechanism).
- All data — video bookmarks and most-visited stats — lives only in this browser's `localStorage`; clearing site data clears it.
