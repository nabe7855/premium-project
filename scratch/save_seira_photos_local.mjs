import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function saveSeiraPhotosLocal() {
  console.log('=== SAVING SEIRA PHOTOS TO PUBLIC DIRECTORY ===\n');

  const baseDir = 'C:\\Users\\nabe7\\.gemini\\antigravity\\scratch\\obsidian-antigravity-nexus\\dev\\premium-project\\ストロベリーボーイズ運用\\セイラ';
  const targetDir = 'C:\\Users\\nabe7\\.gemini\antigravity\\scratch\\obsidian-antigravity-nexus\\dev\\premium-project\\public\\images\\casts\\seira';

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const photo1Path = path.join(baseDir, 'S__52174854_0.jpg'); // portrait
  const photo2Path = path.join(baseDir, 'S__52174855_0.jpg'); // fullbody

  const portraitDest = path.join(targetDir, 'portrait.webp');
  const fullbodyDest = path.join(targetDir, 'fullbody.webp');

  await sharp(photo1Path).resize(1200, null, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toFile(portraitDest);
  await sharp(photo2Path).resize(1200, null, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toFile(fullbodyDest);

  console.log('Saved Portrait WebP to:', portraitDest);
  console.log('Saved Fullbody WebP to:', fullbodyDest);

  fs.writeFileSync('scratch/uploaded_seira_urls.json', JSON.stringify({
    portraitUrl: '/images/casts/seira/portrait.webp',
    fullbodyUrl: '/images/casts/seira/fullbody.webp'
  }, null, 2));
}

saveSeiraPhotosLocal().catch(console.error);
