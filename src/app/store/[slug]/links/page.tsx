import { getActivePartnerLinks } from '@/lib/actions/partnerLinks';
import { getStoreBySlug } from '@/lib/actions/store-actions';
import { getStoreLinksConfig } from '@/lib/store/getStoreLinksConfig';
import { StoreLinksConfig, DEFAULT_STORE_LINKS_CONFIG } from '@/lib/store/storeLinksConfig';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import LinksPage from '@/components/templates/store/fukuoka/page-templates/LinksPage';

interface Props {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const result = await getStoreBySlug(params.slug);
  const store = result.store;
  if (!store) return { title: 'Not Found' };

  const configResult = await getStoreLinksConfig(params.slug);
  const config = (configResult.success && configResult.config) 
    ? configResult.config 
    : DEFAULT_STORE_LINKS_CONFIG;

  const storeName = store.name.replace('店', '');
  const title = config.seo.title.replace('{storeName}', storeName);
  const description = config.seo.description.replace('{storeName}', storeName);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export const revalidate = 3600;

export default async function StoreLinksPage({ params }: Props) {
  const { slug } = params;
  
  // Fetch store info
  const storeResult = await getStoreBySlug(slug);
  const store = storeResult.store;
  if (!store || !store.is_active) notFound();

  // Fetch filtered links
  const linksResult = await getActivePartnerLinks(slug);
  const links = linksResult.links ?? [];

  // Fetch config
  const configResult = await getStoreLinksConfig(slug);
  const config = (configResult.success && configResult.config) 
    ? configResult.config 
    : DEFAULT_STORE_LINKS_CONFIG;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `${store.name} おすすめパートナーサイト`,
            description: config.seo.description,
            url: `https://www.sutoroberrys.jp/store/${slug}/links`,
          }),
        }}
      />

      <LinksPage 
        slug={slug}
        storeName={store.name}
        links={links}
        config={config}
      />
    </>
  );
}
