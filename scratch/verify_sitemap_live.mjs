import { execSync } from 'child_process';

function verifySitemapAndRedirect() {
  console.log('=== VERIFYING SITEMAP & 301 REDIRECT LIVE ===\n');

  // Revalidate sitemap.xml
  try {
    execSync(`curl.exe -X POST -H "Content-Type: application/json" -d "{\\"path\\":\\"/sitemap.xml\\"}" "https://www.sutoroberrys.jp/api/revalidate"`, { encoding: 'utf8' });
  } catch (e) {}

  const sitemapHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/sitemap.xml"', { encoding: 'utf8' });
  const seiraSitemapLines = sitemapHtml.split('\n').filter(l => l.includes('seira-interview-vol4'));
  console.log('Sitemap Lines for seira-interview-vol4:');
  seiraSitemapLines.forEach(l => console.log('  ', l.trim()));

  const uuidUrl = 'https://www.sutoroberrys.jp/store/fukuoka/interview/8df77013-ed2c-435f-8f9e-83f1cb60f41f/seira-interview-vol4';
  const redirectRes = execSync(`curl.exe -i -s "${uuidUrl}"`, { encoding: 'utf8' }).slice(0, 600);
  console.log('\nUUID URL Raw Response Header:\n' + redirectRes);
}

verifySitemapAndRedirect();
