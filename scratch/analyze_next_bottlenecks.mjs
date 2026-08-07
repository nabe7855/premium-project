import fs from 'fs';

const pages = [
  { name: 'TopPage', file: 'scratch/lh_TopPage.json' },
  { name: 'FukuokaStore', file: 'scratch/lh_FukuokaStore.json' },
  { name: 'YokohamaStore', file: 'scratch/lh_YokohamaStore.json' },
  { name: 'FukuokaCastList', file: 'scratch/lh_FukuokaCastList.json' }
];

function analyzeBottlenecks() {
  console.log('======================================================');
  console.log('=== DETAILED BOTTLENECK ANALYSIS BEYOND IMAGES ===');
  console.log('======================================================\n');

  for (const p of pages) {
    if (!fs.existsSync(p.file)) continue;
    const data = JSON.parse(fs.readFileSync(p.file, 'utf8'));
    const audits = data.audits;

    console.log(`\n--------------------------------------------------`);
    console.log(`📄 PAGE: ${p.name}`);
    console.log(`--------------------------------------------------`);
    console.log(`LCP Value: ${audits['largest-contentful-paint']?.displayValue}`);
    console.log(`TTFB: ${audits['server-response-time']?.displayValue || audits['server-response-time']?.numericValue + ' ms'}`);
    console.log(`Total Byte Weight: ${audits['total-byte-weight']?.displayValue}`);

    // Main thread work
    console.log(`Main Thread Work Time: ${audits['mainthread-work-breakdown']?.displayValue}`);
    console.log(`JS Execution Time: ${audits['bootup-time']?.displayValue}`);

    // Third-party summary
    const tpDetails = audits['third-party-summary']?.details?.items || [];
    if (tpDetails.length > 0) {
      console.log('\nTop Third-Party Scripts/Assets Blocking Main Thread:');
      tpDetails.slice(0, 5).forEach(tp => {
        console.log(`- ${tp.entity?.text || 'Third-Party'}: Transfer ${(tp.transferSize/1024).toFixed(1)} KB, Main Thread Time: ${tp.blockingTime?.toFixed(0) || 0} ms`);
      });
    }

    // Diagnostic opportunities
    console.log('\nTop Diagnostic Opportunities for Speed:');
    ['render-blocking-resources', 'unused-javascript', 'unminified-javascript', 'offscreen-images'].forEach(key => {
      if (audits[key] && audits[key].numericValue > 0) {
        console.log(`- ${audits[key].title}: ${audits[key].displayValue}`);
      }
    });
  }
}

analyzeBottlenecks();
