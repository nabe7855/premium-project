import React from 'react';
import { motion } from 'framer-motion';
import { Search, Brain, Heart, Sparkles } from 'lucide-react';

interface AIMatchingTeaserProps {
  onAgeVerification: () => void;
}

const AIMatchingTeaser: React.FC<AIMatchingTeaserProps> = ({ onAgeVerification }) => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-rose-50 to-cream-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6">
            <Brain className="w-5 h-5 text-strawberry-500" />
            <span className="text-sm font-rounded text-gray-700">AI診断システム</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-rounded font-bold text-gray-800 mb-4">
            3つの質問で見つかる
            <br />
            <span className="text-strawberry-500">最高の出会い</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            心理学に基づいたAIが、あなただけの
            <br />
            <span className="font-rounded font-medium text-strawberry-600">ストロベリーボーイを導き出します</span>
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Search className="w-8 h-8 text-strawberry-500" />
            </div>
            <h3 className="text-lg font-rounded font-bold text-gray-800 mb-2">
              簡単3ステップ
            </h3>
            <p className="text-gray-600 text-sm">
              たった3つの質問に答えるだけで、あなたの理想の方をお探しします
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Brain className="w-8 h-8 text-strawberry-500" />
            </div>
            <h3 className="text-lg font-rounded font-bold text-gray-800 mb-2">
              心理学ベース
            </h3>
            <p className="text-gray-600 text-sm">
              科学的なアプローチで、相性の良い方をピンポイントでご提案
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-strawberry-500" />
            </div>
            <h3 className="text-lg font-rounded font-bold text-gray-800 mb-2">
              95%の満足度
            </h3>
            <p className="text-gray-600 text-sm">
              AI診断をご利用いただいたお客様の95%が「満足」と回答
            </p>
          </motion.div>
        </div>

        {/* Character Illustration Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative text-center mb-12"
        >
          <div className="inline-block relative">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Search className="w-12 h-12 text-strawberry-500 animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 font-rounded">
            「あなたにぴったりの方を探しますね」
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={onAgeVerification}
            className="group relative inline-flex items-center gap-3 bg-strawberry-500 hover:bg-strawberry-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-rounded font-medium text-lg"
          >
            <Heart className="w-5 h-5 group-hover:animate-pulse" />
            AI診断を始める
            <motion.div
              className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-10"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            診断は完全無料です
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AIMatchingTeaser;