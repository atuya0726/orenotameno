#!/usr/bin/env node
// Appends glossary terms from a JSON array file to src/features/glossary/terms.ts.
// Usage: node scripts/past-exam/add-terms.mjs <terms.json>
// Rejects duplicate ids or names, unknown related ids, and criteria without ids, so the file stays consistent.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const file = fileURLToPath(new URL('../../src/features/glossary/terms.ts', import.meta.url));
const source = readFileSync(file, 'utf8');
const incoming = JSON.parse(readFileSync(process.argv[2] ?? process.exit(console.error('usage: add-terms.mjs <terms.json>') ?? 1), 'utf8'));

const existing = [...source.matchAll(/^ {4}"id": "([^"]+)",\n {4}"name": "([^"]+)"/gm)].map(m => ({ id: m[1], name: m[2] }));
const ids = new Set(existing.map(t => t.id));
const names = new Set(existing.map(t => t.name));
const errors = [];
for (const term of incoming) {
  if (ids.has(term.id)) errors.push(`duplicate id: ${term.id}`);
  if (names.has(term.name)) errors.push(`duplicate name: ${term.name}`);
  ids.add(term.id); names.add(term.name);
}
for (const term of incoming) {
  for (const key of ['id', 'name', 'reading', 'category', 'definition', 'example']) if (!term[key]) errors.push(`${term.id}: missing ${key}`);
  if (!term.criteria?.some(c => !c.level || c.level === 'B')) errors.push(`${term.id}: needs at least one B criterion`);
  const criterionIds = term.criteria?.map(c => c.id) ?? [];
  if (new Set(criterionIds).size !== criterionIds.length || criterionIds.some(id => !id)) errors.push(`${term.id}: criterion ids must be unique`);
  for (const c of term.criteria ?? []) if (c.level && !['A', 'S'].includes(c.level)) errors.push(`${term.id}/${c.id}: level must be A or S (omit for B)`);
  for (const id of term.related ?? []) if (!ids.has(id)) errors.push(`${term.id}: unknown related id ${id}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const marker = '\n];\n\nexport const termById';
if (!source.includes(marker)) throw new Error('terms.ts layout changed; update add-terms.mjs');
const body = incoming.map(term => JSON.stringify({ ...term, commonMistakes: term.commonMistakes ?? [], related: term.related ?? [] }, ['id', 'name', 'reading', 'category', 'definition', 'example', 'related', 'criteria', 'title', 'hint', 'level', 'commonMistakes'], 2).replace(/^/gm, '  ')).join(',\n');
writeFileSync(file, source.replace(marker, `,\n${body}${marker}`));
console.log(`added ${incoming.length} terms (${existing.length + incoming.length} total)`);
