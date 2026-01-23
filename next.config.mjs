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
        hostname: 'vkrztvkpjcpejccyiviw.supabase.co',
      },
    ],
  },
  optimizeFonts: true,
};

export default nextConfig;
