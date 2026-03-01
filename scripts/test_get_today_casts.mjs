import fs from 'fs';
import { getTodayCastsByStore } from './src/lib/getTodayCastsByStore.js';

async function test() {
  const stores = ['fukuoka', 'yokohama'];
  const today = '2026-03-01';
  const results = {};

  for (const slug of stores) {
    console.log(`Testing ${slug}...`);
    try {
      const casts = await getTodayCastsByStore(slug, today);
      results[slug] = {
        count: casts.length,
        casts: casts,
      };
    } catch (e) {
      results[slug] = { error: e.message };
    }
  }

  fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2));
}

test();
