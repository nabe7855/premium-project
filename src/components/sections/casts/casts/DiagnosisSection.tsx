'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MBTI_INFO, ANIMAL_INFO, LOVE_STYLES } from '@/data/matchingData';

const DiagnosisSection: React.FC = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedMBTI, setSelectedMBTI] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedLoveStyle, setSelectedLoveStyle] = useState('');

  const handleDiagnosisClick = () => {
    if (!selectedMBTI || !selectedAnimal || !selectedLoveStyle) {
      alert('すべての項目を選択してください');
      return;
    }
    // 診断結果を検索ページに送信
    const params = new URLSearchParams({
      mbti: selectedMBTI,
      animalType: selectedAnimal,
      loveStyles: selectedLoveStyle,
    });

    router.push(`/store/tokyo/cast-list/search?${params.toString()}`);
  };

  //const features = [
  //{ icon: Brain, label: 'MBTI診断', description: '性格タイプから相性を分析' },
  //{ icon: Heart, label: '動物占い', description: 'あなたの本質を動物で表現' },
  //{ icon: Sparkles, label: '希望シチュエーション', description: '理想の時間の過ごし方' }
  //]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-secondary p-6"
      id="matching"
    >
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

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white/80 p-4 backdrop-blur-sm"
        >
          <div className="mb-2 flex justify-center">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <h4 className="mb-2 text-sm font-semibold text-neutral-800">MBTI診断</h4>
          <select
            value={selectedMBTI}
            onChange={(e) => setSelectedMBTI(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">選択してください</option>
            {MBTI_INFO.map((mbti) => (
              <option key={mbti.id} value={mbti.id}>
                {mbti.id} - {mbti.name}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-white/80 p-4 backdrop-blur-sm"
        >
          <div className="mb-2 flex justify-center">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h4 className="mb-2 text-sm font-semibold text-neutral-800">動物占い</h4>
          <select
            value={selectedAnimal}
            onChange={(e) => setSelectedAnimal(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">選択してください</option>
            {ANIMAL_INFO.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-white/80 p-4 backdrop-blur-sm"
        >
          <div className="mb-2 flex justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h4 className="mb-2 text-sm font-semibold text-neutral-800">希望シチュエーション</h4>
          <select
            value={selectedLoveStyle}
            onChange={(e) => setSelectedLoveStyle(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">選択してください</option>
            {LOVE_STYLES.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
          </select>
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
