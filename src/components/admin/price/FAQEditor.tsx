'use client';

import { FAQ } from '@/types/priceConfig';
import { Plus, X } from 'lucide-react';

interface FAQEditorProps {
  faqs: FAQ[];
  onUpdate: (faqs: FAQ[]) => void;
}

export default function FAQEditor({ faqs, onUpdate }: FAQEditorProps) {
  const addFAQ = () => {
    onUpdate([...faqs, { question: '', answer: '' }]);
  };

  const removeFAQ = (index: number) => {
    const newList = faqs.filter((_, i) => i !== index);
    onUpdate(newList);
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const newList = [...faqs];
    newList[index] = { ...newList[index], [field]: value };
    onUpdate(newList);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-rounded text-lg font-bold text-rose-900">よくある質問</h3>
        <button
          onClick={addFAQ}
          className="flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          質問を追加
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <span className="text-sm font-bold text-rose-400">質問 {index + 1}</span>
              <button
                onClick={() => removeFAQ(index)}
                className="rounded-full p-1 text-rose-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-rose-700">質問</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                  className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
                  placeholder="質問を入力してください"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-rose-700">回答</label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border-2 border-rose-100 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none"
                  placeholder="回答を入力してください"
                />
              </div>
            </div>
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/30 p-8 text-center">
            <p className="text-sm text-rose-400">
              まだ質問が登録されていません。「質問を追加」ボタンから追加してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
