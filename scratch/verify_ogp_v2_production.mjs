import { execSync } from 'child_process';

function verifyOgpV2Production() {
  console.log('=== VERIFYING PRODUCTION OGP V2 IMAGE RESPONSE ===\n');

  for (const slug of ['fukuoka', 'yokohama']) {
    const pageUrl = `https://www.sutoroberrys.jp/store/${slug}/reviews`;
    console.log(`Checking HTML meta tags for ${pageUrl}...`);
    const html = execSync(`curl.exe -s "${pageUrl}"`, { encoding: 'utf8' });

    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    console.log(`   og:image tag:`, ogImageMatch ? ogImageMatch[1] : 'NOT FOUND');

    const ogpImgUrl = `https://www.sutoroberrys.jp/ogp/store-${slug}-v2.png`;
    try {
      const imgStatus = execSync(`curl.exe -s -o NUL -w "%{http_code}" "${ogpImgUrl}"`, { encoding: 'utf8' });
      console.log(`   Image HTTP Status (${ogpImgUrl}):`, imgStatus);
    } catch (e) {
      console.error('   Image fetch error:', e);
    }
    console.log('');
  }
}

verifyOgpV2Production();
