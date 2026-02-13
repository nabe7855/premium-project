const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const hotel = await prisma.lh_hotels.findFirst();
    console.log('Columns:', Object.keys(hotel || {}));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

check().finally(() => prisma.$disconnect());
