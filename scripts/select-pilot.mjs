import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/lib/lectures/catalog.json'), 'utf-8'));

const domains = ['seerah', 'tafsir', 'constitutional-law', 'civic-ethics', 'iqbal'];
const pilot = [];

for (const d of domains) {
  const matches = catalog.filter(c => c.domainId === d);
  pilot.push(matches[0]);
  pilot.push(matches[Math.floor(matches.length / 2)]);
}

console.log('--- 10-LECTURE PILOT CANDIDATES ---');
pilot.forEach((p, idx) => {
  const mins = Math.round((p.durationSeconds || 0) / 60);
  console.log(`${idx + 1}. [${p.domainId}] ${p.title} | ID: ${p.youtubeId} | ${mins}m`);
});
