import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Moon, Sparkles, Heart } from 'lucide-react';

const PlanSection: React.FC = () => {
  const plans = [
    {
      icon: Coffee,
      title: '自分へのご褒美に',
      subtitle: 'Reward Plan',
      description: 'お仕事や家事を頑張ったあなたに、特別なひとときを。上質な会話と癒しの時間をお届けします。',
      mood: '癒し',
      duration: '2-3時間',
      image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-amber-50 to-orange-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      icon: Moon,
      title: 'ただ話を聞いてほしい夜に',
      subtitle: 'Listening Plan',
      description: '誰にも言えない想いや日々の疲れを、優しく包み込む温かな時間で解放してください。',
      mood: '安らぎ',
      duration: '1-2時間',
      image: 'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Sparkles,
      title: '心も体も満たされたい',
      subtitle: 'Premium Plan',
      description: '心からの満足と至福の時間を求めるあなたに。最高級のサービスで特別な一日を演出します。',
      mood: '至福',
      duration: '3-5時間',
      image: 'https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-purple-50 to-pink-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-rose-50/50 to-cream-50/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-rounded font-bold text-gray-800 mb-4">
            あなたの気分に合わせて
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            どんな時間をお過ごしになりたいですか？
            <br />
            <span className="font-rounded font-medium text-strawberry-600">
              3つのシーンからお選びいただけます
            </span>
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative bg-gradient-to-br ${plan.color} rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500`}
            >
              {/* Background Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={plan.image}
                  alt={plan.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Icon and Tags */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${plan.iconBg} rounded-full flex items-center justify-center`}>
                    <plan.icon className={`w-6 h-6 ${plan.iconColor}`} />
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-white/80 text-gray-600 px-2 py-1 rounded-full font-rounded">
                      {plan.mood}
                    </span>
                    <span className="text-xs bg-white/80 text-gray-600 px-2 py-1 rounded-full font-rounded">
                      {plan.duration}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-rounded font-bold text-gray-800 mb-1">
                  {plan.title}
                </h3>
                <p className="text-sm text-strawberry-600 font-medium mb-3">
                  {plan.subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-rounded">
                    詳細はお問い合わせください
                  </span>
                  <Heart className="w-5 h-5 text-strawberry-400 group-hover:text-strawberry-500 transition-colors" />
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-strawberry-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500">
            ※ 上記は一例です。お客様のご希望に合わせてカスタマイズも可能です
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PlanSection;