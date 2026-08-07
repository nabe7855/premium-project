import fs from 'fs';

const pages = [
  { name: 'TopPage', file: 'scratch/lh_TopPage.json' },
  { name: 'FukuokaStore', file: 'scratch/lh_FukuokaStore.json' },
  { name: 'YokohamaStore', file: 'scratch/lh_YokohamaStore.json' },
  { name: 'FukuokaCastList', file: 'scratch/lh_FukuokaCastList.json' }
];

function analyze() {
  console.log('===========================================================');
  console.log('=== (1) TOP 10 LARGEST REQUESTS & (3) LCP TARGET ELEMENT ===');
  console.log('===========================================================\n');

  for (const p of pages) {
    console.log(`\n========================================`);
    console.log(`📄 PAGE: ${p.name}`);
    console.log(`========================================`);

    if (!fs.existsSync(p.file)) {
      console.log(`File not found: ${p.file}`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(p.file, 'utf8'));
    const audits = data.audits;

    // LCP Element
    const lcpAudit = audits['largest-contentful-paint-element'];
    console.log('\n【LCP Target Element】');
    if (lcpAudit && lcpAudit.details && lcpAudit.details.items && lcpAudit.details.items.length > 0) {
      lcpAudit.details.items.forEach(item => {
        console.log(`- Snippet: ${item.node?.snippet}`);
        console.log(`- Selector: ${item.node?.selector}`);
      });
    } else {
      console.log('LCP element details not available in audit.');
    }

    // Top 10 Requests
    const items = audits['network-requests']?.details?.items || [];
    items.sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0));

    console.log('\n【Top 10 Largest Network Requests】');
    items.slice(0, 10).forEach((item, idx) => {
      const sizeKB = ((item.transferSize || 0) / 1024).toFixed(1);
      const sizeMB = ((item.transferSize || 0) / 1024 / 1024).toFixed(2);
      const sizeStr = item.transferSize > 1000000 ? `${sizeMB} MB` : `${sizeKB} KB`;
      console.log(`${idx + 1}. [${item.resourceType || 'Unknown'}] ${sizeStr} - ${item.url}`);
    });
  }
}

analyze();
