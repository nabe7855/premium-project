'use client';

import { PlusIcon, TrashIcon } from 'lucide-react';
import { FAQItem, ProfileField } from './types';

interface ProfileFaqEditorProps {
  profileFields: ProfileField[];
  faqs: FAQItem[];
  onChange: (data: { profileFields: ProfileField[]; faqs: FAQItem[] }) => void;
}

export default function ProfileFaqEditor({ profileFields, faqs, onChange }: ProfileFaqEditorProps) {
  
  const addProfileField = () => {
    onChange({
      profileFields: [...profileFields, { key: '項目名', value: '内容' }],
      faqs
    });
  };

  const removeProfileField = (index: number) => {
    onChange({
      profileFields: profileFields.filter((_, i) => i !== index),
      faqs
    });
  };

  const updateProfileField = (index: number, data: Partial<ProfileField>) => {
    const newFields = [...profileFields];
    newFields[index] = { ...newFields[index], ...data };
    onChange({ profileFields: newFields, faqs });
  };

  const addFaq = () => {
    onChange({
      profileFields,
      faqs: [...faqs, { question: '質問を入力', answer: '回答を入力' }]
    });
  };

  const removeFaq = (index: number) => {
    onChange({
      profileFields,
      faqs: faqs.filter((_, i) => i !== index)
    });
  };

  const updateFaq = (index: number, data: Partial<FAQItem>) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], ...data };
    onChange({ profileFields, faqs: newFaqs });
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Profile Specs */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          <h3 className="text-base font-bold text-gray-800">プロフィールスペック</h3>
          <button 
            type="button" 
            onClick={addProfileField}
            className="flex items-center gap-1 text-[11px] font-bold text-brand-accent hover:underline"
          >
            <PlusIcon size={14} />
            項目追加
          </button>
        </div>
        
        <div className="space-y-3">
          {profileFields.map((field, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={field.key}
                onChange={(e) => updateProfileField(index, { key: e.target.value })}
                className="w-1/3 rounded-md border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 focus:border-brand-accent focus:outline-none"
              />
              <input
                type="text"
                value={field.value}
                onChange={(e) => updateProfileField(index, { value: e.target.value })}
                className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-800 focus:border-brand-accent focus:outline-none"
              />
              <button 
                type="button"
                onClick={() => removeProfileField(index)}
                className="text-gray-300 hover:text-red-500"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          ))}
          {profileFields.length === 0 && (
            <p className="py-4 text-center text-xs text-gray-400">項目がありません</p>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          <h3 className="text-base font-bold text-gray-800">よくある質問</h3>
          <button 
            type="button" 
            onClick={addFaq}
            className="flex items-center gap-1 text-[11px] font-bold text-brand-accent hover:underline"
          >
            <PlusIcon size={14} />
            質問追加
          </button>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="relative rounded-lg bg-gray-50 p-3 pr-8">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateFaq(index, { question: e.target.value })}
                placeholder="Q: 質問"
                className="mb-2 w-full bg-transparent text-xs font-bold text-gray-800 focus:outline-none"
              />
              <textarea
                value={faq.answer}
                onChange={(e) => updateFaq(index, { answer: e.target.value })}
                placeholder="A: 回答"
                rows={2}
                className="w-full bg-transparent text-xs text-gray-600 focus:outline-none"
              />
              <button 
                type="button"
                onClick={() => removeFaq(index)}
                className="absolute right-2 top-2 text-gray-300 hover:text-red-500"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          ))}
          {faqs.length === 0 && (
            <p className="py-4 text-center text-xs text-gray-400">質問がありません</p>
          )}
        </div>
      </div>
    </div>
  );
}
