'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Heart, Palmtree, Search, Sparkles, Users, X, Zap } from 'lucide-react';
import React, { Fragment } from 'react';

interface ThemeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

const THEMES = [
  {
    id: 'popular',
    label: '人気設備',
    icon: <Sparkles size={20} className="text-rose-500" />,
    items: [
      '露天風呂付きラブホテル',
      'サウナ付きラブホテル',
      '岩盤浴付きラブホテル',
      'ジャグジー付きラブホテル',
      'プール付きラブホテル',
      'プロジェクター付きラブホテル',
      '大画面TV付きラブホテル',
      'カラオケ付きラブホテル',
      'ゲーム機があるラブホテル',
      'マッサージチェア付きラブホテル',
    ],
  },
  {
    id: 'concept',
    label: '部屋コンセプト',
    icon: <Palmtree size={20} className="text-emerald-500" />,
    items: [
      'SMルーム',
      '鏡張りルーム',
      'コスプレルーム',
      '和風ルーム',
      'お姫様ルーム',
      'ゴシックルーム',
      '昭和レトロホテル',
      'ラグジュアリールーム',
      'スイートルーム',
      'コンセプトルーム',
    ],
  },
  {
    id: 'situation',
    label: 'シチュエーション',
    icon: <Heart size={20} className="text-pink-500" />,
    items: [
      '記念日デートにおすすめ',
      '誕生日におすすめ',
      'サプライズ演出ができるホテル',
      '夜景が見えるホテル',
      '海が見えるホテル',
      '女子会できるホテル',
      '推し活できるホテル',
      'カップルに人気',
      '初デートにおすすめ',
      '長時間滞在できるホテル',
    ],
  },
  {
    id: 'usage',
    label: '利用スタイル',
    icon: <Users size={20} className="text-indigo-500" />,
    items: [
      '予約できるラブホテル',
      '一人利用OKホテル',
      'ビジネス利用できるホテル',
      '家族利用できるホテル',
      '同性利用OKホテル',
      '女子同士OKホテル',
      '駐車場付きホテル',
      'ワンガレージホテル',
      '駅近ラブホテル',
      '郊外ラブホテル',
    ],
  },
  {
    id: 'cost',
    label: '料金・コスパ',
    icon: <Zap size={20} className="text-amber-500" />,
    items: [
      '安いラブホテル',
      '休憩3000円以下',
      '宿泊5000円以下',
      'コスパ最強ホテル',
      'クーポンありホテル',
      '平日割引ホテル',
      'フリータイムが長いホテル',
      '深夜休憩できるホテル',
      '24時間休憩ホテル',
      '学割があるホテル',
    ],
  },
  {
    id: 'special',
    label: 'こだわり条件（特殊）',
    icon: <Palmtree size={20} className="text-yellow-500" />,
    items: [
      '360°部屋ビュー',
      '撮影できるホテル',
      '防音が強いホテル',
      'レンタル品が多いホテル',
      'アメニティ充実ホテル',
      '美容家電があるホテル',
      '高級ブランドアメニティホテル',
      '禁煙ルームホテル',
      'バリアフリーホテル',
      'ペットOKホテル',
    ],
  },
];

const ThemeSearchModal: React.FC<ThemeSearchModalProps> = ({
  isOpen,
  onClose,
  selectedTags,
  onToggleTag,
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[110]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-2xl transition-all md:p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                      <Search className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tighter text-slate-800">
                        テーマで探す
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400">THEME SEARCH</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="max-h-[65vh] space-y-10 overflow-y-auto pr-2 scrollbar-hide">
                  {THEMES.map((theme) => (
                    <div key={theme.id} className="space-y-4">
                      <div className="flex items-center gap-2 pl-1">
                        {theme.icon}
                        <h4 className="text-sm font-black text-slate-700">{theme.label}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {theme.items.map((item) => (
                          <button
                            key={item}
                            onClick={() => onToggleTag(item)}
                            className={`flex h-full items-center justify-center rounded-xl border px-3 py-3 text-center transition-all active:scale-95 ${
                              selectedTags.includes(item)
                                ? 'border-orange-400 bg-orange-50 font-black text-orange-600 shadow-sm'
                                : 'border-slate-100 bg-white font-bold text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-[10px] leading-tight sm:text-[11px]">{item}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-slate-50 pt-8">
                  <button
                    onClick={onClose}
                    className="flex w-full items-center justify-center rounded-2xl bg-orange-500 py-4 text-base font-black text-white shadow-xl shadow-orange-200/50 transition-all hover:brightness-105 active:scale-[0.98]"
                  >
                    この条件で設定する
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ThemeSearchModal;
