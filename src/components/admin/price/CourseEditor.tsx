'use client';

import { savePriceConfig } from '@/lib/actions/priceConfig';
import type { EditableCourse, EditableCoursePlan, EditablePriceConfig } from '@/types/priceConfig';
import { ChevronDown, ChevronUp, Plus, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface CourseEditorProps {
  storeSlug: string;
  initialConfig: EditablePriceConfig;
  onSaveComplete: () => void;
}

export default function CourseEditor({
  storeSlug,
  initialConfig,
  onSaveComplete,
}: CourseEditorProps) {
  const [config, setConfig] = useState<EditablePriceConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  // コース追加
  const addCourse = () => {
    const newCourse: EditableCourse = {
      course_key: `course-${Date.now()}`,
      name: '新しいコース',
      description: '',
      icon: '🍓',
      extension_per_30min: 6000,
      designation_fee_first: 1000,
      designation_fee_note: '',
      notes: '',
      display_order: config.courses.length,
      plans: [],
    };
    setConfig({ ...config, courses: [...config.courses, newCourse] });
  };

  // コース削除
  const deleteCourse = (index: number) => {
    if (!confirm('このコースを削除しますか？')) return;
    const newCourses = config.courses.filter((_, i) => i !== index);
    setConfig({ ...config, courses: newCourses });
  };

  // コース更新
  const updateCourse = (index: number, updates: Partial<EditableCourse>) => {
    const newCourses = [...config.courses];
    newCourses[index] = { ...newCourses[index], ...updates };
    setConfig({ ...config, courses: newCourses });
  };

  // プラン追加
  const addPlan = (courseIndex: number) => {
    const newPlan: EditableCoursePlan = {
      minutes: 60,
      price: 10000,
      sub_label: '',
      discount_info: '',
      display_order: config.courses[courseIndex].plans.length,
    };
    const newCourses = [...config.courses];
    newCourses[courseIndex].plans.push(newPlan);
    setConfig({ ...config, courses: newCourses });
  };

  // プラン削除
  const deletePlan = (courseIndex: number, planIndex: number) => {
    const newCourses = [...config.courses];
    newCourses[courseIndex].plans = newCourses[courseIndex].plans.filter((_, i) => i !== planIndex);
    setConfig({ ...config, courses: newCourses });
  };

  // プラン更新
  const updatePlan = (
    courseIndex: number,
    planIndex: number,
    updates: Partial<EditableCoursePlan>,
  ) => {
    const newCourses = [...config.courses];
    newCourses[courseIndex].plans[planIndex] = {
      ...newCourses[courseIndex].plans[planIndex],
      ...updates,
    };
    setConfig({ ...config, courses: newCourses });
  };

  // 保存
  const handleSave = async () => {
    setIsSaving(true);
    const result = await savePriceConfig(storeSlug, config);
    setIsSaving(false);

    if (result.success) {
      alert('保存しました！');
      onSaveComplete();
    } else {
      alert('保存に失敗しました: ' + result.error);
    }
  };

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-rose-900">コース編集</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-rose-600 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {isSaving ? '保存中...' : '保存'}
        </button>
      </div>

      {/* コース一覧 */}
      <div className="space-y-4">
        {config.courses.map((course, courseIndex) => (
          <CourseEditCard
            key={courseIndex}
            course={course}
            onUpdate={(updates) => updateCourse(courseIndex, updates)}
            onDelete={() => deleteCourse(courseIndex)}
            onAddPlan={() => addPlan(courseIndex)}
            onDeletePlan={(planIndex) => deletePlan(courseIndex, planIndex)}
            onUpdatePlan={(planIndex, updates) => updatePlan(courseIndex, planIndex, updates)}
          />
        ))}
      </div>

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

// コース編集カード
function CourseEditCard({
  course,
  onUpdate,
  onDelete,
  onAddPlan,
  onDeletePlan,
  onUpdatePlan,
}: {
  course: EditableCourse;
  onUpdate: (updates: Partial<EditableCourse>) => void;
  onDelete: () => void;
  onAddPlan: () => void;
  onDeletePlan: (planIndex: number) => void;
  onUpdatePlan: (planIndex: number, updates: Partial<EditableCoursePlan>) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-rose-100 bg-white shadow-lg">
      {/* ヘッダー */}
      <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50 p-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={course.icon}
            onChange={(e) => onUpdate({ icon: e.target.value })}
            className="w-16 rounded-lg border border-rose-200 bg-white p-2 text-center text-2xl"
            placeholder="🍓"
          />
          <input
            type="text"
            value={course.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="flex-1 rounded-lg border border-rose-200 bg-white p-2 font-bold text-rose-900"
            placeholder="コース名"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg bg-rose-100 p-2 text-rose-600 transition-colors hover:bg-rose-200"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 詳細 */}
      {isExpanded && (
        <div className="space-y-6 p-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-rose-700">説明</label>
              <textarea
                value={course.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                className="w-full rounded-lg border border-rose-200 p-3 text-sm"
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
                  value={course.extension_per_30min}
                  onChange={(e) => onUpdate({ extension_per_30min: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-rose-200 p-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-rose-700">本指名料</label>
                <input
                  type="number"
                  value={course.designation_fee_first}
                  onChange={(e) => onUpdate({ designation_fee_first: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-rose-200 p-2"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-rose-700">指名料備考</label>
              <input
                type="text"
                value={course.designation_fee_note}
                onChange={(e) => onUpdate({ designation_fee_note: e.target.value })}
                className="w-full rounded-lg border border-rose-200 p-2 text-sm"
                placeholder="全セラピスト一律。特にご希望がなければ無料となります♫"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-rose-700">注意事項</label>
              <textarea
                value={course.notes}
                onChange={(e) => onUpdate({ notes: e.target.value })}
                className="w-full rounded-lg border border-rose-200 p-3 text-sm"
                rows={3}
                placeholder="コースの注意事項"
              />
            </div>
          </div>

          {/* プラン一覧 */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-bold text-rose-900">プラン</h4>
              <button
                onClick={onAddPlan}
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
                    value={plan.minutes}
                    onChange={(e) => onUpdatePlan(planIndex, { minutes: parseInt(e.target.value) })}
                    className="w-20 rounded border border-rose-200 p-1 text-center text-sm"
                    placeholder="分"
                  />
                  <span className="text-sm text-rose-600">分</span>
                  <input
                    type="number"
                    value={plan.price}
                    onChange={(e) => onUpdatePlan(planIndex, { price: parseInt(e.target.value) })}
                    className="w-28 rounded border border-rose-200 p-1 text-sm"
                    placeholder="料金"
                  />
                  <span className="text-sm text-rose-600">円</span>
                  <input
                    type="text"
                    value={plan.discount_info || ''}
                    onChange={(e) => onUpdatePlan(planIndex, { discount_info: e.target.value })}
                    className="flex-1 rounded border border-rose-200 p-1 text-sm"
                    placeholder="割引情報（例: 初回2,000円OFF）"
                  />
                  <button
                    onClick={() => onDeletePlan(planIndex)}
                    className="rounded bg-red-100 p-1 text-red-600 transition-colors hover:bg-red-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
