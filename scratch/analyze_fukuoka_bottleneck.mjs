import fs from 'fs';

function analyzeFukuoka() {
  console.log('======================================================');
  console.log('=== (3-D) FUKUOKA STORE TOP DETAILED BOTTLENECK ANALYSIS ===');
  console.log('======================================================\n');

  if (!fs.existsSync('scratch/lh_FukuokaStore.json')) {
    console.log('File scratch/lh_FukuokaStore.json not found.');
    return;
  }

  const data = JSON.parse(fs.readFileSync('scratch/lh_FukuokaStore.json', 'utf8'));
  const audits = data.audits;

  // LCP Target Element
  console.log('【1. Fukuoka LCP Target Element】');
  const lcpAudit = audits['largest-contentful-paint-element'];
  if (lcpAudit && lcpAudit.details && lcpAudit.details.items) {
    lcpAudit.details.items.forEach(item => {
      console.log('LCP Element HTML:', item.node?.snippet);
      console.log('LCP Element Selector:', item.node?.selector);
    });
  }

  // Network Requests
  console.log('\n【2. Top Network Requests on Fukuoka Store】');
  const items = audits['network-requests']?.details?.items || [];
  items.sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0));

  items.slice(0, 15).forEach((item, idx) => {
    const sizeKB = ((item.transferSize || 0) / 1024).toFixed(1);
    console.log(`${idx + 1}. [${item.resourceType}] ${sizeKB} KB - ${item.url}`);
  });

  // Diagnostics
  console.log('\n【3. Diagnostic Timings for Fukuoka】');
  console.log('LCP Numeric Value:', audits['largest-contentful-paint']?.displayValue);
  console.log('TTFB:', audits['server-response-time']?.displayValue || audits['server-response-time']?.numericValue + ' ms');
  console.log('Main Thread Work Time:', audits['mainthread-work-breakdown']?.displayValue);
  console.log('JS Execution Time:', audits['bootup-time']?.displayValue);
}

analyzeFukuoka();
