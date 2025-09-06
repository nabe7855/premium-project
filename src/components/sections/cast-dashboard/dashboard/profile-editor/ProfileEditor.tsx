'use client';

import React, { useState } from 'react';
import { CastProfile, FeatureMaster } from '@/types/cast';

import BasicInfoSection from './BasicInfoSection';
import MBTISelect from './MBTISelect';
import AnimalSelect from './AnimalSelect';
import PersonalitySelector from './PersonalitySelector';
import FaceSelector from './FaceSelector';
import FeatureSelector from './FeatureSelector';
import ServiceLevels from './ServiceLevels';
import QuestionsSection from './QuestionsSection';
import SnsInput from './SnsInput';

interface ProfileEditorProps {
  cast: CastProfile;
  featureMasters?: FeatureMaster[];
  onSave: (updated: CastProfile) => void;
}

export default function ProfileEditor({ cast, onSave }: ProfileEditorProps) {
  const [form, setForm] = useState<any>({
    ...cast,
    personality: cast.personality || [],
    appearance: cast.appearance || [],
    features: cast.features || [],
    services: cast.services || {},
    questions: cast.questions || {},
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 space-y-6">
      <h2 className="text-xl font-bold">プロフィール編集（UIのみ）</h2>

      <BasicInfoSection form={form} onChange={handleChange} />
      <MBTISelect form={form} onChange={handleChange} />
      <AnimalSelect form={form} onChange={handleChange} />
      <PersonalitySelector form={form} onChange={handleChange} />
      <FaceSelector form={form} onChange={handleChange} />
      <FeatureSelector form={form} onChange={handleChange} />
      <ServiceLevels form={form} setForm={setForm} />
      <QuestionsSection form={form} setForm={setForm} />
      <SnsInput form={form} onChange={handleChange} />

      {/* 保存ボタン */}
      <button
        onClick={() => onSave(form)}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-rose-600"
      >
        保存（仮）
      </button>
    </div>
  );
}
