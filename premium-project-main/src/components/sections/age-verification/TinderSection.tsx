'use client';

import React, { useEffect, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Store {
  id: string;
  name: string;
  slug: string;
  theme_color: string | null;
}

interface CastMember {
  id: string;
  name: string;
  catch_copy: string | null;
  main_image_url: string | null;
  mbti: { name: string } | null;
  face: { name: string } | null;
  stores: Store[];
}

interface TinderSectionProps {
  onAgeVerification: () => void;
}

const TinderSection: React.FC<TinderSectionProps> = ({ onAgeVerification }) => {
  const [castMembers, setCastMembers] = useState<CastMember[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedCount, setSwipedCount] = useState(0);
  const [showMoreButton, setShowMoreButton] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -50, 0, 50, 200], [0, 1, 1, 1, 0]);

  useEffect(() => {
    const fetchCasts = async () => {
      const { data, error } = await supabase
        .from('casts')
        .select(`
          id,
          name,
          catch_copy,
          main_image_url,
          mbti:feature_master!casts_mbti_id_fkey ( name ),
          face:feature_master!casts_face_id_fkey ( name ),
          stores:cast_store_memberships (
            store:stores (
              id,
              name,
              slug,
              theme_color
            )
          )
        `)
        .eq('is_active', true)
        .not('main_image_url', 'is', null); // ✅ サーバー側でフィルタリング

      if (error) {
        console.error('❌ fetch error:', error);
        return;
      }

      const mapped: CastMember[] = (data ?? []).map((c: any) => ({
        id: c.id,
        name: c.name,
        catch_copy: c.catch_copy ?? null,
        main_image_url: c.main_image_url ?? null,
        mbti: c.mbti ?? null,
        face: c.face ?? null,
        stores: (c.stores ?? []).map((s: any) => s.store),
      }));

      // ✅ シャッフルしてランダム表示
      setCastMembers(mapped.sort(() => Math.random() - 0.5));
    };

    fetchCasts();
  }, []);

  const handleDragEnd = (_event: any, info: PanInfo) => {
    const swipeThreshold = 100;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0) {
        onAgeVerification();
      } else {
        handleNextCard();
      }
    }
  };

  const handleNextCard = () => {
    const next = swipedCount + 1;
    setSwipedCount(next);
    if (next >= 5) setShowMoreButton(true);
    else setCurrentIndex((prev) => (prev + 1) % castMembers.length);
    x.set(0);
  };

  const currentCast = castMembers[currentIndex];

  // 🎨 グラデーション背景
  const cardBackground =
    currentCast?.stores && currentCast.stores.length > 0
      ? `linear-gradient(135deg, ${currentCast.stores
          .map((s) => s.theme_color || '#ffffff')
          .join(', ')})`
      : '#ffffff';

  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-rounded text-3xl font-bold text-gray-800">
            <Sparkles className="mr-2 inline h-8 w-8 text-strawberry-500" />
            直感で選ぶ
          </h2>
          <p className="text-gray-600">左スワイプで❌、右スワイプで❤️</p>
        </div>

        {!showMoreButton && currentCast ? (
          <div className="relative h-[28rem]">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              style={{ x, rotate, opacity, background: cardBackground }}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab overflow-hidden rounded-2xl border border-rose-100 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 画像 */}
              <div className="relative h-2/3 overflow-hidden">
                <img
                  src={currentCast.main_image_url!}
                  alt={currentCast.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* ❌ / ❤️ */}
                <div className="absolute top-4 left-0 right-0 flex justify-between px-6">
                  <button
                    onClick={handleNextCard}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-gray-100"
                  >
                    <X className="h-6 w-6 text-red-500" />
                  </button>
                  <button
                    onClick={onAgeVerification}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-pink-100"
                  >
                    <Heart className="h-6 w-6 text-pink-500" fill="currentColor" />
                  </button>
                </div>
              </div>

              {/* テキスト */}
              <div className="flex h-1/3 flex-col justify-end p-6 relative">
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none rounded-b-2xl" />
                <div className="relative z-10">
                  <h3 className="mb-2 font-rounded text-2xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    {currentCast.name}
                  </h3>
                  <p className="mb-4 text-lg font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]">
                    {currentCast.catch_copy ?? ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentCast.mbti?.name && (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs text-white font-semibold shadow-sm backdrop-blur-sm">
                        MBTI: {currentCast.mbti.name}
                      </span>
                    )}
                    {currentCast.face?.name && (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs text-white font-semibold shadow-sm backdrop-blur-sm">
                        顔型: {currentCast.face.name}
                      </span>
                    )}
                    {currentCast.stores?.map((store) => (
                      <span
                        key={store.id}
                        className="rounded-full bg-white/20 px-3 py-1 text-xs text-white font-semibold shadow-sm backdrop-blur-sm"
                      >
                        {store.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <Heart className="h-8 w-8 text-strawberry-500" />
            </div>
            <h3 className="mb-4 text-xl font-bold text-gray-800">他の方もご覧になりますか？</h3>
            <p className="mb-8 text-gray-600">まだまだ素敵な方々がお待ちしています</p>
            <button className="rounded-full bg-strawberry-500 px-8 py-3 font-medium text-white hover:bg-strawberry-600">
              もっと見る
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TinderSection;
