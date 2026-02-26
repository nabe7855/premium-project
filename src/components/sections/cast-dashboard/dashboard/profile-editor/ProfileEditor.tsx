'use client';

import { CastProfile, FeatureMaster, QuestionMaster } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';
import { useEffect, useState } from 'react';

import AnimalSelect from './AnimalSelect';
import BasicInfoSection from './BasicInfoSection';
import FaceSelector from './FaceSelector';
import FeatureSelector from './FeatureSelector';
import GalleryEditor from './GalleryEditor'; // ✅ 追加
import MBTISelect from './MBTISelect';
import QuestionsSection from './QuestionsSection';
import ServiceLevels from './ServiceLevels';
import SnsInput from './SnsInput';

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

  const [activeTab, setActiveTab] = useState<'basic' | 'story' | 'sns' | 'gallery'>('basic');

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
    { id: 'story', name: 'ストーリー' },
    { id: 'sns', name: 'SNS' },
    { id: 'gallery', name: 'ギャラリー' },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 pb-24 shadow-md">
      <h2 className="mb-4 text-xl font-bold">プロフィール編集</h2>

      {/* ✅ タブ切り替え */}
      <div className="mb-6 flex space-x-4 overflow-x-auto whitespace-nowrap border-b scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-2 pb-2 transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-pink-500 font-semibold text-pink-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* ✅ タブごとの表示 */}
      {activeTab === 'basic' && (
        <div className="space-y-8">
          <BasicInfoSection form={form} onChange={handleChange} />
          <MBTISelect form={form} onChange={handleChange} featureMasters={featureMasters} />
          <AnimalSelect form={form} onChange={handleChange} featureMasters={featureMasters} />
          <FaceSelector form={form} onChange={handleChange} featureMasters={featureMasters} />

          <div className="border-t pt-8">
            <FeatureSelector
              form={form}
              onChange={handleChange}
              featureMasters={featureMasters}
              category="personality"
            />
          </div>

          <div className="border-t pt-8">
            <FeatureSelector
              form={form}
              onChange={handleChange}
              featureMasters={featureMasters}
              category="appearance"
            />
          </div>

          <div className="border-t pt-8">
            <h4 className="mb-4 text-sm font-bold text-gray-700">施術対応内容</h4>
            <ServiceLevels form={form} onChange={handleChange} />
          </div>

          <div className="border-t pt-8">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              自己紹介 (プロフィール)
            </label>
            <textarea
              value={form.profile ?? ''}
              onChange={(e) => handleChange('profile', e.target.value)}
              className="h-32 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-pink-500"
              placeholder="お客様への挨拶や自己紹介を入力してください..."
            />
          </div>
        </div>
      )}

      {activeTab === 'story' && (
        <div className="space-y-8">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              ストーリー (紹介文)
            </label>
            <textarea
              value={form.managerComment ?? ''}
              onChange={(e) => handleChange('managerComment', e.target.value)}
              className="h-48 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-pink-500"
              placeholder="あなたのストーリーや、より詳細な紹介文を入力してください..."
            />
            <p className="mt-2 text-xs text-gray-500">
              ※ キャスト詳細ページの「ストーリー」タブのトップに表示されます
            </p>
          </div>

          <div className="border-t pt-8">
            <h4 className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-700">
              <span>❓</span> 質問回答 (Q&A)
            </h4>
            <QuestionsSection
              form={form}
              onChange={handleChange}
              questionMasters={questionMasters}
            />
          </div>
        </div>
      )}

      {activeTab === 'sns' && <SnsInput form={form} onChange={handleChange} />}

      {activeTab === 'gallery' && <GalleryEditor castId={form.id} />}

      {/* 保存ボタン */}
      <div className="mt-6">
        <button
          onClick={() => onSave(form)}
          className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 py-2 text-white hover:from-pink-600 hover:to-rose-600"
        >
          保存
        </button>
      </div>
    </div>
  );
}
