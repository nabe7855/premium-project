'use client';

import { CancellationPolicy } from '@/types/priceConfig';

interface CancellationPolicyEditorProps {
  policy: CancellationPolicy;
  onUpdate: (policy: CancellationPolicy) => void;
}

export default function CancellationPolicyEditor({
  policy,
  onUpdate,
}: CancellationPolicyEditorProps) {
  const updateTokyo23kuTitle = (title: string) => {
    onUpdate({
      ...policy,
      tokyo23ku: { ...policy.tokyo23ku, title },
    });
  };

  const updateTokyo23kuRule = (index: number, field: 'period' | 'fee', value: string) => {
    const newRules = [...policy.tokyo23ku.rules];
    newRules[index] = { ...newRules[index], [field]: value };
    onUpdate({
      ...policy,
      tokyo23ku: { ...policy.tokyo23ku, rules: newRules },
    });
  };

  const updateOutside23ku = (field: 'title' | 'description', value: string) => {
    onUpdate({
      ...policy,
      outside23ku: { ...policy.outside23ku, [field]: value },
    });
  };

  const updateReschedule = (reschedule: string) => {
    onUpdate({ ...policy, reschedule });
  };

  return (
    <div className="space-y-6">
      <h3 className="font-rounded text-lg font-bold text-rose-900">ご変更・キャンセルについて</h3>

      {/* 東京23区内 */}
      <div className="rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-rose-700">東京23区内のタイトル</label>
          <input
            type="text"
            value={policy.tokyo23ku.title}
            onChange={(e) => updateTokyo23kuTitle(e.target.value)}
            className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
            placeholder="例: 東京23区内の場合"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-rose-700">キャンセル料金規定</label>
          {policy.tokyo23ku.rules.map((rule, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={rule.period}
                  onChange={(e) => updateTokyo23kuRule(index, 'period', e.target.value)}
                  className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
                  placeholder="期間"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={rule.fee}
                  onChange={(e) => updateTokyo23kuRule(index, 'fee', e.target.value)}
                  className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
                  placeholder="料金"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 東京23区外 */}
      <div className="rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-rose-700">東京23区外のタイトル</label>
          <input
            type="text"
            value={policy.outside23ku.title}
            onChange={(e) => updateOutside23ku('title', e.target.value)}
            className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
            placeholder="例: 東京23区外の場合"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-rose-700">説明</label>
          <textarea
            value={policy.outside23ku.description}
            onChange={(e) => updateOutside23ku('description', e.target.value)}
            rows={3}
            className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
            placeholder="東京23区外の場合の説明を入力してください"
          />
        </div>
      </div>

      {/* 変更（延期）について */}
      <div className="rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-bold text-rose-700">変更（延期）について</label>
          <textarea
            value={policy.reschedule}
            onChange={(e) => updateReschedule(e.target.value)}
            rows={2}
            className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
            placeholder="変更（延期）に関する説明を入力してください"
          />
        </div>
      </div>
    </div>
  );
}
