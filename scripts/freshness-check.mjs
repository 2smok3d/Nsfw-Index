#!/usr/bin/env node
/* ============================================================
   freshness-check.mjs — weekly maintenance check, NOT part of
   the shipped app and NOT part of the push/PR CI gate. Run on a
   schedule via .github/workflows/freshness.yml, from an
   environment with real internet access.

   For every sites.js entry: homepage reachability, plus a
   parked-domain heuristic (adult tube sites regularly lapse and
   get replaced by a registrar's for-sale page rather than going
   fully dark).

   Writes a markdown report to the path given as argv[2] (default
   freshness-report.md) for the weekly GitHub issue, and exits
   non-zero only for actionable breakage.
   ============================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(path.join(root, 'assets', 'data', 'sites.js'), 'utf8');
const { SITES } = new Function(src + '\nreturn { SITES };')();

const REPORT_PATH = process.argv[2] || path.join(root, 'freshness-report.md');

const PARKED_MARKERS = [
  'domain is for sale', 'buy this domain', 'this domain may be for sale',
  'parkingcrew', 'bodis.com', 'sedo domain parking', 'hugedomains',
  'afternic', 'future home of something quite cool', 'domain has expired',
  'godaddy.com/domains', 'namecheap.com/domains/registration',
];

// Status codes bot protection (Cloudflare, DDoS-Guard) hands a headless
// browser on a datacenter IP while real visitors get the site. Reported,
// but not actionable on their own.
const BLOCKED_CODES = new Set([401, 403, 429, 503]);

async function loadHomepage(page, site) {
  try {
    return await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  } catch (e) {
    // Ad-heavy tube homepages often miss domcontentloaded in 20s from a
    // runner; one retry that only waits for the server to answer.
    if (!/timeout/i.test(e.message)) throw e;
    return page.goto(site.url, { waitUntil: 'commit', timeout: 30000 });
  }
}

async function checkHomepage(page, site) {
  try {
    const resp = await loadHomepage(page, site);
    if (!resp) return { status: 'dead', reason: 'no response' };
    if (BLOCKED_CODES.has(resp.status())) return { status: 'blocked', reason: `HTTP ${resp.status()}` };
    if (!resp.ok()) return { status: 'error', reason: `HTTP ${resp.status()}` };
    const bodyText = await page.evaluate(() => document.body?.innerText?.slice(0, 2000) || '').catch(() => '');
    const text = ((await page.title()) + ' ' + bodyText).toLowerCase();
    const hit = PARKED_MARKERS.find(m => text.includes(m));
    if (hit) return { status: 'parked', reason: `matched "${hit}"` };
    return { status: 'ok' };
  } catch (e) {
    return { status: 'dead', reason: e.message.split('\n')[0] };
  }
}

function fmt(entries, mapper) {
  return entries.map(mapper).join('\n');
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36' });

  const dead = [], parked = [], errored = [], blocked = [];

  for (const site of SITES) {
    const page = await context.newPage();
    const home = await checkHomepage(page, site);
    await page.close();
    console.log(`${site.id}: homepage=${home.status}${home.reason ? ' (' + home.reason + ')' : ''}`);

    if (home.status === 'dead') dead.push({ site, reason: home.reason });
    else if (home.status === 'parked') parked.push({ site, reason: home.reason });
    else if (home.status === 'error') errored.push({ site, reason: home.reason });
    else if (home.status === 'blocked') blocked.push({ site, reason: home.reason });
  }

  await browser.close();

  const actionable = dead.length + parked.length + errored.length;
  const lines = [];
  lines.push(`# Weekly freshness check — ${new Date().toISOString().slice(0, 10)}`);
  lines.push('');
  lines.push(`Checked ${SITES.length} directory entries.`);
  lines.push('');

  if (actionable === 0) {
    lines.push('Everything looks healthy. No action needed.');
    lines.push('');
  } else {
    if (dead.length) {
      lines.push(`## 🔴 Dead sites (${dead.length}) — unreachable, likely gone`);
      lines.push(fmt(dead, ({ site, reason }) => `- **${site.name}** (\`${site.id}\`) — ${site.url} — ${reason}`));
      lines.push('');
    }
    if (parked.length) {
      lines.push(`## 🟠 Parked domains (${parked.length}) — lapsed, now a registrar for-sale page`);
      lines.push(fmt(parked, ({ site, reason }) => `- **${site.name}** (\`${site.id}\`) — ${site.url} — ${reason}`));
      lines.push('');
    }
    if (errored.length) {
      lines.push(`## 🟡 HTTP errors (${errored.length})`);
      lines.push(fmt(errored, ({ site, reason }) => `- **${site.name}** (\`${site.id}\`) — ${site.url} — ${reason}`));
      lines.push('');
    }
  }

  if (blocked.length) {
    lines.push(`## ⚪ Bot-blocked (${blocked.length}) — server answered but refused a headless browser; check by hand only if it persists`);
    lines.push(fmt(blocked, ({ site, reason }) => `- **${site.name}** (\`${site.id}\`) — ${site.url} — ${reason}`));
    lines.push('');
  }

  const report = lines.join('\n');
  writeFileSync(REPORT_PATH, report);
  console.log('\n' + report);

  if (actionable > 0) process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
