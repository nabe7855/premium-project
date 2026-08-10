import fs from 'fs';
import path from 'path';

const userOriginalLogo = 'C:\\Users\\nabe7\\.gemini\\antigravity\\brain\\05249213-5ec4-4daa-842a-ba7a34d81fe9\\.user_uploaded\\media_1786215951094.png';
const generatedFukuokaV2 = 'C:\\Users\\nabe7\\.gemini\\antigravity\\brain\\05249213-5ec4-4daa-842a-ba7a34d81fe9\\ogp_fukuoka_v2_1786216038075.jpg';
const generatedYokohamaV2 = 'C:\\Users\\nabe7\\.gemini\\antigravity\\brain\\05249213-5ec4-4daa-842a-ba7a34d81fe9\\ogp_yokohama_v2_1786216056854.jpg';
const generatedDefaultV2 = 'C:\\Users\\nabe7\\.gemini\\antigravity\\brain\\05249213-5ec4-4daa-842a-ba7a34d81fe9\\ogp_default_v2_1786216074613.jpg';

const publicDir = path.join(process.cwd(), 'public');
const ogpDir = path.join(publicDir, 'ogp');

// Copy official original logo to public/strawberry-bunny.png & public/ogp/logo-official.png
fs.copyFileSync(userOriginalLogo, path.join(publicDir, 'strawberry-bunny.png'));
fs.copyFileSync(userOriginalLogo, path.join(ogpDir, 'logo-official.png'));
console.log('✅ Updated public/strawberry-bunny.png & public/ogp/logo-official.png');

// Copy Fukuoka v2 & v1
fs.copyFileSync(generatedFukuokaV2, path.join(ogpDir, 'store-fukuoka-v2.png'));
fs.copyFileSync(generatedFukuokaV2, path.join(ogpDir, 'store-fukuoka.png'));
console.log('✅ Updated store-fukuoka-v2.png and store-fukuoka.png');

// Copy Yokohama v2 & v1
fs.copyFileSync(generatedYokohamaV2, path.join(ogpDir, 'store-yokohama-v2.png'));
fs.copyFileSync(generatedYokohamaV2, path.join(ogpDir, 'store-yokohama.png'));
console.log('✅ Updated store-yokohama-v2.png and store-yokohama.png');

// Copy Default v2 & v1
fs.copyFileSync(generatedDefaultV2, path.join(ogpDir, 'default-v2.png'));
fs.copyFileSync(generatedDefaultV2, path.join(ogpDir, 'default.png'));
console.log('✅ Updated default-v2.png and default.png');

// Copy Default v2 to other store/recruit v2 files
const others = [
  'store-tokyo-v2.png', 'store-osaka-v2.png', 'store-nagoya-v2.png', 'store-honten-v2.png',
  'recruit-fukuoka-v2.png', 'recruit-yokohama-v2.png', 'recruit-tokyo-v2.png', 'recruit-osaka-v2.png', 'recruit-nagoya-v2.png', 'recruit-honten-v2.png',
  'store-tokyo.png', 'store-osaka.png', 'store-nagoya.png', 'store-honten.png',
  'recruit-fukuoka.png', 'recruit-yokohama.png', 'recruit-tokyo.png', 'recruit-osaka.png', 'recruit-nagoya.png', 'recruit-honten.png'
];

others.forEach(file => {
  fs.copyFileSync(generatedDefaultV2, path.join(ogpDir, file));
  console.log(`✅ Updated ${file}`);
});
