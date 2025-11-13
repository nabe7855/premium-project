import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, Users, Lock, Heart, Award } from 'lucide-react';

const ReasonTrustSection: React.FC = () => {
  const reasons = [
    {
      icon: Trophy,
      title: '創業7年の実績',
      description: '10,000名以上のお客様にご利用いただき、満足度98%を維持しています',
      stats: '10,000+'
    },
    {
      icon: Shield,
      title: '徹底した安全管理',
      description: '個人情報保護とスタッフの健康管理を最優先に、安心してご利用いただけます',
      stats: '100%'
    },
    {
      icon: Users,
      title: '厳選されたスタッフ',
      description: '外見・内面・サービス品質すべてにおいて厳しい基準をクリアした方のみが在籍',
      stats: '3%'
    },
    {
      icon: Lock,
      title: '完全個室・秘密厳守',
      description: 'プライバシーを最重視し、他のお客様と顔を合わせることのない設計です',
      stats: '秘密厳守'
    },
    {
      icon: Heart,
      title: 'アフターフォロー',
      description: 'ご利用後も専任スタッフがサポート。ご相談やご要望をお気軽にどうぞ',
      stats: '24h'
    },
    {
      icon: Award,
      title: '業界最高品質',
      description: '女性向けサービスのパイオニアとして、常に業界最高レベルを追求します',
      stats: 'No.1'
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-rounded font-bold text-gray-800 mb-4">
            選ばれる理由
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            多くの女性に愛され続ける、6つの理由があります
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-50"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-strawberry-100 rounded-full flex items-center justify-center group-hover:bg-strawberry-200 transition-colors">
                    <reason.icon className="w-6 h-6 text-strawberry-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-rounded font-bold text-gray-800">
                      {reason.title}
                    </h3>
                    <span className="text-sm font-rounded font-bold text-strawberry-500 bg-strawberry-50 px-2 py-1 rounded-full">
                      {reason.stats}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-rose-50 to-cream-50 px-8 py-4 rounded-full">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-strawberry-500" />
              <span className="text-sm font-rounded text-gray-700">SSL暗号化通信</span>
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-strawberry-500" />
              <span className="text-sm font-rounded text-gray-700">プライバシーマーク取得</span>
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-strawberry-500" />
              <span className="text-sm font-rounded text-gray-700">女性満足度98%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReasonTrustSection;