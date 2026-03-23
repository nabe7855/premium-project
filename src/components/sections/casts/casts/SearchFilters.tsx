import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronDown } from 'lucide-react';
import { MBTI_INFO } from '@/data/matchingData';
import { FACE_TYPES } from '@/data/faceTypes';
import { flavorTags } from '@/data/castsmockData';

interface SearchFiltersProps {
  showFilters: boolean;
  selectedMBTI: string | null;
  selectedFaceTypes: string[];
  ageRange: [number, number];
  selectedTags: string[];
  onMBTIChange: (mbti: string) => void;
  onFaceTypeToggle: (faceType: string) => void;
  onAgeRangeChange: (range: [number, number]) => void;
  onTagToggle: (tag: string) => void;
  onReset: () => void;
  hitCount: number; // 🆕 ヒット件数を追加
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  showFilters,
  selectedMBTI,
  selectedFaceTypes,
  ageRange,
  selectedTags,
  onMBTIChange,
  onFaceTypeToggle,
  onAgeRangeChange,
  onTagToggle,
  onReset,
  hitCount,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['tags']); // 最初はタグだけ開いておく等の調整可

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  const SectionHeader: React.FC<{ title: string; id: string }> = ({ title, id }) => (
    <button
      onClick={() => toggleSection(id)}
      className="flex w-full items-center justify-between py-1 transition-colors hover:text-primary"
    >
      <span className="text-sm font-black text-neutral-800">{title}</span>
      <ChevronDown 
        className={`h-4 w-4 text-neutral-400 transition-transform duration-300 ${
          expandedSections.includes(id) ? 'rotate-180 text-primary' : ''
        }`} 
      />
    </button>
  );

  return (
    <AnimatePresence mode="wait">
      {showFilters && (
        <motion.div
          id="filter-panel"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden rounded-[2.5rem] border border-rose-100 bg-white p-6 shadow-2xl"
        >
          <div className="mb-6 flex items-center justify-between border-b border-rose-50 pb-4">
            <h3 className="flex items-center gap-2 font-black text-slate-800">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              こだわり検索
              <span className="ml-2 text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                該当: {hitCount}名
              </span>
            </h3>
            <button
              onClick={onReset}
              className="flex items-center text-xs font-bold text-slate-400 transition-colors duration-200 hover:text-rose-500"
            >
              <RotateCcw className="mr-1 h-3 w-3" />
              リセット
            </button>
          </div>

          <div className="space-y-4">
            {/* MBTI選択 */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/30 p-4">
              <SectionHeader title="MBTI診断結果" id="mbti" />
              {expandedSections.includes('mbti') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4"
                >
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {MBTI_INFO.map((mbti) => (
                      <button
                        key={mbti.id}
                        onClick={() => onMBTIChange(selectedMBTI === mbti.id ? '' : mbti.id)}
                        className={`rounded-xl p-3 text-[10px] font-black transition-all duration-200 border ${
                          selectedMBTI === mbti.id
                            ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                            : 'bg-white border-neutral-100 text-neutral-500 hover:border-rose-200'
                        }`}
                      >
                        <div className="text-sm">{mbti.id}</div>
                        <div className="opacity-70">{mbti.name}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* 顔タイプ選択 */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/30 p-4">
              <SectionHeader title="いちご系タイプ（顔の印象）" id="face" />
              {expandedSections.includes('face') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4"
                >
                  <div className="flex flex-wrap gap-2">
                    {FACE_TYPES.map((faceType) => (
                      <button
                        key={faceType.id}
                        onClick={() => onFaceTypeToggle(faceType.id)}
                        className={`rounded-full px-4 py-2 text-xs font-black transition-all duration-200 border ${
                          selectedFaceTypes.includes(faceType.id)
                            ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                            : 'bg-white border-neutral-100 text-neutral-500 hover:border-rose-200'
                        }`}
                      >
                        {faceType.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* 年齢範囲 */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/30 p-4">
              <SectionHeader title={`年齢範囲: ${ageRange[0]}歳 - ${ageRange[1]}歳`} id="age" />
              {expandedSections.includes('age') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4"
                >
                  <div className="space-y-4 px-2">
                    <div className="relative h-2 w-full rounded-full bg-neutral-200">
                      <div 
                        className="absolute h-full bg-rose-400 rounded-full"
                        style={{ 
                          left: `${((ageRange[0] - 20) / 30) * 100}%`,
                          right: `${100 - ((ageRange[1] - 20) / 30) * 100}%`
                        }}
                      />
                      <input
                        type="range"
                        min="20"
                        max="50"
                        value={ageRange[0]}
                        onChange={(e) => onAgeRangeChange([parseInt(e.target.value), ageRange[1]])}
                        className="pointer-events-none absolute h-2 w-full appearance-none bg-transparent accent-rose-500 [&::-webkit-slider-thumb]:pointer-events-auto"
                      />
                      <input
                        type="range"
                        min="20"
                        max="50"
                        value={ageRange[1]}
                        onChange={(e) => onAgeRangeChange([ageRange[0], parseInt(e.target.value)])}
                        className="pointer-events-none absolute h-2 w-full appearance-none bg-transparent accent-rose-500 [&::-webkit-slider-thumb]:pointer-events-auto"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-neutral-400">
                      <span>20歳</span>
                      <span>50歳</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* フレーバータグ */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/30 p-4">
              <SectionHeader title="おすすめタグ" id="tags" />
              {expandedSections.includes('tags') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4"
                >
                  <div className="flex flex-wrap gap-2">
                    {flavorTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => onTagToggle(tag)}
                        className={`rounded-full px-4 py-2 text-[10px] font-black transition-all duration-200 border ${
                          selectedTags.includes(tag)
                            ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                            : 'bg-white border-neutral-100 text-neutral-500 hover:border-rose-200'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default SearchFilters;
