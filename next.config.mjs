/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir: true, // Next.js 13/14 ではデフォルトなので不要な場合が多いですが、残しておきます
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
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
};

export default nextConfig;
