import https from 'https';

async function measurePageSpeed() {
  console.log('=== (3) CWV MEASUREMENT VIA PAGESPEED INSIGHTS API ===\n');

  const url = 'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://www.sutoroberrys.jp/&strategy=mobile';

  https.get(url, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(body);
        const audits = json.lighthouseResult?.audits;

        if (audits) {
          const lcp = audits['largest-contentful-paint']?.displayValue || audits['largest-contentful-paint']?.numericValue;
          const cls = audits['cumulative-layout-shift']?.displayValue || audits['cumulative-layout-shift']?.numericValue;
          const fcp = audits['first-contentful-paint']?.displayValue;
          const score = json.lighthouseResult?.categories?.performance?.score * 100;

          console.log(`📊 Lighthouse Mobile Results for https://www.sutoroberrys.jp/:`);
          console.log(`- Performance Score: ${score}`);
          console.log(`- LCP (Largest Contentful Paint): ${lcp}`);
          console.log(`- CLS (Cumulative Layout Shift): ${cls}`);
          console.log(`- FCP (First Contentful Paint): ${fcp}`);
        } else {
          console.log('API Response status:', json.error?.message || 'No audit data');
        }
      } catch (e) {
        console.error('Failed to parse PageSpeed Insights response:', e);
      }
    });
  }).on('error', err => {
    console.error('HTTP Error:', err);
  });
}

measurePageSpeed();
