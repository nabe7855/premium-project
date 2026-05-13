import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const store = await prisma.store.findUnique({
    where: { slug: 'fukuoka' },
    include: { recruit_pages: true }
  });
  if (store) {
    const trustPage = store.recruit_pages.find(p => p.section_key === 'trust');
    console.log("Current DB locations:");
    console.log(JSON.stringify(trustPage?.content?.locations, null, 2));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
