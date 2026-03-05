# 画面遷移時のローディング動画実装計画

ご提供いただいた `読み込み用動画.mp4` を使用して、サイト全体の体感速度を向上させつつ、ブランドイメージを強化するための実装案です。

## 1. 動画ファイルの最適化プラン

現在のファイルサイズ（1.4MB）は、ローディング画面としてはやや重いため、以下の最適化を提案します。

- **WebM形式への変換**: モダンブラウザ向けに、MP4よりも圧縮率の高いWebM形式（VP9/VP8）をメインで使用します。
- **解像度の調整**: ローディング画面で全画面表示する必要がなければ、500x500px程度にリサイズすることでファイルサイズを数百KBまで落とせます。
- **ループポイントの最適化**: 動画の最後から最初への繋がりを滑らかにし、読み込みが長引いても違和感のないループにします。
- **静止画（Poster）の用意**: 動画の1枚目（または静止画）をJPG/WebPで用意し、動画がロードされるまでの「一瞬の空白」を防ぎます。

## 2. 実装アーキテクチャ

Next.js (App Router) において、全ページ遷移で共通のローディングを表示するための構成案です。

### A. 全画面ローディング・コンポーネント

`src/components/common/GlobalLoader.tsx` を作成。

- ビデオ要素 (`<video>`) を使用し、`autoplay`, `muted`, `loop`, `playsinline` を指定。
- フェードイン・アウトのアニメーションに `framer-motion` を利用し、唐突な表示切り替えを避けます。

### B. 遷移の検知

Next.js 13/14の App Router では従来の `routeChangeStart` がありません。

- クリックイベントをフックする `Link` のラッパーを作成するか、
- `Suspense` と `loading.tsx` を各フォルダに配置する標準的な方法を採用します。

## 3. 具体的なコードイメージ (Loader Component)

```tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GlobalLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // ページ遷移（URL変更）を検知してローディングを表示
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setTimeout(() => setIsLoading(false), 800);

    // App Routerでの遷移検知には工夫が必要ですが、
    // ここでは基本的な表示/非表示のロジックを構成します。
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          <video src="/読み込み用動画.mp4" className="h-48 w-48" autoPlay muted loop playsInline />
          <p className="mt-4 animate-pulse font-bold text-rose-400">Loading...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## 4. 懸念点と対策

- **低速回線での挙動**: 1.4MBの動画が落ちてくるまで「真っ白」にならないよう、ビデオの背景色をページの背景色と合わせます。
- **iOSの省電力モード**: 自動再生が制限されるケースを考慮し、動画が表示されない場合のフォールバック（回転するアイコンなど）を検討します。

---

まずは、この動画をそのまま（あるいは変換して）組み込むためのコンポーネント作成から着手してよろしいでしょうか？
ffmpeg等のツールが私の環境で使えれば、最適なフォーマットへの変換も代行可能です。
