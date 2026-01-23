import * as fs from 'fs';
import { prisma } from './src/lib/prisma';

async function test() {
  try {
    const columns = await prisma.$queryRaw`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'stores'
    `;

    const sample = await prisma.$queryRaw`SELECT id::text as id, name, slug FROM stores LIMIT 10`;

    fs.writeFileSync(
      'column_check.json',
      JSON.stringify(
        {
          columns,
          sample,
        },
        null,
        2,
      ),
    );

    console.log('Results written to column_check.json');
  } catch (err: any) {
    console.error('ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
