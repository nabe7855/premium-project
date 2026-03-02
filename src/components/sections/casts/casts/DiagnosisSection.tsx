'use client';

import { ANIMAL_INFO, LOVE_STYLES, MBTI_INFO } from '@/data/matchingData';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Heart, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { getCastsByStore } from '@/lib/getCastsByStore';
import { Cast } from '@/types/cast';
import { useParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { CardFallScene, StrawberryOverlay, WhiteoutScene } from './matching/MatchingAnimations';
import MatchingCarousel from './matching/MatchingCarousel';
import { calculateMatchScores, MatchingResult } from './matching/matchingUtils';

type Scene =
  | 'idle'
  | 'strawberry_fill'
  | 'background_fade'
  | 'strawberry_fade'
  | 'cards'
  | 'whiteout'
  | 'results';

const DiagnosisSection: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const storeSlug = params.slug as string;

  const [isHovered, setIsHovered] = useState(false);
  const [selectedMBTI, setSelectedMBTI] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedLoveStyle, setSelectedLoveStyle] = useState('');

  // アニメーション・結果用ステート
  const [scene, setScene] = useState<Scene>('idle');
  const [allCasts, setAllCasts] = useState<Cast[]>([]);
  const [matchResults, setMatchResults] = useState<MatchingResult[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 診断用のキャストデータを事前に取得（または初回クリック時に取得）
    const loadCasts = async () => {
      if (storeSlug) {
        const data = await getCastsByStore(storeSlug);
        setAllCasts(data);
      }
    };
    loadCasts();
  }, [storeSlug]);

  // アニメーションシーケンスの制御
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (scene === 'strawberry_fill') {
      timerId = setTimeout(() => setScene('background_fade'), 4500);
    } else if (scene === 'background_fade') {
      timerId = setTimeout(() => setScene('strawberry_fade'), 1500);
    } else if (scene === 'strawberry_fade') {
      timerId = setTimeout(() => setScene('cards'), 5000);
    } else if (scene === 'cards') {
      timerId = setTimeout(() => setScene('whiteout'), 4000);
    } else if (scene === 'whiteout') {
      timerId = setTimeout(() => setScene('results'), 600);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [scene]);

  const handleDiagnosisClick = () => {
    if (!selectedMBTI || !selectedAnimal || !selectedLoveStyle) {
      alert('すべての項目を選択してください');
      return;
    }

    // 相性計算
    const results = calculateMatchScores(allCasts, {
      mbti: selectedMBTI,
      animalType: selectedAnimal,
      loveStyles: selectedLoveStyle,
    });
    setMatchResults(results.slice(0, 5)); // トップ5位まで

    // アニメーション開始
    setScene('strawberry_fill');
  };

  const restartDiagnosis = () => {
    setScene('idle');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-secondary p-6"
      id="matching"
    >
      {/* ポータルを使用したオーバーレイ演出 */}
      {mounted &&
        createPortal(
          <>
            {(scene === 'strawberry_fill' ||
              scene === 'background_fade' ||
              scene === 'strawberry_fade') && (
              <StrawberryOverlay fadingOut={scene === 'strawberry_fade'} />
            )}
            {scene === 'cards' && <CardFallScene />}
            {scene === 'whiteout' && <WhiteoutScene />}
            {scene === 'results' && (
              <MatchingCarousel results={matchResults} onRestart={restartDiagnosis} />
            )}

            {/* 黒背景フェード */}
            <div
              className={`duration-[1500ms] pointer-events-none fixed inset-0 z-[9997] bg-black transition-opacity ${
                scene === 'background_fade' || scene === 'strawberry_fade' || scene === 'cards'
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
            />
          </>,
          document.body,
        )}

      <div className="mb-6 text-center">
        <div className="mb-3 flex items-center justify-center">
          <span className="mr-2 text-2xl">💕</span>
          <h3 className="font-serif text-xl font-bold text-neutral-800">
            相性診断でぴったりのキャストを見つけよう
          </h3>
        </div>
        <p className="text-sm text-neutral-600 sm:text-base">
          3つの質問に答えるだけで、あなたと相性抜群のキャストをご提案します
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* MBTI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div className="mb-3 flex flex-col items-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-sm font-bold text-neutral-800">MBTI診断</h4>
          </div>
          <div className="relative">
            <select
              value={selectedMBTI}
              onChange={(e) => setSelectedMBTI(e.target.value)}
              className="w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">選択してください</option>
              {MBTI_INFO.map((mbti) => (
                <option key={mbti.id} value={mbti.id}>
                  {mbti.id} - {mbti.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>
        </motion.div>

        {/* 動物占い */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div className="mb-3 flex flex-col items-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-sm font-bold text-neutral-800">動物占い</h4>
          </div>
          <div className="relative">
            <select
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
              className="w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">選択してください</option>
              {ANIMAL_INFO.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>
        </motion.div>

        {/* 希望シチュエーション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div className="mb-3 flex flex-col items-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-sm font-bold text-neutral-800">希望シチュエーション</h4>
          </div>
          <div className="relative">
            <select
              value={selectedLoveStyle}
              onChange={(e) => setSelectedLoveStyle(e.target.value)}
              className="w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">選択してください</option>
              {LOVE_STYLES.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="text-center">
        <motion.button
          onClick={handleDiagnosisClick}
          disabled={!selectedMBTI || !selectedAnimal || !selectedLoveStyle}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="group inline-flex items-center rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 font-medium text-white shadow-luxury transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>相性診断を始める</span>
          <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }}>
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.div>
        </motion.button>

        <p className="mt-3 text-xs text-neutral-500">⏱️ 約2分で完了 | 💯 完全無料</p>
      </div>
    </motion.div>
  );
};
export default DiagnosisSection;
