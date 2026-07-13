import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // 本番環境以外は noindex とする
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  const siteUrl = 'https://www.sutoroberrys.jp';

  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${siteUrl}/sitemap.xml`,
      host: siteUrl,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/test',
          '/store/*/aaaa/',
          '/age-check/',
          '/store-select/',
          '/privacy/',
          '/terms/'
        ],
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot'],
        allow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
