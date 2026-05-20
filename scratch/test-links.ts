import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- ALL LINKS AND METAS ---');
  const links = await prisma.interviewCastLink.findMany();
  console.log(JSON.stringify(links, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
