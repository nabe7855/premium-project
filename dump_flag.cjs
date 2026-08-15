const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  const a = await prisma.mediaArticle.findFirst({ where: { slug: 'fukuoka-recruit-guide' } });
  if (a) {
    fs.writeFileSync('flag_content.md', a.content);
    console.log('saved');
  } else {
    console.log('not found');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
