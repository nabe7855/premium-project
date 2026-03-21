'use client';

import { ANIMAL_INFO, LOVE_STYLES, MBTI_INFO } from '@/data/matchingData';
import { FACE_TYPES } from '@/data/faceTypes'; // 顔タイプ追加
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Heart, Sparkles, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { getCastsByStore } from '@/lib/getCastsByStore';
import { Cast } from '@/types/cast';
import { useParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { CardFallScene, StrawberryOverlay, WhiteoutScene } from './matching/MatchingAnimations';
import MatchingCarousel from './matching/MatchingCarousel';
import { calculateMatchScores, MatchingResult } from './matching/matchingUtils';

// 質問データの定義（好みの顔タイプ診断用）
const PREFERENCE_QUESTIONS = [
  // 軸1: 世代感 (A: スウィート/子供顔, B: ビター/大人顔)
  {
    text: 'Q1. 相手の男性には実年齢より…',
    options: { A: '若く見えてほしい（若々しい・可愛い）', B: '大人っぽく見えてほしい（落ち着き）' },
    axis: 'generation',
  },
  {
    text: 'Q2. 好みの顔の縦の比率は…',
    options: { A: 'やや短め（幼いバランス）', B: '長め（大人っぽいバランス）' },
    axis: 'generation',
  },
  {
    text: 'Q3. 相手の男性の全体的な雰囲気は…',
    options: { A: '親しみやすくカジュアル', B: '落ち着いていてクール・セクシー' },
    axis: 'generation',
  },
  // 軸2: 形状 (A: まろやか/曲線, B: すっきり/直線)
  {
    text: 'Q4. 好きな顔の輪郭は？',
    options: { A: '丸みがある・卵型', B: '骨っぽさがある・シャープなベース型' },
    axis: 'shape',
  },
  {
    text: 'Q5. 好きな目元の形は？',
    options: { A: '丸みがある・二重でパッチリ', B: '切れ長・一重や奥二重でスッキリ' },
    axis: 'shape',
  },
  {
    text: 'Q6. 鼻や唇の印象は？',
    options: { A: '小ぶりで丸みがある・ぽってり', B: '鼻筋が通っている・薄めの唇' },
    axis: 'shape',
  },
  // 軸3: 濃さ (A: ソフト/繊細, B: リッチ/はっきり)
  {
    text: 'Q7. 各パーツ（目や鼻など）の大きさは？',
    options: { A: '小さめ〜普通・すっきりしている', B: '大きくてはっきりしている' },
    axis: 'intensity',
  },
  {
    text: 'Q8. 眉毛や輪郭の主張は？',
    options: { A: '薄め・細め・柔らかい', B: 'しっかり濃いめ・骨格がハッキリ' },
    axis: 'intensity',
  },
  {
    text: 'Q9. 相手の第一印象はどちらが好き？',
    options: { A: '優しそう・儚げな雰囲気', B: '目力がある・華やかな雰囲気' },
    axis: 'intensity',
  },
];

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
  const [selectedFaceType, setSelectedFaceType] = useState('');
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionStep, setQuestionStep] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, 'A' | 'B'>>({});

  // アニメーション・結果用ステート
  const [scene, setScene] = useState<Scene>('idle');
  const [allCasts, setAllCasts] = useState<Cast[]>([]);
  const [matchResults, setMatchResults] = useState<MatchingResult[]>([]);
  const [mounted, setMounted] = useState(false);

  const handleQuestionAnswer = (choice: 'A' | 'B') => {
    const newAnswers = { ...questionAnswers, [questionStep]: choice };
    setQuestionAnswers(newAnswers);

    if (questionStep < PREFERENCE_QUESTIONS.length - 1) {
      setQuestionStep(questionStep + 1);
    } else {
      // 診断結果を計算
      let generationA = 0;
      let shapeA = 0;
      let intensityA = 0;

      PREFERENCE_QUESTIONS.forEach((q, idx) => {
        const isA = newAnswers[idx] === 'A';
        if (q.axis === 'generation' && isA) generationA++;
        if (q.axis === 'shape' && isA) shapeA++;
        if (q.axis === 'intensity' && isA) intensityA++;
      });

      const isSweet = generationA >= 2;
      const isMellow = shapeA >= 2;
      const isSoft = intensityA >= 2;

      let resultId = '';
      if (isSweet && isMellow && isSoft) resultId = '章姫（あきひめ）';
      else if (isSweet && isMellow && !isSoft) resultId = 'とちおとめ';
      else if (isSweet && !isMellow && isSoft) resultId = 'パールホワイト';
      else if (isSweet && !isMellow && !isSoft) resultId = 'さがほのか';
      else if (!isSweet && isMellow && isSoft) resultId = '淡雪（あわゆき）';
      else if (!isSweet && isMellow && !isSoft) resultId = 'あまおう';
      else if (!isSweet && !isMellow && isSoft) resultId = 'ゆめのか';
      else if (!isSweet && !isMellow && !isSoft) resultId = 'スカイベリー';

      setSelectedFaceType(resultId);
      setIsQuestionModalOpen(false);
    }
  };

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
      faceType: selectedFaceType,
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

      {/* 顔タイプ選択モーダル */}
      {mounted && isFaceModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity" onClick={() => setIsFaceModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
               <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white sticky top-0 z-10">
                  <h3 className="text-lg font-bold text-neutral-800">直感で選ぶ！好みのタイプ</h3>
                  <button onClick={() => setIsFaceModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors" aria-label="閉じる">
                     <span className="text-xl leading-none">&times;</span>
                  </button>
               </div>
               
               <div className="p-4 overflow-y-auto custom-scrollbar">
                  <p className="text-sm text-neutral-600 mb-5 text-center leading-relaxed">
                    いちごに例えた8種類のイケメンから、<br className="sm:hidden" />
                    あなたの直感でピンときた顔を選んでください💕
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                     {FACE_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                             setSelectedFaceType(type.id);
                             setIsFaceModalOpen(false);
                          }}
                          className={`group flex flex-col items-center rounded-xl border-2 transition-all overflow-hidden text-left ${selectedFaceType === type.id ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-neutral-100 hover:border-primary/50 hover:bg-neutral-50 shadow-sm'}`}
                        >
                           <div className="w-full aspect-square relative overflow-hidden bg-neutral-100">
                              <img src={type.imageUrl} alt={type.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                           </div>
                           <div className="p-3 w-full flex flex-col items-center bg-white group-hover:bg-neutral-50 transition-colors">
                              <span className={`text-[13px] sm:text-sm font-bold mb-1 w-full text-center truncate ${selectedFaceType === type.id ? 'text-primary' : 'text-neutral-800'}`}>{type.name}</span>
                              <span className="text-[10px] text-neutral-500 leading-tight text-center w-full line-clamp-2">
                                {type.description?.split('\n')[0] || type.description}
                              </span>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>
            </motion.div>
          </div>,
          document.body,
        )
      }

      {/* 顔タイプ質問診断モーダル */}
      {mounted && isQuestionModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity" onClick={() => setIsQuestionModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-pink-500">
                  好みのタイプ診断（{questionStep + 1} / {PREFERENCE_QUESTIONS.length}）
                </span>
                <button
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  キャンセル
                </button>
              </div>
              
              <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div 
                  className="h-full bg-pink-400 transition-all duration-300" 
                  style={{ width: `${((questionStep) / PREFERENCE_QUESTIONS.length) * 100}%` }} 
                />
              </div>

              <p className="mb-8 text-center text-lg font-bold text-gray-800 leading-relaxed">
                {PREFERENCE_QUESTIONS[questionStep].text}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleQuestionAnswer('A')}
                  className="flex items-center justify-between rounded-xl border-2 border-pink-100 bg-pink-50/50 p-4 text-left font-medium text-gray-700 transition-all hover:border-pink-300 hover:bg-pink-100/50 active:scale-95"
                >
                  <span className="text-sm sm:text-base">A. {PREFERENCE_QUESTIONS[questionStep].options.A}</span>
                  <ArrowRight className="h-4 w-4 text-pink-400 ml-2 shrink-0" />
                </button>
                <button
                  onClick={() => handleQuestionAnswer('B')}
                  className="flex items-center justify-between rounded-xl border-2 border-indigo-100 bg-indigo-50/50 p-4 text-left font-medium text-gray-700 transition-all hover:border-indigo-300 hover:bg-indigo-100/50 active:scale-95"
                >
                  <span className="text-sm sm:text-base">B. {PREFERENCE_QUESTIONS[questionStep].options.B}</span>
                  <ArrowRight className="h-4 w-4 text-indigo-400 ml-2 shrink-0" />
                </button>
              </div>
            </motion.div>
          </div>,
          document.body,
        )
      }

      <div className="mb-6 text-center">
        <div className="mb-3 flex items-center justify-center">
          <span className="mr-2 text-2xl">💕</span>
          <h3 className="font-serif text-xl font-bold text-neutral-800">
            相性診断でぴったりのキャストを見つけよう
          </h3>
        </div>
        <p className="text-sm text-neutral-600 sm:text-base">
          4つの質問に答えるだけで、あなたと相性抜群のキャストをご提案します
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* 顔の好み（印象タイプ） */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md h-full flex flex-col"
        >
          <div className="mb-3 flex flex-col items-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <UserCircle className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-sm font-bold text-neutral-800">好みのいちご系タイプ（顔の印象）</h4>
          </div>
          
          <div className="mt-auto relative w-full">
            {!selectedFaceType ? (
              <div className="flex flex-col gap-2 w-full">
                <button
                   type="button"
                   onClick={() => setIsFaceModalOpen(true)}
                   className="w-full rounded-xl border border-primary/30 bg-primary/5 px-3 py-3 text-xs sm:text-sm font-bold text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2 shadow-sm relative overflow-hidden group"
                >
                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                   <span className="text-xl relative z-10">🖼️</span>
                   <span className="relative z-10">イラストから直感で選ぶ</span>
                </button>
                <button
                   type="button"
                   onClick={() => {
                     setQuestionStep(0);
                     setQuestionAnswers({});
                     setIsQuestionModalOpen(true);
                   }}
                   className="w-full rounded-xl border border-indigo-300/40 bg-indigo-50/50 px-3 py-3 text-xs sm:text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-sm relative overflow-hidden group"
                >
                   <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                   <span className="text-xl relative z-10">✨</span>
                   <span className="relative z-10">質問に答えて診断する</span>
                </button>
              </div>
            ) : (
              <div 
                className="relative rounded-lg border border-primary/30 bg-white shadow-sm overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors" 
                onClick={() => setIsFaceModalOpen(true)}
              >
                {(() => {
                  const face = FACE_TYPES.find(f => f.id === selectedFaceType);
                  return face ? (
                    <div className="flex flex-col items-center p-3 relative">
                       <div className="relative w-16 h-16 mb-2 rounded-full overflow-hidden shadow-inner bg-neutral-100 shrink-0">
                          <img src={face.imageUrl} alt={face.name} className="w-full h-full object-cover" />
                       </div>
                       <span className="text-sm font-bold text-primary mb-1">{face.name}</span>
                       <p className="text-[10px] text-neutral-600 text-center whitespace-pre-line leading-relaxed">
                          {face.description}
                       </p>
                       
                       <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <span className="bg-white/95 text-primary text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                            変更する
                          </span>
                       </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="text-center">
        <motion.button
          onClick={handleDiagnosisClick}
          disabled={!selectedMBTI || !selectedAnimal || !selectedLoveStyle || !selectedFaceType}
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
