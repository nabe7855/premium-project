import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const targetSlug = 'news-1785718651524';
  const article = await prisma.pageRequest.findUnique({
    where: { slug: targetSlug },
  });

  if (!article) {
    console.error(`❌ Record with slug ${targetSlug} not found!`);
    return;
  }

  console.log('=== TARGET ARTICLE RECORD (PageRequest) ===');
  console.log('ID:', article.id);
  console.log('Title:', article.title);
  console.log('Status:', article.status);
  console.log('Slug:', article.slug);
  console.log('UpdatedAt:', article.updatedAt);
  console.log('targetStoreSlugs:', article.targetStoreSlugs);

  // Backup before doing anything
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  const backupPath = path.join(backupDir, `news_backup_${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(article, null, 2), 'utf-8');
  console.log(`\n✅ Backup saved to ${backupPath}`);

  // Assert title
  if (!article.title.includes('新人セラピスト2名')) {
    console.error(`❌ ASSERTION FAILED: Title "${article.title}" does not contain "新人セラピスト2名"`);
    process.exit(1);
  }
  console.log('✅ Title Assertion PASSED ("新人セラピスト2名" found)');

  console.log('\n--- Sections JSON ---');
  console.log(JSON.stringify(article.sections, null, 2));

  // Inspect Mousho-wari or Obon articles to check link rendering format in sections
  const otherArticles = await prisma.pageRequest.findMany({
    where: {
      OR: [
        { slug: { contains: 'mousho' } },
        { slug: { contains: 'copy-1785376605692' } },
        { title: { contains: '営業' } },
        { title: { contains: '猛暑' } }
      ]
    }
  });

  console.log('\n=== OTHER ARTICLES FOR LINK FORMAT CHECK ===');
  for (const a of otherArticles) {
    console.log(`\n--- Article: ${a.title} (${a.slug}) ---`);
    console.log('Sections:', JSON.stringify(a.sections, null, 2));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
