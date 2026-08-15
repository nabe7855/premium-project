const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const publishTime = new Date('2026-08-25T19:00:00+09:00');
  await prisma.mediaArticle.update({
    where: { slug: 'riku-interview-vol5' },
    data: {
      status: 'published',
      published_at: publishTime
    }
  });
  console.log('scheduled vol.5 for ' + publishTime.toISOString());
}
main().catch(console.error).finally(() => prisma.$disconnect());
