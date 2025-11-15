import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Heart } from 'lucide-react';

interface HeroSectionProps {
  onAgeVerification: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onAgeVerification }) => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 to-cream-100 flex items-center justify-center px-4 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-8 h-8 bg-strawberry-200 rounded-full opacity-30 animate-float" />
      <div className="absolute bottom-32 right-16 w-6 h-6 bg-rose-300 rounded-full opacity-40 animate-float" style={{animationDelay: '1s'}} />
      <div className="absolute top-1/3 right-8 w-4 h-4 bg-strawberry-300 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}} />

      <div className="max-w-4xl mx-auto text-center z-10">
        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-8"
        >
          <Shield className="w-4 h-4 text-strawberry-500" />
          <span className="text-sm font-rounded text-gray-700">創業7年の安心と実績</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-rounded font-bold text-gray-800 mb-6 leading-tight"
        >
          <span className="text-strawberry-500">甘く</span>とろける
          <br />
          <span className="text-2xl md:text-4xl font-light">いちご一会</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          毎日頑張るあなたに、上質で心とろけるひとときを。
          <br />
          <span className="font-rounded font-medium text-strawberry-600">AIが導く、あなただけの特別な時間</span>
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center gap-8 mb-12"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} fill="currentColor" className="w-4 h-4 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600">満足度98%</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-rounded font-bold text-strawberry-500 mb-1">
              10,000+
            </div>
            <p className="text-sm text-gray-600">ご利用実績</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-rounded font-bold text-strawberry-500 mb-1">
              95%
            </div>
            <p className="text-sm text-gray-600">リピート率</p>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button
            onClick={onAgeVerification}
            className="group relative inline-flex items-center gap-3 bg-strawberry-500 hover:bg-strawberry-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-rounded font-medium text-lg"
          >
            <Heart className="w-5 h-5 group-hover:animate-pulse" />
            あなただけのストロベリーボーイを探す
            <motion.div
              className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-10"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;