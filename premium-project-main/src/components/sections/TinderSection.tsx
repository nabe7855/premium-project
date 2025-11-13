'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, Star, Users } from 'lucide-react';
import { useAgeVerification } from '@/hooks/useAgeVerification';
import AgeVerificationModal from '@/components/ui/AgeVerificationModal';

interface Cast {
  id: number;
  name: string;
  age: number;
  image: string;
  location: string;
  rating: number;
  tags: string[];
  description: string;
}

const allCasts: Cast[] = [
  {
    id: 1,
    name: '拓海',
    age: 26,
    image:
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: '渋谷エリア',
    rating: 4.8,
    tags: ['優しい', '聞き上手', 'カフェ好き'],
    description: 'お疲れ様です。今日も一日頑張ったあなたを、温かい笑顔でお迎えします。',
  },
  {
    id: 2,
    name: '蓮',
    age: 24,
    image:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: '新宿エリア',
    rating: 4.9,
    tags: ['クール', '知的', '読書好き'],
    description: '静かな時間を一緒に過ごしませんか。あなたのペースに合わせてお話しします。',
  },
  {
    id: 3,
    name: '陽向',
    age: 28,
    image:
      'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: '銀座エリア',
    rating: 4.7,
    tags: ['明るい', '料理上手', 'アクティブ'],
    description: '一緒に美味しいものを食べて、楽しい時間を過ごしましょう！',
  },
  {
    id: 4,
    name: '颯太',
    age: 25,
    image:
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: '表参道エリア',
    rating: 4.6,
    tags: ['スポーツ好き', '爽やか', 'アウトドア'],
    description: 'アクティブに過ごしたい時も、のんびりしたい時も、あなたに合わせます。',
  },
  {
    id: 5,
    name: '悠斗',
    age: 27,
    image:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: '六本木エリア',
    rating: 4.8,
    tags: ['大人っぽい', 'ワイン好き', '落ち着いた'],
    description: '大人の時間を一緒に楽しみませんか。上質な会話でおもてなしします。',
  },
];

export default function TinderSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedCount, setViewedCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { isModalOpen, requireAgeVerification, handleConfirm, handleClose } = useAgeVerification();

  const currentCast = allCasts[currentIndex];
  const showMoreButton = viewedCount >= 5;

  // タッチイベントハンドラー
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const threshold = 100;

    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        // 右スワイプ - 年齢確認
        handleRightSwipe();
      } else {
        // 左スワイプ - 次のキャスト
        handleLeftSwipe();
      }
    }

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  // マウスイベントハンドラー
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const threshold = 100;

    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        // 右スワイプ - 年齢確認
        handleRightSwipe();
      } else {
        // 左スワイプ - 次のキャスト
        handleLeftSwipe();
      }
    }

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleRightSwipe = () => {
    requireAgeVerification(() => {
      console.log(`キャスト詳細: ${currentCast.name}`);
    });
  };

  const handleLeftSwipe = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % allCasts.length);
      setViewedCount((prev) => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleMoreCastsClick = () => {
    requireAgeVerification(() => {
      console.log('他のキャスト一覧表示');
    });
  };

  // カードのスタイル計算
  const getCardStyle = () => {
    if (!isDragging) return {};

    const rotation = dragOffset.x * 0.1;
    const opacity = 1 - Math.abs(dragOffset.x) / 300;

    return {
      transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
      opacity: Math.max(0.3, opacity),
    };
  };

  // スワイプインジケーターの表示
  const getSwipeIndicator = () => {
    if (!isDragging || Math.abs(dragOffset.x) < 50) return null;

    if (dragOffset.x > 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-green-500/20">
          <div className="rounded-full bg-green-500 px-4 py-2 font-bold text-white">
            <Heart className="mr-2 inline h-6 w-6" />
            詳細を見る
          </div>
        </div>
      );
    } else {
      return (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-red-500/20">
          <div className="rounded-full bg-red-500 px-4 py-2 font-bold text-white">
            <X className="mr-2 inline h-6 w-6" />
            次の方へ
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <section className="bg-gradient-to-b from-white to-pink-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
              運命の出会いを探してみませんか？
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              直感で選んで、右にスワイプで詳細へ、左で次の方へ
            </p>
          </div>

          {!showMoreButton ? (
            <>
              {/* Swipeable Card */}
              <div className="relative mx-auto max-w-sm">
                <Card
                  ref={cardRef}
                  className={`cursor-grab overflow-hidden shadow-2xl transition-all duration-300 active:cursor-grabbing ${
                    isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
                  }`}
                  style={getCardStyle()}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div className="relative">
                    <img
                      src={currentCast.image}
                      alt={currentCast.name}
                      className="h-96 w-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Swipe Indicator */}
                    {getSwipeIndicator()}

                    {/* Cast Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-2xl font-bold">{currentCast.name}</h3>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {currentCast.age}歳
                        </Badge>
                      </div>

                      <div className="mb-2 flex items-center text-sm">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span>{currentCast.location}</span>
                        <Star className="ml-4 mr-1 h-4 w-4 text-yellow-400" />
                        <span>{currentCast.rating}</span>
                      </div>

                      <div className="mb-3 flex flex-wrap gap-1">
                        {currentCast.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-white/20 text-xs text-white"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <p className="line-clamp-2 text-sm opacity-90">{currentCast.description}</p>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-center gap-6">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLeftSwipe}
                    className="h-16 w-16 rounded-full border-gray-300 transition-colors hover:border-gray-400"
                    disabled={isAnimating}
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </Button>

                  <Button
                    size="lg"
                    onClick={handleRightSwipe}
                    className="h-16 w-16 rounded-full bg-rose-600 transition-colors hover:bg-rose-700"
                    disabled={isAnimating}
                  >
                    <Heart className="h-6 w-6" />
                  </Button>
                </div>

                {/* Swipe Guide */}
                <div className="mt-4 flex items-center justify-between px-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-2 text-2xl">👈</span>
                    <span>次の方へ</span>
                  </div>
                  <div className="flex items-center">
                    <span>詳細を見る</span>
                    <span className="ml-2 text-2xl">👉</span>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-6 flex justify-center gap-2">
                  {allCasts.slice(0, 5).map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        index <= viewedCount ? 'bg-rose-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Viewed Count */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">{viewedCount + 1} / 5 人目</p>
                </div>
              </div>
            </>
          ) : (
            /* More Casts Button */
            <div className="mx-auto max-w-sm text-center">
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
                  <Users className="h-10 w-10 text-rose-600" />
                </div>

                <h3 className="mb-4 font-serif text-2xl font-bold text-gray-900">
                  他にも素敵な方が
                  <br />
                  たくさんいます
                </h3>

                <p className="mb-6 text-gray-600">
                  もっと多くのキャストの中から
                  <br />
                  あなたにぴったりの方を見つけませんか？
                </p>

                <Button
                  size="lg"
                  onClick={handleMoreCastsClick}
                  className="transform rounded-full bg-rose-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-rose-700 hover:shadow-xl"
                >
                  <Users className="mr-2 h-5 w-5" />
                  他のキャストを見る
                </Button>

                <p className="mt-4 text-xs text-gray-500">※100名以上のキャストが在籍しています</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Age Verification Modal */}
      <AgeVerificationModal isOpen={isModalOpen} onClose={handleClose} onConfirm={handleConfirm} />
    </>
  );
}
