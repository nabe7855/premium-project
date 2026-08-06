import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function runTaskCAndBackup() {
  console.log('===========================================================');
  console.log('=== (Task B & C) BACKUP NEWS & DEACTIVATE RECRUIT NEWS ===');
  console.log('===========================================================\n');

  const timestamp = Date.now();
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const backupFilePath = path.join(tmpDir, `news_store_backfill_backup_${timestamp}.json`);

  // 1. Fetch All PageRequests for Backup
  const allNewsBackup = await prisma.pageRequest.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  fs.writeFileSync(backupFilePath, JSON.stringify(allNewsBackup, null, 2));
  console.log(`✅ Full News Backup successfully saved to: ${backupFilePath}`);

  // 2. Task C Assert & Deactivate 2 Recruit News
  const target1Slug = 'news-1770103168917-copy-1774078959842';
  const target1ExpectedTitle = '無料モニター&講師さん大募集❗️';

  const target2Slug = 'news-1773289329952';
  const target2ExpectedTitle = '【福岡オープニングセラピスト募集】未経験からトップセラピストへ。';

  const rec1 = await prisma.pageRequest.findFirst({ where: { slug: target1Slug } });
  const rec2 = await prisma.pageRequest.findFirst({ where: { slug: target2Slug } });

  console.log('\n--- Asserting Target Titles for Task C ---');
  if (!rec1 || rec1.title !== target1ExpectedTitle) {
    throw new Error(`ASSERTION FAILED for ${target1Slug}: expected "${target1ExpectedTitle}", found "${rec1?.title}"`);
  }
  console.log(`✅ Target 1 Assert Passed: [${rec1.slug}] "${rec1.title}"`);

  if (!rec2 || rec2.title !== target2ExpectedTitle) {
    throw new Error(`ASSERTION FAILED for ${target2Slug}: expected "${target2ExpectedTitle}", found "${rec2?.title}"`);
  }
  console.log(`✅ Target 2 Assert Passed: [${rec2.slug}] "${rec2.title}"`);

  // Update status to 'private'
  await prisma.pageRequest.update({
    where: { id: rec1.id },
    data: { status: 'private' }
  });
  console.log(`✅ Deactivated [${target1Slug}] (status -> 'private')`);

  await prisma.pageRequest.update({
    where: { id: rec2.id },
    data: { status: 'private' }
  });
  console.log(`✅ Deactivated [${target2Slug}] (status -> 'private')`);

  await prisma.$disconnect();
}

runTaskCAndBackup().catch((err) => {
  console.error('❌ Error during Task C:', err);
  process.exit(1);
});
