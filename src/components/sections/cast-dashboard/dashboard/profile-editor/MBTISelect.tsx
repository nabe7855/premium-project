import React from 'react';

const mbtiOptions = [
  "ESFJ 領事", "ENTJ 指揮官", "ISFJ 擁護者", "INFP 仲介者",
  "ENFJ 主人公", "INTJ 建築家", "ESTJ 幹部", "INTP 論理学者",
  "INFJ 提唱者", "ISFP 冒険家", "ISTP 巨匠", "ISTJ 管理者",
  "ESTP 起業家", "ENTP 討論者", "ENFP 運動家", "ESFP エンターテイナー",
];

interface Props {
  form: any;
  onChange: (key: string, value: any) => void;
}

export default function MBTISelect({ form, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">MBTI</label>
      <select
        value={form.mbti || ''}
        onChange={(e) => onChange('mbti', e.target.value)}
        className="w-full rounded border px-3 py-2"
      >
        <option value="">選択してください</option>
        {mbtiOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
