'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Store } from '../../types/stores';

interface StoreDetailsProps {
  store: Store;
}

const StoreDetails: React.FC<StoreDetailsProps> = ({ store }) => {
  const router = useRouter();

  const theme = {
    ring: `ring-${store.themeColor}-400`,
    shadow: `shadow-${store.themeColor}-400/50`,
    text: `text-${store.themeColor}-300`,
    bg: `bg-${store.themeColor}-500`,
  };

  // ✅ 入店ボタン押下で該当店舗トップページへ遷移
  const handleEnterClick = () => {
    router.push(`/store/${store.slug}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 w-full max-w-6xl mx-auto items-center">
      {/* 店舗画像（ふわっと表示） */}
      <motion.div
        className="md:col-span-2 flex justify-center relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div
          className={`relative bg-black/50 p-2 rounded-lg ring-2 ${theme.ring} shadow-2xl ${theme.shadow}`}
        >
          <img
            src={store.fullImageUrl}
            alt={store.name}
            className="w-full max-w-[400px] sm:max-w-md md:max-w-lg rounded-md aspect-[16/9] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

          {/* 店舗名（画像左下からスライドイン） */}
          <motion.h2
            className="absolute left-[-20px] bottom-[-0px] 
                       font-cinzel font-bold text-white whitespace-nowrap 
                       text-2xl sm:text-3xl md:text-4xl"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            <span className="relative inline-block">
              {/* 文字本体 */}
              <span className="relative z-10">
                ストロベリーボーイズ {store.name}店
              </span>

              {/* マーカー */}
              <span
                aria-hidden="true"
                className="absolute left-[-40px] bottom-0 w-[calc(100%+60px)] h-1/2 
                           bg-gradient-to-r from-pink-400 to-rose-600 z-0"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
                }}
              />
            </span>
          </motion.h2>
        </div>
      </motion.div>

      {/* 店舗詳細（説明文だけスライドイン） */}
      <motion.div
        className="md:col-span-3 text-left flex flex-col justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
      >
        <motion.p
          className="text-gray-300 mb-6 max-w-prose"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
        >
          {store.description}
        </motion.p>
      </motion.div>

      {/* 入店ボタン（中央に強調表示） */}
      <div className="col-span-1 md:col-span-5 flex justify-center mt-12">
        <motion.button
          onClick={handleEnterClick}
          className={`font-cinzel text-xl font-bold text-white px-10 py-4 rounded-lg 
                      bg-gradient-to-r from-${store.themeColor}-500 to-${store.themeColor}-700 
                      hover:from-${store.themeColor}-600 hover:to-${store.themeColor}-800 
                      shadow-xl ${theme.shadow}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
        >
          入店する
        </motion.button>
      </div>
    </div>
  );
};

export default StoreDetails;
