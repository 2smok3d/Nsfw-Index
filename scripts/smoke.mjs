#!/usr/bin/env node
/* ============================================================
   smoke.mjs — loads every page in headless Chromium and fails
   if any of them throw a console error or page error. Mirrors
   the manual QA pass this project is built and reviewed against.
   Requires the "playwright" devDependency + its Chromium browser
   (npx playwright install --with-deps chromium).
   ============================================================ */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index.html', 'directory.html', 'library.html', 'handy.html', 'tools.html', 'settings.html'];

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

  for (const p of PAGES) {
    const page = await browser.newPage();
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push('pageerror: ' + err.message));

    await page.goto(base + p, { waitUntil: 'networkidle' });
    const enter = await page.$('#gate-enter');
    if (enter) await enter.click();
    await page.waitForTimeout(300);

    if (errors.length) {
      failures++;
      console.error(`✗ ${p}: ${errors.length} console error(s)`);
      errors.forEach(e => console.error('   ' + e));
    } else {
      console.log(`✓ ${p}: no console errors`);
    }
    await page.close();
  }

  await browser.close();
  server.close();

  if (failures) {
    console.error(`\nsmoke: ${failures} page(s) failed`);
    process.exit(1);
  }
  console.log('\nsmoke: all pages loaded cleanly');
}

main().catch(err => { console.error(err); process.exit(1); });
