import { prisma } from '../src/lib/prisma.ts';

async function checkCastsPrisma() {
  const casts = await prisma.cast.findMany({
    select: { id: true, name: true, slug: true, is_active: true },
  });
  console.log('Casts in DB (via Prisma):', JSON.stringify(casts, null, 2));
}

checkCastsPrisma().catch(console.error);
