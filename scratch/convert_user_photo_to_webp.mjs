import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function convertPhoto() {
  console.log('=== CONVERTING USER ATTACHED PHOTO TO WEBP ===\n');

  const inputPath = 'C:\\Users\\nabe7\\.gemini\\antigravity\\brain\\05249213-5ec4-4daa-842a-ba7a34d81fe9\\media__1785991880024.jpg';
  
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input image not found: ${inputPath}`);
  }

  const outputDir = path.join(process.cwd(), 'public', 'images', 'amolab', 'aya');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const targetPath1 = path.join(outputDir, 'aya-real-profile.webp');
  const targetPath2 = path.join(outputDir, 'aya-photo-top.webp');

  // 長辺 1200px 以下、品質 85% の WebP に変換
  await sharp(inputPath)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(targetPath1);

  console.log(`✅ Saved: ${targetPath1}`);

  await sharp(inputPath)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(targetPath2);

  console.log(`✅ Saved: ${targetPath2}`);
}

convertPhoto().catch(console.error);
