import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function executeTaskC() {
  console.log('========================================');
  console.log('TASK C: UNPUBLISH OLD RECRUIT NEWS ARTICLES');
  console.log('========================================');

  const target1Slug = 'news-1770103168917-copy-1774078959842';
  const target1TitleExpected = '無料モニター&講師さん大募集❗️';

  const target2Slug = 'news-1773289329952';
  const target2TitleExpected = '【福岡オープニングセラピスト募集】未経験からトップセラピストへ。';

  // 1. Fetch & Assert Target 1
  const art1 = await prisma.pageRequest.findFirst({ where: { slug: target1Slug } });
  if (!art1) throw new Error(`Article 1 not found: ${target1Slug}`);
  console.log(`Checking Article 1 (${art1.id})...`);
  if (art1.title !== target1TitleExpected) {
    throw new Error(`ASSERTION FAILED for Article 1 title! Expected: "${target1TitleExpected}", Found: "${art1.title}"`);
  }
  console.log(`✅ Title match verified for Article 1: "${art1.title}"`);

  // 2. Fetch & Assert Target 2
  const art2 = await prisma.pageRequest.findFirst({ where: { slug: target2Slug } });
  if (!art2) throw new Error(`Article 2 not found: ${target2Slug}`);
  console.log(`Checking Article 2 (${art2.id})...`);
  if (art2.title !== target2TitleExpected) {
    throw new Error(`ASSERTION FAILED for Article 2 title! Expected: "${target2TitleExpected}", Found: "${art2.title}"`);
  }
  console.log(`✅ Title match verified for Article 2: "${art2.title}"`);

  // 3. Backup records before changing
  const backupData = {
    timestamp: new Date().toISOString(),
    art1,
    art2,
  };
  const backupDir = 'tmp';
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const backupFilePath = `${backupDir}/task_c_unpublish_backup_${Date.now()}.json`;
  fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));
  console.log(`✅ Pre-update backup saved to: ${backupFilePath}`);

  // 4. Update status to 'private'
  const updated1 = await prisma.pageRequest.update({
    where: { id: art1.id },
    data: { status: 'private' },
  });
  console.log(`✅ Updated Article 1 status: ${art1.status} -> ${updated1.status}`);

  const updated2 = await prisma.pageRequest.update({
    where: { id: art2.id },
    data: { status: 'private' },
  });
  console.log(`✅ Updated Article 2 status: ${art2.status} -> ${updated2.status}`);

  console.log('\nTask C Completed Successfully!');
}

executeTaskC().catch(console.error).finally(() => prisma.$disconnect());
