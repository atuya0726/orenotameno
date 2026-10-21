#!/usr/bin/env node
// Appends glossary terms from a JSON array file to src/features/glossary/terms.ts.
// Usage: node scripts/past-exam/add-terms.mjs <terms.json>
// Rejects duplicate ids or names, unknown related ids, and criteria without ids, so the file stays consistent.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const file = fileURLToPath(new URL('../../src/features/glossary/terms.ts', import.meta.url));
const source = readFileSync(file, 'utf8');
const incoming = JSON.parse(readFileSync(process.argv[2] ?? process.exit(console.error('usage: add-terms.mjs <terms.json>') ?? 1), 'utf8'));

const existing = [...source.matchAll(/^ {4}"id": "([^"]+)",\n {4}"name": "([^"]+)",(?:\n {4}"aliases": (\[[^\]]*\]),)?/gm)].map(m => ({ id: m[1], name: m[2], aliases: m[3] ? JSON.parse(m[3]) : [] }));
const ids = new Set(existing.map(t => t.id));
// Names and aliases share one namespace, compared the way the app matches question words.
const normalize = text => text.normalize('NFKC').toLowerCase().replace(/ディジタル/g, 'デジタル').replace(/[\s・]/g, '');
const names = new Set(existing.flatMap(t => [t.name, ...t.aliases]).map(normalize));
const errors = [];
for (const term of incoming) {
  if (ids.has(term.id)) errors.push(`duplicate id: ${term.id}`);
  for (const word of [term.name, ...(term.aliases ?? [])]) {
    if (names.has(normalize(word))) errors.push(`duplicate name or alias: ${word} (${term.id})`);
    names.add(normalize(word));
  }
  ids.add(term.id);
}
for (const term of incoming) {
  for (const key of ['id', 'name', 'reading', 'category', 'definition', 'example']) if (!term[key]) errors.push(`${term.id}: missing ${key}`);
  if (!term.criteria?.some(c => !c.level || c.level === 'basic')) errors.push(`${term.id}: needs at least one basic criterion`);
  const criterionIds = term.criteria?.map(c => c.id) ?? [];
  if (new Set(criterionIds).size !== criterionIds.length || criterionIds.some(id => !id)) errors.push(`${term.id}: criterion ids must be unique`);
  for (const c of term.criteria ?? []) if (c.level && !['basic', 'deep'].includes(c.level)) errors.push(`${term.id}/${c.id}: level must be basic or deep (omit for basic)`);
  for (const id of term.related ?? []) if (!ids.has(id)) errors.push(`${term.id}: unknown related id ${id}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const marker = '\n];\n\nexport const termById';
if (!source.includes(marker)) throw new Error('terms.ts layout changed; update add-terms.mjs');
const body = incoming.map(term => JSON.stringify({ ...term, aliases: term.aliases?.length ? term.aliases : undefined, commonMistakes: term.commonMistakes ?? [], related: term.related ?? [] }, ['id', 'name', 'aliases', 'reading', 'category', 'definition', 'example', 'related', 'criteria', 'title', 'hint', 'level', 'commonMistakes'], 2).replace(/^/gm, '  ')).join(',\n');
writeFileSync(file, source.replace(marker, `,\n${body}${marker}`));
console.log(`added ${incoming.length} terms (${existing.length + incoming.length} total)`);
