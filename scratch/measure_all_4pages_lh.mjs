import { execSync } from 'child_process';
import fs from 'fs';

const pages = [
  { name: 'TopPage', path: '/', url: 'https://www.sutoroberrys.jp/' },
  { name: 'FukuokaStore', path: '/store/fukuoka', url: 'https://www.sutoroberrys.jp/store/fukuoka' },
  { name: 'YokohamaStore', path: '/store/yokohama', url: 'https://www.sutoroberrys.jp/store/yokohama' },
  { name: 'FukuokaCastList', path: '/store/fukuoka/cast-list', url: 'https://www.sutoroberrys.jp/store/fukuoka/cast-list' }
];

async function measureAll() {
  console.log('======================================================');
  console.log('=== LIGHTHOUSE MOBILE MEASUREMENT FOR 4 TARGET PAGES ===');
  console.log('======================================================\n');

  const results = [];

  for (const page of pages) {
    console.log(`\n⏳ Measuring: ${page.name} (${page.url})...`);
    const outFile = `scratch/lh_${page.name}.json`;
    const cmd = `npx -y lighthouse ${page.url} --form-factor=mobile --screenEmulation.mobile=true --only-categories=performance --output=json --output-path=${outFile} --chrome-flags="--headless"`;
    
    try {
      execSync(cmd, { stdio: 'pipe' });
      if (fs.existsSync(outFile)) {
        const data = JSON.parse(fs.readFileSync(outFile, 'utf8'));
        const audits = data.audits;
        const lcp = audits['largest-contentful-paint']?.displayValue || 'N/A';
        const cls = audits['cumulative-layout-shift']?.displayValue || '0';
        const networkItems = audits['network-requests']?.details?.items || [];
        const totalTransferBytes = networkItems.reduce((acc, item) => acc + (item.transferSize || 0), 0);
        const totalTransferMB = (totalTransferBytes / 1024 / 1024).toFixed(2);

        results.push({
          name: page.name,
          path: page.path,
          lcp,
          cls,
          transferMB: `${totalTransferMB} MB`,
        });
        console.log(`✅ ${page.name} -> LCP: ${lcp}, CLS: ${cls}, Transfer: ${totalTransferMB} MB`);
      }
    } catch (e) {
      console.error(`Error measuring ${page.name}:`, e.message);
    }
  }

  console.log('\n======================================================');
  console.log('=== FINAL 4 PAGES CWV MEASUREMENT SUMMARY ===');
  console.log('======================================================\n');
  console.table(results);
}

measureAll();
