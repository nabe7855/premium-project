import { getStoreConfigsForAdmin } from './src/lib/actions/priceConfig';

async function test() {
  console.log('Testing getStoreConfigsForAdmin...');
  const configs = await getStoreConfigsForAdmin();
  console.log('Got', configs.length, 'configs');
  if (configs.length > 0) {
    console.log('First config name:', configs[0].storeName);
    console.log('Prohibitions field exists?', 'prohibitions' in configs[0]);
  } else {
    console.log('No configs returned.');
  }
}

test().catch(console.error);
