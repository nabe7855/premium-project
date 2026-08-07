import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function auditNews() {
  console.log('===========================================================');
  console.log('=== (Task A) AUDIT ALL NEWS (pageRequest) & STORE MAPPING ===');
  console.log('===========================================================\n');

  const records = await prisma.pageRequest.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  console.log(`Total News (pageRequest) records in DB: ${records.length}`);

  const report = [];
  const requiresJudgment = [];

  records.forEach((r, idx) => {
    const misc = r.referenceUrls || {};
    const title = r.title || '';
    const slug = r.slug;
    const dbTargetStoreSlugs = r.targetStoreSlugs || [];

    // 判定ロジック
    let determinedStore = '要判断';
    let basis = '';

    // 1. タイトルまたは slug から判断
    if (title.includes('【福岡') || title.includes('博多') || title.includes('天神') || slug.includes('fukuoka')) {
      determinedStore = 'fukuoka';
      basis = 'タイトル/slugに「福岡/博多/天神」表記あり';
    } else if (title.includes('【横浜') || title.includes('関内') || title.includes('みなとみらい') || slug.includes('yokohama')) {
      determinedStore = 'yokohama';
      basis = 'タイトル/slugに「横浜/関内」表記あり';
    } else if (title.includes('【大阪') || title.includes('梅田') || title.includes('難波')) {
      determinedStore = 'osaka';
      basis = 'タイトルに「大阪」表記あり';
    } else if (title.includes('【東京') || title.includes('新宿') || title.includes('池袋')) {
      determinedStore = 'tokyo';
      basis = 'タイトルに「東京」表記あり';
    } else if (dbTargetStoreSlugs.length === 1) {
      determinedStore = dbTargetStoreSlugs[0];
      basis = `DBのtargetStoreSlugsが単一 [${dbTargetStoreSlugs[0]}]`;
    } else if (dbTargetStoreSlugs.length > 1) {
      // 全店舗共通のお知らせやキャンペーン
      determinedStore = dbTargetStoreSlugs.join(', ');
      basis = `DBに複数店舗 [${dbTargetStoreSlugs.join(', ')}] 指定`;
    } else {
      determinedStore = '要判断';
      basis = '店舗表記なし・targetStoreSlugs空';
    }

    const item = {
      index: idx + 1,
      id: r.id,
      slug: r.slug,
      title: r.title,
      status: r.status,
      category: misc.category || 'なし',
      dbTargetStoreSlugs: dbTargetStoreSlugs.join(', '),
      determinedStore,
      basis
    };

    report.push(item);
    if (determinedStore === '要判断') {
      requiresJudgment.push(item);
    }
  });

  fs.writeFileSync('scratch/news_audit_report.json', JSON.stringify(report, null, 2));

  console.log('\n===========================================================');
  console.log('=== (Task A-3) 全ニュースレコードの店舗判定表 ===');
  console.log('===========================================================');
  report.forEach(item => {
    console.log(`${item.index}. [ID: ${item.id}] [slug: ${item.slug}]`);
    console.log(`   タイトル: "${item.title}"`);
    console.log(`   ステータス: ${item.status} | カテゴリ: ${item.category}`);
    console.log(`   DB登録店舗: [${item.dbTargetStoreSlugs}] ➔ 判定店舗: [${item.determinedStore}] (${item.basis})`);
    console.log('-----------------------------------------------------------');
  });

  console.log(`\n要判断記事の件数: ${requiresJudgment.length} 件`);

  await prisma.$disconnect();
}

auditNews().catch(console.error);
