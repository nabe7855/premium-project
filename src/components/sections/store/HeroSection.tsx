'use client';

import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const { store } = useStore();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={store.hero.backgroundImage}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${store.theme.gradient} opacity-80`} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10">
        <div className="animate-bounce delay-1000 absolute top-20 left-10 text-white/30">
          <Heart className="w-8 h-8" />
        </div>
        <div className="animate-pulse delay-2000 absolute top-32 right-20 text-white/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="animate-bounce delay-3000 absolute bottom-40 left-20 text-white/30">
          <Sparkles className="w-10 h-10" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              {store.hero.title}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light">
              {store.hero.subtitle}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
            <p className="text-lg md:text-xl text-white font-medium">
              {store.hero.catchphrase}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              今すぐ予約する
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg rounded-full backdrop-blur-sm"
            >
              キャスト一覧を見る
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">247+</div>
              <div className="text-white/80 text-sm">満足度レビュー</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">15+</div>
              <div className="text-white/80 text-sm">在籍キャスト</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">4.8</div>
              <div className="text-white/80 text-sm">平均評価</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce text-white/70">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}