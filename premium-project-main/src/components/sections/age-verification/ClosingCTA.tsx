import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

interface ClosingCTAProps {
  onAgeVerification: () => void;
}

const ClosingCTA: React.FC<ClosingCTAProps> = ({ onAgeVerification }) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-strawberry-50 to-rose-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-12 h-12 bg-white/20 rounded-full animate-float" />
      <div className="absolute bottom-32 right-16 w-8 h-8 bg-white/30 rounded-full animate-float" style={{animationDelay: '1s'}} />
      <div className="absolute top-1/3 right-8 w-6 h-6 bg-white/25 rounded-full animate-float" style={{animationDelay: '2s'}} />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Character Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-block relative">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-strawberry-500 animate-pulse" fill="currentColor" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 -left-2 w-6 h-6 bg-rose-300 rounded-full"
            />
          </div>
          <p className="text-sm text-strawberry-600 mt-4 font-rounded">
            「あなたをお待ちしています」
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-5xl font-rounded font-bold text-gray-800 mb-6">
            今日から始まる
            <br />
            <span className="text-strawberry-500">新しい自分への扉</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            毎日頑張るあなたに、心からの癒しと
            <br />
            <span className="font-rounded font-medium text-strawberry-600">
              特別な「いちご一会」をお届けします
            </span>
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-8 mb-12"
        >
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-rounded font-bold text-strawberry-500 mb-1">
              98%
            </div>
            <p className="text-sm text-gray-600">満足度</p>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-rounded font-bold text-strawberry-500 mb-1">
              7年
            </div>
            <p className="text-sm text-gray-600">信頼の実績</p>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-rounded font-bold text-strawberry-500 mb-1">
              24h
            </div>
            <p className="text-sm text-gray-600">サポート</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <button
            onClick={onAgeVerification}
            className="group relative inline-flex items-center gap-3 bg-strawberry-500 hover:bg-strawberry-600 text-white px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 font-rounded font-bold text-lg"
          >
            <Heart className="w-6 h-6 group-hover:animate-pulse" fill="currentColor" />
            今すぐあなただけのストロベリーボーイを探す
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <motion.div
              className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          </button>
          
          <p className="text-sm text-gray-500">
            ※ 18歳未満の方はご利用いただけません
          </p>
        </motion.div>

        {/* Trust Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl text-center">
            <p className="text-xs text-gray-600 mb-1">完全個室</p>
            <p className="text-lg font-rounded font-bold text-strawberry-500">プライベート</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl text-center">
            <p className="text-xs text-gray-600 mb-1">AI診断</p>
            <p className="text-lg font-rounded font-bold text-strawberry-500">最適マッチング</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl text-center">
            <p className="text-xs text-gray-600 mb-1">24時間</p>
            <p className="text-lg font-rounded font-bold text-strawberry-500">サポート</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl text-center">
            <p className="text-xs text-gray-600 mb-1">創業7年</p>
            <p className="text-lg font-rounded font-bold text-strawberry-500">安心実績</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClosingCTA;