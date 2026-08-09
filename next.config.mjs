/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir: true, // Next.js 13/14 ではデフォルトなので不要な場合が多いですが、残しておきます
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.jp',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'vkrztvkpjcpejccyiviw.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  optimizeFonts: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  async redirects() {
    return [
      // R1-2: 求人記事の重複統合（/amolab -> /ikeo 301 転送）
      {
        source: '/amolab/fukuoka-recruit-guide',
        destination: '/ikeo/fukuoka-recruit-guide',
        permanent: true,
      },
      {
        source: '/amolab/fukuoka-recruit-guide/',
        destination: '/ikeo/fukuoka-recruit-guide',
        permanent: true,
      },
      {
        source: '/amolab/yokohama-recruit-guide',
        destination: '/ikeo/yokohama-recruit-guide',
        permanent: true,
      },
      {
        source: '/amolab/yokohama-recruit-guide/',
        destination: '/ikeo/yokohama-recruit-guide',
        permanent: true,
      },
      {
        source: '/store/honten',
        destination: '/store/fukuoka',
        permanent: true,
      },
      {
        source: '/store/honten/:path*',
        destination: '/store/fukuoka/:path*',
        permanent: true,
      },
      {
        source: '/store/tokyo',
        destination: 'https://sutoroberrys.com/main/',
        permanent: true,
      },
      {
        source: '/store/tokyo/:path*',
        destination: 'https://sutoroberrys.com/main/',
        permanent: true,
      },
      {
        source: '/store/osaka',
        destination: 'https://sutoroberrys-osaka.com/main.html',
        permanent: true,
      },
      {
        source: '/store/osaka/:path*',
        destination: 'https://sutoroberrys-osaka.com/main.html',
        permanent: true,
      },
      {
        source: '/store/nagoya',
        destination: 'https://sutoroberrys-aichi.com/main.html',
        permanent: true,
      },
      {
        source: '/store/nagoya/:path*',
        destination: 'https://sutoroberrys-aichi.com/main.html',
        permanent: true,
      },
      {
        source: '/career',
        destination: '/store/fukuoka/recruit',
        permanent: true,
      },
      {
        source: '/career/:path*',
        destination: '/store/fukuoka/recruit',
        permanent: true,
      },
      {
        source: '/store/:store/reviews/reviews',
        destination: '/store/:store/reviews',
        permanent: true,
      },
      {
        source: '/store/:store/schedule/schedule',
        destination: '/store/:store/schedule',
        permanent: true,
      },
      {
        source: '/store/:store/diary/diary-list',
        destination: '/store/:store/diary',
        permanent: true,
      },
      {
        source: '/store/:store/system',
        destination: '/store/:store/price',
        permanent: true,
      },
      {
        source: '/store/:store/videos/videos',
        destination: '/store/:store/videos',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
