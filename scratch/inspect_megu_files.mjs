import fs from 'fs';
import path from 'path';

const meguDir = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/ストロベリーボーイズ運用/めぐ/めぐ_記事_公開セット';

function scanDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log('Dir does not exist:', dir);
    return;
  }
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      console.log('[DIR]', f);
      scanDir(full);
    } else {
      console.log('[FILE]', f, '(' + Math.round(stat.size / 1024) + ' KB)');
    }
  }
}

scanDir(meguDir);
