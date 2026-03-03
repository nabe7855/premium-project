import { getCastsByStore } from '@/lib/getCastsByStore';
import { getDiaryPostsByStore } from '@/lib/getDiaryPostsByStore';
import { getAllStores } from '@/lib/store/store-data';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.sutoroberrys.jp';
  const stores = getAllStores();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/age-check`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/store-select`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const storePages: MetadataRoute.Sitemap = [];

  for (const store of stores) {
    const storeSlug = store.slug;
    const storeBase = `/store/${storeSlug}`;

    // Store main pages
    const routes = [
      '',
      '/cast-list',
      '/price',
      '/system',
      '/recruit',
      '/q-and-a',
      '/diary',
      '/reviews/reviews',
      '/schedule/schedule',
      '/videos',
      '/first-time',
    ];

    for (const route of routes) {
      storePages.push({
        url: `${baseUrl}${storeBase}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 0.9 : 0.7,
      });
    }

    // Cast pages
    try {
      const casts = await getCastsByStore(storeSlug);
      for (const cast of casts) {
        if (cast.slug || cast.id) {
          storePages.push({
            url: `${baseUrl}${storeBase}/cast/${cast.slug || cast.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        }
      }
    } catch (e) {
      console.error(`Sitemap: Error fetching casts for store ${storeSlug}:`, e);
    }

    // Diary posts
    try {
      const diaries = await getDiaryPostsByStore(storeSlug);
      for (const post of diaries) {
        storePages.push({
          url: `${baseUrl}${storeBase}/diary/post/${post.id}`,
          lastModified: new Date(post.date),
          changeFrequency: 'never',
          priority: 0.4,
        });
      }
    } catch (e) {
      console.error(`Sitemap: Error fetching diaries for store ${storeSlug}:`, e);
    }
  }

  // Media (Magazine & Career)
  const mediaPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/magazine`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/career`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  try {
    const { getMediaArticles } = await import('@/lib/actions/media');
    const result = await getMediaArticles();
    if (result.success && result.articles) {
      for (const article of result.articles) {
        if (article.status === 'published') {
          const path = article.target_audience === 'user' ? '/magazine' : '/career';
          mediaPages.push({
            url: `${baseUrl}${path}/${article.slug}`,
            lastModified: new Date(article.updated_at),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      }
    }
  } catch (e) {
    console.error('Sitemap: Error fetching media articles:', e);
  }

  return [...staticPages, ...storePages, ...mediaPages];
}
