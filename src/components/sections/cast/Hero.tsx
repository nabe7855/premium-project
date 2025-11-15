'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, Calendar } from 'lucide-react';
import BookingModal from './BookingModal';

const Hero: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-secondary via-white to-neutral-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="mb-6">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-soft"
              >
                <span className="text-2xl mr-2">🍓</span>
                <span className="text-sm font-medium text-primary">Premium Experience</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 mb-6 font-serif leading-tight">
                心とろける<br />
                <span className="text-primary">極上のひととき</span>を
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                東京の上質なラグジュアリーサービス。経験豊富なキャストが、あなただけの特別な時間をお届けします。
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a 
                href="#casts"
                className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-luxury hover:shadow-xl flex items-center justify-center"
              >
                <span>キャストを探す</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="group bg-white/80 backdrop-blur-sm hover:bg-white text-neutral-700 px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-soft hover:shadow-luxury flex items-center justify-center"
              >
                <Calendar className="mr-2 w-5 h-5" />
                <span>今すぐ予約</span>
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8"
            >
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-white"></div>
                  ))}
                </div>
                <span className="ml-3 text-sm text-neutral-600">500+ Happy Customers</span>
              </div>
              
              <div className="flex items-center">
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-neutral-600">4.9 Rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-white to-secondary rounded-3xl shadow-luxury overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Strawberry Boys Tokyo - Premium luxury service experience"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              
              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-luxury"
              >
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-primary fill-current" />
                  <span className="ml-2 text-sm font-medium">本日出勤</span>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-luxury"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🍓</span>
                  <div>
                    <div className="text-sm font-medium">Premium</div>
                    <div className="text-xs text-neutral-600">Quality Service</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </section>
  );
};

export default Hero;