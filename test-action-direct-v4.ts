import * as fs from 'fs';
import { getStoreConfigsForAdmin } from './src/lib/actions/priceConfig';
import { prisma } from './src/lib/prisma';

async function test() {
  const log: string[] = [];
  const capture = (msg: string) => {
    console.log(msg);
    log.push(msg);
  };

  capture('--- ACTION DIAGNOSTIC START ---');
  try {
    capture('Checking database connection...');
    const dbCheck = await prisma.$queryRaw`SELECT 1 as result`;
    capture('Database connection check successful: ' + JSON.stringify(dbCheck));

    capture('Calling getStoreConfigsForAdmin...');
    const results = await getStoreConfigsForAdmin();
    capture('Final results count: ' + results.length);

    fs.writeFileSync(
      'diagnostic_results.json',
      JSON.stringify(
        {
          log,
          count: results.length,
          firstResult: results.length > 0 ? results[0] : null,
          allIds: results.map((r) => r.id),
        },
        null,
        2,
      ),
    );
    capture('Results written to diagnostic_results.json');
  } catch (err: any) {
    capture('ACTION DIAGNOSTIC ERROR: ' + err.message);
    fs.writeFileSync(
      'diagnostic_results.json',
      JSON.stringify(
        {
          log,
          error: err.message,
          stack: err.stack,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
    capture('--- ACTION DIAGNOSTIC END ---');
  }
}

test();
