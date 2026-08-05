import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function investigateTaskA() {
  console.log('========================================');
  console.log('TASK A: NEWS & STORE MAPPING INVESTIGATION');
  console.log('========================================');

  // 1. Fetch all PageRequests
  const records = await prisma.pageRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  console.log(`\nTotal PageRequest records in DB: ${records.length}`);

  const reportList = [];
  const ambiguousArticles = [];

  for (const r of records) {
    const misc = r.referenceUrls || {};
    const targetStoreSlugs = r.targetStoreSlugs || [];
    const storeSettings = misc.storeSettings || {};
    
    let inferredStore = '';
    let reason = '';

    if (Array.isArray(targetStoreSlugs) && targetStoreSlugs.length > 0) {
      if (targetStoreSlugs.length === 1) {
        inferredStore = targetStoreSlugs[0];
        reason = `targetStoreSlugs = ["${inferredStore}"]`;
      } else {
        inferredStore = targetStoreSlugs.join(', ');
        reason = `targetStoreSlugs multiple: [${inferredStore}]`;
      }
    } else {
      const title = r.title || '';
      const text = `${title} ${JSON.stringify(r.sections || '')}`;

      if (title.includes('【福岡店】') || title.includes('福岡') || text.includes('福岡')) {
        inferredStore = 'fukuoka';
        reason = 'Title/Content contains 福岡';
      } else if (title.includes('【横浜店】') || title.includes('横浜') || text.includes('横浜')) {
        inferredStore = 'yokohama';
        reason = 'Title/Content contains 横浜';
      } else {
        inferredStore = '要判断';
        reason = 'No store slugs & no store name in title/content';
        ambiguousArticles.push(r);
      }
    }

    reportList.push({
      id: r.id,
      slug: r.slug,
      title: r.title,
      status: r.status,
      targetStoreSlugs,
      storeSettingsKeys: Object.keys(storeSettings),
      inferredStore,
      reason,
      createdAt: r.createdAt,
    });
  }

  console.log('\n--- ALL NEWS RECORDS SUMMARY TABLE ---');
  console.log(JSON.stringify(reportList, null, 2));

  console.log(`\nAmbiguous / Multi-store articles count: ${ambiguousArticles.length}`);

  // Write JSON artifact for backup & verification
  const backupDir = 'tmp';
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = `${backupDir}/news_store_backfill_backup_${Date.now()}.json`;
  fs.writeFileSync(backupFile, JSON.stringify(records, null, 2));
  console.log(`\n✅ Backup written to: ${backupFile}`);
}

investigateTaskA().catch(console.error).finally(() => prisma.$disconnect());
