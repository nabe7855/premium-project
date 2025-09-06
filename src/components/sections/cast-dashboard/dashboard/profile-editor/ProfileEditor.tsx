'use client';

import React, { useState } from 'react';
import { CastProfile, FeatureMaster } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';

import BasicInfoSection from './BasicInfoSection';
import MBTISelect from './MBTISelect';
import AnimalSelect from './AnimalSelect';
import FaceSelector from './FaceSelector';
import FeatureSelector from './FeatureSelector';
import ServiceLevels from './ServiceLevels';
import QuestionsSection from './QuestionsSection';
import SnsInput from './SnsInput';

interface ProfileEditorProps {
  cast: CastProfile;
  featureMasters: FeatureMaster[]; // ✅ 必須にした
  onSave: (updated: CastProfile) => void;
}

export default function ProfileEditor({
  cast,
  featureMasters,
  onSave,
}: ProfileEditorProps) {
  const [form, setForm] = useState<CastProfile>({
    ...cast,
    personalityIds: cast.personalityIds ?? [],
    appearanceIds: cast.appearanceIds ?? [],
    services: cast.services ?? {},
    questions: cast.questions ?? {},
  });

  // ✅ 型安全な共通ハンドラ
  const handleChange: OnChangeHandler = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 space-y-6 pb-24">
      {/* 👆 pb-24 を追加してナビゲーションバーの高さ分スペースを確保 */}

      <h2 className="text-xl font-bold">プロフィール編集</h2>

      <BasicInfoSection form={form} onChange={handleChange} />
      <MBTISelect 
  form={form} 
  onChange={handleChange} 
  featureMasters={featureMasters} 
/>
      <AnimalSelect 
  form={form} 
  onChange={handleChange} 
  featureMasters={featureMasters} // ✅ 追加
/>

      {/* ✅ Personality と Appearance を共通の FeatureSelector に統一 */}
      <FeatureSelector
        form={form}
        onChange={handleChange}
        featureMasters={featureMasters}
        category="personality"
      />
      <FeatureSelector
        form={form}
        onChange={handleChange}
        featureMasters={featureMasters}
        category="appearance"
      />

      <FaceSelector
        form={form}
        onChange={handleChange}
        featureMasters={featureMasters}
      />
      <ServiceLevels form={form} onChange={handleChange} />
      <QuestionsSection form={form} onChange={handleChange} />
      <SnsInput form={form} onChange={handleChange} />

      {/* 保存ボタン */}
      <button
        onClick={() => onSave(form)}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-rose-600"
      >
        保存
      </button>
    </div>
  );
}
