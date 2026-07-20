#!/usr/bin/env node
/* ============================================================
   verify.mjs — fast, dependency-free sanity checks:
     1. every local href/src referenced by an .html file exists
     2. every assets/js/*.js file is syntactically valid
     3. assets/data/sites.js has no duplicate ids and every
        entry's category is one of the declared CATEGORIES
   No npm dependencies — keeps CI as self-contained as the site.
   ============================================================ */
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
const fail = msg => { console.error('✗ ' + msg); failures++; };
const ok = msg => console.log('✓ ' + msg);

// ── 1. local link/asset integrity ──
const htmlFiles = readdirSync(root).filter(f => f.endsWith('.html'));
const refRe = /(?:href|src)="([^"]+)"/g;

for (const file of htmlFiles) {
  const raw = readFileSync(path.join(root, file), 'utf8');
  // strip inline (non-src) <script> bodies before scanning — template
  // literal JS often contains href="${...}"/src="${...}" that aren't
  // real file refs. <script src="..."> tags themselves are kept.
  const markup = raw.replace(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi, '');
  let m;
  let checkedInFile = 0;
  while ((m = refRe.exec(markup))) {
    const ref = m[1];
    if (/^(https?:)?\/\//.test(ref) || ref.startsWith('data:') || ref.startsWith('mailto:') || ref.startsWith('#') || ref.startsWith('javascript:')) continue;
    const clean = ref.split('#')[0].split('?')[0];
    if (!clean) continue;
    const resolved = path.join(root, clean);
    checkedInFile++;
    if (!existsSync(resolved)) fail(`${file} references missing local file: ${ref}`);
  }
  if (checkedInFile) ok(`${file}: ${checkedInFile} local reference(s) resolved`);
}

// ── 2. JS syntax check ──
const jsDir = path.join(root, 'assets', 'js');
const jsFiles = existsSync(jsDir) ? readdirSync(jsDir).filter(f => f.endsWith('.js')) : [];
for (const file of jsFiles) {
  try {
    execFileSync(process.execPath, ['--check', path.join(jsDir, file)], { stdio: 'pipe' });
    ok(`assets/js/${file}: valid syntax`);
  } catch (e) {
    fail(`assets/js/${file}: syntax error\n${e.stderr?.toString() || e.message}`);
  }
}
const dataFile = path.join(root, 'assets', 'data', 'sites.js');
if (existsSync(dataFile)) {
  try {
    execFileSync(process.execPath, ['--check', dataFile], { stdio: 'pipe' });
    ok('assets/data/sites.js: valid syntax');
  } catch (e) {
    fail(`assets/data/sites.js: syntax error\n${e.stderr?.toString() || e.message}`);
  }
}

// ── 3. directory dataset sanity ──
if (existsSync(dataFile)) {
  const src = readFileSync(dataFile, 'utf8');
  const sandbox = { CATEGORIES: undefined, SITES: undefined };
  try {
    const fn = new Function(src + '\nreturn { CATEGORIES, SITES };');
    const { CATEGORIES, SITES } = fn();
    const catIds = new Set((CATEGORIES || []).map(c => c.id));
    ok(`sites.js: ${CATEGORIES.length} categories, ${SITES.length} entries`);

    const seenIds = new Set();
    for (const entry of SITES) {
      if (!entry.id) { fail(`sites.js entry missing id: ${entry.name}`); continue; }
      if (seenIds.has(entry.id)) fail(`sites.js: duplicate id "${entry.id}"`);
      seenIds.add(entry.id);
      if (!catIds.has(entry.category)) fail(`sites.js: entry "${entry.id}" has unknown category "${entry.category}"`);
      if (!entry.url || !/^https?:\/\//.test(entry.url)) fail(`sites.js: entry "${entry.id}" has an invalid url`);
    }
    if (seenIds.size === SITES.length) ok('sites.js: all entry ids unique');
  } catch (e) {
    fail(`sites.js: failed to evaluate — ${e.message}`);
  }
}

console.log('');
if (failures) {
  console.error(`verify: ${failures} check(s) failed`);
  process.exit(1);
}
console.log('verify: all checks passed');
