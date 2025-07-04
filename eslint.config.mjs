// eslint.config.mjs

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ `extends` に旧形式の設定を混ぜるために FlatCompat 使用
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  // ❌ 除外対象（開発用ディレクトリやビルド成果物）
  {
    ignores: ['.next', 'dist', 'node_modules'],
  },

  // ✅ TypeScript + React用設定
  {
    name: 'base',
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // ✅ Next.js 公式ルール（Core Web Vitals対応）
  ...compat.extends('next/core-web-vitals', 'next'),

  // ✅ JS の基本ルール推奨セット
  js.configs.recommended,
);
