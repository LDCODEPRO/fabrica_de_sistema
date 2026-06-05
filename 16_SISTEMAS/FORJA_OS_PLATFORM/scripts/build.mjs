import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const depRoot = process.env.FORJA_DEPS_NODE_MODULES;
const { build } = depRoot
  ? require(join(depRoot, 'esbuild'))
  : require('esbuild');

const root = process.cwd();
const sourceOrder = [
  'js/data.js',
  'js/api.js',
  'js/shared.jsx',
  'js/shell.jsx',
  'js/explorer.jsx',
  'js/copilot.jsx',
  'js/centers_a.jsx',
  'js/centers_b.jsx',
  'js/centers_c.jsx',
  'js/app.jsx',
];

const dist = process.env.FORJA_DIST_DIR || join(root, 'dist');
await mkdir(join(dist, 'assets'), { recursive: true });
await mkdir(join(dist, 'css'), { recursive: true });

const chunks = [];
for (const file of sourceOrder) {
  chunks.push(await readFile(join(root, file), 'utf8'));
}

const entry = [
  "import React from 'react';",
  "import { createRoot } from 'react-dom/client';",
  'const ReactDOM = { createRoot };',
  ...chunks,
].join('\n\n');

const generatedEntry = join(process.env.FORJA_BUILD_TMP || join(root, 'scripts'), 'generated-entry.jsx');
await writeFile(generatedEntry, entry, 'utf8');

await build({
  entryPoints: [generatedEntry],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020'],
  format: 'iife',
  outfile: join(dist, 'assets', 'app.js'),
  logLevel: 'info',
  nodePaths: depRoot ? [depRoot] : [],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

await copyFile(join(root, 'Factory OS - Monitor 1.html'), join(dist, 'index.html'));
await copyFile(join(root, 'favicon.svg'), join(dist, 'favicon.svg'));
await copyFile(join(root, 'css/tokens.css'), join(dist, 'css/tokens.css'));
await copyFile(join(root, 'css/app.css'), join(dist, 'css/app.css'));
await copyFile(join(root, 'css/centers.css'), join(dist, 'css/centers.css'));
await writeFile(join(dist, 'health.json'), JSON.stringify({ status: 'ok', service: 'forja-os-platform' }, null, 2), 'utf8');
