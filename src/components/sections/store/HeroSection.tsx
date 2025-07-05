'use client';

import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const { store } = useStore();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={store.hero.backgroundImage}
          alt={store.name}
          className="h-full w-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${store.theme.gradient} opacity-80`} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute left-10 top-20 animate-bounce text-white/30 delay-1000">
          <Heart className="h-8 w-8" />
        </div>
        <div className="delay-2000 absolute right-20 top-32 animate-pulse text-white/30">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="delay-3000 absolute bottom-40 left-20 animate-bounce text-white/30">
          <Sparkles className="h-10 w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-4xl px-4 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
              {store.hero.title}
            </h1>
            <p className="text-xl font-light text-white/90 md:text-2xl lg:text-3xl">
              {store.hero.subtitle}
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm md:p-8">
            <p className="text-lg font-medium text-white md:text-xl">{store.hero.catchphrase}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="outline"
              size="lg"
              onClick={() => (window.location.href = `/store/${store.slug}/cast-list`)}
              className="rounded-full border-white/30 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm hover:bg-white/10"
            >
              キャスト一覧を見る
            </Button>
          </div>
          ｝
          <div className="mx-auto grid max-w-md grid-cols-3 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white md:text-3xl">247+</div>
              <div className="text-sm text-white/80">満足度レビュー</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white md:text-3xl">15+</div>
              <div className="text-sm text-white/80">在籍キャスト</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white md:text-3xl">4.8</div>
              <div className="text-sm text-white/80">平均評価</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transform">
        <div className="animate-bounce text-white/70">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/50">
            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white/70" />
          </div>
        </div>
      </div>
    </section>
  );
}
