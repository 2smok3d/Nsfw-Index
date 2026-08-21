#!/usr/bin/env node
/* ============================================================
   freshness-check.mjs — weekly maintenance check, NOT part of
   the shipped app and NOT part of the push/PR CI gate. Run on a
   schedule via .github/workflows/freshness.yml, from an
   environment with real internet access.

   For every sites.js entry:
     - homepage reachability, plus a parked-domain heuristic
       (adult tube sites regularly lapse and get replaced by a
       registrar's for-sale page rather than going fully dark)
     - for entries with `su`: re-verifies the search pattern
       still resolves, and re-checks the noFrame flag against a
       live embed test — the same X-Frame-Options/CSP detection
       smoke.mjs runs on every push — in both directions: sites
       that started blocking without noFrame set (broken), and
       sites marked noFrame that could now be relaxed (optional).

   Writes a markdown report to the path given as argv[2] (default
   freshness-report.md) for the weekly GitHub issue, and exits
   non-zero only for actionable breakage — not for the harmless
   "could relax" case.
   ============================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(path.join(root, 'assets', 'data', 'sites.js'), 'utf8');
const { SITES } = new Function(src + '\nreturn { SITES };')();

const REPORT_PATH = process.argv[2] || path.join(root, 'freshness-report.md');
const TEST_TERM = 'test';

const PARKED_MARKERS = [
  'domain is for sale', 'buy this domain', 'this domain may be for sale',
  'parkingcrew', 'bodis.com', 'sedo domain parking', 'hugedomains',
  'afternic', 'future home of something quite cool', 'domain has expired',
  'godaddy.com/domains', 'namecheap.com/domains/registration',
];

async function checkHomepage(page, site) {
  try {
    const resp = await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    if (!resp) return { status: 'dead', reason: 'no response' };
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

async function checkEmbeddable(context, url) {
  const page = await context.newPage();
  const frameErrors = [];
  page.on('console', m => {
    if (m.type() === 'error' && /X-Frame-Options|frame-ancestors|Refused to display/i.test(m.text())) frameErrors.push(m.text());
  });
  try {
    await page.setContent(`<iframe id="t" src="${url}" style="width:800px;height:600px"></iframe>`);
    await page.waitForTimeout(3500);
  } catch { /* ignore */ }
  await page.close();
  return frameErrors.length === 0;
}

async function checkSearch(context, site) {
  const searchUrl = site.su + encodeURIComponent(TEST_TERM);
  const page = await context.newPage();
  let reachable = true;
  try {
    const resp = await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    reachable = !!resp && resp.ok();
  } catch {
    reachable = false;
  }
  await page.close();
  if (!reachable) return { status: 'search-broken' };

  const nowEmbeddable = await checkEmbeddable(context, searchUrl);
  const claimedNoFrame = !!site.noFrame;
  if (nowEmbeddable && claimedNoFrame) return { status: 'could-relax' };
  if (!nowEmbeddable && !claimedNoFrame) return { status: 'started-blocking' };
  return { status: 'ok' };
}

function fmt(entries, mapper) {
  return entries.map(mapper).join('\n');
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36' });

  const dead = [], parked = [], errored = [], searchBroken = [], startedBlocking = [], couldRelax = [];

  for (const site of SITES) {
    const page = await context.newPage();
    const home = await checkHomepage(page, site);
    await page.close();
    console.log(`${site.id}: homepage=${home.status}${home.reason ? ' (' + home.reason + ')' : ''}`);

    if (home.status === 'dead') dead.push({ site, reason: home.reason });
    else if (home.status === 'parked') parked.push({ site, reason: home.reason });
    else if (home.status === 'error') errored.push({ site, reason: home.reason });

    if (site.su && home.status === 'ok') {
      const search = await checkSearch(context, site);
      console.log(`${site.id}: search=${search.status}`);
      if (search.status === 'search-broken') searchBroken.push({ site });
      else if (search.status === 'started-blocking') startedBlocking.push({ site });
      else if (search.status === 'could-relax') couldRelax.push({ site });
    }
  }

  await browser.close();

  const actionable = dead.length + parked.length + errored.length + searchBroken.length + startedBlocking.length;
  const lines = [];
  lines.push(`# Weekly freshness check — ${new Date().toISOString().slice(0, 10)}`);
  lines.push('');
  lines.push(`Checked ${SITES.length} directory entries (${SITES.filter(s => s.su).length} with in-app search).`);
  lines.push('');

  if (actionable === 0 && couldRelax.length === 0) {
    lines.push('Everything looks healthy. No action needed.');
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
    if (searchBroken.length) {
      lines.push(`## 🟡 Search pattern broken (${searchBroken.length}) — \`su\` no longer resolves`);
      lines.push(fmt(searchBroken, ({ site }) => `- **${site.name}** (\`${site.id}\`) — \`${site.su}\``));
      lines.push('');
    }
    if (startedBlocking.length) {
      lines.push(`## 🟡 Started blocking embedding (${startedBlocking.length}) — needs \`noFrame: true\``);
      lines.push(fmt(startedBlocking, ({ site }) => `- **${site.name}** (\`${site.id}\`)`));
      lines.push('');
    }
    if (couldRelax.length) {
      lines.push(`## 🟢 Could relax (${couldRelax.length}) — currently \`noFrame: true\` but embeds fine now (optional)`);
      lines.push(fmt(couldRelax, ({ site }) => `- **${site.name}** (\`${site.id}\`)`));
      lines.push('');
    }
  }

  const report = lines.join('\n');
  writeFileSync(REPORT_PATH, report);
  console.log('\n' + report);

  if (actionable > 0) process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
