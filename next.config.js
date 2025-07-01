/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'], // ← あなたの Cloudinary 対応を追加
  },
  optimizeFonts: false,
};

module.exports = nextConfig;
