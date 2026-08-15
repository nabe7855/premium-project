import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const inputDir = 'C:\\Users\\nabe7\\.gemini\\antigravity\\brain\\bee238ae-0681-480a-8cd4-eaca06706434\\.user_uploaded';
const outputDir = path.join(process.cwd(), 'public', 'images', 'guide');

async function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Convert Images
  const files = fs.readdirSync(inputDir)
    .filter(f => f.startsWith('media_') && f.endsWith('.jpg'))
    .sort(); // Sort by name ascending, which handles the timestamp

  if (files.length === 0) {
    console.log('No images found.');
    return;
  }

  console.log(`Found ${files.length} images to process.`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const stepNum = i + 1;
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, `step-${stepNum}.webp`);

    await sharp(inputPath)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    console.log(`Converted ${file} -> step-${stepNum}.webp`);
  }

  // 2. Update DB
  const article = await prisma.mediaArticle.findUnique({ where: { slug: 'jyosei-fuzoku-guide' } });
  if (!article || !article.content) {
    console.error('Article not found.');
    return;
  }

  let content = article.content;
  let stepCounter = 1;

  // The regex finds the closing </p> tag inside the step div and appends the img tag right after it.
  content = content.replace(/(<div class="flex gap-4 items-start.*?<p class="text-sm text-gray-600">.*?<\/p>)/gs, (match) => {
    if (stepCounter <= files.length) {
      const imgTag = `\n      <img src="/images/guide/step-${stepCounter}.webp" alt="ステップ ${stepCounter}" class="w-full h-auto mt-3 rounded-lg border border-gray-100 shadow-sm" loading="lazy" />`;
      stepCounter++;
      // Check if image already exists to avoid duplication
      if (match.includes('<img src="/images/guide/step-')) {
        return match;
      }
      return match + imgTag;
    }
    return match;
  });

  await prisma.mediaArticle.update({
    where: { slug: 'jyosei-fuzoku-guide' },
    data: { content }
  });

  console.log('Database updated successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
