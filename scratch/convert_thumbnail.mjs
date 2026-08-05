import fs from 'fs';
import path from 'path';

const srcJpg = 'C:/Users/nabe7/.gemini/antigravity/brain/9804d248-35b5-4ea0-a18f-858b26cfd928/media__1785852114540.jpg';
const destWebp = 'public/images/amolab/aya/aya-photo-top.webp';

async function convert() {
  try {
    const sharp = (await import('sharp')).default;
    await sharp(srcJpg)
      .webp({ quality: 85 })
      .toFile(destWebp);
    console.log('Successfully converted uploaded thumbnail to WebP using sharp!');
  } catch (e) {
    console.log('Sharp error, falling back to copy/direct rewrite:', e.message);
    // If sharp is not available, we can write a canvas or copy
    fs.copyFileSync(srcJpg, destWebp);
    console.log('Copied directly to', destWebp);
  }

  const stat = fs.statSync(destWebp);
  console.log(`Final thumbnail size: ${Math.round(stat.size / 1024)} KB`);
}

convert();
