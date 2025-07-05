'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Sparkles, Phone, MessageCircle } from 'lucide-react';

export default function ClosingCTA() {
  const { store } = useStore();

  return (
    <section className={`py-20 px-4 bg-gradient-to-br ${store.theme.gradient} text-white relative overflow-hidden`}>
      {/* Animated SB-kun (mascot) */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
        <div className="animate-bounce">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="text-2xl md:text-3xl">🍓</div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="animate-pulse delay-1000 absolute top-10 left-10 text-white/20">
          <Heart className="w-8 h-8" />
        </div>
        <div className="animate-bounce delay-2000 absolute top-20 right-20 text-white/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="animate-pulse delay-3000 absolute bottom-32 left-20 text-white/20">
          <Sparkles className="w-10 h-10" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              素敵な時間が<br />
              あなたを待っています
            </h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              {store.city}で一番特別な癒しの時間を<br />
              心を込めてお届けします
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-pink-200" />
              <h3 className="text-lg md:text-xl font-semibold">今すぐご予約・お問い合わせ</h3>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1">{store.contact.phone}</div>
                <div className="text-white/80">営業時間: 18:00 - 翌5:00</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold mb-1">LINE ID: {store.contact.line}</div>
                <div className="text-white/80 text-sm">24時間受付中</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              <Phone className="w-5 h-5 mr-2" />
              電話で予約する
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-bold px-8 py-4 text-lg rounded-full backdrop-blur-sm"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              LINEで相談
            </Button>
          </div>

          <div className="text-center">
            <p className="text-white/80 text-sm leading-relaxed max-w-md mx-auto">
              初回の方も安心してご利用いただけます。<br />
              不安なことがございましたら、お気軽にお問い合わせください。
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 text-white/60">
            <div className="text-center">
              <div className="text-lg font-bold">4.8/5.0</div>
              <div className="text-xs">平均評価</div>
            </div>
            <div className="w-px h-8 bg-white/30"></div>
            <div className="text-center">
              <div className="text-lg font-bold">247+</div>
              <div className="text-xs">満足レビュー</div>
            </div>
            <div className="w-px h-8 bg-white/30"></div>
            <div className="text-center">
              <div className="text-lg font-bold">98%</div>
              <div className="text-xs">満足度</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}