import fs from 'fs';

const htmlPath = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/ストロベリーボーイズ運用/めぐ/めぐ_記事_公開セット/index.html';
let html = fs.readFileSync(htmlPath, 'utf-8');

// Extract body inner HTML (between <body> and </body>)
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyContent = bodyMatch ? bodyMatch[1].trim() : html;

// 1. Replace image paths: images/aya- -> /images/amolab/aya/aya-
bodyContent = bodyContent.replace(/src="images\//g, 'src="/images/amolab/aya/');

// 2. Check stealth marketing compliance text
const complianceText = '<p className="text-xs text-gray-500 bg-pink-50/60 p-3 rounded-lg border border-pink-100 mb-6">※本メディア「アモラボ」は、女性用風俗ストロベリーボーイズが運営しています。</p>';

if (!bodyContent.includes('本メディア「アモラボ」は、女性用風俗ストロベリーボーイズが運営しています')) {
  // Prepend compliance text right after the header or at the top of article
  bodyContent = complianceText + '\n' + bodyContent;
}

// 3. Check for any unwanted regional claims ("福岡で利用", "横浜で利用")
const fukuokaMatch = bodyContent.match(/福岡店?で?利用/g);
const yokohamaMatch = bodyContent.match(/横浜店?で?利用/g);

console.log('Fukuoka usage claims found:', fukuokaMatch);
console.log('Yokohama usage claims found:', yokohamaMatch);

console.log('Formatted body length:', bodyContent.length);
