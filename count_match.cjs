const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = ['interview', 'amolab', 'ikeo'];
  console.log('| カテゴリ | 全 published 件数 | lte:now 条件付き件数 | 差分 |');
  console.log('|---|---|---|---|');
  for (const cat of categories) {
    const total = await prisma.mediaArticle.count({
      where: { category: cat, status: 'published' }
    });
    const withDate = await prisma.mediaArticle.count({
      where: { category: cat, status: 'published', published_at: { lte: new Date() } }
    });
    console.log(`| ${cat} | ${total} | ${withDate} | ${total - withDate} |`);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
