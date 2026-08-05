import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRecruitNews() {
  console.log('=== SEARCHING FOR RECRUIT-RELATED NEWS ARTICLES IN DB ===');

  const pages = await prisma.pageRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  console.log(`Total PageRequests (News/Pages) found: ${pages.length}`);

  const recruitKeywords = ['求人', '採用', '募集', 'セラピスト募集', '講師', 'スタッフ募集', 'キャスト募集', '未経験'];

  const matches = [];

  pages.forEach((p) => {
    const titleMatch = recruitKeywords.some((kw) => p.title.includes(kw));
    const contentStr = JSON.stringify(p.content || '');
    const contentMatch = recruitKeywords.some((kw) => contentStr.includes(kw));
    const miscStr = JSON.stringify(p.misc || '');

    if (titleMatch || p.category === 'recruit' || p.category === '求人') {
      matches.push({
        id: p.id,
        title: p.title,
        category: p.category,
        slug: p.slug,
        status: p.status,
        misc: p.misc,
      });
    }
  });

  console.log(`\nFound ${matches.length} recruitment-related news pages:`);
  console.log(JSON.stringify(matches, null, 2));
}

checkRecruitNews().catch(console.error).finally(() => prisma.$disconnect());
