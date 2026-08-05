async function verifyLiveAlt() {
  const url = 'https://www.sutoroberrys.jp/store/fukuoka/news/news-1785718651524';
  try {
    const res = await fetch(url);
    console.log('HTTP Status Code:', res.status);

    const html = await res.text();

    console.log('\n--- 1. ALL <img> TAGS IN HTML ---');
    const imgTags = html.match(/<img[^>]*>/gi) || [];
    console.log(`Total <img> tags found: ${imgTags.length}`);
    imgTags.forEach((img, idx) => {
      console.log(`Image ${idx + 1}: ${img}`);
    });

    console.log('\n--- 2. CHECK EMPTY alt="" COUNT ON IMAGES ---');
    const emptyAltImgs = imgTags.filter((img) => /alt=""/i.test(img));
    console.log(`Count of <img> with alt="": ${emptyAltImgs.length}`);

    console.log('\n--- 3. CHECK TITLE FALLBACK ALT ON HERO IMAGE ---');
    const heroImgWithTitle = imgTags.find((img) => img.includes('alt="【福岡店】新人セラピスト「りく」「青空（せいら）」が入店しました"'));
    console.log('Hero image has correct title fallback alt:', !!heroImgWithTitle);

  } catch (err) {
    console.error('Fetch error:', err);
  }
}

verifyLiveAlt();
