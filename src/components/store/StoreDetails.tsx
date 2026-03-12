'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Store } from '../../types/stores';

interface StoreDetailsProps {
  store: Store;
}

// ✅ 動的クラス用マッピング
const colorThemes: Record<string, string> = {
  pink: 'from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 shadow-pink-400/50',
  rose: 'from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 shadow-rose-400/50',
  violet:
    'from-violet-500 to-violet-700 hover:from-violet-600 hover:to-violet-800 shadow-violet-400/50',
};

const StoreDetails: React.FC<StoreDetailsProps> = ({ store }) => {
  const router = useRouter();

  const handleEnterClick = () => {
    if (store.use_external_url && store.external_url) {
      window.location.href = store.external_url;
    } else {
      router.push(`/store/${store.slug}`);
    }
  };

  // ✅ themeColor がマッピングされていない場合は pink をデフォルトに
  const gradientClass = colorThemes[store.themeColor] || colorThemes['pink'];

  return (
    <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-5">
      {/* 店舗画像 */}
      <motion.div
        className="relative flex justify-center md:col-span-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="relative rounded-lg bg-black/50 p-2 shadow-2xl shadow-pink-400/50 ring-2 ring-pink-400">
          <img
            src={store.fullImageUrl}
            alt={store.name}
            className="aspect-[16/9] w-full max-w-[400px] rounded-md object-cover sm:max-w-md md:max-w-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

          {/* 店舗名 */}
          <motion.h2
            className="font-cinzel absolute bottom-0 left-[-20px] whitespace-nowrap text-2xl font-bold text-white sm:text-3xl md:text-4xl"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            <span className="relative inline-block">
              {/* 文字本体 */}
              <span className="relative z-10">ストロベリーボーイズ {store.name}店</span>

              {/* マーカー */}
              <span
                aria-hidden="true"
                className="absolute bottom-[0.15em] left-[-40px] z-0 h-[0.5em] w-[calc(100%+60px)] bg-gradient-to-r from-pink-400 to-rose-600"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
                }}
              />
            </span>
          </motion.h2>
        </div>
      </motion.div>

      {/* 店舗詳細 */}
      <motion.div
        className="flex flex-col justify-center text-left md:col-span-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
      >
        {store.catch_copy && (
          <motion.h3
            className="text-white-400 mb-3 text-xl font-semibold"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.45 }}
          >
            {store.catch_copy}
          </motion.h3>
        )}
        <motion.p
          className="mb-6 max-w-prose whitespace-pre-line leading-relaxed text-gray-300"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
        >
          {store.description}
        </motion.p>
      </motion.div>

      {/* ✅ 入店ボタン（画面下中央に浮遊固定） */}
      <div className="fixed bottom-40 z-50 flex w-full justify-center">
        <motion.button
          type="button"
          onClick={handleEnterClick}
          aria-label="ストロベリーボーイズ店舗に入店する"
          className={`font-cinzel inline-flex items-center justify-center rounded-lg bg-gradient-to-r px-20 py-4 text-xl font-bold text-white focus:outline-none focus:ring-4 ${gradientClass} shadow-xl transition-colors duration-300 ease-out`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          入店する
        </motion.button>
      </div>
    </div>
  );
};

export default StoreDetails;
