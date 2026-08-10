import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function executeTaskD() {
  console.log('=== EXECUTING TASK D (ADDING CLOSING PARAGRAPH & INTERNAL LINKS) ===\n');

  const article = await prisma.pageRequest.findUnique({
    where: { id: '3697fe49-978a-4646-99cd-d19e8ca6f009' }
  });

  if (!article) return;

  const sections = JSON.parse(JSON.stringify(article.sections || []));
  if (sections[0] && sections[0].content) {
    const existingDesc = sections[0].content.description || '';

    // Append closing paragraph and 3 internal links if not already present
    if (!existingDesc.includes('/store/fukuoka/price')) {
      const closingText = `\n\n打ち上げ花火の感動と、そのあとに訪れる特別なくつろぎ。福岡・博多・天神エリアの女性用風俗ストロベリーボーイズ福岡店で、記憶に残る夏の一日をお過ごしください。\n\n▶ [デートプラン・料金はこちら](/store/fukuoka/price)\n▶ [セラピスト一覧を見る](/store/fukuoka/cast)\n▶ [出勤スケジュールを確認する](/store/fukuoka/schedule)`;
      sections[0].content.description = existingDesc + closingText;
    }
  }

  await prisma.pageRequest.update({
    where: { id: article.id },
    data: { sections }
  });

  console.log('✅ Task D updated successfully in DB!');
}

executeTaskD().catch(console.error);
