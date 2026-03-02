const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const eita = await prisma.$queryRawUnsafe(
      `SELECT id, name, email, user_id FROM casts WHERE email = 'eita@gmail.com'`,
    );
    process.stdout.write(JSON.stringify(eita));
  } finally {
    await prisma.$disconnect();
  }
}

check();
