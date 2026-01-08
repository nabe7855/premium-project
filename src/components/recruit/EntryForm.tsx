'use client';

import { AlertCircle, Camera, Image as ImageIcon, Users } from 'lucide-react';
import React from 'react';
import { StrawberryChan } from './Common';

const EntryForm: React.FC = () => {
  return (
    <section id="entry-form" className="bg-strawberry relative overflow-hidden px-4 py-24">
      <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/5"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/5"></div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-16 text-center text-white">
          <h2 className="mb-6 text-3xl font-black leading-tight md:text-5xl">
            あなたの勇気が、
            <br />
            人生の新しい扉を開く。
          </h2>
          <p className="mb-8 text-lg font-medium opacity-90 md:text-xl">
            まずはお話だけでも大丈夫です。秘密厳守で承ります。
          </p>
          <div className="text-strawberry mb-12 inline-block rounded-full bg-white px-8 py-4 text-xl font-black shadow-2xl transition-transform hover:scale-105">
            エントリーフォーム
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-2xl md:p-12">
          <form className="space-y-10">
            {/* Category: Personal */}
            <div>
              <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-2">
                <div className="bg-strawberry flex h-10 w-10 items-center justify-center rounded-full font-bold text-white">
                  1
                </div>
                <h3 className="text-xl font-black text-stone-900">Personal Information</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    氏名（フルネーム） <span className="text-strawberry">*</span>
                  </label>
                  <input
                    type="text"
                    className="focus:ring-strawberry w-full rounded-xl border border-stone-200 bg-stone-50 p-4 outline-none transition-all focus:ring-2"
                    placeholder="山田 太郎"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    メールアドレス <span className="text-strawberry">*</span>
                  </label>
                  <input
                    type="email"
                    className="focus:ring-strawberry w-full rounded-xl border border-stone-200 bg-stone-50 p-4 outline-none transition-all focus:ring-2"
                    placeholder="example@gmail.com"
                    required
                  />
                  <p className="text-[10px] text-stone-400">※Gmail/Yahoo推奨</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    携帯電話番号 <span className="text-strawberry">*</span>
                  </label>
                  <input
                    type="tel"
                    className="focus:ring-strawberry w-full rounded-xl border border-stone-200 bg-stone-50 p-4 outline-none transition-all focus:ring-2"
                    placeholder="09012345678"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    年齢 <span className="text-strawberry">*</span>
                  </label>
                  <input
                    type="number"
                    className="focus:ring-strawberry w-full rounded-xl border border-stone-200 bg-stone-50 p-4 outline-none transition-all focus:ring-2"
                    placeholder="25"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    身長 / 体重 <span className="text-strawberry">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="focus:ring-strawberry w-full rounded-xl border border-stone-200 bg-stone-50 p-4 outline-none focus:ring-2"
                      placeholder="175cm"
                      required
                    />
                    <span className="text-stone-300">/</span>
                    <input
                      type="text"
                      className="focus:ring-strawberry w-full rounded-xl border border-stone-200 bg-stone-50 p-4 outline-none focus:ring-2"
                      placeholder="65kg"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    既婚 / 未婚 / その他 <span className="text-strawberry">*</span>
                  </label>
                  <select
                    className="focus:ring-strawberry w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 p-4 outline-none focus:ring-2"
                    required
                  >
                    <option value="">選択してください</option>
                    <option value="未婚">未婚</option>
                    <option value="既婚">既婚</option>
                    <option value="その他">その他</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category: Lifestyle */}
            <div>
              <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-2">
                <div className="bg-strawberry flex h-10 w-10 items-center justify-center rounded-full font-bold text-white">
                  2
                </div>
                <h3 className="text-xl font-black text-stone-900">Lifestyle & Career</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    居住エリア <span className="text-strawberry">*</span>
                  </label>
                  <input
                    type="text"
                    className="focus:ring-strawberry w-full rounded-xl border border-stone-200 bg-stone-50 p-4 outline-none focus:ring-2"
                    placeholder="福岡市中央区"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    最寄駅 / 路線 <span className="text-strawberry">*</span>
                  </label>
                  <input
                    type="text"
                    className="focus:ring-strawberry w-full rounded-xl border border-stone-200 bg-stone-50 p-4 outline-none focus:ring-2"
                    placeholder="天神駅 / 地下鉄空港線"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    現職の業種
                  </label>
                  <input
                    type="text"
                    className="focus:ring-strawberry w-full rounded-xl border border-stone-200 bg-stone-50 p-4 outline-none focus:ring-2"
                    placeholder="IT・接客・学生など"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    稼働可能な曜日・時間帯 <span className="text-strawberry">*</span>
                  </label>
                  <textarea
                    className="focus:ring-strawberry h-24 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 p-4 outline-none focus:ring-2"
                    placeholder="例：土日の20:00〜24:00"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Category: Vision */}
            <div>
              <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-2">
                <div className="bg-strawberry flex h-10 w-10 items-center justify-center rounded-full font-bold text-white">
                  3
                </div>
                <h3 className="text-xl font-black text-stone-900">Qualifications & Vision</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    エントリーの動機と目標 <span className="text-strawberry">*</span>
                  </label>
                  <textarea
                    className="focus:ring-strawberry h-32 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 p-4 outline-none focus:ring-2"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Category: Verification */}
            <div>
              <div className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-2">
                <div className="bg-strawberry flex h-10 w-10 items-center justify-center rounded-full font-bold text-white">
                  4
                </div>
                <h3 className="text-xl font-black text-stone-900">Verification Materials</h3>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <ImageIcon size={18} className="text-strawberry mt-1 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Face Profile</h4>
                      <p className="text-[10px] leading-relaxed text-stone-500">
                        現在の表情が鮮明にわかるもの。
                      </p>
                    </div>
                  </div>
                  <label className="relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 transition-colors hover:bg-stone-50">
                    <Camera size={32} className="mb-2 text-stone-300" />
                    <span className="text-xs font-bold text-stone-400">Select Image</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Users size={18} className="text-strawberry mt-1 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Full Body</h4>
                      <p className="text-[10px] leading-relaxed text-stone-500">
                        全体の雰囲気が確認できるもの。
                      </p>
                    </div>
                  </div>
                  <label className="relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 transition-colors hover:bg-stone-50">
                    <ImageIcon size={32} className="mb-2 text-stone-300" />
                    <span className="text-xs font-bold text-stone-400">Select Image</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="space-y-4 rounded-2xl border border-stone-100 bg-stone-50 p-6">
              <div className="text-strawberry mb-2 flex items-center gap-2 font-black">
                <AlertCircle size={20} />
                <span>Notice to Candidates</span>
              </div>
              <ul className="list-disc space-y-3 pl-4 text-[11px] font-medium leading-relaxed text-stone-600 md:text-xs">
                <li>
                  キャリアメールは受信できない場合がございます。Gmail/Yahooメールをご利用ください。
                </li>
                <li>
                  エントリー内容は細部まで拝見いたします。空白が目立つ場合は審査対象外となる場合がございます。
                </li>
              </ul>
            </div>

            <div className="pt-8 text-center">
              <button
                type="submit"
                className="gold-gradient w-full rounded-full py-5 text-xl font-black text-stone-900 shadow-xl transition-all hover:scale-105 hover:shadow-2xl md:w-80"
              >
                同意してエントリーする
              </button>
              <p className="mt-4 text-[10px] text-stone-400">
                ※ご記入いただいた情報は採用選考の目的以外には使用いたしません。
              </p>
            </div>
          </form>
        </div>

        <div className="mt-16 text-center">
          <StrawberryChan
            text="あなたの勇気ある第一歩、福岡店のみんなで待ってるね！"
            className="mx-auto mb-12 max-w-sm"
          />
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            &copy; 2024 Luxury Therapist Network. All Rights Reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EntryForm;
