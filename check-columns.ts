import { prisma } from './src/lib/prisma';

async function test() {
  try {
    const columns = await prisma.$queryRaw`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'stores'
    `;
    console.log('Column types for stores:', JSON.stringify(columns, null, 2));

    const sample = await prisma.$queryRaw`SELECT id, name FROM stores LIMIT 5`;
    console.log('Sample data from stores:', JSON.stringify(sample, null, 2));
  } catch (err: any) {
    console.error('ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
