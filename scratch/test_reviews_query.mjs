import { getReviewsByStore } from '../src/lib/getReviewsByStore.ts';

async function main() {
  console.log('=== TESTING REVIEWS QUERY FOR YOKOHAMA STORE ===');
  const yokohamaResult = await getReviewsByStore('yokohama');
  console.log(`Yokohama Reviews Count: ${yokohamaResult.reviews.length} | TotalCount: ${yokohamaResult.totalCount}`);

  console.log('\n=== TESTING REVIEWS QUERY FOR FUKUOKA STORE ===');
  const fukuokaResult = await getReviewsByStore('fukuoka');
  console.log(`Fukuoka Reviews Count: ${fukuokaResult.reviews.length} | TotalCount: ${fukuokaResult.totalCount}`);
}

main().catch(console.error);
