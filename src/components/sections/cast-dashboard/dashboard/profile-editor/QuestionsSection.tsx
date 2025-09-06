import React from 'react';

const questionList = [
  "似ている芸能人は？", "得意プレイは？", "休日の過ごし方は？", "趣味・特技はありますか？",
  "チャレンジしたい事は？", "長所", "短所", "性格", "飲酒", "喫煙",
  "好きな言葉", "好きなブランド", "好きな音楽", "好きな本", "好きな映画",
  "好きな食べ物", "出勤スケジュール", "S・Mはどっちですか？", "自己PR",
  "この業界に入ったきっかけは？", "なぜストロベリーボーイズを選んだのですか？",
  "ストロベリーボーイズは働きやすいですか？", "新規のお客様に気を付けている事はありますか？",
  "本指名の方に気を付けている事はありますか？", "女性の何処にドキッとする？",
  "ストロベリーボーイズの店名を替えるなら何にしますか？", "ライバルはいますか？その理由は？",
  "斎藤店長をどう思いますか？", "カラオケの十八番は？", "あなたの前世は何ですか？",
  "1億円自由に使えるとしたら何をしますか？", "人生最後の日に何をしますか？",
];

interface Props {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function QuestionsSection({ form, setForm }: Props) {
  return (
    <div>
      <label className="block text-lg font-bold mb-2">質問一覧</label>
      <div className="space-y-4">
        {questionList.map((q) => (
          <div key={q}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{q}</label>
            <textarea
              value={form.questions[q] || ''}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  questions: { ...prev.questions, [q]: e.target.value },
                }))
              }
              className="w-full rounded border px-3 py-2"
              rows={2}
              placeholder={`${q} を入力してください`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
