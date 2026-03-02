const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const role = await prisma.$queryRawUnsafe(
      `SELECT * FROM roles WHERE user_id = '82b4b4ad-7f1e-4178-a1a3-bbb59edd63b1'`,
    );
    console.log('--- Role Search Results ---');
    console.log(role);
  } finally {
    await prisma.$disconnect();
  }
}

check();
