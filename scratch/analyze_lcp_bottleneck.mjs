import fs from 'fs';

function analyzeLCP() {
  console.log('======================================================');
  console.log('=== (3) LCP 20.2s BOTTLENECK ANALYSIS & DIAGNOSTICS ===');
  console.log('======================================================\n');

  if (!fs.existsSync('scratch/lh_report.json')) {
    console.log('No Lighthouse report JSON found.');
    return;
  }

  const report = JSON.parse(fs.readFileSync('scratch/lh_report.json', 'utf8'));
  const audits = report.audits;

  // LCP Audit Details
  const lcpAudit = audits['largest-contentful-paint-element'];
  console.log('【1. Largest Contentful Paint (LCP) Target Element】');
  if (lcpAudit && lcpAudit.details && lcpAudit.details.items) {
    lcpAudit.details.items.forEach(item => {
      console.log('LCP Element HTML:', item.node?.snippet);
      console.log('LCP Element Selector:', item.node?.selector);
    });
  }

  console.log('\n----------------------------------------------------\n');

  // LCP Breakdown (TTFB, Load Delay, Load Time, Render Delay)
  const lcpBreakdown = audits['lcp-breakdown'];
  console.log('【2. LCP Phase Breakdown】');
  if (lcpBreakdown && lcpBreakdown.details) {
    console.log(JSON.stringify(lcpBreakdown.details, null, 2));
  } else {
    // Audit metric timings
    console.log('LCP Numeric Value:', audits['largest-contentful-paint']?.numericValue, 'ms');
    console.log('TTFB (Server Response Time):', audits['server-response-time']?.numericValue, 'ms');
  }

  console.log('\n----------------------------------------------------\n');

  // Network Requests breakdown
  console.log('【3. Top Slowest Network Requests & Images】');
  const networkItems = audits['network-requests']?.details?.items || [];
  const slowRequests = networkItems.filter(r => r.resourceType === 'Image' || r.transferSize > 50000);

  slowRequests.sort((a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime));

  slowRequests.slice(0, 10).forEach(req => {
    const duration = (req.endTime - req.startTime);
    console.log(`- URL: ${req.url.substring(0, 80)}`);
    console.log(`  Type: ${req.resourceType}, Size: ${(req.transferSize / 1024).toFixed(1)} KB, Duration: ${duration.toFixed(0)} ms, TTFB: ${(req.responseReceivedTime - req.startTime).toFixed(0)} ms`);
  });
}

analyzeLCP();
