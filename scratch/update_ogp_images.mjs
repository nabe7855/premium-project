import fs from 'fs';
import path from 'path';

const generatedFukuoka = 'C:\\Users\\nabe7\\.gemini\\antigravity\\brain\\05249213-5ec4-4daa-842a-ba7a34d81fe9\\ogp_fukuoka_store_1786214023151.jpg';
const generatedYokohama = 'C:\\Users\\nabe7\\.gemini\\antigravity\\brain\\05249213-5ec4-4daa-842a-ba7a34d81fe9\\ogp_yokohama_store_1786214037165.jpg';
const generatedDefault = 'C:\\Users\\nabe7\\.gemini\\antigravity\\brain\\05249213-5ec4-4daa-842a-ba7a34d81fe9\\ogp_default_brand_1786214052066.jpg';

const ogpDir = path.join(process.cwd(), 'public', 'ogp');

// Copy Fukuoka
fs.copyFileSync(generatedFukuoka, path.join(ogpDir, 'store-fukuoka.png'));
console.log('✅ Updated public/ogp/store-fukuoka.png');

// Copy Yokohama
fs.copyFileSync(generatedYokohama, path.join(ogpDir, 'store-yokohama.png'));
console.log('✅ Updated public/ogp/store-yokohama.png');

// Copy Default
fs.copyFileSync(generatedDefault, path.join(ogpDir, 'default.png'));
console.log('✅ Updated public/ogp/default.png');

// Copy Default to other stores & recruits
const otherStores = ['store-tokyo.png', 'store-osaka.png', 'store-nagoya.png', 'store-honten.png'];
const recruits = ['recruit-fukuoka.png', 'recruit-yokohama.png', 'recruit-tokyo.png', 'recruit-osaka.png', 'recruit-nagoya.png', 'recruit-honten.png'];

[...otherStores, ...recruits].forEach((file) => {
  fs.copyFileSync(generatedDefault, path.join(ogpDir, file));
  console.log(`✅ Updated public/ogp/${file}`);
});
