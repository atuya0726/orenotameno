// Explicit live check: one paid assessment per fixture, no retries. Not part of npm test.
import { readFile } from 'node:fs/promises';

const [origin, expectedPolicy] = process.argv.slice(2);
if (!origin || !expectedPolicy) {
  console.error('Usage: node scripts/glossary/check-typo-tolerance.mjs <origin> <expected-policy>');
  process.exit(1);
}
const endpoint = new URL('/api/glossary/evaluate', origin);
const probe = await fetch(endpoint, { signal: AbortSignal.timeout(15_000) });
const policy = probe.headers.get('X-Glossary-Policy');
if (policy !== expectedPolicy) {
  console.error(`Policy mismatch: expected ${expectedPolicy}, received ${policy ?? '(missing)'}. No assessments sent.`);
  process.exit(1);
}
const samples = JSON.parse(await readFile(new URL('./typo-cases.json', import.meta.url), 'utf8'));
const results = await Promise.allSettled(samples.map(async sample => {
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: endpoint.origin },
    body: JSON.stringify({ termId: sample.termId, text: sample.text, usedVoice: sample.usedVoice ?? false }), signal: AbortSignal.timeout(60_000),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`${sample.name}: HTTP ${response.status} ${body.code ?? ''}`);
  if (response.headers.get('X-Glossary-Policy') !== expectedPolicy) throw new Error(`${sample.name}: policy changed during check`);
  const checks = Object.entries(sample.expected).map(([id, expected]) => {
    const actual = body.criteria?.find(c => c.id === id);
    return { id, expected, actual: actual?.status, passed: actual?.status === expected, decision: actual?.decision };
  });
  const passed = checks.every(c => c.passed);
  console.log(JSON.stringify({ name: sample.name, policy, passed, grade: body.grade, checks }));
  return passed;
}));
for (const result of results) if (result.status === 'rejected') console.error(result.reason.message);
if (results.some(r => r.status === 'rejected' || !r.value)) process.exitCode = 1;
