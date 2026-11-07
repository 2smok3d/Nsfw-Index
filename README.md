# Noir Index

A private, self-contained adult site directory — no backend, no accounts, no tracking. A **single-page app**: one HTML shell (`index.html`), every section is a client-side route, navigation never triggers a full page reload. Everything is static HTML/CSS/vanilla JS and every preference lives in your own browser's `localStorage`.

Built around one focus: **step fetish, femdom, and mommy domme**, with two things at the center of the app — **search** (home itself, and the only search bar in the app: rank every free site locally, or fan out to each site's own real search in a tap) and **bookmarks** (its own separate section — save specific videos you find, including one-click capture via a bookmarklet).

## Routes

One page, three sections, addressed by hash (`index.html#/directory`, etc.) so the back/forward buttons and bookmarks work normally without ever reloading the app shell:

| Route | Purpose |
|---|---|
| `#/` | Home IS the search: one query ranks every site in the directory locally by relevance, surfaces any of your own bookmarked videos that match, and offers one-tap buttons — sorted by how often you actually use each site — that open the same query on every site's own real search, each in a new tab. With no query, shows your recent searches and local history instead. |
| `#/bookmarks` | Its own separate section — save specific videos by pasting a link, or drag the bookmarklet into your bookmarks bar and click it on any video page to capture its real title automatically. Filter by tag as the list grows (no second search bar here — just tag chips). |
| `#/directory` | Every free site as one flat grid to browse — 64 sites across Taboo and Ebony, no category sections, no featured sections, no second search bar, links go straight to each site's homepage, no paywalled entries |

The old separate files (`directory.html`, `tools.html`, `settings.html`) still exist as one-line redirects, so any existing bookmarks or home-screen icons keep working — the retired Tools and Settings sections now redirect to the home route.

## Design

"Index Noir" — cool near-black, electric violet, hot rose. One typeface (Instrument Sans) throughout, no external font/CDN requests. Mobile-first: every layout is designed at phone width first, with wider breakpoints as the enhancement, not the baseline. No decorative chrome beyond what's needed — no marketing copy, no title blocks, no featured-site mosaics — just the search bar, the buttons, and the results.

Browsing works fine opened straight from a local file (`file://`) — nothing here needs a server to render. **Installing it does not**: service workers and the install prompt only activate on a real `https://` (or `localhost`) origin, a browser-level security rule with no workaround. Push to `main` and this repo auto-deploys to GitHub Pages (enable it once under the repo's **Settings → Pages → Source: GitHub Actions**) to get a real URL — open that on your phone and both the offline cache and the Install button actually work.

## Premium features

- **True single-page app** — one load, then every navigation (header nav, mobile tab bar, command palette, in-app links) is instant, client-side, and reload-free. The age gate, header, and tab bar are built once and never re-rendered.
- **One search, two ways out** (`#/`) — a local index (names, tags, categories, notes, plus your own bookmarked videos) ranks results instantly, no fetching or embedding involved. Alongside it, "open this search on every site" turns the same query into one real button per site (`known search-URL pattern + your term`), sorted by how often you actually visit each one — each opening that site's own live results in a new tab. The app never loads another site's page itself, it just hands you the door. No "smart facets" or extra chrome — just the one search bar and what it finds.
- **Bookmarks with a bookmarklet** (`#/bookmarks`) — its own separate page, not folded into Home. Paste a video's link to save it, or drag the "♥ Save to Noir Index" bookmarklet into your bookmarks bar once; clicking it while viewing any video reads that page's own `<title>`/`og:` tags (same-origin, in your browser, triggered by you — not a fetch this app performs) and opens the bookmark form here pre-filled. Filter by tag as the list grows — no duplicate search bar here. Saved videos also surface automatically on Home when they match your search.
- **Most Visited** — the app quietly tracks which sites you actually click (locally, nothing leaves the browser) and sorts both the Directory grid and the multi-site search buttons by that usage, with a "🔥 N" badge on cards you've visited. Curated data is just the starting point until your own usage takes over.
- **Command palette** (`⌘K` / `Ctrl+K`, anywhere, including a tap on mobile) — jump to any section instantly or fuzzy-search the whole directory without leaving where you are.
- **Mobile bottom tab bar** — on phones, a persistent native-app-style tab bar (Home / Directory / Saved) replaces a hamburger. Three sections, everything fits directly — no "More" bucket needed.

## Notes

- Nothing here is sent to any server other than the destination sites you click through to (and a best-effort favicon request per site icon, from Google's public favicon service).
- The multi-site "open search" buttons only ever construct a URL and open it in a new tab — this app never fetches, embeds, or displays another site's content itself.
- Every outbound link uses `rel="noopener noreferrer"`, so the destination never learns you came from here and can't reach back into this tab. No website — this one included — can force a new tab to open in Private/Incognito mode; that's a browser restriction, not a setting. If you open Noir Index itself in a Private window, every link you tap inherits that same private session automatically.
- Age-gated on first visit per browser (`localStorage`-based, not a real verification mechanism).
- All data — video bookmarks and most-visited stats — lives only in this browser's `localStorage`; clearing site data clears it.
