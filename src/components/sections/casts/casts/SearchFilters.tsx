'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { MBTI_INFO } from '@/data/matchingData';
import { FACE_TYPES } from '@/data/faceTypes';
import { flavorTags } from '@/data/castsmockData';

interface SearchFiltersProps {
  showFilters: boolean;
  selectedMBTI: string;
  selectedFaceTypes: string[];
  ageRange: [number, number];
  selectedTags: string[];
  onMBTIChange: (mbti: string) => void;
  onFaceTypeToggle: (faceType: string) => void;
  onAgeRangeChange: (range: [number, number]) => void;
  onTagToggle: (tag: string) => void;
  onReset: () => void;
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
}) => {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          id="filter-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-800">こだわり検索</h3>
            <button
              onClick={onReset}
              className="flex items-center text-sm text-neutral-600 transition-colors duration-200 hover:text-neutral-800"
            >
              <RotateCcw className="mr-1 h-4 w-4" />
              リセット
            </button>
          </div>

          {/* MBTI選択 */}
          <div>
            <label className="mb-3 block text-sm font-medium text-neutral-700">MBTI診断結果</label>
            <div className="grid grid-cols-4 gap-2">
              {MBTI_INFO.map((mbti) => (
                <button
                  key={mbti.id}
                  onClick={() => onMBTIChange(selectedMBTI === mbti.id ? '' : mbti.id)}
                  className={`rounded-lg p-2 text-xs font-medium transition-all duration-200 ${
                    selectedMBTI === mbti.id
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <div>{mbti.id}</div>
                  <div className="text-xs opacity-80">{mbti.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 顔タイプ選択 */}
          <div>
            <label className="mb-3 block text-sm font-medium text-neutral-700">顔タイプ</label>
            <div className="flex flex-wrap gap-2">
              {FACE_TYPES.map((faceType) => (
                <button
                  key={faceType.id}
                  onClick={() => onFaceTypeToggle(faceType.id)}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedFaceTypes.includes(faceType.id)
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {faceType.name}
                </button>
              ))}
            </div>
          </div>

          {/* 年齢範囲 */}
          <div>
            <label className="mb-3 block text-sm font-medium text-neutral-700">
              年齢: {ageRange[0]}歳 - {ageRange[1]}歳
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-600">最小年齢</label>
                <input
                  type="range"
                  min="20"
                  max="50"
                  value={ageRange[0]}
                  onChange={(e) => onAgeRangeChange([parseInt(e.target.value), ageRange[1]])}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-600">最大年齢</label>
                <input
                  type="range"
                  min="20"
                  max="50"
                  value={ageRange[1]}
                  onChange={(e) => onAgeRangeChange([ageRange[0], parseInt(e.target.value)])}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200"
                />
              </div>
            </div>
          </div>

          {/* フレーバータグ */}
          <div>
            <label className="mb-3 block text-sm font-medium text-neutral-700">
              フレーバータグ
            </label>
            <div className="flex flex-wrap gap-2">
              {flavorTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default SearchFilters;
