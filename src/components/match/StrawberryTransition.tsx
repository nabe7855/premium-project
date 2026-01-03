import React, { useEffect } from 'react';
import { motion } from 'framer-motion'; // 🎬 アニメーションライブラリ
import { THEME_EMOJI } from '@/data/constants'; // 🍓 などテーマ用の絵文字

// ==========================
// Props: 親から渡されるもの
// ==========================
interface ThemeTransitionProps {
  // アニメーションが終わったときに呼ばれるコールバック（任意）
  onComplete?: () => void;
}

// ==========================
// 1粒ごとの 🍓 パーティクル
// ==========================
const Particle: React.FC<{ onAnimationComplete: () => void }> = ({ onAnimationComplete }) => {
  // 画面サイズを取得（🍓をランダムに配置するため）
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  return (
    <motion.span
      className="absolute text-3xl md:text-5xl" // 🍓サイズ（レスポンシブ）
      // 🎬 初期位置：画面の下のほう（外側）にランダム配置
      initial={{
        bottom: -100, // 画面下の外からスタート
        left: Math.random() * screenWidth, // 横位置はランダム
        scale: Math.random() * 5.8 + 3.0,  // 大きさもランダム（5.0〜15.8倍）
      }}
      // 🎬 アニメーション：画面の上から下へ落ちていく
      animate={{
        bottom: [screenHeight * -0.1, screenHeight * 1.2], // 画面の上 → 下へ流れる
        rotate: Math.random() * 720 - 360, // ランダムに回転
      }}
      // ⏱️ 動き方の調整
      transition={{
        duration: Math.random() * 3.5 + 2, // 落ちる時間（2〜5.5秒ランダム）
        ease: 'easeIn',                     // 落ち方は加速する感じ
        delay: Math.random() * 0.5,         // 開始タイミングもランダム
      }}
      // 1粒のアニメーションが終わったときの処理（今は何もしない）
      onAnimationComplete={onAnimationComplete}
      style={{ willChange: 'transform, opacity' }} // ブラウザ最適化
    >
      {THEME_EMOJI} {/* 実際の 🍓 を描画 */}
    </motion.span>
  );
};

// ==========================
// 🍓 全体のトランジション演出
// ==========================
const StrawberryTransition: React.FC<ThemeTransitionProps> = ({ onComplete }) => {
  const particleCount = 100; // 🍓を何粒流すか

  useEffect(() => {
    // 2.5秒後に「アニメーション完了」として親に通知
    const timer = setTimeout(() => {
      onComplete?.(); // ✅ 渡されていれば呼び出す
    }, 2500);

    return () => clearTimeout(timer); // コンポーネントが消えるときはタイマー解除
  }, [onComplete]);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full overflow-hidden z-50" 
      // 画面全体を覆って 🍓 を流すレイヤー
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }} // 退場時はフェードアウト
    >
      {/* 🍓パーティクルを100個生成して画面全体に流す */}
      {[...Array(particleCount)].map((_, i) => (
        <Particle key={i} onAnimationComplete={() => {}} />
      ))}
    </motion.div>
  );
};

export default StrawberryTransition;
