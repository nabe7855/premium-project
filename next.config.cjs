/** @type {import('next').NextConfig} */
const nextConfig = {
  appDir: true, // App Router

  eslint: {
    ignoreDuringBuilds: true, // 本番前に false に戻すのがベスト
  },
  images: {
    unoptimized: false, // ← 本番では true をやめる
    domains: ['vkrztvkpjcpejccyiviw.supabase.co'],
  },
  optimizeFonts: true, // ← Google Fonts を使ってるなら true
};

module.exports = nextConfig;
