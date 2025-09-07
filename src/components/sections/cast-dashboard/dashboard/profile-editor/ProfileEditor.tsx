'use client';

import React, { useEffect, useState } from 'react';
import { CastProfile, FeatureMaster, QuestionMaster } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';

import BasicInfoSection from './BasicInfoSection';
import MBTISelect from './MBTISelect';
import AnimalSelect from './AnimalSelect';
import FaceSelector from './FaceSelector';
import FeatureSelector from './FeatureSelector';
import ServiceLevels from './ServiceLevels';
import QuestionsSection from './QuestionsSection';
import SnsInput from './SnsInput';
import GalleryEditor from './GalleryEditor'; // ✅ 追加

interface ProfileEditorProps {
  cast: CastProfile;
  featureMasters: FeatureMaster[];
  questionMasters: QuestionMaster[];
  onSave: (updated: CastProfile) => void;
}

export default function ProfileEditor({
  cast,
  featureMasters,
  questionMasters,
  onSave,
}: ProfileEditorProps) {
  const [form, setForm] = useState<CastProfile>({
    ...cast,
    personalityIds: cast.personalityIds ?? [],
    appearanceIds: cast.appearanceIds ?? [],
    services: cast.services ?? {},
    questions: cast.questions ?? {},
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'features' | 'questions' | 'sns' | 'gallery'>('basic');

  // ✅ cast が更新されたら form も更新
  useEffect(() => {
    setForm({
      ...cast,
      personalityIds: cast.personalityIds ?? [],
      appearanceIds: cast.appearanceIds ?? [],
      services: cast.services ?? {},
      questions: cast.questions ?? {},
    });
  }, [cast]);

  // ✅ 型安全な共通ハンドラ
  const handleChange: OnChangeHandler = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'basic', name: '基本情報' },
    { id: 'features', name: '特徴 / サービス' },
    { id: 'questions', name: '質問' },
    { id: 'sns', name: 'SNS' },
    { id: 'gallery', name: 'ギャラリー' },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 pb-24">
      <h2 className="text-xl font-bold mb-4">プロフィール編集</h2>

      {/* ✅ タブ切り替え */}
      <div className="flex space-x-4 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2 px-2 ${
              activeTab === tab.id
                ? 'border-b-2 border-pink-500 text-pink-600 font-semibold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* ✅ タブごとの表示 */}
      {activeTab === 'basic' && (
        <>
          <BasicInfoSection form={form} onChange={handleChange} />
          <MBTISelect form={form} onChange={handleChange} featureMasters={featureMasters} />
          <AnimalSelect form={form} onChange={handleChange} featureMasters={featureMasters} />
          <FaceSelector form={form} onChange={handleChange} featureMasters={featureMasters} />
        </>
      )}

      {activeTab === 'features' && (
        <>
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
          <ServiceLevels form={form} onChange={handleChange} />
        </>
      )}

      {activeTab === 'questions' && (
        <QuestionsSection form={form} onChange={handleChange} questionMasters={questionMasters} />
      )}

      {activeTab === 'sns' && <SnsInput form={form} onChange={handleChange} />}

      {activeTab === 'gallery' && <GalleryEditor castId={form.id} />}

      {/* 保存ボタン */}
      <div className="mt-6">
        <button
          onClick={() => onSave(form)}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-rose-600"
        >
          保存
        </button>
      </div>
    </div>
  );
}
