import { execSync } from 'child_process';

function runBothVerifications() {
  console.log('================================================================');
  console.log('=== FULL PRODUCTION VERIFICATION: HUB CASTS & IKEO AUDIT ===');
  console.log('================================================================\n');

  // 1. Verify Top Page (/ ) Popular Therapists (Real Active DB Casts & Store Badges)
  console.log('--- 1. TOP PAGE POPULAR THERAPISTS (REAL DB CASTS & BADGES) ---');
  const hubHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/"', { encoding: 'utf8' });

  const storeBadgeMatches = hubHtml.match(/<span[^>]*>(福岡店|横浜店|東京)<\/span>[\s\S]*?<h3[^>]*>([^<]+)<\/h3>/g) || [];
  console.log(`Found ${storeBadgeMatches.length} real cast card badges in Top Page HTML:`);
  storeBadgeMatches.slice(0, 8).forEach((m, idx) => {
    console.log(`\n[Card ${idx + 1}]`);
    console.log(m.replace(/\s+/g, ' '));
  });

  // Check if old dummy Osaka / Nagoya still exists
  const osakaCount = (hubHtml.match(/大阪店/g) || []).length;
  const nagoyaCount = (hubHtml.match(/名古屋店/g) || []).length;
  console.log(`\nOld Dummy Badges Count -> Osaka: ${osakaCount}, Nagoya: ${nagoyaCount} (Expected: 0)`);

  // 2. Verify Ikeo Fukuoka & Yokohama Title vs H1 (cURL Evidence)
  console.log('\n--- 2. IKEO FUKUOKA & YOKOHAMA TITLE VS H1 (CURL EVIDENCE) ---');
  const fukHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/ikeo/fukuoka-recruit-guide"', { encoding: 'utf8' });
  const fukTitle = fukHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
  const fukH1 = fukHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '';

  console.log(`Fukuoka Title: "${fukTitle}"`);
  console.log(`Fukuoka H1:    "${fukH1}"`);
  console.log(`Title != H1:   ${fukTitle !== fukH1}`);

  const yokHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/ikeo/yokohama-recruit-guide"', { encoding: 'utf8' });
  const yokTitle = yokHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
  const yokH1 = yokHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '';

  console.log(`\nYokohama Title: "${yokTitle}"`);
  console.log(`Yokohama H1:    "${yokH1}"`);
  console.log(`Title != H1:    ${yokTitle !== yokH1}`);

  // 3. Verify Operator Notation Output (cURL Evidence)
  console.log('\n--- 3. OPERATOR NOTATION OUTPUT (CURL EVIDENCE) ---');
  const opMatch = fukHtml.match(/<div[^>]*>※本メディア「イケオラボ」は[\s\S]*?<\/div>/i)?.[0] || '';
  console.log('Operator Notation HTML snippet:');
  console.log(opMatch);

  // 4. Verify /recruit Links to Ikeo (cURL Evidence)
  console.log('\n--- 4. /RECRUIT LINKS TO IKEO ARTICLES (CURL EVIDENCE) ---');
  const recruitHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/recruit"', { encoding: 'utf8' });
  const ikeoLinkMatches = recruitHtml.match(/<a[^>]*href="\/ikeo\/[^"]*"[^>]*>[\s\S]*?<\/a>/gi) || [];
  console.log(`Found ${ikeoLinkMatches.length} links to /ikeo/ in /recruit page:`);
  ikeoLinkMatches.forEach(l => console.log('   ', l.replace(/\s+/g, ' ')));

  // 5. Verify FAQPage JSON-LD in Ikeo Fukuoka & Yokohama
  console.log('\n--- 5. FAQPAGE JSON-LD IN IKEO ARTICLES (CURL EVIDENCE) ---');
  const faqJsonLdFukuoka = fukHtml.match(/<script type="application\/ld\+json">([\s\S]*?FAQPage[\s\S]*?)<\/script>/gi) || [];
  console.log(`Found ${faqJsonLdFukuoka.length} FAQPage JSON-LD script tags in Fukuoka article:`);
  faqJsonLdFukuoka.forEach(tag => console.log(tag));

  const faqJsonLdYokohama = yokHtml.match(/<script type="application\/ld\+json">([\s\S]*?FAQPage[\s\S]*?)<\/script>/gi) || [];
  console.log(`Found ${faqJsonLdYokohama.length} FAQPage JSON-LD script tags in Yokohama article:`);
  faqJsonLdYokohama.forEach(tag => console.log(tag));
}

runBothVerifications();
