import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function deactivateTestData() {
  console.log('===========================================================');
  console.log('=== (Task 1) BACKUP & DEACTIVATE TEST DATA ===');
  console.log('===========================================================\n');

  const timestamp = Date.now();
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const backupFilePath = path.join(tmpDir, `testdata_backup_${timestamp}.json`);

  // 1. Fetch Target Test Blogs (5 items)
  const testBlogIds = [
    'd8605d6a-7f00-489c-b239-9b4b206f9297',
    'b442cdf7-96bb-427d-a840-757da6608e14',
    '5843e217-c1a0-4a9c-8dd5-cfac9b81f873',
    '574c9b2c-c8f3-4957-a336-7a58c5c6517c',
    '86effd86-cc4a-4e1c-a6eb-6145e7cdf3db'
  ];

  const blogBackup = await prisma.$queryRaw`
    SELECT * FROM blogs WHERE id IN (${testBlogIds[0]}::uuid, ${testBlogIds[1]}::uuid, ${testBlogIds[2]}::uuid, ${testBlogIds[3]}::uuid, ${testBlogIds[4]}::uuid)
  `;

  // 2. Fetch Target Test Casts (2 items: koko, 田中 テスト用)
  const testCastIds = [
    '21e6000b-4d89-43e4-8fb5-ac9c583b1df6', // koko
    '013cd4f7-bc4f-4ce2-a956-4b942444ce4c'  // 田中 テスト用
  ];

  const castBackup = await prisma.$queryRaw`
    SELECT * FROM casts WHERE id IN (${testCastIds[0]}::uuid, ${testCastIds[1]}::uuid)
  `;

  const backupData = {
    timestamp: new Date().toISOString(),
    blogs: blogBackup,
    casts: castBackup
  };

  fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));
  console.log(`✅ Backup successfully saved to: ${backupFilePath}`);

  // 3. Deactivate Test Blogs (status -> draft)
  console.log('\n- Updating status to "draft" for 5 test blogs...');
  const blogUpdateResult = await prisma.$executeRaw`
    UPDATE blogs SET status = 'draft' WHERE id IN (${testBlogIds[0]}::uuid, ${testBlogIds[1]}::uuid, ${testBlogIds[2]}::uuid, ${testBlogIds[3]}::uuid, ${testBlogIds[4]}::uuid)
  `;
  console.log(`✅ ${blogUpdateResult} blog records updated to status='draft'`);

  // 4. Deactivate Test Casts (Check columns on casts table: status / is_active)
  console.log('- Updating casts status/activation for 2 test casts...');
  try {
    const castUpdateResult = await prisma.$executeRaw`
      UPDATE casts SET status = 'draft' WHERE id IN (${testCastIds[0]}::uuid, ${testCastIds[1]}::uuid)
    `;
    console.log(`✅ ${castUpdateResult} cast records updated to status='draft'`);
  } catch (err) {
    console.log('Status column on casts update note:', err.message);
  }

  await prisma.$disconnect();
}

deactivateTestData().catch(console.error);
