#!/usr/bin/env node
/* ============================================================
   discover-search.mjs — one-off research tool, NOT part of the
   shipped app and NOT wired into the regular CI workflow. Run
   manually (via .github/workflows/discover.yml, workflow_dispatch)
   from an environment with real internet access to find search-URL
   patterns for sites.js entries that don't have `su` yet, and to
   check whether the resulting search-results page can be embedded
   in an iframe (same X-Frame-Options/CSP check smoke.mjs does).

   It only ever submits a single test query to each site's own
   search box and inspects the resulting URL + frame headers — it
   does not scrape or store any site content.

   Usage: node scripts/discover-search.mjs [siteId siteId ...]
   With no args, runs every SITES entry that lacks `su`.
   ============================================================ */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(path.join(root, 'assets', 'data', 'sites.js'), 'utf8');
const { SITES } = new Function(src + '\nreturn { SITES };')();

const requested = process.argv.slice(2);
const candidates = SITES.filter(s => !s.su && (!requested.length || requested.includes(s.id)));

const SEARCH_INPUT_SELECTOR = [
  'input[type="search"]',
  'input[name*="search" i]',
  'input[name="q"]',
  'input[name="s"]',
  'input[placeholder*="search" i]',
].join(', ');
const TEST_TERM = 'test';

async function findSuPattern(page, homepage) {
  await page.goto(homepage, { waitUntil: 'domcontentloaded', timeout: 25000 });
  const input = page.locator(SEARCH_INPUT_SELECTOR).first();
  if (!(await input.count())) return { status: 'no-search-box' };
  try {
    await input.click({ timeout: 5000 });
    await input.fill(TEST_TERM, { timeout: 5000 });
    await Promise.race([
      page.waitForURL(u => u.toString() !== homepage, { timeout: 8000 }),
      input.press('Enter').then(() => page.waitForLoadState('domcontentloaded', { timeout: 8000 })),
    ]);
  } catch {
    // fall through — check page.url() regardless, Enter may have already navigated
  }
  await page.waitForTimeout(500);
  const finalUrl = page.url();
  if (finalUrl === homepage || !finalUrl.includes(TEST_TERM)) {
    return { status: 'no-navigation', finalUrl };
  }
  const idx = finalUrl.lastIndexOf(TEST_TERM);
  const su = finalUrl.slice(0, idx);
  const suffix = finalUrl.slice(idx + TEST_TERM.length);
  if (suffix.length > 0) {
    return { status: 'complex-pattern', finalUrl, note: 'trailing content after query term — needs manual su' };
  }
  return { status: 'ok', su, finalUrl };
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

async function main() {
  console.log(`discover-search: testing ${candidates.length} site(s) without su\n`);
  const browser = await chromium.launch();
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36' });

  for (const site of candidates) {
    const page = await context.newPage();
    let result;
    try {
      result = await findSuPattern(page, site.url);
    } catch (e) {
      result = { status: 'error', error: e.message };
    }
    await page.close();

    if (result.status === 'ok') {
      const embeddable = await checkEmbeddable(context, result.su + TEST_TERM);
      console.log(`✓ ${site.id} (${site.name}): su='${result.su}' | embeddable=${embeddable}`);
    } else {
      console.log(`✗ ${site.id} (${site.name}): ${result.status}${result.finalUrl ? ' | landed on ' + result.finalUrl : ''}${result.error ? ' | ' + result.error : ''}`);
    }
  }

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
