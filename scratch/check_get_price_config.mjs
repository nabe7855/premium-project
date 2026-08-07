import { getPriceConfig } from '../src/lib/actions/priceConfig.ts';

async function checkPriceConfig() {
  console.log('=== CHECKING getPriceConfig OUTPUT FOR FUKUOKA & YOKOHAMA ===\n');

  const fukuokaConfig = await getPriceConfig('fukuoka');
  console.log('Fukuoka Price Config:');
  console.log(JSON.stringify(fukuokaConfig, null, 2));

  const yokohamaConfig = await getPriceConfig('yokohama');
  console.log('\nYokohama Price Config:');
  console.log(JSON.stringify(yokohamaConfig, null, 2));
}

checkPriceConfig().catch(console.error);
