# Noir Index

A private, self-contained, multi-page adult link index — no backend, no accounts, no tracking. Everything is static HTML/CSS/vanilla JS and every setting lives in your own browser's `localStorage`.

Built around one focus: **step fetish, femdom, and mommy domme**, with a personal Google Drive-backed library and full Handy device control alongside it.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Hub — hero, feature cards, quick search |
| `directory.html` | The curated Taboo directory: text search, tag filters, favorites, cross-site search — ~22 free sites covering step fetish, femdom, and mommy domme, one card per site, no paywalled entries |
| `library.html` | Your own video library, read live from Google Drive — folder browsing, inline preview, per-file tags, direct download |
| `handy.html` | Full control panel for The Handy over its official public REST API (manual mode, stroke range, script sync), plus curated interactive/script resources |
| `tools.html` | Downloaders (yt-dlp & friends) and self-hosted media server recommendations |
| `settings.html` | Drive API key & folders, Handy connection key, density/landing-page prefs, tag manager, JSON backup/restore, full reset |

## Design

"Noir Boudoir" — obsidian black, antique gold, deep crimson. Serif display type for headings, system fonts throughout (no external font/CDN requests — the whole site works offline once loaded, e.g. via GitHub Pages or a plain `file://` open). Layered shadows, gradient hairlines, and a fine film-grain texture give it depth instead of flat digital gradients; native View Transitions cross-fade between pages on supporting browsers.

## Premium features

- **Command palette** (`⌘K` / `Ctrl+K`, anywhere) — jump to any page instantly or fuzzy-search the whole Taboo directory without leaving where you are.
- **Continue Watching** — the homepage surfaces your in-progress videos from My Library with a Netflix-style progress bar, pulled from the same local resume data the player already tracks.
- **Bulk tagging** — tag every visible video in My Library in one action instead of one file at a time.
- **Mobile bottom tab bar** — on phones, a persistent native-app-style tab bar (Home / Directory / Library / Handy / More) replaces the old hamburger-only nav. "More" opens a full sheet with Tools, Settings, and a one-tap Quick Search that opens the command palette (no keyboard needed).

## Setting up your Drive library

1. Create a Google Cloud API key restricted to the **Drive API** ([console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)).
2. Share your Drive folder(s) as **"Anyone with the link — Viewer."**
3. In `settings.html`, paste the API key and add each folder's ID (the string after `/folders/` in its URL).
4. Open `library.html` — your videos load directly from Drive, client-side. Nothing passes through any third-party server.

## Setting up The Handy

1. Open the Handy app, copy your Connection Key from Settings.
2. Paste it into `handy.html` or `settings.html`.
3. Control manual mode, stroke range, and best-effort script sync directly from the browser, using Handy's own public API (`handyfeeling.com/api/handy/v2`).

## Notes

- Nothing here is sent to any server other than the ones you explicitly configure (Google Drive, Handy) or the destination sites you click through to.
- Age-gated on first visit per browser (`localStorage`-based, not a real verification mechanism).
- All data — favorites, tags, keys — can be exported/imported as a single JSON file from Settings.
