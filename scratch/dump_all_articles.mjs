import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function dumpAllArticles() {
  const records = await prisma.pageRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  console.log(`| # | ID (先頭8桁) | Slug | タイトル | ステータス | 現在のtargetStoreSlugs | 判定店舗 | 判定根拠 |`);
  console.log(`|---|---|---|---|---|---|---|---|`);

  records.forEach((r, idx) => {
    const slugs = Array.isArray(r.targetStoreSlugs) ? r.targetStoreSlugs : [];
    let inferred = '';
    let reason = '';

    if (slugs.length === 1) {
      inferred = slugs[0] === 'fukuoka' ? '福岡店' : slugs[0] === 'yokohama' ? '横浜店' : slugs[0];
      reason = `DB設定 (targetStoreSlugs: ${slugs[0]})`;
    } else if (slugs.length > 1) {
      inferred = `複数 (${slugs.join(', ')})`;
      reason = `複数店舗設定`;
    } else {
      const title = r.title || '';
      if (title.includes('福岡')) {
        inferred = '福岡店';
        reason = 'タイトル文言判定 (福岡)';
      } else if (title.includes('横浜')) {
        inferred = '横浜店';
        reason = 'タイトル文言判定 (横浜)';
      } else {
        inferred = '要判断';
        reason = '店舗指定なし・文言判定不能';
      }
    }

    const shortId = r.id.substring(0, 8);
    const titleClean = r.title.replace(/\|/g, '｜');
    console.log(`| ${idx + 1} | \`${shortId}\` | \`${r.slug}\` | ${titleClean} | ${r.status} | \`${slugs.join(',') || 'なし'}\` | **${inferred}** | ${reason} |`);
  });
}

dumpAllArticles().catch(console.error).finally(() => prisma.$disconnect());
