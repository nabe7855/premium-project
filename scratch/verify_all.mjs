import { getPublishedPagesByStore } from '../src/lib/actions/news-pages.ts';
import { generateMetadata } from '../src/app/(protected)/store/[slug]/news/[newsSlug]/page.tsx';

async function main() {
  console.log('=== VERIFICATION START ===');
  
  const fukuokaPages = await getPublishedPagesByStore('fukuoka');
  console.log(`Fetched ${fukuokaPages.length} published pages for Fukuoka store.`);

  const mousho = fukuokaPages.find(p => p.slug === 'mousho-wari-2026');
  const obon = fukuokaPages.find(p => p.slug === 'news-1785225904472-copy-1785376605692');

  console.log('\n--- 1. Mousho Article Verification ---');
  console.log('Title:', mousho?.title);
  console.log('Slug:', mousho?.slug);
  console.log('Description Content:', mousho?.sections[0]?.content?.description);
  
  const moushoMeta = await generateMetadata({ params: { slug: 'fukuoka', newsSlug: 'mousho-wari-2026' } });
  console.log('Metadata Title:', moushoMeta.title);
  console.log('Metadata Description:', moushoMeta.description);
  console.log('Canonical:', moushoMeta.alternates?.canonical);

  console.log('\n--- 2. Obon Article Verification ---');
  console.log('Title:', obon?.title);
  console.log('Slug:', obon?.slug);
  console.log('Description Content:', obon?.sections[0]?.content?.description);

  const obonMeta = await generateMetadata({ params: { slug: 'fukuoka', newsSlug: 'news-1785225904472-copy-1785376605692' } });
  console.log('Metadata Title:', obonMeta.title);
  console.log('Metadata Description:', obonMeta.description);
  console.log('Canonical:', obonMeta.alternates?.canonical);

  console.log('\n=== VERIFICATION END ===');
}

main().catch(console.error);
