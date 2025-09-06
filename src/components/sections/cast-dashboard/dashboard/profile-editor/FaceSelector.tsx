import React from 'react';

const faceOptions = [
  "エレガントハード", "チャーミングソフト", "クールソフト", "フレッシュソフト",
  "チャーミングハード", "フレッシュハード", "エレガントソフト", "クールハード",
];

interface Props {
  form: any;
  onChange: (key: string, value: any) => void;
}

export default function FaceSelector({ form, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">顔タイプ</label>
      <div className="flex flex-wrap gap-2">
        {faceOptions.map((opt) => {
          const isSelected = form.face === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange('face', opt)}
              className={`px-3 py-1 rounded-full border text-sm transition ${
                isSelected
                  ? 'bg-blue-500 text-white border-blue-500'
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
