const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const result = await prisma.cast.findMany({
    where: {
      OR: [{ name: 'エイタ' }, { email: { contains: 'eita' } }],
    },
    select: { id: true, name: true, email: true },
  });
  console.log('--- Cast Search Results ---');
  console.log(result);

  if (result.length > 0) {
    const emails = result.map((c) => c.email).filter(Boolean);
    const users = await prisma.user.findMany({
      where: { email: { in: emails } },
    });
    console.log('--- User (Auth) Search Results ---');
    console.log(users);
  }
}

check().finally(() => prisma.$disconnect());
