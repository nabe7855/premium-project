'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import CastDetail from '@/components/sections/cast/CastDetail';
import { mockCasts } from '@/data/castdata';

const CastDetailPage: React.FC = () => {
  const { castId } = useParams<{ castId: string }>();
  const router = useRouter();

  const cast = mockCasts.find((c) => c.id === castId);

  const handleBack = () => {
    router.push('/');
    // Scroll to cast list section after navigation
    setTimeout(() => {
      const castsSection = document.getElementById('casts');
      if (castsSection) {
        castsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!cast) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="mb-4">
            <span className="text-6xl">🍓</span>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-neutral-800">キャストが見つかりません</h1>
          <p className="mb-6 text-neutral-600">
            指定されたキャストは存在しないか、削除された可能性があります。
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary hover:bg-primary/90 rounded-full px-6 py-3 text-white transition-colors duration-200"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <CastDetail cast={cast} onBack={handleBack} />
    </motion.div>
  );
};

export default CastDetailPage;
