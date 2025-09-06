import React from 'react';

const personalityOptions = [
  "ドS系", "ドM系", "文系", "理系", "インテリ系",
  "僧職系", "小悪魔系", "体育会系", "地味系", "クール系",
  "サブカル系", "オタク系", "アキバ系", "イヌ系", "ネコ系",
  "キツネ系", "ゴリラ系", "ウサギ系", "タバコ", "アイコス",
  "お酒好き", "辛いの好き", "スイーツ大好き系", "いっぱいたべーる系"
];

interface Props {
  form: any;
  onChange: (key: string, value: any) => void;
}

export default function PersonalitySelector({ form, onChange }: Props) {
  const toggle = (value: string) => {
    const current: string[] = form.personality || [];
    onChange(
      'personality',
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">性格カテゴリ</label>
      <div className="flex flex-wrap gap-2">
        {personalityOptions.map((opt) => {
          const isSelected = form.personality.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`px-3 py-1 rounded-full border text-sm transition ${
                isSelected
                  ? 'bg-pink-500 text-white border-pink-500'
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
