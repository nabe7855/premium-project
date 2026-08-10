import { getCastsByStore } from '@/lib/getCastsByStore';
import { getDiaryPostsByStore } from '@/lib/getDiaryPostsByStore';
import { getAllStores } from '@/lib/store/store-data';
import { AREA_MAP } from '@/lib/area-data';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.sutoroberrys.jp';
  const storeSlugs = ['fukuoka', 'yokohama'];

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/recruit`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
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
      '/recruit',
      '/news',
      '/diary',
      '/reviews',
      '/schedule',
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

    // 店舗所属の公開ニュース記事 (複数店舗ニュースは .jp 内の第一所属店舗の URL のみを出力して重複防止)
    try {
      const { getPublishedPagesByStore } = await import('@/lib/actions/news-pages');
      const JP_STORES = ['fukuoka', 'yokohama'];
      const newsPages = await getPublishedPagesByStore(storeSlug);
      for (const p of newsPages) {
        const targetSlugs = p.targetStoreSlugs || [];
        const jpTargetSlugs = targetSlugs.filter((s) => JP_STORES.includes(s));
        const primaryStoreSlug = jpTargetSlugs[0] || storeSlug;

        if (primaryStoreSlug === storeSlug) {
          storePages.push({
            url: `${baseUrl}${storeBase}/news/${p.slug}`,
            lastModified: new Date(p.storeSettings?.[storeSlug]?.publishedAt || p.updatedAt),
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        }
      }
    } catch (e) {
      console.error(`Sitemap: Error fetching news for store ${storeSlug}:`, e);
    }

    // エリアLP (単一ソース AREA_MAP より実在エリア全7枠を動的生成)
    const storeAreas = Object.values(AREA_MAP).filter((area) => area.slug === storeSlug);
    for (const area of storeAreas) {
      storePages.push({
        url: `${baseUrl}/store/${area.slug}/area/${area.areaSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    // インタビュー一覧ページ（公開インタビューが1本以上存在する店舗のみ追加）
    try {
      const { getInterviewArticles } = await import('@/lib/actions/interview');
      const interviewResult = await getInterviewArticles({ area: storeSlug });
      if (interviewResult.success && interviewResult.articles && interviewResult.articles.length > 0) {
        storePages.push({
          url: `${baseUrl}${storeBase}/interview`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    } catch (e) {
      console.error(`Sitemap: Error checking interview articles for ${storeSlug}:`, e);
    }

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

    // Diary posts (Only primary store URL is included to prevent duplicates in sitemap)
    try {
      const diaries = await getDiaryPostsByStore(storeSlug);
      for (const post of diaries) {
        if (post.primaryStoreSlug === storeSlug) {
          storePages.push({
            url: `${baseUrl}${storeBase}/diary/post/${post.id}`,
            lastModified: new Date(post.date),
            changeFrequency: 'never',
            priority: 0.4,
          });
        }
      }
    } catch (e) {
      console.error(`Sitemap: Error fetching diaries for store ${storeSlug}:`, e);
    }
  }

  // Media (Magazine & Career)
  const mediaPages: MetadataRoute.Sitemap = [
    // /magazine (404) is excluded from sitemap
    // /career is redirected, so excluded from sitemap
    {
      url: `${baseUrl}/amolab`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/amolab/jiten`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // インタビューセクション（新規追加・既存エントリーは変更なし）
    {
      url: `${baseUrl}/magazine/interview`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // AmoLab コラムおよび用語辞典の動的ページ
  try {
    const { prisma } = await import('@/lib/prisma');
    const amolabArticles = await prisma.mediaArticle.findMany({
      where: {
        status: 'published',
        category: { in: ['amolab', 'amolab-jiten'] },
      },
      select: { slug: true, category: true, updated_at: true },
    });

    for (const art of amolabArticles) {
      const pathPrefix = art.category === 'amolab-jiten' ? '/amolab/jiten/words' : '/amolab';
      mediaPages.push({
        url: `${baseUrl}${pathPrefix}/${art.slug}`,
        lastModified: new Date(art.updated_at),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch (e) {
    console.error('Sitemap: Error fetching amolab articles:', e);
  }

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
          const castSlug = castLink?.cast_name_romaji || castLink?.cast_id || 'unknown';
          
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

  // 採用コラム (/recruit/column & /recruit/column/[slug]) - 公開記事が存在する場合のみ追加
  try {
    const { getPublishedRecruitColumns } = await import('@/lib/actions/recruit-column');
    const columns = await getPublishedRecruitColumns();
    if (columns && columns.length > 0) {
      mediaPages.push({
        url: `${baseUrl}/recruit/column`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      for (const col of columns) {
        mediaPages.push({
          url: `${baseUrl}/recruit/column/${col.slug}`,
          lastModified: new Date(col.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }
  } catch (e) {
    console.error('Sitemap: Error fetching recruit columns:', e);
  }

  // イケオラボ (/ikeo & /ikeo/[slug]) - category='ikeo' かつ published の記事を追加
  try {
    const { getMediaArticles } = await import('@/lib/actions/media');
    const ikeoResult = await getMediaArticles('ikeo');
    if (ikeoResult.success && ikeoResult.articles) {
      mediaPages.push({
        url: `${baseUrl}/ikeo`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      const publishedIkeo = ikeoResult.articles.filter((a: any) => a.status === 'published');
      for (const article of publishedIkeo) {
        mediaPages.push({
          url: `${baseUrl}/ikeo/${article.slug}`,
          lastModified: new Date(article.updated_at || article.created_at),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  } catch (e) {
    console.error('Sitemap: Error fetching ikeo articles:', e);
  }

  return [...staticPages, ...storePages, ...mediaPages];
}
