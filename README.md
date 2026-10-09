# Noir Index

A private, self-contained adult site directory — no backend, no accounts, no tracking. A **single-page app**: one HTML shell (`index.html`), every section is a client-side route, navigation never triggers a full page reload. Everything is static HTML/CSS/vanilla JS and every preference lives in your own browser's `localStorage`.

Built around one focus: **step fetish, femdom, and mommy domme** — a curated directory of free webpages and one search that ranks all of them at once, entirely inside the app.

## Routes

One page, four sections, addressed by hash (`index.html#/directory`, etc.) so the back/forward buttons and bookmarks work normally without ever reloading the app shell:

| Route | Purpose |
|---|---|
| `#/` | Hub — a big search bar front and center in the hero, the Taboo directory as the primary banner |
| `#/directory` | The curated Taboo directory: text filter, tag chips, usage-based "Most Visited" ranking — 57 free sites, one card per site, links go to each site's homepage, no paywalled entries |
| `#/search` | The app's single search — type once, every site in the directory is ranked locally by relevance and shown as a card; tap a card to open that site directly in a new tab |
| `#/bookmarks` | Paste the link to a specific video you want to find again — saved locally, nothing fetched |

The old separate files (`directory.html`, `tools.html`, `settings.html`) still exist as one-line redirects, so any existing bookmarks or home-screen icons keep working — the retired Tools and Settings sections now redirect to the home route.

## Design

"Noir Boudoir" — obsidian black, antique gold, deep crimson. Serif display type for headings, system fonts throughout (no external font/CDN requests — the whole app works offline once loaded, e.g. via GitHub Pages or a plain `file://` open). Layered shadows, gradient hairlines, and a fine film-grain texture give it depth instead of flat digital gradients.

## Premium features

- **True single-page app** — one load, then every navigation (header nav, mobile tab bar, command palette, in-app links) is instant, client-side, and reload-free. The age gate, header, and tab bar are built once and never re-rendered.
- **One unified search** (`#/search`) — a single local index (names, tags, categories, notes) ranks the entire directory instantly as you type. Nothing is embedded, proxied, or fetched from another site — every result card is a real link that opens that site directly. This is the one source every search routes through.
- **Most Visited** — the directory quietly tracks which sites you actually click (locally, nothing leaves the browser) and promotes them to the top hero row with a "🔥 Most Visited" badge, pushing the rest of the grid into the same order. Curated picks are just the starting point until your own usage takes over.
- **Bookmarks** (`#/bookmarks`) — paste the link to a specific video, give it a title and note, and it's saved locally as a card you can reopen any time. The app never fetches or previews the link — just what you typed in.
- **Command palette** (`⌘K` / `Ctrl+K`, anywhere, including a tap on mobile) — jump to any section instantly or fuzzy-search the whole Taboo directory without leaving where you are.
- **Mobile bottom tab bar** — on phones, a persistent native-app-style tab bar (Home / Directory / Search / Saved) replaces a hamburger. With only four sections, everything fits directly — no "More" bucket needed.

## Notes

- Nothing here is sent to any server other than the destination sites you click through to (and a best-effort favicon request per site icon, from Google's public favicon service).
- Age-gated on first visit per browser (`localStorage`-based, not a real verification mechanism).
- All data — video bookmarks and most-visited stats — lives only in this browser's `localStorage`; clearing site data clears it.
