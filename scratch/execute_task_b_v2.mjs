import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';
import path from 'path';

async function executeTaskB() {
  console.log('=== TASK B: BACKUP & DRAFT OLD KISEKI ACCOUNT ===\n');

  const oldKisekiId = 'c788c210-41f4-4510-bf72-ceb63535fb80';

  // 1. 旧アカウント全データ取得（バックアップ）
  const oldCast = await prisma.$queryRawUnsafe(`SELECT * FROM casts WHERE id = '${oldKisekiId}'::uuid`);
  const oldMemberships = await prisma.$queryRawUnsafe(`SELECT * FROM cast_store_memberships WHERE cast_id = '${oldKisekiId}'::uuid`);
  const oldBlogs = await prisma.$queryRawUnsafe(`SELECT * FROM blogs WHERE cast_id = '${oldKisekiId}'`);
  const oldReviews = await prisma.$queryRawUnsafe(`SELECT * FROM reviews WHERE cast_id = '${oldKisekiId}'`);
  const oldSchedules = await prisma.$queryRawUnsafe(`SELECT * FROM schedules WHERE cast_id = '${oldKisekiId}'`);

  const backupData = {
    timestamp: new Date().toISOString(),
    cast: oldCast[0],
    memberships: oldMemberships,
    blogs: oldBlogs,
    reviews: oldReviews,
    schedules: oldSchedules,
  };

  const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const backupFilePath = path.join(tmpDir, `kiseki_old_backup_${timestampStr}.json`);
  fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf8');

  console.log(`✅ Backup saved to: ${backupFilePath}`);
  console.log(`   - Cast info: ${backupData.cast?.name} (${backupData.cast?.age}歳, slug: ${backupData.cast?.slug})`);
  console.log(`   - Reviews attached: ${oldReviews.length} items`);
  console.log(`   - Blogs attached: ${oldBlogs.length} items`);

  // 2. 非公開化 (is_active = false)
  await prisma.$executeRawUnsafe(`UPDATE casts SET is_active = false WHERE id = '${oldKisekiId}'::uuid`);

  console.log(`✅ Old Kiseki account (ID: ${oldKisekiId}) status updated to is_active = false (Drafted).`);
}

executeTaskB().catch(console.error);
