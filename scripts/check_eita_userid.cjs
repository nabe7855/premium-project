const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const casts = await prisma.cast.findMany({
      where: { name: 'エイタ' },
      select: { id: true, name: true, email: true, user_id: true },
    });
    console.log('--- Cast Search Results ---');
    console.log(JSON.stringify(casts, null, 2));
  } catch (err) {
    console.error('Error during check:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
