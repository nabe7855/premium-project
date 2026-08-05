import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { prisma } from '../src/lib/prisma.ts';

async function processRealPhoto() {
  const sourcePath = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/ストロベリーボーイズ運用/めぐ/画像素材/めぐさん写真.jpg';
  const targetDir = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/public/images/amolab/aya';
  const targetPath = path.join(targetDir, 'aya-real-profile.webp');

  if (!fs.existsSync(sourcePath)) {
    console.error('Source photo not found:', sourcePath);
    return;
  }

  // Convert to WebP and optimize
  console.log('Converting real photo to WebP...');
  await sharp(sourcePath)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(targetPath);

  const stats = fs.statSync(targetPath);
  console.log(`✅ WebP generated: ${targetPath} (${Math.round(stats.size / 1024)} KB)`);

  // Update Database article content to include real photo in profile block
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'voice-aya' },
  });

  if (!article) {
    console.error('Article voice-aya not found');
    return;
  }

  let content = article.content;

  // Real photo HTML block
  const realPhotoHtml = `
    <div class="profile-photo-wrapper my-6 text-center">
      <figure class="inline-block max-w-full">
        <img src="/images/amolab/aya/aya-real-profile.webp" alt="取材時のあやさん（ご本人ショット）" width="800" height="600" loading="lazy" class="rounded-2xl mx-auto shadow-md border border-pink-100 max-w-full h-auto" />
        <figcaption class="text-[11px] text-gray-400 mt-2 font-sans">【取材時のご本人ショット】※プライバシー保護のためアングルに配慮して掲載しております</figcaption>
      </figure>
    </div>`;

  // Inject real photo inside the profile section
  if (content.includes('<div class="profile">')) {
    content = content.replace(/<div class="profile">/, `<div class="profile">\n${realPhotoHtml}`);
  } else if (content.includes('<h3>プロフィール</h3>')) {
    content = content.replace(/<h3>プロフィール<\/h3>/, `<h3>プロフィール</h3>\n${realPhotoHtml}`);
  } else {
    content += realPhotoHtml;
  }

  await prisma.mediaArticle.update({
    where: { slug: 'voice-aya' },
    data: {
      content,
      updated_at: new Date(),
    },
  });

  console.log('✅ Updated article content in DB with real photo!');
}

processRealPhoto().catch(console.error);
