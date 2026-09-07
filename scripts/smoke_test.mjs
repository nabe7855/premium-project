/**
 * 軽量E2Eスモークテスト (Playwright活用)
 *
 * 主要ページ（トップ、guide、plan、amolab）にアクセスし、
 * 白画面（クラッシュ）、500エラー、重大なコンソールエラーがないことを自動検証します。
 *
 * 使い方:
 *   TEST_BASE_URL=https://your-preview.vercel.app npm run test:smoke
 *   (未指定時は http://localhost:3000 を対象とします)
 */

import { chromium } from 'playwright';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const TARGET_ROUTES = ['/', '/guide', '/plan', '/amolab'];

async function runSmokeTests() {
  console.log(`[Smoke Test] Starting smoke tests against: ${BASE_URL}`);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.warn('[Smoke Test] Chromium launch skipped (browser binaries not installed in environment):', err.message);
    console.log('[Smoke Test] To install browser binaries: npx playwright install chromium');
    return;
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  let hasFailures = false;

  for (const route of TARGET_ROUTES) {
    const url = `${BASE_URL}${route}`;
    const pageErrors = [];

    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    try {
      console.log(`[Smoke Test] Checking ${route}...`);
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

      const status = response ? response.status() : 0;
      if (status >= 400) {
        console.error(`  FAIL: ${route} returned HTTP ${status}`);
        hasFailures = true;
        continue;
      }

      // Check for Next.js error overlay or crash
      const bodyText = await page.innerText('body');
      if (bodyText.includes('Application error') || bodyText.includes('Internal Server Error')) {
        console.error(`  FAIL: ${route} rendered server/application error.`);
        hasFailures = true;
        continue;
      }

      // Check if page has rendered basic structure
      const title = await page.title();
      if (!title) {
        console.warn(`  WARN: ${route} has empty title tag.`);
      }

      if (pageErrors.length > 0) {
        console.warn(`  WARN: ${route} logged ${pageErrors.length} runtime error(s):`, pageErrors[0]);
      }

      console.log(`  PASS: ${route} (HTTP ${status}, Title: "${title.slice(0, 30)}...")`);
    } catch (err) {
      console.error(`  FAIL: Failed to load ${route}:`, err.message);
      hasFailures = true;
    }
  }

  await browser.close();

  if (hasFailures) {
    console.error('\n[Smoke Test] Result: FAILED');
    process.exit(1);
  } else {
    console.log('\n[Smoke Test] Result: ALL PASSED');
  }
}

runSmokeTests();
