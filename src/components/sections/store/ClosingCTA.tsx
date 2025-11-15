'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Phone, MessageCircle } from 'lucide-react';
export default function ClosingCTA() {
  const { store } = useStore();

  return (
    <section
      className={`bg-gradient-to-br px-4 py-20 ${store.theme.gradient} relative overflow-hidden text-white`}
    >
      {/* Animated SB-kun (mascot) */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
        <div className="animate-bounce">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm md:h-20 md:w-20">
            <div className="text-2xl md:text-3xl">🍓</div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute left-10 top-10 animate-pulse text-white/20 delay-1000">
          <Heart className="h-8 w-8" />
        </div>
        <div className="delay-2000 absolute right-20 top-20 animate-bounce text-white/20">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="delay-3000 absolute bottom-32 left-20 animate-pulse text-white/20">
          <Sparkles className="h-10 w-10" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">
              素敵な時間が
              <br />
              あなたを待っています
            </h2>
            <p className="text-xl leading-relaxed text-white/90 md:text-2xl">
              {store.city}で一番特別な癒しの時間を
              <br />
              心を込めてお届けします
            </p>
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm md:p-8">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-pink-200" />
              <h3 className="text-lg font-semibold md:text-xl">今すぐご予約・お問い合わせ</h3>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold md:text-3xl">{store.contact.phone}</div>
                <div className="text-white/80">営業時間: 18:00 - 翌5:00</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-lg font-semibold">LINE ID: {store.contact.line}</div>
                <div className="text-sm text-white/80">24時間受付中</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="transform rounded-full bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100"
            >
              <Phone className="mr-2 h-5 w-5" />
              電話で予約する
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/30 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm hover:bg-white/10"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              LINEで相談
            </Button>
          </div>

          <div className="text-center">
            <p className="mx-auto max-w-md text-sm leading-relaxed text-white/80">
              初回の方も安心してご利用いただけます。
              <br />
              不安なことがございましたら、お気軽にお問い合わせください。
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 text-white/60">
            <div className="text-center">
              <div className="text-lg font-bold">4.8/5.0</div>
              <div className="text-xs">平均評価</div>
            </div>
            <div className="h-8 w-px bg-white/30"></div>
            <div className="text-center">
              <div className="text-lg font-bold">247+</div>
              <div className="text-xs">満足レビュー</div>
            </div>
            <div className="h-8 w-px bg-white/30"></div>
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
