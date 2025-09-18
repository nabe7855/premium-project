/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [],
  theme: {
    extend: {
      colors: {
        primary: '#DC143C',
        secondary: '#FFF0F5',
        accent: '#FF69B4',
        // 既存 + ゴールド追加
        gold: {
          50: '#FFFBEA',
          100: '#FFF3C4',
          200: '#FCE588',
          300: '#FADB5F',
          400: '#F7C948',
          500: '#F0B429',
          600: '#DE911D',
          700: '#CB6E17',
          800: '#B44D12',
          900: '#8D2B0B',
        },
      },
      boxShadow: {
        luxury: '0 8px 32px rgba(220, 20, 60, 0.1)',
        soft: '0 4px 16px rgba(0, 0, 0, 0.1)',
        // ✨ ゴールドの発光感
        rich: '0 0 15px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.4), 0 0 45px rgba(255, 165, 0, 0.3)',
      },
      backgroundImage: {
        // ゴールドグラデーションフレーム用
        'gold-frame': 'linear-gradient(135deg, #FFD700, #FFA500, #FF69B4)',
      },
    },
  },
  plugins: [
  require('tailwindcss-animate'),
  /**
   * Tailwind のユーティリティ追加用プラグイン
   */
  function ({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
    addUtilities({
      '.text-foreground': {
        color: 'hsl(var(--foreground))',
      },
      '.border-gold': {
        border: '2px solid #FFD700', // ゴールド枠
      },
      '.shadow-gold': {
        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.5)', // ゴールドの影
      },
      '.bg-gold-gradient': {
        background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)', // 高級感のあるゴールドグラデーション
      },
    });
  },
],
};
