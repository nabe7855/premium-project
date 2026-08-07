import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function restoreIllustration() {
  console.log('=== RESTORING ILLUSTRATION FOR THUMBNAIL & TOP IMAGE (WEBP) ===\n');

  const illustrationInput = 'C:\\Users\\nabe7\\.gemini\\antigravity\\brain\\05249213-5ec4-4daa-842a-ba7a34d81fe9\\media__1785992604948.jpg';
  const realPhotoInput = 'C:\\Users\\nabe7\\.gemini\\antigravity\\brain\\05249213-5ec4-4daa-842a-ba7a34d81fe9\\media__1785991880024.jpg';

  if (!fs.existsSync(illustrationInput)) {
    throw new Error(`Illustration image not found: ${illustrationInput}`);
  }
  if (!fs.existsSync(realPhotoInput)) {
    throw new Error(`Real photo image not found: ${realPhotoInput}`);
  }

  const outputDir = path.join(process.cwd(), 'public', 'images', 'amolab', 'aya');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. aya-photo-top.webp (サムネイル・1枚目のトップ画像) -> イラスト画像をWebP化
  const topPath = path.join(outputDir, 'aya-photo-top.webp');
  await sharp(illustrationInput)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(topPath);
  console.log(`✅ Saved Illustration as Top Image/Thumbnail: ${topPath}`);

  // 2. aya-real-profile.webp (本文中実写プロフィール画像) -> 実写写真をWebP化
  const profilePath = path.join(outputDir, 'aya-real-profile.webp');
  await sharp(realPhotoInput)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(profilePath);
  console.log(`✅ Saved Real Photo as Profile Image: ${profilePath}`);
}

restoreIllustration().catch(console.error);
