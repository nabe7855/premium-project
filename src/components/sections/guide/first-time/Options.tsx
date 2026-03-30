import { OptionsConfig } from '@/lib/store/firstTimeConfig';
import React from 'react';

interface OptionsProps {
  config?: OptionsConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
}

export const Options: React.FC<OptionsProps> = ({ config, isEditing, onUpdate }) => {
  const data = config || {
    heading: 'サービス・オプション詳細',
    basicTitle: '基本サービス・無料オプション',
    basicItems: [],
    paidTitle: '有料オプション',
    paidItems: [],
    areasTitle: '出張費・ホテル代目安',
    areas: [],
    isVisible: true,
  };

  const handleUpdateField = (key: string, value: any) => {
    onUpdate?.('options', key, value);
  };

  const handleItemUpdate = (field: string, index: number, key: string, value: any) => {
    const items = [...(data[field as keyof OptionsConfig] as any[])];
    if (typeof items[index] === 'string') {
      items[index] = value;
    } else {
      items[index] = { ...items[index], [key]: value };
    }
    onUpdate?.('options', field, items);
  };

  const handleAddItem = (field: string, defaultValue: any) => {
    const items = [...(data[field as keyof OptionsConfig] as any[]), defaultValue];
    onUpdate?.('options', field, items);
  };

  const handleRemoveItem = (field: string, index: number) => {
    const items = [...(data[field as keyof OptionsConfig] as any[])].filter((_, i) => i !== index);
    onUpdate?.('options', field, items);
  };

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section className={`bg-gray-50 py-20 ${!data.isVisible ? 'opacity-50' : ''}`}>
      <div className="container mx-auto max-w-5xl px-4">
        <h2
          className={`mb-12 text-center text-3xl font-black text-slate-950 outline-none focus:ring-2 focus:ring-rose-200 ${
            isEditing ? 'cursor-text rounded bg-white/50 px-2 pt-1' : ''
          }`}
          contentEditable={isEditing}
          onBlur={(e) => handleUpdateField('heading', e.currentTarget.innerText)}
          suppressContentEditableWarning
        >
          {data.heading}
        </h2>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Basic/Free */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 border-b border-stone-100 pb-4 text-lg font-bold text-slate-900">
              <span className="h-6 w-2 rounded-full bg-[#FF4B5C]"></span>
              <span
                className={`outline-none focus:ring-2 focus:ring-rose-200 ${
                  isEditing ? 'cursor-text rounded bg-stone-50 px-1' : ''
                }`}
                contentEditable={isEditing}
                onBlur={(e) => handleUpdateField('basicTitle', e.currentTarget.innerText)}
                suppressContentEditableWarning
              >
                {data.basicTitle}
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-600">
              {(data.basicItems || []).map((item, idx) => (
                <div key={idx} className="group relative flex items-center">
                  <span>・</span>
                  <span
                    className={`flex-grow outline-none focus:ring-2 focus:ring-rose-200 ${
                      isEditing ? 'cursor-text rounded bg-stone-100 px-1' : ''
                    }`}
                    contentEditable={isEditing}
                    onBlur={(e) => handleItemUpdate('basicItems', idx, '', e.currentTarget.innerText)}
                    suppressContentEditableWarning
                  >
                    {item}
                  </span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveItem('basicItems', idx)}
                      className="ml-1 rounded-full bg-red-100 p-0.5 text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() => handleAddItem('basicItems', '新しい項目')}
                  className="rounded-md border border-dashed border-stone-200 py-1 text-center text-xs text-stone-400 hover:bg-stone-50"
                >
                  + 追加
                </button>
              )}
            </div>
          </div>

          {/* Paid Options */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 border-b border-stone-100 pb-4 text-lg font-bold text-slate-900">
              <span className="h-6 w-2 rounded-full bg-[#FF4B5C]"></span>
              <span
                className={`outline-none focus:ring-2 focus:ring-rose-200 ${
                  isEditing ? 'cursor-text rounded bg-stone-50 px-1' : ''
                }`}
                contentEditable={isEditing}
                onBlur={(e) => handleUpdateField('paidTitle', e.currentTarget.innerText)}
                suppressContentEditableWarning
              >
                {data.paidTitle}
              </span>
            </h3>
            <div className="space-y-6">
              {(data.paidItems || []).map((item, idx) => (
                <div
                  key={idx}
                  className={`group relative flex items-start justify-between gap-4 ${
                    item.isNegative ? 'rounded-xl border border-rose-100 bg-rose-50/50 p-4' : ''
                  }`}
                >
                  <div className="flex-grow">
                    <h4
                      className={`font-bold outline-none focus:ring-2 focus:ring-rose-200 ${
                        item.isNegative ? 'text-[#FF4B5C]' : 'text-slate-800'
                      } ${isEditing ? 'cursor-text rounded bg-white/50 px-1' : ''}`}
                      contentEditable={isEditing}
                      onBlur={(e) =>
                        handleItemUpdate('paidItems', idx, 'title', e.currentTarget.innerText)
                      }
                      suppressContentEditableWarning
                    >
                      {item.title}
                    </h4>
                    <p
                      className={`text-xs text-slate-500 outline-none focus:ring-2 focus:ring-rose-200 ${
                        isEditing ? 'cursor-text rounded bg-white/50 px-1' : ''
                      }`}
                      contentEditable={isEditing}
                      onBlur={(e) =>
                        handleItemUpdate('paidItems', idx, 'desc', e.currentTarget.innerText)
                      }
                      suppressContentEditableWarning
                    >
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`whitespace-nowrap font-black text-[#FF4B5C] outline-none focus:ring-2 focus:ring-rose-200 ${
                        isEditing ? 'cursor-text rounded bg-white/50 px-1' : ''
                      }`}
                      contentEditable={isEditing}
                      onBlur={(e) =>
                        handleItemUpdate('paidItems', idx, 'price', e.currentTarget.innerText)
                      }
                      suppressContentEditableWarning
                    >
                      {item.price}
                    </span>
                    {isEditing && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleItemUpdate('paidItems', idx, 'isNegative', !item.isNegative)}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            item.isNegative ? 'bg-[#FF4B5C] text-white' : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          強調
                        </button>
                        <button
                          onClick={() => handleRemoveItem('paidItems', idx)}
                          className="rounded bg-red-100 p-0.5 text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() =>
                    handleAddItem('paidItems', {
                      title: '新しいオプション',
                      desc: '説明文',
                      price: '+¥0',
                    })
                  }
                  className="flex w-full items-center justify-center rounded-md border border-dashed border-stone-200 py-2 text-xs text-stone-400 hover:bg-stone-50"
                >
                  + オプションを追加
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Areas */}
        <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-2 border-b border-stone-100 pb-4 text-lg font-bold text-slate-900">
            <span className="h-6 w-2 rounded-full bg-[#55A630]"></span>
            <span
              className={`outline-none focus:ring-2 focus:ring-rose-200 ${
                isEditing ? 'cursor-text rounded bg-stone-50 px-1' : ''
              }`}
              contentEditable={isEditing}
              onBlur={(e) => handleUpdateField('areasTitle', e.currentTarget.innerText)}
              suppressContentEditableWarning
            >
              {data.areasTitle}
            </span>
          </h3>
          <div className="grid gap-8 text-sm md:grid-cols-2">
            {(data.areas || []).map((area, idx) => (
              <div key={idx} className="group relative flex items-start justify-between gap-4 rounded-xl p-2 transition-colors hover:bg-stone-50/50">
                <div className="flex-grow">
                  <span
                    className={`mb-1 block font-bold text-slate-800 outline-none focus:ring-2 focus:ring-rose-200 ${
                      isEditing ? 'cursor-text rounded bg-stone-100 px-1' : ''
                    }`}
                    contentEditable={isEditing}
                    onBlur={(e) => handleItemUpdate('areas', idx, 'name', e.currentTarget.innerText)}
                    suppressContentEditableWarning
                  >
                    {area.name}
                  </span>
                  <span
                    className={`text-slate-600 outline-none focus:ring-2 focus:ring-rose-200 ${
                      isEditing ? 'cursor-text rounded bg-stone-100 px-1' : ''
                    }`}
                    contentEditable={isEditing}
                    onBlur={(e) => handleItemUpdate('areas', idx, 'price', e.currentTarget.innerText)}
                    suppressContentEditableWarning
                  >
                    {area.price}
                  </span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveItem('areas', idx)}
                    className="rounded-full bg-red-100 p-1 text-red-500 opacity-0 group-hover:opacity-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                onClick={() => handleAddItem('areas', { name: '新しい地域', price: '0円〜' })}
                className="flex items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 py-6 text-sm font-bold text-stone-400 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-500"
              >
                地域を追加する
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
