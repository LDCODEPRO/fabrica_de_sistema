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
  'js/shared.jsx',
  'js/shell.jsx',
  'js/explorer.jsx',
  'js/copilot.jsx',
  'js/home.jsx',
  'js/home_exec.jsx',
  'js/equipes.jsx',
  'js/modules_a.jsx',
  'js/modules_b.jsx',
  'js/app.jsx',
];

const dist = process.env.FORJA_DIST_DIR || join(root, 'dist');
await mkdir(join(dist, 'assets'), { recursive: true });
await mkdir(join(dist, 'css'), { recursive: true });

const chunks = [];
for (const file of sourceOrder) {
  chunks.push(await readFile(join(root, file), 'utf8'));
}

const entry = chunks.join('\n\n');

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

let html = await readFile(join(root, 'Factory OS - Monitor 1.html'), 'utf8');
html = html.replace(/<script.*?src="js\/.*?".*?><\/script>/g, '');
html = html.replace('</body>', '  <script src="assets/app.js"></script>\n</body>');
await writeFile(join(dist, 'index.html'), html, 'utf8');
await copyFile(join(root, 'favicon.svg'), join(dist, 'favicon.svg'));
await copyFile(join(root, 'css/tokens.css'), join(dist, 'css/tokens.css'));
await copyFile(join(root, 'css/app.css'), join(dist, 'css/app.css'));
await copyFile(join(root, 'css/centers.css'), join(dist, 'css/centers.css'));
await writeFile(join(dist, 'health.json'), JSON.stringify({ status: 'ok', service: 'forja-os-platform' }, null, 2), 'utf8');
