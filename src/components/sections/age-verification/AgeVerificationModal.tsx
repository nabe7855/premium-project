import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, AlertCircle } from 'lucide-react';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ onClose }) => {
  const handleOver18 = () => {
    // Redirect to store selection page
    window.location.href = '/';
  };

  const handleUnder18 = () => {
    alert('またのお越しをお待ちしています🍓');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Header */}
        <div className="from-strawberry-50 bg-gradient-to-br to-rose-100 px-8 py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            <Heart className="text-strawberry-500 h-8 w-8" fill="currentColor" />
          </div>
          <h2 className="font-rounded mb-2 text-2xl font-bold text-gray-800">年齢確認</h2>
          <p className="text-strawberry-600 font-medium">
            🍓 この先には、あなたの心をとろけさせる
            <br />
            "いちご一会" が待っています。
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">18歳未満の方はご利用になれません。</p>
          </div>

          <p className="mb-8 text-center leading-relaxed text-gray-600">
            法令に基づき、年齢確認をお願いしております。
            <br />
            あなたは18歳以上ですか？
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleOver18}
              className="bg-strawberry-500 hover:bg-strawberry-600 font-rounded w-full rounded-2xl py-4 text-lg font-bold text-white shadow-lg transition-colors hover:shadow-xl"
            >
              ✅ はい、18歳以上です
            </button>

            <button
              onClick={handleUnder18}
              className="font-rounded w-full rounded-2xl bg-gray-100 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              ❌ いいえ、まだです
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            ※ 虚偽の申告は法律で禁じられています
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="animate-float absolute left-4 top-16 h-3 w-3 rounded-full bg-rose-200 opacity-30" />
        <div
          className="bg-strawberry-300 animate-float absolute bottom-20 right-6 h-2 w-2 rounded-full opacity-40"
          style={{ animationDelay: '1s' }}
        />
      </motion.div>
    </motion.div>
  );
};

export default AgeVerificationModal;
