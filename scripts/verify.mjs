#!/usr/bin/env node
/* ============================================================
   verify.mjs — fast, dependency-free sanity checks:
     1. every local href/src referenced by an .html file exists
     2. every assets/js/*.js file is syntactically valid
     3. assets/data/sites.js has no duplicate ids and every
        entry's category is one of the declared CATEGORIES
   No npm dependencies — keeps CI as self-contained as the site.
   ============================================================ */
import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
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

// ── 2. JS syntax check (recurses into assets/js/**, e.g. views/) ──
function walkJs(dir) {
  let out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out = out.concat(walkJs(full));
    else if (entry.endsWith('.js')) out.push(full);
  }
  return out;
}
const jsDir = path.join(root, 'assets', 'js');
const jsFiles = existsSync(jsDir) ? walkJs(jsDir) : [];
for (const full of jsFiles) {
  const rel = path.relative(root, full);
  try {
    execFileSync(process.execPath, ['--check', full], { stdio: 'pipe' });
    ok(`${rel}: valid syntax`);
  } catch (e) {
    fail(`${rel}: syntax error\n${e.stderr?.toString() || e.message}`);
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
const swFile = path.join(root, 'sw.js');
if (existsSync(swFile)) {
  try {
    execFileSync(process.execPath, ['--check', swFile], { stdio: 'pipe' });
    ok('sw.js: valid syntax');
  } catch (e) {
    fail(`sw.js: syntax error\n${e.stderr?.toString() || e.message}`);
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

// ── 4. SPA route table sanity ──
const viewsDir = path.join(root, 'assets', 'js', 'views');
if (existsSync(viewsDir)) {
  const registered = new Set();
  for (const full of walkJs(viewsDir)) {
    const src = readFileSync(full, 'utf8');
    const re = /Router\.register\(\s*'([^']+)'/g;
    let m;
    while ((m = re.exec(src))) registered.add(m[1]);
  }
  const expected = ['/', '/directory', '/bookmarks'];
  const missing = expected.filter(p => !registered.has(p));
  if (missing.length) fail(`router: expected route(s) not registered: ${missing.join(', ')}`);
  else ok(`router: all ${expected.length} expected routes registered (${[...registered].join(', ')})`);
}

// ── 5. PWA manifest sanity ──
const manifestFile = path.join(root, 'manifest.json');
if (existsSync(manifestFile)) {
  try {
    const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
    ok('manifest.json: valid JSON');
    if (!Array.isArray(manifest.icons) || !manifest.icons.length) {
      fail('manifest.json: no icons declared');
    } else {
      for (const icon of manifest.icons) {
        const resolved = path.join(root, icon.src);
        if (!existsSync(resolved)) fail(`manifest.json: icon src missing on disk: ${icon.src}`);
      }
      ok(`manifest.json: ${manifest.icons.length} icon(s) resolved`);
    }
  } catch (e) {
    fail(`manifest.json: failed to parse — ${e.message}`);
  }
}

// ── 6. base design system sanity ──
// Guards against the exact regression that broke the live site on
// 2026-09-09: something (a tool, a bad merge, a careless edit)
// overwrote theme.css down to just its newest feature-specific rules,
// silently deleting the entire base stylesheet — CSS custom
// properties, layout, every component — while every other check
// here kept passing, because none of them look at CSS at all. A page
// with no styling doesn't throw a JS console error, so smoke.mjs's
// browser check didn't catch it either.
const themeFile = path.join(root, 'assets', 'css', 'theme.css');
if (existsSync(themeFile)) {
  const css = readFileSync(themeFile, 'utf8');
  const lineCount = css.split('\n').length;
  if (lineCount < 400) {
    fail(`theme.css: only ${lineCount} lines — the base design system may have been overwritten (expected 400+)`);
  } else {
    ok(`theme.css: ${lineCount} lines`);
  }
  const REQUIRED_VARS = ['--bg', '--gold', '--text', '--s1', '--border', '--radius', '--serif', '--sans'];
  const missingVars = REQUIRED_VARS.filter(v => !css.includes(v + ':'));
  if (missingVars.length) fail(`theme.css: missing core custom propert${missingVars.length === 1 ? 'y' : 'ies'}: ${missingVars.join(', ')}`);
  else ok(`theme.css: all ${REQUIRED_VARS.length} core custom properties present`);
  const REQUIRED_RULES = ['.hero-search{', '.card{', '.btn-gold{', '.panel{', '#hdr{'];
  const missingRules = REQUIRED_RULES.filter(r => !css.includes(r));
  if (missingRules.length) fail(`theme.css: missing core rule(s): ${missingRules.join(', ')}`);
  else ok(`theme.css: all ${REQUIRED_RULES.length} core structural rules present`);
} else {
  fail('theme.css: file not found');
}

console.log('');
if (failures) {
  console.error(`verify: ${failures} check(s) failed`);
  process.exit(1);
}
console.log('verify: all checks passed');
