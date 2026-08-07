import { execSync } from 'child_process';
import fs from 'fs';

function runLocalLighthouse() {
  console.log('=== RUNNING LIGHTHOUSE MOBILE MEASUREMENT ===\n');

  try {
    // npx lighthouse https://www.sutoroberrys.jp/ --form-factor=mobile --output=json --quiet
    const cmd = 'npx -y lighthouse https://www.sutoroberrys.jp/ --form-factor=mobile --screenEmulation.mobile=true --only-categories=performance --output=json --output-path=scratch/lh_report.json --chrome-flags="--headless"';
    console.log(`Executing: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });

    if (fs.existsSync('scratch/lh_report.json')) {
      const data = JSON.parse(fs.readFileSync('scratch/lh_report.json', 'utf8'));
      const audits = data.audits;
      const score = data.categories?.performance?.score * 100;
      const lcp = audits['largest-contentful-paint']?.displayValue;
      const cls = audits['cumulative-layout-shift']?.displayValue;
      const fcp = audits['first-contentful-paint']?.displayValue;

      console.log(`\n✅ Lighthouse Mobile Results for https://www.sutoroberrys.jp/:`);
      console.log(`- Performance Score: ${score}`);
      console.log(`- LCP (Largest Contentful Paint): ${lcp}`);
      console.log(`- CLS (Cumulative Layout Shift): ${cls}`);
      console.log(`- FCP (First Contentful Paint): ${fcp}`);
    }
  } catch (e) {
    console.error('Lighthouse execution error:', e.message);
  }
}

runLocalLighthouse();
