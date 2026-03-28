'use client';

import { captureAttribution } from '@/lib/attribution';
import { useEffect } from 'react';

/**
 * 初回アクセス時の流入情報をキャプチャするコンポーネント
 * レイアウト等の上位階層に配置してください
 */
export default function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null; // UIは表示しません (Stealth)
}
