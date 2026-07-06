const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function update() {
  const store = await prisma.store.findUnique({ where: { slug: 'yokohama' } });
  const config = await prisma.storeTopConfig.findUnique({ where: { store_id: store.id } });
  
  config.config.concept.footerText = '「自分へのご褒美」を、もっと身近で、もっと心地よいものに。ストロベリーボーイズは横浜の女性を応援します。';
  
  await prisma.storeTopConfig.update({
    where: { id: config.id },
    data: { config: config.config }
  });
  console.log('Updated Yokohama Concept footerText in DB!');
}
update().finally(() => prisma.$disconnect());
