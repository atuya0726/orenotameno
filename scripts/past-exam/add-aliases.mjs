#!/usr/bin/env node
// Adds aliases to existing glossary terms so question words open them.
// Usage: node scripts/past-exam/add-aliases.mjs <aliases.json>   (a JSON object: { "<term id>": ["alias", ...] })
// Rejects unknown ids and aliases that already name or alias another term.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const file = fileURLToPath(new URL('../../src/features/glossary/terms.ts', import.meta.url));
let source = readFileSync(file, 'utf8');
const incoming = JSON.parse(readFileSync(process.argv[2] ?? process.exit(console.error('usage: add-aliases.mjs <aliases.json>') ?? 1), 'utf8'));
const pattern = /^ {4}"id": "([^"]+)",\n {4}"name": "([^"]+)",(?:\n {4}"aliases": (\[[^\]]*\]),)?/gm;
const existing = [...source.matchAll(pattern)].map(m => ({ id: m[1], name: m[2], aliases: m[3] ? JSON.parse(m[3]) : [] }));
const normalize = text => text.normalize('NFKC').toLowerCase().replace(/ディジタル/g, 'デジタル').replace(/[\s・]/g, '');
const owner = new Map(existing.flatMap(t => [t.name, ...t.name.split(/[（）()]/).filter(Boolean), ...t.aliases].map(word => [normalize(word), t.id])));
const errors = [];
for (const [id, aliases] of Object.entries(incoming)) {
  if (!existing.some(t => t.id === id)) errors.push(`unknown term id: ${id}`);
  for (const alias of aliases) {
    const taken = owner.get(normalize(alias));
    if (taken) errors.push(`${alias} already opens ${taken}`);
    owner.set(normalize(alias), id);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
source = source.replace(pattern, (match, id, name, current) => {
  if (!incoming[id]) return match;
  const aliases = [...(current ? JSON.parse(current) : []), ...incoming[id]];
  return `    "id": ${JSON.stringify(id)},\n    "name": ${JSON.stringify(name)},\n    "aliases": ${JSON.stringify(aliases, null, 2).replace(/\n/g, '\n    ')},`;
});
writeFileSync(file, source);
console.log(`added aliases to ${Object.keys(incoming).length} terms`);
