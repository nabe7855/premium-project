import React from 'react';

const featureOptions = [
  "巨根", "ぽっちゃり", "ヒゲ", "EXILE系", "韓国系",
  "塩顔", "ソース顔", "醤油顔", "メガネ", "スーツ",
  "低ボイス", "筋肉質", "美肌", "陰毛処理済み",
  "爬虫類系", "高身長", "ストリート系",
];

interface Props {
  form: any;
  onChange: (key: string, value: any) => void;
}

export default function FeatureSelector({ form, onChange }: Props) {
  const toggle = (value: string) => {
    const current: string[] = form.features || [];
    onChange(
      'features',
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">特徴カテゴリ</label>
      <div className="flex flex-wrap gap-2">
        {featureOptions.map((opt) => {
          const isSelected = form.features.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`px-3 py-1 rounded-full border text-sm transition ${
                isSelected
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
