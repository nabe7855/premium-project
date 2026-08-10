import { execSync } from 'child_process';
import fs from 'fs';

function inspect45SourceAndJsonLd() {
  console.log('=== INSPECTING 4.5 SOURCE AND JSON-LD ===\n');

  // 1. Curl Fukuoka Store Front Page HTML
  const fukuokaHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka"', { encoding: 'utf8' });

  console.log('--- 1. SEARCHING 4.5 IN FUKUOKA STORE FRONT HTML ---');
  const linesWith45 = fukuokaHtml.split('\n').filter(line => line.includes('4.5') || line.includes('4.8'));
  console.log(`Found ${linesWith45.length} lines containing '4.5' or '4.8':`);
  linesWith45.forEach((l, i) => console.log(` [Line ${i + 1}] ${l.trim().slice(0, 150)}`));

  // Extract JSON-LD / AggregateRating from HTML
  console.log('\n--- 6. JSON-LD / AGGREGATERATING IN FUKUOKA HTML ---');
  const jsonLdMatches = fukuokaHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
  console.log(`Found ${jsonLdMatches.length} JSON-LD script tags:`);
  jsonLdMatches.forEach((tag, idx) => {
    console.log(`\n[JSON-LD Tag ${idx + 1}]`);
    console.log(tag);
  });

  // Check Yokohama Store Front HTML
  const yokohamaHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/yokohama"', { encoding: 'utf8' });
  console.log('\n--- 7. JSON-LD / AGGREGATERATING IN YOKOHAMA HTML ---');
  const yokohamaJsonLd = yokohamaHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
  yokohamaJsonLd.forEach((tag, idx) => {
    console.log(`\n[Yokohama JSON-LD Tag ${idx + 1}]`);
    console.log(tag);
  });
}

inspect45SourceAndJsonLd();
