import { getCastsByStore } from '@/lib/getCastsByStore';
import { getDiaryPostsByStore } from '@/lib/getDiaryPostsByStore';
import { getAllStores } from '@/lib/store/store-data';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.sutoroberrys.jp';
  const storeSlugs = ['tokyo', 'yokohama', 'nagoya', 'osaka', 'fukuoka'];

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
    {
      url: `${baseUrl}/links`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  const storePages: MetadataRoute.Sitemap = [];

  for (const storeSlug of storeSlugs) {
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

    // インタビュー一覧ページを追加
    storePages.push({
      url: `${baseUrl}${storeBase}/interview`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    try {
      const casts = await getCastsByStore(storeSlug);
      for (const cast of casts) {
        const slugStr = cast.slug || cast.id;
        // 文字化けURLを除外するため、半角英数字ハイフンアンダースコアのみを許可
        if (slugStr && /^[a-zA-Z0-9-_]+$/.test(slugStr)) {
          storePages.push({
            url: `${baseUrl}${storeBase}/cast/${slugStr}`,
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
    // /magazine (404) is excluded from sitemap
    // /career is redirected, so excluded from sitemap
    // インタビューセクション（新規追加・既存エントリーは変更なし）
    {
      url: `${baseUrl}/magazine/interview`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  /* 
  try {
    const { getMediaArticles } = await import('@/lib/actions/media');
    const result = await getMediaArticles();
    if (result.success && result.articles) {
      for (const article of result.articles) {
        if (article.status === 'published') {
          const path = article.target_audience === 'user' ? '/magazine' : '/career';
          mediaPages.push({
            url: `${baseUrl}${path}/${encodeURI(article.slug)}`,
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
  */

  // インタビュー記事の動的ページ（新規追加・既存処理は変更なし）
  try {
    const { getInterviewArticles } = await import('@/lib/actions/interview');
    const interviewResult = await getInterviewArticles();
    if (interviewResult.success && interviewResult.articles) {
      for (const article of interviewResult.articles) {
        if (article && (article as any).status === 'published') {
          const meta = (article as any).interview_meta;
          
          // 日本語エリア名（福岡など）を英語スラッグにマッピング
          const areaMap: Record<string, string> = {
            福岡: 'fukuoka',
            東京: 'tokyo',
            横浜: 'yokohama',
            名古屋: 'nagoya',
            大阪: 'osaka',
            fukuoka: 'fukuoka',
            tokyo: 'tokyo',
            yokohama: 'yokohama',
            nagoya: 'nagoya',
            osaka: 'osaka',
          };
          const rawArea = meta?.area || 'fukuoka';
          const area = areaMap[rawArea] || 'fukuoka';

          const castLink = meta?.cast_links?.[0];
          const castSlug = castLink?.cast_id || castLink?.cast_name_romaji || 'unknown';
          
          mediaPages.push({
            url: `${baseUrl}/store/${area}/interview/${castSlug}/${article.slug}`,
            lastModified: new Date((article as any).updated_at),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
      }
    }
  } catch (e) {
    console.error('Sitemap: Error fetching interview articles:', e);
  }

  return [...staticPages, ...storePages, ...mediaPages];
}
