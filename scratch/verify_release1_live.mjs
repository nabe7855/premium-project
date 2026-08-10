import { execSync } from 'child_process';

function verifyRelease1Live() {
  console.log('================================================================');
  console.log('=== VERIFYING RELEASE 1 LIVE DEPLOYMENT (301 & DEGRADATION CHECK) ===');
  console.log('================================================================\n');

  // 1. Fukuoka Recruit Guide 301 Check
  console.log('--- 1. /amolab/fukuoka-recruit-guide (301 Redirect Check) ---');
  const fukuokaHeaders = execSync('curl.exe -sI "https://www.sutoroberrys.jp/amolab/fukuoka-recruit-guide"', { encoding: 'utf8' });
  const fukuokaCode = fukuokaHeaders.match(/HTTP\/[12\.]+\s+(\d+)/i)?.[1];
  const fukuokaLocation = fukuokaHeaders.match(/location:\s*([^\r\n]+)/i)?.[1];

  console.log(`HTTP Status: ${fukuokaCode}`);
  console.log(`Location Header: ${fukuokaLocation}`);

  // 2. Yokohama Recruit Guide 301 Check
  console.log('\n--- 2. /amolab/yokohama-recruit-guide (301 Redirect Check) ---');
  const yokohamaHeaders = execSync('curl.exe -sI "https://www.sutoroberrys.jp/amolab/yokohama-recruit-guide"', { encoding: 'utf8' });
  const yokohamaCode = yokohamaHeaders.match(/HTTP\/[12\.]+\s+(\d+)/i)?.[1];
  const yokohamaLocation = yokohamaHeaders.match(/location:\s*([^\r\n]+)/i)?.[1];

  console.log(`HTTP Status: ${yokohamaCode}`);
  console.log(`Location Header: ${yokohamaLocation}`);

  // 3. Ikeo Target Page HTTP 200 Check
  console.log('\n--- 3. /ikeo/fukuoka-recruit-guide (Target 200 Check) ---');
  const ikeoFukHeaders = execSync('curl.exe -sI "https://www.sutoroberrys.jp/ikeo/fukuoka-recruit-guide"', { encoding: 'utf8' });
  const ikeoFukCode = ikeoFukHeaders.match(/HTTP\/[12\.]+\s+(\d+)/i)?.[1];
  console.log(`HTTP Status: ${ikeoFukCode}`);

  // 4. Degradation Check on Genuine Amolab Articles
  console.log('\n--- 4. DEGRADATION CHECK ON GENUINE AMOLAB ARTICLES ---');
  const ayaHeaders = execSync('curl.exe -sI "https://www.sutoroberrys.jp/amolab/voice-aya"', { encoding: 'utf8' });
  const ayaCode = ayaHeaders.match(/HTTP\/[12\.]+\s+(\d+)/i)?.[1];

  const guideHeaders = execSync('curl.exe -sI "https://www.sutoroberrys.jp/amolab/jyosei-fuzoku-guide"', { encoding: 'utf8' });
  const guideCode = guideHeaders.match(/HTTP\/[12\.]+\s+(\d+)/i)?.[1];

  console.log(`/amolab/voice-aya HTTP Status: ${ayaCode} (Expected: 200)`);
  console.log(`/amolab/jyosei-fuzoku-guide HTTP Status: ${guideCode} (Expected: 200)`);

  // 5. Sitemap Check
  console.log('\n--- 5. SITEMAP.XML CHECK ---');
  const sitemapXml = execSync('curl.exe -s "https://www.sutoroberrys.jp/sitemap.xml"', { encoding: 'utf8' });

  const hasAmolabRecruitInSitemap = sitemapXml.includes('/amolab/fukuoka-recruit-guide');
  const hasIkeoRecruitInSitemap = sitemapXml.includes('/ikeo/fukuoka-recruit-guide');
  const hasStoreRecruitInSitemap = sitemapXml.includes('/store/fukuoka/recruit');

  console.log(`Has /amolab/fukuoka-recruit-guide in sitemap: ${hasAmolabRecruitInSitemap} (Expected: false)`);
  console.log(`Has /ikeo/fukuoka-recruit-guide in sitemap: ${hasIkeoRecruitInSitemap} (Expected: true)`);
  console.log(`Has /store/fukuoka/recruit in sitemap: ${hasStoreRecruitInSitemap} (Expected: true)`);
}

verifyRelease1Live();
