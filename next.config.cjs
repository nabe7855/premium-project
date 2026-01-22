/** @type {import('next').NextConfig} */
const nextConfig = {
  appDir: true, // App Router

  eslint: {
    ignoreDuringBuilds: true, // 本番前に false に戻すのがベスト
  },
  images: {
    unoptimized: true, // 画像エラー回避のためtrueに設定
    domains: ['vkrztvkpjcpejccyiviw.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'vkrztvkpjcpejccyiviw.supabase.co',
        port: '',
      },
    ],
  },
  optimizeFonts: true, // ← Google Fonts を使ってるなら true
};

module.exports = nextConfig;
