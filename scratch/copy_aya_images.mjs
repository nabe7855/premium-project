import fs from 'fs';
import path from 'path';

const srcDir = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/ストロベリーボーイズ運用/めぐ/めぐ_記事_公開セット';
const targetDir = 'public/images/amolab/aya';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function findAndCopy(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findAndCopy(fullPath);
    } else if (item.endsWith('.webp')) {
      let targetName = item;
      if (targetName.startsWith('megu-')) {
        targetName = targetName.replace('megu-', 'aya-');
      }
      const dstPath = path.join(targetDir, targetName);
      fs.copyFileSync(fullPath, dstPath);
      console.log(`Copied ${fullPath} -> ${dstPath} (${Math.round(stat.size / 1024)} KB)`);
    }
  }
}

findAndCopy(srcDir);
console.log('Done copying images!');
