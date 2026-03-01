import fs from 'fs';
import { getTodayCastsByStore } from '../src/lib/getTodayCastsByStore';

// Load .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [key, ...val] = line.split('=');
      if (!key || !val) return ['', ''];
      return [
        key.trim(),
        val
          .join('=')
          .trim()
          .replace(/^["'](.*)["']$/, '$1'),
      ];
    })
    .filter(([k]) => k),
);

// Manually set process.env for standard imports if needed,
// though getTodayCastsByStore imports supabaseClient which might already be imported.
// In this case, we might need to mock or ensure the env is set BEFORE any imports.
process.env.NEXT_PUBLIC_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function test() {
  const stores = ['fukuoka', 'yokohama'];
  const today = '2026-03-01';
  const results: any = {};

  for (const slug of stores) {
    console.log(`Testing ${slug}...`);
    try {
      const casts = await getTodayCastsByStore(slug, today);
      results[slug] = {
        count: casts.length,
        casts: casts,
      };
    } catch (e: any) {
      console.error(`Error for ${slug}:`, e);
      results[slug] = { error: e.message };
    }
  }

  fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2));
  console.log('Results written to test_results.json');
}

test();
