'use client';

import { savePriceConfig } from '@/lib/actions/priceConfig';
import { uploadPriceImageClient } from '@/lib/store/uploadPriceImageClient';
import type { EditablePriceConfig } from '@/types/priceConfig';
import { Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { useState } from 'react';
import CampaignEditor from './CampaignEditor';
import CancellationPolicyEditor from './CancellationPolicyEditor';
import { DEFAULT_CANCELLATION_POLICY, DEFAULT_FAQS } from './defaultData';
import FAQEditor from './FAQEditor';
import OptionEditor from './OptionEditor';
import ProhibitionEditor from './ProhibitionEditor';
import TransportEditor from './TransportEditor';

interface PriceConfigEditorProps {
  storeSlug: string;
  initialConfig: EditablePriceConfig;
  onSaveComplete: () => void;
}

type TabType =
  | 'COURSES'
  | 'TRANSPORT'
  | 'OPTIONS'
  | 'CAMPAIGN'
  | 'PROHIBITIONS'
  | 'FAQ'
  | 'CANCELLATION';

export default function PriceConfigEditor({
  storeSlug,
  initialConfig,
  onSaveComplete,
}: PriceConfigEditorProps) {
  console.log('--- PriceConfigEditor Rendering ---');
  console.log('StoreSlug:', storeSlug);
  console.log('initialConfig courses count:', initialConfig.courses.length);

  const [config, setConfig] = useState<EditablePriceConfig>({
    ...initialConfig,
    faqs: initialConfig.faqs || DEFAULT_FAQS,
    cancellation_policy: initialConfig.cancellation_policy || DEFAULT_CANCELLATION_POLICY,
  });
  const [activeTab, setActiveTab] = useState<TabType>('COURSES');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  // ヒーロー画像アップロード
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    try {
      const publicUrl = await uploadPriceImageClient(storeSlug, 'hero', file);
      if (publicUrl) {
        setConfig({ ...config, hero_image_url: publicUrl });
      } else {
        alert('画像のアップロードに失敗しました');
      }
    } catch (error: any) {
      console.error('Hero Image Upload Error:', error);
      alert('エラーが発生しました: ' + JSON.stringify(error));
    } finally {
      setUploadingHero(false);
    }
  };

  // 保存
  const handleSave = async () => {
    setIsSaving(true);
    const result = await savePriceConfig(storeSlug, config);
    setIsSaving(false);

    if (result.success) {
      alert('すべての変更を保存しました！');
      onSaveComplete();
    } else {
      alert('保存に失敗しました: ' + result.error);
    }
  };

  // タブ定義
  const tabs: { id: TabType; label: string }[] = [
    { id: 'COURSES', label: 'コース' },
    { id: 'TRANSPORT', label: '送迎' },
    { id: 'OPTIONS', label: 'オプション' },
    { id: 'CAMPAIGN', label: 'キャンペーン' },
    { id: 'PROHIBITIONS', label: '禁止事項' },
    { id: 'FAQ', label: 'よくある質問' },
    { id: 'CANCELLATION', label: 'キャンセル' },
  ];

  return (
    <div className="space-y-6">
      {/* ヒーローヘッダー（保存ボタン・画像設定など） */}
      <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl">
        {/* 背景画像（ヒーロー画像） */}
        <div className="relative h-64 w-full bg-rose-50 md:h-80">
          {config.hero_image_url ? (
            <img
              src={config.hero_image_url}
              alt="ヒーロー画像"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-rose-300">
              <span className="text-4xl">🍓</span>
            </div>
          )}
          {/* オーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
        </div>

        {/* ヘッダーコンテンツ */}
        <div className="absolute left-0 right-0 top-0 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white/20 p-2 backdrop-blur-md">
                <button
                  onClick={() => document.getElementById('hero-upload')?.click()}
                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-rose-500 shadow-sm transition-all hover:bg-rose-50"
                  disabled={uploadingHero}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingHero ? '更新中...' : '画像変更'}
                </button>
                <input
                  id="hero-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  disabled={uploadingHero}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-xs font-bold text-white/80 md:block">
                ※変更内容は「保存」で反映
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-full bg-rose-500 px-8 py-3 font-bold text-white shadow-lg shadow-rose-500/30 transition-all hover:scale-105 hover:bg-rose-600 disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {isSaving ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-rounded text-3xl font-black tracking-wide text-white drop-shadow-md md:text-4xl">
              料金設定へ編集
            </h2>
            <p className="mt-2 text-sm font-bold text-white/90">
              コース、送迎エリア、オプション、キャンペーンの設定
            </p>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="flex overflow-x-auto rounded-full border border-rose-100 bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-rose-400 hover:bg-rose-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* コンテンツエリア */}
      <div className="duration-500 animate-in fade-in slide-in-from-bottom-4">
        {activeTab === 'COURSES' && (
          <div className="space-y-4">
            <CourseListLogic
              courses={config.courses}
              storeSlug={storeSlug}
              onUpdate={(courses) => setConfig({ ...config, courses })}
            />
          </div>
        )}

        {activeTab === 'TRANSPORT' && (
          <TransportEditor
            transportAreas={config.transport_areas}
            onUpdate={(areas) => setConfig({ ...config, transport_areas: areas })}
          />
        )}

        {activeTab === 'OPTIONS' && (
          <OptionEditor
            options={config.options}
            onUpdate={(options) => setConfig({ ...config, options: options })}
          />
        )}

        {activeTab === 'CAMPAIGN' && (
          <CampaignEditor
            campaigns={config.campaigns}
            storeSlug={storeSlug}
            onUpdate={(campaigns) => setConfig({ ...config, campaigns })}
          />
        )}

        {activeTab === 'PROHIBITIONS' && (
          <ProhibitionEditor
            prohibitions={config.prohibitions}
            onUpdate={(prohibitions) => setConfig({ ...config, prohibitions })}
          />
        )}

        {activeTab === 'FAQ' && (
          <FAQEditor faqs={config.faqs} onUpdate={(faqs) => setConfig({ ...config, faqs })} />
        )}

        {activeTab === 'CANCELLATION' && (
          <CancellationPolicyEditor
            policy={config.cancellation_policy}
            onUpdate={(cancellation_policy) => setConfig({ ...config, cancellation_policy })}
          />
        )}
      </div>
    </div>
  );
}

// Inline CourseListLogic to avoid file dependency issues
// This replicates the logic from CourseEditor but as a controlled component

function CourseListLogic({
  courses,
  storeSlug,
  onUpdate,
}: {
  courses: EditablePriceConfig['courses'];
  storeSlug: string;
  onUpdate: (courses: EditablePriceConfig['courses']) => void;
}) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // --- Utility functions (Moved to top to avoid hoisting issues) ---
  const updateCourse = (index: number, updates: Partial<EditablePriceConfig['courses'][0]>) => {
    const newCourses = [...courses];
    newCourses[index] = { ...newCourses[index], ...updates };
    onUpdate(newCourses);
  };

  const addCourse = () => {
    const newCourse: EditablePriceConfig['courses'][0] = {
      course_key: `course-${Date.now()}`,
      name: '新しいコース',
      description: '',
      icon: '🍓',
      extension_per_30min: 6000,
      designation_fee_first: 1000,
      designation_fee_note: '',
      notes: '',
      display_order: courses.length,
      plans: [],
    };
    onUpdate([...courses, newCourse]);
  };

  const deleteCourse = (index: number) => {
    if (!confirm('このコースを削除しますか？')) return;
    const newCourses = courses.filter((_, i) => i !== index);
    onUpdate(newCourses);
  };

  const addPlan = (courseIndex: number) => {
    const newCourses = [...courses];
    const newPlan = {
      minutes: 60,
      price: 10000,
      sub_label: '',
      discount_info: '',
      display_order: newCourses[courseIndex].plans.length,
    };
    newCourses[courseIndex].plans.push(newPlan);
    onUpdate(newCourses);
  };

  const deletePlan = (courseIndex: number, planIndex: number) => {
    const newCourses = [...courses];
    newCourses[courseIndex].plans = newCourses[courseIndex].plans.filter((_, i) => i !== planIndex);
    onUpdate(newCourses);
  };

  const updatePlan = (courseIndex: number, planIndex: number, updates: any) => {
    const newCourses = [...courses];
    newCourses[courseIndex].plans[planIndex] = {
      ...newCourses[courseIndex].plans[planIndex],
      ...updates,
    };
    onUpdate(newCourses);
  };

  // --- Handlers ---
  const handleIconUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const publicUrl = await uploadPriceImageClient(storeSlug, `icon-${index}`, file);
      console.log(`Client: Course Icon Upload Result for index ${index}:`, publicUrl);
      if (publicUrl) {
        updateCourse(index, { icon: publicUrl });
      } else {
        alert('アイコンのアップロードに失敗しました');
      }
    } catch (error: any) {
      console.error('Icon Upload Error:', error);
      alert('エラーが発生しました: ' + JSON.stringify(error));
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      {courses.map((course, courseIndex) => (
        <div
          key={courseIndex}
          className="overflow-hidden rounded-2xl border-2 border-rose-100 bg-white shadow-lg"
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50 p-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="group/icon relative">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-rose-200 bg-white text-2xl">
                  {course.icon &&
                  (course.icon.startsWith('http') || course.icon.startsWith('/')) ? (
                    <img src={course.icon} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span>{course.icon || '🍓'}</span>
                  )}
                  {uploadingIndex === courseIndex && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => document.getElementById(`icon-upload-${courseIndex}`)?.click()}
                  className="absolute -bottom-1 -right-1 rounded-full bg-rose-500 p-1.5 text-white shadow-md transition-colors hover:bg-rose-600"
                  disabled={uploadingIndex !== null}
                >
                  <Upload className="h-3.5 w-3.5" />
                </button>
                <input
                  id={`icon-upload-${courseIndex}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleIconUpload(courseIndex, e)}
                  className="hidden"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    Icon Emoji (Optional)
                  </label>
                  <input
                    type="text"
                    value={
                      course.icon && !course.icon.startsWith('http') && !course.icon.startsWith('/')
                        ? course.icon
                        : ''
                    }
                    onChange={(e) => updateCourse(courseIndex, { icon: e.target.value })}
                    className="w-10 rounded border border-rose-200 bg-white p-1 text-center text-xs"
                    placeholder="🍓"
                  />
                </div>
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(courseIndex, { name: e.target.value })}
                  className="w-full rounded-lg border border-rose-200 bg-white p-2 font-bold text-rose-900"
                  placeholder="コース名"
                />
              </div>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <button
                onClick={() => deleteCourse(courseIndex)}
                className="rounded-lg bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 詳細 (Always Open in this view for simplicity, or add state) */}
          <div className="space-y-6 p-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-rose-700">説明</label>
                <textarea
                  value={course.description || ''}
                  onChange={(e) => updateCourse(courseIndex, { description: e.target.value })}
                  className="w-full rounded-lg border border-rose-200 p-3 text-sm text-rose-900"
                  rows={2}
                  placeholder="コースの説明"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-bold text-rose-700">
                    延長料金（30分）
                  </label>
                  <input
                    type="number"
                    value={course.extension_per_30min ?? 0}
                    onChange={(e) =>
                      updateCourse(courseIndex, {
                        extension_per_30min: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-rose-200 p-2 text-rose-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-rose-700">本指名料</label>
                  <input
                    type="number"
                    value={course.designation_fee_first ?? 0}
                    onChange={(e) =>
                      updateCourse(courseIndex, {
                        designation_fee_first: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-rose-200 p-2 text-rose-900"
                  />
                </div>
              </div>
            </div>

            {/* プラン一覧 */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-bold text-rose-900">プラン</h4>
                <button
                  onClick={() => addPlan(courseIndex)}
                  className="flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-200"
                >
                  <Plus className="h-4 w-4" />
                  プラン追加
                </button>
              </div>
              <div className="space-y-2">
                {course.plans.map((plan, planIndex) => (
                  <div
                    key={planIndex}
                    className="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 p-3"
                  >
                    <input
                      type="number"
                      value={plan.minutes ?? 0}
                      onChange={(e) =>
                        updatePlan(courseIndex, planIndex, {
                          minutes: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20 rounded border border-rose-200 p-1 text-center text-sm text-rose-900"
                      placeholder="分"
                    />
                    <span className="text-sm text-rose-600">分</span>
                    <input
                      type="number"
                      value={plan.price ?? 0}
                      onChange={(e) =>
                        updatePlan(courseIndex, planIndex, { price: parseInt(e.target.value) || 0 })
                      }
                      className="w-28 rounded border border-rose-200 p-1 text-sm text-rose-900"
                      placeholder="料金"
                    />
                    <span className="text-sm text-rose-600">円</span>
                    <input
                      type="text"
                      value={plan.discount_info || ''}
                      onChange={(e) =>
                        updatePlan(courseIndex, planIndex, { discount_info: e.target.value })
                      }
                      className="flex-1 rounded border border-rose-200 p-1 text-sm text-rose-900"
                      placeholder="割引情報"
                    />
                    <button
                      onClick={() => deletePlan(courseIndex, planIndex)}
                      className="rounded bg-red-100 p-1 text-red-600 transition-colors hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* コース追加ボタン */}
      <button
        onClick={addCourse}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50 p-6 font-bold text-rose-500 transition-colors hover:border-rose-300 hover:bg-rose-100"
      >
        <Plus className="h-5 w-5" />
        コースを追加
      </button>
    </div>
  );
}
