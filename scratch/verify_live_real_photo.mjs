async function verifyRealPhotoLive() {
  const url = 'https://www.sutoroberrys.jp/amolab/voice-aya';
  console.log(`Fetching live URL: ${url} ...`);

  const res = await fetch(url);
  const html = await res.text();

  console.log(`HTTP Status: ${res.status}`);

  const hasPhoto = html.includes('aya-real-profile.webp');
  console.log(`\nReal photo (aya-real-profile.webp) present on live page: ${hasPhoto} ${hasPhoto ? '✅ PASS' : '❌ FAIL'}`);

  if (hasPhoto) {
    const photoMatch = html.match(/<div class="profile-photo-wrapper[\s\S]*?<\/div>/);
    console.log('\n=== LIVE REAL PHOTO HTML SNIPPET ===');
    console.log(photoMatch ? photoMatch[0] : 'Snippet not found');

    // Test photo asset URL directly
    const imgUrl = 'https://www.sutoroberrys.jp/images/amolab/aya/aya-real-profile.webp';
    const imgRes = await fetch(imgUrl, { method: 'HEAD' });
    console.log(`\nReal photo WebP URL (${imgUrl}) -> HTTP ${imgRes.status} ${imgRes.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
  }
}

verifyRealPhotoLive().catch(console.error);
