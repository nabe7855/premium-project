async function verifyLiveAreaBlock() {
  const url = 'https://www.sutoroberrys.jp/amolab/voice-aya';
  console.log(`Fetching live URL: ${url} ...`);

  const res = await fetch(url);
  const html = await res.text();

  console.log(`HTTP Status: ${res.status}`);

  // Extract area select block HTML
  const blockMatch = html.match(/<div class="area-select-block[\s\S]*?<\/div>\s*<\/div>/);
  if (!blockMatch) {
    console.error('Area select block not found in live HTML!');
    return;
  }

  console.log('\n=== LIVE AREA SELECT BLOCK HTML ===');
  console.log(blockMatch[0]);

  // Extract all 5 href attributes inside area select block
  const hrefMatches = [...blockMatch[0].matchAll(/href="([^"]+)"/g)];
  console.log('\n=== 5 HREF OUTPUTS FROM LIVE PRODUCTION HTML ===');
  hrefMatches.forEach((m, idx) => {
    console.log(`Card ${idx + 1}: href="${m[1]}"`);
  });

  // Verify landing page status for each
  console.log('\n=== VERIFYING LANDING HTTP STATUS FOR ALL 5 HREFS ===');
  for (const m of hrefMatches) {
    const href = m[1];
    const fullUrl = href.startsWith('/') ? `https://www.sutoroberrys.jp${href}` : href;
    try {
      const resp = await fetch(fullUrl, { method: 'HEAD' });
      console.log(`href="${href}" -> Landing URL: ${fullUrl} [HTTP ${resp.status} ${resp.status === 200 ? '✅ PASS' : '❌ FAIL'}]`);
    } catch (e) {
      console.error(`href="${href}" -> Error fetching ${fullUrl}:`, e.message);
    }
  }
}

verifyLiveAreaBlock().catch(console.error);
