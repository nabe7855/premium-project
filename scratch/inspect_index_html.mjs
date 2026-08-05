import fs from 'fs';
import path from 'path';

const htmlPath = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/ストロベリーボーイズ運用/めぐ/めぐ_記事_公開セット/index.html';

if (fs.existsSync(htmlPath)) {
  const content = fs.readFileSync(htmlPath, 'utf-8');
  console.log('--- INDEX.HTML HEADERS / TITLE ---');
  console.log(content.slice(0, 1500));
} else {
  console.log('File not found:', htmlPath);
}
