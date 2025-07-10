'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart } from 'lucide-react';
import BookingModal from '../modals/BookingModal';

const Hero: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    console.log(`${sectionId}セクションへスクロール`);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`セクション ${sectionId} が見つかりません`);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-secondary via-white to-neutral-100">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
        <div className="grid min-h-[80vh] items-center gap-8 sm:gap-12 lg:grid-cols-2">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="mb-6">
              <motion.div
                {...scaleIn}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-4 inline-flex items-center rounded-full bg-white/80 px-3 py-2 shadow-soft backdrop-blur-sm sm:px-4"
              >
                <span className="mr-2 text-xl sm:text-2xl">🍓</span>
                <span className="text-xs font-medium text-primary sm:text-sm">
                  Premium Experience
                </span>
              </motion.div>

              <h1 className="mb-4 font-serif text-3xl font-bold leading-tight text-neutral-800 sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                心とろける
                <br />
                <span className="text-primary">極上のひととき</span>を
              </h1>

              <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-neutral-600 sm:mb-8 sm:text-lg md:text-xl lg:mx-0">
                東京の上質なラグジュアリーサービス。経験豊富なキャストが、あなただけの特別な時間をお届けします。
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start"
            >
              <button
                onClick={() => scrollToSection('matching')}
                className="group flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-luxury transition-all duration-300 hover:bg-primary/90 hover:shadow-xl sm:px-8 sm:py-4 sm:text-base"
              >
                <span>相性診断で探す</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </button>

              <button
                onClick={() => scrollToSection('casts')}
                className="group flex items-center justify-center rounded-full bg-white/80 px-6 py-3 text-sm font-medium text-neutral-700 shadow-soft backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-luxury sm:px-8 sm:py-4 sm:text-base"
              >
                <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span>キャスト一覧</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-8 lg:justify-start"
            >
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-primary to-accent sm:h-8 sm:w-8"
                    ></div>
                  ))}
                </div>
                <span className="ml-3 text-xs text-neutral-600 sm:text-sm">
                  500+ Happy Customers
                </span>
              </div>

              <div className="flex items-center">
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-current sm:h-5 sm:w-5" />
                  ))}
                </div>
                <span className="ml-2 text-xs text-neutral-600 sm:text-sm">4.9 Rating</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-white to-secondary shadow-luxury sm:rounded-3xl">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Strawberry Boys Tokyo - Premium luxury service experience"
                  className="h-full w-full object-cover"
                />
              </div>

              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -right-3 -top-3 rounded-xl bg-white p-3 shadow-luxury sm:-right-4 sm:-top-4 sm:rounded-2xl sm:p-4"
              >
                <div className="flex items-center">
                  <Heart className="h-4 w-4 fill-current text-primary sm:h-5 sm:w-5" />
                  <span className="ml-2 text-xs font-medium sm:text-sm">本日出勤</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                className="absolute -bottom-3 -left-3 rounded-xl bg-white p-3 shadow-luxury sm:-bottom-4 sm:-left-4 sm:rounded-2xl sm:p-4"
              >
                <div className="flex items-center">
                  <span className="mr-2 text-xl sm:text-2xl">🍓</span>
                  <div>
                    <div className="text-xs font-medium sm:text-sm">Premium</div>
                    <div className="text-xs text-neutral-600">Quality Service</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </section>
  );
};

export default Hero;
