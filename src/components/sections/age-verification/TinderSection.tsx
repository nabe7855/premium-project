import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';

interface CastMember {
  id: number;
  name: string;
  age: number;
  image: string;
  specialty: string;
  personality: string[];
}

interface TinderSectionProps {
  onAgeVerification: () => void;
}

const TinderSection: React.FC<TinderSectionProps> = ({ onAgeVerification }) => {
  const castMembers: CastMember[] = [
    {
      id: 1,
      name: 'あきら',
      age: 26,
      image:
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialty: '癒し系トーク',
      personality: ['優しい', '聞き上手', '温厚'],
    },
    {
      id: 2,
      name: 'りゅうせい',
      age: 28,
      image:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialty: 'アクティブケア',
      personality: ['明るい', '元気', 'スポーティ'],
    },
    {
      id: 3,
      name: 'かずき',
      age: 24,
      image:
        'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialty: '知的会話',
      personality: ['落ち着き', '教養', '紳士的'],
    },
    {
      id: 4,
      name: 'たかし',
      age: 30,
      image:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialty: 'リラクゼーション',
      personality: ['包容力', '大人', '安心感'],
    },
    {
      id: 5,
      name: 'ゆうき',
      age: 25,
      image:
        'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialty: 'エンターテイメント',
      personality: ['面白い', 'クリエイティブ', '情熱的'],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedCount, setSwipedCount] = useState(0);
  const [showMoreButton, setShowMoreButton] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -50, 0, 50, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_event: any, info: PanInfo) => {
    const swipeThreshold = 100;

    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0) {
        // Right swipe (like)
        onAgeVerification();
      } else {
        // Left swipe (change)
        handleNextCard();
      }
    }
  };

  const handleNextCard = () => {
    const newSwipedCount = swipedCount + 1;
    setSwipedCount(newSwipedCount);

    if (newSwipedCount >= 5) {
      setShowMoreButton(true);
    } else {
      setCurrentIndex((prev) => (prev + 1) % castMembers.length);
    }

    x.set(0);
  };

  const handleLike = () => {
    onAgeVerification();
  };

  const currentCast = castMembers[currentIndex];

  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-md">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-rounded text-3xl font-bold text-gray-800">
            <Sparkles className="mr-2 inline h-8 w-8 text-strawberry-500" />
            直感で選ぶ
          </h2>
          <p className="text-gray-600">あなたの心が動いた方向に、スワイプしてください</p>
        </div>

        {!showMoreButton ? (
          <div className="relative h-96">
            {/* Swipe Instructions */}
            <div className="absolute left-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1 font-rounded text-xs text-gray-600 backdrop-blur-sm">
              ←チェンジ
            </div>
            <div className="absolute right-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1 font-rounded text-xs text-strawberry-600 backdrop-blur-sm">
              いいね♡→
            </div>

            {/* Cast Card */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              style={{ x, rotate, opacity }}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-xl active:cursor-grabbing"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="h-2/3 overflow-hidden">
                <img
                  src={currentCast.image}
                  alt={currentCast.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              <div className="flex h-1/3 flex-col justify-between p-6">
                <div>
                  <h3 className="mb-1 font-rounded text-xl font-bold text-gray-800">
                    {currentCast.name}{' '}
                    <span className="font-normal text-gray-500">({currentCast.age})</span>
                  </h3>
                  <p className="mb-2 font-medium text-strawberry-600">{currentCast.specialty}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentCast.personality.map((trait, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-rose-100 px-2 py-1 text-xs text-rose-700"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 transform gap-4">
              <button
                onClick={handleNextCard}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 shadow-lg transition-colors hover:bg-gray-200"
              >
                <RotateCcw className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={handleLike}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-strawberry-500 shadow-lg transition-colors hover:bg-strawberry-600"
              >
                <Heart className="h-5 w-5 text-white" fill="currentColor" />
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <Heart className="h-8 w-8 text-strawberry-500" />
            </div>
            <h3 className="mb-4 font-rounded text-xl font-bold text-gray-800">
              他の方もご覧になりますか？
            </h3>
            <p className="mb-8 text-gray-600">まだまだ素敵な方々がお待ちしています</p>
            <button
              onClick={onAgeVerification}
              className="rounded-full bg-strawberry-500 px-8 py-3 font-rounded font-medium text-white transition-colors hover:bg-strawberry-600"
            >
              もっと見る
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TinderSection;
