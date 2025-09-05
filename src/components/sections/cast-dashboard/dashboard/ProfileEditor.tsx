'use client';

import React, { useState } from 'react';
import { CastProfile, FeatureMaster } from '@/types/cast';

interface ProfileEditorProps {
  cast: CastProfile;
featureMasters?: FeatureMaster[];
  onSave: (updated: CastProfile) => void;
}

// 性格カテゴリ
const personalityOptions = [
  "ドS系", "ドM系", "文系", "理系", "インテリ系",
  "僧職系", "小悪魔系", "体育会系", "地味系", "クール系",
  "サブカル系", "オタク系", "アキバ系", "イヌ系", "ネコ系",
  "キツネ系", "ゴリラ系", "ウサギ系", "タバコ", "アイコス",
  "お酒好き", "辛いの好き", "スイーツ大好き系", "いっぱいたべーる系"
];

// 顔タイプ（単一選択）
const faceOptions = [
  "エレガントハード", "チャーミングソフト", "クールソフト", "フレッシュソフト",
  "チャーミングハード", "フレッシュハード", "エレガントソフト", "クールハード",
];

// MBTI（単一選択）
const mbtiOptions = [
  "ESFJ 領事", "ENTJ 指揮官", "ISFJ 擁護者", "INFP 仲介者",
  "ENFJ 主人公", "INTJ 建築家", "ESTJ 幹部", "INTP 論理学者",
  "INFJ 提唱者", "ISFP 冒険家", "ISTP 巨匠", "ISTJ 管理者",
  "ESTP 起業家", "ENTP 討論者", "ENFP 運動家", "ESFP エンターテイナー",
];

// 動物占い（単一選択）
const animalOptions = [
  "狼", "こじか", "猿", "チータ", "黒ひょう", "ライオン",
  "虎", "たぬき", "子守熊", "ゾウ", "ひつじ", "ペガサス",
];

// 特徴カテゴリ（複数選択可）
const featureOptions = [
  "巨根", "ぽっちゃり", "ヒゲ", "EXILE系", "韓国系",
  "塩顔", "ソース顔", "醤油顔", "メガネ", "スーツ",
  "低ボイス", "筋肉質", "美肌", "陰毛処理済み",
  "爬虫類系", "高身長", "ストリート系",
];

// 施術内容（4段階選択）
const serviceOptions = [
  "アイラインタッチなし", "ドMコース", "洗体コース", "デート", "お泊り", "添い寝",
  "3P(女性二人◯,セラピスト2人×)", "キス", "クンニ", "フェラ", "手コキ",
  "モノ鑑賞", "全身リップ", "乳首舐め", "アナル舐め", "指入れ", "Gスポット",
  "ポルチオ", "パウダー性感", "ソフトSM", "おもちゃプレイ",
  "指圧マッサージ", "オイルマッサージ"
];
const serviceLevels = ["NG", "要相談", "普通", "得意"];

// 質問一覧
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

export default function ProfileEditor({ cast, onSave }: ProfileEditorProps) {
  const [form, setForm] = useState<any>({
    ...cast,
    personality: cast.personality || [],
    appearance: cast.appearance || [],
    features: cast.features || [],
    services: cast.services || {},
    questions: cast.questions || {},
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = (key: string, value: string) => {
    const current: string[] = form[key] || [];
    handleChange(
      key,
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    );
  };

  const handleServiceChange = (service: string, level: string) => {
    setForm((prev: any) => ({
      ...prev,
      services: { ...prev.services, [service]: level },
    }));
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 space-y-6">
      <h2 className="text-xl font-bold">プロフィール編集（UIのみ）</h2>

      {/* 基本情報 */}
      <div>
        <label className="block text-sm font-medium">名前</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full mt-1 rounded border px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">年齢</label>
          <input
            type="number"
            value={form.age || ''}
            onChange={(e) => handleChange('age', Number(e.target.value))}
            className="w-full mt-1 rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">身長 (cm)</label>
          <input
            type="number"
            value={form.height || ''}
            onChange={(e) => handleChange('height', Number(e.target.value))}
            className="w-full mt-1 rounded border px-3 py-2"
          />
        </div>
      </div>

      {/* MBTI */}
      <div>
        <label className="block text-sm font-medium mb-1">MBTI</label>
        <select
          value={form.mbti || ''}
          onChange={(e) => handleChange('mbti', e.target.value)}
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

      {/* 動物占い */}
      <div>
        <label className="block text-sm font-medium mb-1">動物占い</label>
        <select
          value={form.animal || ''}
          onChange={(e) => handleChange('animal', e.target.value)}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">選択してください</option>
          {animalOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* 性格カテゴリ（複数選択） */}
      <div>
        <label className="block text-sm font-medium mb-2">性格カテゴリ</label>
        <div className="flex flex-wrap gap-2">
          {personalityOptions.map((opt) => {
            const isSelected = form.personality.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleArrayValue('personality', opt)}
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

      {/* 顔タイプ（単一選択） */}
      <div>
        <label className="block text-sm font-medium mb-2">顔タイプ</label>
        <div className="flex flex-wrap gap-2">
          {faceOptions.map((opt) => {
            const isSelected = form.face === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleChange('face', opt)}
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

      {/* 特徴カテゴリ（複数選択） */}
      <div>
        <label className="block text-sm font-medium mb-2">特徴カテゴリ</label>
        <div className="flex flex-wrap gap-2">
          {featureOptions.map((opt) => {
            const isSelected = form.features.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleArrayValue('features', opt)}
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

      {/* 施術内容（4段階選択） */}
      <div>
        <label className="block text-sm font-medium mb-2">施術内容（4段階）</label>
        <div className="space-y-3">
          {serviceOptions.map((service) => (
            <div key={service} className="flex items-center gap-3">
              <span className="w-48 text-sm">{service}</span>
              <div className="flex gap-2">
                {serviceLevels.map((level) => {
                  const isSelected = form.services?.[service] === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleServiceChange(service, level)}
                      className={`px-3 py-1 rounded-full border text-xs transition ${
                        isSelected
                          ? 'bg-purple-500 text-white border-purple-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 質問一覧 */}
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

      {/* SNS URL */}
      <div>
        <label className="block text-sm font-medium">SNS URL</label>
        <input
          type="text"
          value={form.snsUrl || ''}
          onChange={(e) => handleChange('snsUrl', e.target.value)}
          className="w-full mt-1 rounded border px-3 py-2"
          placeholder="https://..."
        />
      </div>

      {/* 保存ボタン */}
      <button
        onClick={() => onSave(form)}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-rose-600"
      >
        保存（仮）
      </button>
    </div>
  );
}
