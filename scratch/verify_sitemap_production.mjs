import { execSync } from 'child_process';

function verifySitemapProduction() {
  console.log('=== VERIFYING SITEMAP PRODUCTION OUTPUT ===\n');
  const sitemapXml = execSync('curl.exe -s "https://www.sutoroberrys.jp/sitemap.xml"', { encoding: 'utf8' });

  const ikeoUrls = sitemapXml.match(/<loc>[^<]*ikeo[^<]*<\/loc>/gi) || [];
  console.log(`Found ${ikeoUrls.length} Ikeo URLs in sitemap.xml:`);
  ikeoUrls.forEach(url => console.log('   ', url));
}

verifySitemapProduction();
