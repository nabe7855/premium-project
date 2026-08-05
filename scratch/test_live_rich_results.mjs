async function testLiveRichResults() {
  const url = 'https://www.sutoroberrys.jp/amolab/voice-aya';
  console.log(`Testing live URL: ${url} ...`);

  const res = await fetch(url);
  const html = await res.text();

  console.log(`HTTP Status: ${res.status}`);

  // (1) Dummy links count
  const hashes = html.match(/href="#"/g);
  console.log(`\n(1) Live href="#" count: ${hashes ? hashes.length : 0} ${(!hashes || hashes.length === 0) ? '✅ PASS' : '❌ FAIL'}`);

  // (2) 5-area block check
  const hasAreaBlock = html.includes('お住まいのエリアから店舗を選ぶ') && html.includes('/store/tokyo') && html.includes('/store/fukuoka') && html.includes('/store/yokohama') && html.includes('/store/nagoya') && html.includes('/store/osaka');
  console.log(`(2) 5-area selection block present: ${hasAreaBlock} ${hasAreaBlock ? '✅ PASS' : '❌ FAIL'}`);

  // (3) FAQ Q5 check
  const hasFaq5 = html.includes('どこで待ち合わせるの？家族にバレませんか？');
  console.log(`(3) FAQ Q5 present in body: ${hasFaq5} ${hasFaq5 ? '✅ PASS' : '❌ FAIL'}`);

  // (4) Heading h2 check
  const h2Faq = /<h2[^>]*>[\s\S]*?よくある質問[\s\S]*?<\/h2>/i.test(html);
  const h2Ed = /<h2[^>]*>[\s\S]*?編集部より[\s\S]*?<\/h2>/i.test(html);
  const h2Rel = /<h2[^>]*>[\s\S]*?あわせて読みたい[\s\S]*?<\/h2>/i.test(html);
  console.log(`(4) Heading h2 check: FAQ(${h2Faq}), Editorial(${h2Ed}), Related(${h2Rel}) ${(h2Faq && h2Ed && h2Rel) ? '✅ PASS' : '❌ FAIL'}`);

  // (5) Title check
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  const liveTitle = titleMatch ? titleMatch[1].trim() : '';
  const expectedTitle = '「このままおばあさんになりたくなかった」｜あやさん（30代・既婚）が女性用風俗の予約ボタンを押すまで｜体験談 | アモラボ (AmoLab) by ストロベリーボーイズ';
  console.log(`(5) Title: "${liveTitle}" ${liveTitle === expectedTitle ? '✅ PASS' : '❌ FAIL'}`);

  // (6) JSON-LD Schemas check
  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  console.log(`\n(6) JSON-LD Schemas found on live page (${jsonLdMatches?.length || 0} total):`);

  jsonLdMatches?.forEach((s, idx) => {
    const text = s.replace(/<[^>]+>/g, '').trim();
    try {
      const parsed = JSON.parse(text);
      console.log(`   Schema ${idx + 1}: @type="${parsed['@type']}"`);
      if (parsed['@type'] === 'FAQPage') {
        console.log(`     -> FAQ count: ${parsed.mainEntity?.length}`);
      } else if (parsed['@type'] === 'BreadcrumbList') {
        console.log(`     -> Items: ${parsed.itemListElement?.map(i => i.name).join(' > ')}`);
      }
    } catch (e) {
      console.log(`   Schema ${idx + 1} parse error:`, e.message);
    }
  });
}

testLiveRichResults().catch(console.error);
