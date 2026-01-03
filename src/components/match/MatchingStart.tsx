import React from 'react';
import { motion } from 'framer-motion';
import { ThemeIcon } from './icons/StrawberryIcon'; // 🍓アイコンコンポーネント

// 🍓 アニメーション専用コンポーネント（ボタンやテキストは持たない）
const MatchingStart: React.FC = () => {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }} // 初期状態: 小さく透明
      animate={{ scale: 1, opacity: 1 }}   // アニメ後: 通常サイズ・不透明
      transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
      className="flex justify-center items-center"
    >
      <ThemeIcon className="w-24 h-24 sm:w-32 sm:h-32 text-red-400 drop-shadow-lg" />
    </motion.div>
  );
};

export default MatchingStart;
