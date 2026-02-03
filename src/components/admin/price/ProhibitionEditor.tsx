'use client';

import { Plus, Trash2 } from 'lucide-react';

interface ProhibitionEditorProps {
  prohibitions: string[];
  onUpdate: (prohibitions: string[]) => void;
}

export default function ProhibitionEditor({ prohibitions, onUpdate }: ProhibitionEditorProps) {
  const addProhibition = () => {
    onUpdate([...prohibitions, '新しい禁止事項']);
  };

  const removeProhibition = (index: number) => {
    const newList = prohibitions.filter((_, i) => i !== index);
    onUpdate(newList);
  };

  const updateProhibition = (index: number, value: string) => {
    const newList = [...prohibitions];
    newList[index] = value;
    onUpdate(newList);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-rounded text-xl font-bold text-rose-900">禁止事項の管理</h3>
        <button
          onClick={addProhibition}
          className="flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition-all hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          項目を追加
        </button>
      </div>

      <div className="rounded-[2rem] border-2 border-rose-100 bg-white p-6 shadow-xl md:p-8">
        <div className="space-y-4">
          {prohibitions.length > 0 ? (
            prohibitions.map((item, index) => (
              <div key={index} className="group flex items-start gap-3">
                <div className="mt-4 h-2 w-2 shrink-0 rounded-full bg-rose-400" />
                <div className="flex-1">
                  <textarea
                    value={item}
                    onChange={(e) => updateProhibition(index, e.target.value)}
                    className="w-full rounded-xl border border-rose-100 bg-rose-50/30 p-3 text-sm font-medium text-rose-800 transition-colors focus:border-rose-300 focus:bg-white focus:outline-none"
                    rows={2}
                  />
                </div>
                <button
                  onClick={() => removeProhibition(index)}
                  className="mt-2 rounded-lg p-2 text-rose-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="italic text-rose-300">
                禁止事項が設定されていません。上のボタンから追加してください。
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 rounded-2xl bg-rose-50/50 p-6 text-xs leading-relaxed text-rose-500">
          <p className="mb-2 font-bold">💡 設定のヒント</p>
          <p>
            ここに記載した内容は、ユーザーページの「禁止事項」タブにリスト形式で表示されます。
            一般的でないルールや、店舗独自の制約がある場合に入力してください。
          </p>
        </div>
      </div>
    </div>
  );
}
