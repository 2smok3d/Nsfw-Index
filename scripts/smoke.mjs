#!/usr/bin/env node
/* ============================================================
   smoke.mjs — loads every SPA route in headless Chromium and
   fails if any of them throw a console error or page error.
   Also confirms the legacy page redirects (directory.html etc.)
   land on the right route. Mirrors the manual QA pass this
   project is built and reviewed against.
   Requires the "playwright" devDependency + its Chromium browser
   (npx playwright install --with-deps chromium).
   ============================================================ */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROUTES = ['/', '/directory', '/library', '/handy', '/tools', '/settings', '/search'];
const REDIRECTS = {
  'directory.html': '/directory',
  'library.html': '/library',
  'handy.html': '/handy',
  'tools.html': '/tools',
  'settings.html': '/settings',
};

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml' };

function startServer() {
  return new Promise(resolve => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent(req.url.split('?')[0]);
        const filePath = path.join(root, urlPath === '/' ? '/index.html' : urlPath);
        const st = await stat(filePath);
        if (!st.isFile()) throw new Error('not a file');
        const body = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
        res.end(body);
      } catch {
        res.writeHead(404);
        res.end('not found');
      }
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function main() {
  const server = await startServer();
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}/`;

  const browser = await chromium.launch();
  let failures = 0;

  for (const route of ROUTES) {
    const page = await browser.newPage();
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push('pageerror: ' + err.message));

    await page.goto(base + 'index.html#' + route, { waitUntil: 'networkidle' });
    const enter = await page.$('#gate-enter');
    if (enter) await enter.click();
    await page.waitForTimeout(300);

    // /search needs a query to render its results state — exercise that too
    if (route === '/search') {
      await page.goto(base + 'index.html#/search?q=test', { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
    }

    const label = 'index.html#' + route;
    if (errors.length) {
      failures++;
      console.error(`✗ ${label}: ${errors.length} console error(s)`);
      errors.forEach(e => console.error('   ' + e));
    } else {
      console.log(`✓ ${label}: no console errors`);
    }
    await page.close();
  }

  // Click through every search tab NOT marked noFrame — catches sites that
  // silently gained an X-Frame-Options block without being flagged in
  // sites.js (this is how the SpankBang regression should have been caught
  // automatically instead of via a user report).
  {
    const page = await browser.newPage();
    const frameErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && /X-Frame-Options|frame-ancestors/i.test(msg.text())) frameErrors.push(msg.text());
    });
    await page.goto(base + 'index.html#/search?q=test', { waitUntil: 'networkidle' });
    const enter = await page.$('#gate-enter');
    if (enter) await enter.click();
    await page.waitForTimeout(300);

    const claimedFrameable = await page.evaluate(() => SITES.filter(s => s.su && !s.noFrame).map(s => s.name));
    for (const name of claimedFrameable) {
      frameErrors.length = 0;
      const tab = page.locator('#srch-tabs .chip', { hasText: name }).first();
      if (await tab.count()) {
        await tab.click();
        await page.waitForTimeout(600);
        if (frameErrors.length) {
          failures++;
          console.error(`✗ search tab "${name}" claims frameable but blocked embedding — mark it noFrame:true in sites.js`);
          frameErrors.forEach(e => console.error('   ' + e));
        } else {
          console.log(`✓ search tab "${name}": embeds without a frame-block error`);
        }
      }
    }
    if (!claimedFrameable.length) console.log('✓ search: no sites currently claim to be frameable (all su entries marked noFrame)');
    await page.close();
  }

  for (const [file, expectedRoute] of Object.entries(REDIRECTS)) {
    const page = await browser.newPage();
    await page.goto(base + file, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    const landedHash = new URL(page.url()).hash;
    if (landedHash === '#' + expectedRoute) {
      console.log(`✓ ${file}: redirects to index.html#${expectedRoute}`);
    } else {
      failures++;
      console.error(`✗ ${file}: expected redirect to #${expectedRoute}, landed on ${landedHash || '(no hash)'}`);
    }
    await page.close();
  }

  await browser.close();
  server.close();

  if (failures) {
    console.error(`\nsmoke: ${failures} check(s) failed`);
    process.exit(1);
  }
  console.log('\nsmoke: all routes loaded cleanly, all redirects correct');
}

main().catch(err => { console.error(err); process.exit(1); });
