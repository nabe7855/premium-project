import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkCastSchema() {
  try {
    const castCols = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'casts'
    `);
    console.log('--- casts columns ---');
    console.log(castCols);

    const membershipCols = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cast_store_memberships'
    `);
    console.log('\n--- cast_store_memberships columns ---');
    console.log(membershipCols);

    const statusMaster = await prisma.$queryRawUnsafe(`SELECT * FROM status_master`);
    console.log('\n--- status_master ---');
    console.log(statusMaster);

    const castStatuses = await prisma.$queryRawUnsafe(`
      SELECT cs.*, sm.name as status_name 
      FROM cast_statuses cs 
      JOIN status_master sm ON cs.status_id = sm.id 
      LIMIT 10
    `);
    console.log('\n--- sample cast_statuses ---');
    console.log(castStatuses);

  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

checkCastSchema();
