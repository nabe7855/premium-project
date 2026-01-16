'use client';

import { EditableImage } from '@/components/admin/EditableImage';
import { motion } from 'framer-motion';
import React from 'react';

interface FukuokaReasonProps {
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
  backgroundImage?: string;
}

const FukuokaReason: React.FC<FukuokaReasonProps> = ({
  isEditing = false,
  onUpdate,
  backgroundImage,
}) => {
  return (
    <section className="relative overflow-hidden bg-white py-32 text-white">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <EditableImage
          src={backgroundImage || '/福岡夜景.png'}
          alt="福岡の夜景"
          className="duration-[20s] h-full w-full object-cover transition-transform hover:scale-110"
          isEditing={isEditing}
          onUpload={(file) => {
            if (onUpdate) onUpdate('backgroundImage', file);
          }}
        />
        {/* Dark Overlay for Readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900/80"></div>

        {/* Edit Background Button */}
        {isEditing && (
          <label className="absolute right-4 top-4 z-50 cursor-pointer rounded bg-black/50 px-4 py-2 text-white hover:bg-black/70">
            <span className="text-sm font-bold">背景画像を変更</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && onUpdate) {
                  onUpdate('backgroundImage', file);
                }
              }}
            />
          </label>
        )}
      </motion.div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="mx-auto max-w-5xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        >
          {/* Fukuoka Vision Part - Extracted from IdealCandidate.tsx */}
          {/* Removed: <h2 className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-6">Fukuoka Expansion</h2> */}

          <h3 className="mb-10 font-serif text-3xl font-bold leading-tight drop-shadow-lg md:text-5xl">
            なぜ、いま福岡なのか。
          </h3>
          <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-slate-300">
            <p>
              数ある都市の中で、私たちが福岡を選んだのは、この街に「自分を変えたい」と強く願う熱量を感じたからです。
            </p>
            <p>
              私たちは、あなたのための場所を創るためにここに来ました。
              <br />
              東京で磨き上げたクオリティと、福岡の情熱を掛け合わせ、新しい時代の働き方を定義します。
            </p>
            <p className="pt-4 font-serif text-2xl font-bold italic text-amber-500 drop-shadow-md">
              "あなたの挑戦を、私たちは全力で肯定します。"
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FukuokaReason;
