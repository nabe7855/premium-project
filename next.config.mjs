/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir: true, // Next.js 13/14 ではデフォルトなので不要な場合が多いですが、残しておきます
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
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
      {
        source: '/store/honten',
        destination: '/store/tokyo',
        permanent: true,
      },
      {
        source: '/store/honten/:path*',
        destination: '/store/tokyo/:path*',
        permanent: true,
      },
      {
        source: '/career',
        destination: '/store/tokyo/recruit',
        permanent: true,
      },
      {
        source: '/career/:path*',
        destination: '/store/tokyo/recruit',
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
