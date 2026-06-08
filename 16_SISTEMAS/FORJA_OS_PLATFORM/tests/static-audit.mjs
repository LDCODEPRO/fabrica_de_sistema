import { access, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const dist = process.env.FORJA_DIST_DIR || join(root, 'dist');
const required = [
  'Dockerfile',
  'docker-compose.yml',
  '.env.example',
];

for (const file of required) {
  await access(join(root, file));
}
for (const file of ['index.html', 'assets/app.js', 'css/tokens.css', 'css/app.css', 'css/centers.css', 'health.json']) {
  await access(join(dist, file));
}

const html = await readFile(join(dist, 'index.html'), 'utf8');
const sourceHtml = await readFile(join(root, 'Factory OS - Monitor 1.html'), 'utf8');
const sourceFiles = [
  'js/data.js',
  'js/shared.jsx',
  'js/shell.jsx',
  'js/explorer.jsx',
  'js/copilot.jsx',
  'js/centers_a.jsx',
  'js/centers_b.jsx',
  'js/centers_c.jsx',
  'js/app.jsx',
];
const source = sourceHtml + '\n' + (await Promise.all(sourceFiles.map(file => readFile(join(root, file), 'utf8')))).join('\n');

const banned = [
  'unpkg.com',
  'react.development.js',
  'babel.min.js',
  'type="text/babel"',
  'api_key',
  'password',
  'secret',
];

for (const term of banned) {
  if (html.toLowerCase().includes(term) || source.toLowerCase().includes(term)) {
    throw new Error(`Production artifact contains banned term: ${term}`);
  }
}

if (!html.includes("default-src 'self'")) {
  throw new Error('Content Security Policy missing from production HTML');
}

const appSize = (await stat(join(dist, 'assets/app.js'))).size;
if (appSize <= 1000) {
  throw new Error('Compiled app bundle is unexpectedly small');
}

console.log('STATIC_AUDIT_OK');
