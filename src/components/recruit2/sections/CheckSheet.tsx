import React, { useState } from 'react';

interface CheckSheetProps {
  onOpenChat?: () => void;
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
  heading?: string;
  description?: string;
  okHeading?: string;
  ngHeading?: string;
  okItems?: string[];
  ngItems?: string[];
  resultPerfect?: string;
  resultGood?: string;
  resultTrial?: string;
  closingLine1?: string;
  closingLine2?: string;
  closingLine3?: string;
}

const DEFAULT_OK_ITEMS = [
  '連絡の返信は早い方だ',
  '新しいことを学ぶのが好き',
  '常に身だしなみや清潔感を大切にしている',
  '人のアドバイスを素直に聞ける',
  '約束や時間はきっちり守る',
  '周りから「話しやすい」と言われることが多い',
  'メンタルは比較的強い方だと思う',
  '相手の気持ちを察して行動できる',
  '経験はないが、やる気だけはある',
  '20歳〜40歳である',
];

const DEFAULT_NG_ITEMS = [
  '無断欠勤や当日キャンセルを繰り返してしまう',
  '連絡が取れなくなることがよくある',
  '清潔感に全く無頓着である',
  'プライドが高く、人の話を聞くのが苦手',
  '20歳未満である',
];

const CheckSheet: React.FC<CheckSheetProps> = ({
  onOpenChat,
  isEditing = false,
  onUpdate,
  heading = 'あなたの適性をチェック',
  description = '今の自分を振り返ってみましょう。完璧である必要はありません。',
  okHeading = 'あてはまる項目（OK項目）',
  ngHeading = 'あてはまる項目（NG項目）',
  okItems,
  ngItems,
  resultPerfect = '適性バッチリ！あなたは当店の即戦力候補です。ぜひお気軽にご応募ください！',
  resultGood = '合格ラインです！足りない部分は私たちが全力でサポートします。一緒に成長しましょう！',
  resultTrial = 'まずは約束を守ることや清潔感から始めてみませんか？改善できれば、いつでもお待ちしております。',
  closingLine1 = '「今の自分」が完璧である必要はありません。',
  closingLine2 = '誠実に自分と向き合い、約束を守れる方であれば、',
  closingLine3 = '私たちが全力で育て上げます。',
}) => {
  const displayOkItems = okItems ?? DEFAULT_OK_ITEMS;
  const displayNgItems = ngItems ?? DEFAULT_NG_ITEMS;

  const [checkedOk, setCheckedOk] = useState<boolean[]>(
    new Array(displayOkItems.length).fill(false),
  );
  const [checkedNg, setCheckedNg] = useState<boolean[]>(
    new Array(displayNgItems.length).fill(false),
  );

  const toggleOk = (idx: number) => {
    if (isEditing) return;
    const next = [...checkedOk];
    next[idx] = !next[idx];
    setCheckedOk(next);
  };

  const toggleNg = (idx: number) => {
    if (isEditing) return;
    const next = [...checkedNg];
    next[idx] = !next[idx];
    setCheckedNg(next);
  };

  const handleListItemUpdate = (isOk: boolean, idx: number, value: string) => {
    if (!onUpdate) return;
    const list = isOk ? displayOkItems : displayNgItems;
    const updated = list.map((item, i) => (i === idx ? value : item));
    onUpdate(isOk ? 'okItems' : 'ngItems', updated);
  };

  const okCount = checkedOk.filter(Boolean).length;
  const hasNg = checkedNg.some(Boolean);

  let resultMessage = '';
  let resultType: 'perfect' | 'good' | 'trial' | null = null;

  if (okCount >= 7 && !hasNg) {
    resultMessage = resultPerfect;
    resultType = 'perfect';
  } else if (okCount >= 4 && !hasNg) {
    resultMessage = resultGood;
    resultType = 'good';
  } else if (hasNg) {
    resultMessage = resultTrial;
    resultType = 'trial';
  }

  const editable = (value: string, onBlurKey: string, className: string, isMultiline = false) =>
    isEditing ? (
      <span
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.(onBlurKey, e.currentTarget.innerText)}
        className={`cursor-text outline-none hover:bg-black/5 ${className}`}
        style={{ whiteSpace: isMultiline ? 'pre-wrap' : 'normal' }}
      >
        {value}
      </span>
    ) : (
      <span className={className} style={{ whiteSpace: isMultiline ? 'pre-wrap' : 'normal' }}>
        {value}
      </span>
    );

  return (
    <section className="relative overflow-hidden bg-slate-100 py-24 sm:py-32">
      {/* Background Pattern - Graph Paper Style */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container relative z-10 mx-auto max-w-4xl px-4">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-slate-800 px-4 py-1.5 text-xs font-bold tracking-widest text-white">
            CHECK SHEET
          </span>
          <h2 className="mb-6 font-serif text-3xl font-bold text-slate-900 md:text-5xl">
            {isEditing ? (
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdate?.('heading', e.currentTarget.innerText)}
                className="cursor-text outline-none hover:bg-black/5"
              >
                {heading}
              </span>
            ) : (
              <>
                {heading.replace('適性', '')}
                <span className="relative">
                  適性
                  <svg
                    className="absolute -bottom-2 left-0 h-2 w-full text-rose-400"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 10"
                    fill="currentColor"
                  >
                    <path d="M0 5 Q 25 0, 50 5 T 100 5 L 100 8 Q 75 10, 50 8 T 0 8 Z" />
                  </svg>
                </span>
                をチェック
              </>
            )}
          </h2>
          {editable(
            description,
            'description',
            'mx-auto max-w-2xl text-base font-medium text-slate-600 md:text-lg',
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* OK Items Column */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <h3 className="mb-8 flex items-center gap-3 font-serif text-xl font-bold text-emerald-600">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 p-1">
                👍
              </span>
              {editable(okHeading, 'okHeading', '')}
            </h3>
            <div className="space-y-4">
              {displayOkItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleOk(i)}
                  className={`group flex w-full items-center gap-4 rounded-xl p-3 text-left transition-all ${isEditing ? 'cursor-default' : 'hover:bg-slate-50'}`}
                >
                  <div
                    className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 ${!isEditing && checkedOk[i] ? 'scale-110 border-emerald-500 bg-emerald-500' : 'border-slate-200'}`}
                  >
                    {!isEditing && checkedOk[i] && (
                      <span className="text-sm text-white duration-300 animate-in zoom-in">★</span>
                    )}
                  </div>
                  {isEditing ? (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleListItemUpdate(true, i, e.currentTarget.innerText)}
                      className="cursor-text text-sm font-bold leading-tight text-slate-900 outline-none hover:bg-black/5 sm:text-base"
                    >
                      {item}
                    </span>
                  ) : (
                    <span
                      className={`text-sm font-bold leading-tight sm:text-base ${checkedOk[i] ? 'text-slate-900' : 'text-slate-500'}`}
                    >
                      {item}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* NG Items Column */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <h3 className="mb-8 flex items-center gap-3 font-serif text-xl font-bold text-rose-600">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 p-1">
                ⚠️
              </span>
              {editable(ngHeading, 'ngHeading', '')}
            </h3>
            <div className="space-y-4">
              {displayNgItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleNg(i)}
                  className={`group flex w-full items-center gap-4 rounded-xl p-3 text-left transition-all ${isEditing ? 'cursor-default' : 'hover:bg-slate-50'}`}
                >
                  <div
                    className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 ${!isEditing && checkedNg[i] ? 'scale-110 border-rose-500 bg-rose-400' : 'border-slate-200'}`}
                  >
                    {!isEditing && checkedNg[i] && (
                      <span className="text-sm text-white duration-300 animate-in zoom-in">○</span>
                    )}
                  </div>
                  {isEditing ? (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleListItemUpdate(false, i, e.currentTarget.innerText)}
                      className="cursor-text text-sm font-bold leading-tight text-slate-900 outline-none hover:bg-black/5 sm:text-base"
                    >
                      {item}
                    </span>
                  ) : (
                    <span
                      className={`text-sm font-bold leading-tight sm:text-base ${checkedNg[i] ? 'text-slate-900' : 'text-slate-500'}`}
                    >
                      {item}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnostic Result */}
        {(isEditing || okCount > 0 || hasNg) && (
          <div className="mt-12 overflow-hidden rounded-[2.5rem] border-2 border-slate-200 bg-white shadow-2xl duration-700 animate-in fade-in slide-in-from-bottom-5">
            <div
              className={`p-8 text-center md:p-12 ${resultType === 'perfect' ? 'bg-emerald-50/50' : resultType === 'good' ? 'bg-amber-50/50' : resultType === 'trial' ? 'bg-rose-50/50' : 'bg-slate-50'}`}
            >
              <div className="mb-4 inline-block">
                <span
                  className={`rounded-xl px-4 py-1.5 text-sm font-black uppercase tracking-widest text-white shadow-sm ${resultType === 'perfect' ? 'bg-emerald-500' : resultType === 'good' ? 'bg-amber-500' : resultType === 'trial' ? 'bg-rose-500' : 'bg-slate-500'}`}
                >
                  RESULT
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-4 text-left">
                  <div className="rounded-lg bg-emerald-50 p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase text-emerald-600">
                      最高評価メッセージ
                    </p>
                    {editable(
                      resultPerfect,
                      'resultPerfect',
                      'font-serif text-lg font-bold text-slate-800',
                    )}
                  </div>
                  <div className="rounded-lg bg-amber-50 p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase text-amber-600">
                      良好メッセージ
                    </p>
                    {editable(
                      resultGood,
                      'resultGood',
                      'font-serif text-lg font-bold text-slate-800',
                    )}
                  </div>
                  <div className="rounded-lg bg-rose-50 p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase text-rose-600">
                      要改善メッセージ
                    </p>
                    {editable(
                      resultTrial,
                      'resultTrial',
                      'font-serif text-lg font-bold text-slate-800',
                    )}
                  </div>
                </div>
              ) : (
                <p className="mb-8 font-serif text-xl font-bold leading-relaxed text-slate-800 md:text-2xl">
                  {resultMessage || 'もう少しチェックしてみてください！'}
                </p>
              )}

              {resultType && !isEditing && (
                <div className="flex flex-col items-center gap-6">
                  <button
                    onClick={onOpenChat}
                    className="inline-flex items-center gap-3 rounded-full bg-[#06C755] px-8 py-4 text-xl font-bold text-white shadow-xl transition-all hover:bg-[#05b34c] hover:shadow-2xl active:scale-95 md:px-12 md:py-5"
                  >
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.5C6.5 2.5 2 6.6 2 11.7c0 2.9 1.4 5.5 3.8 7.1-.2.8-1.2 2.8-1.3 3 .1.1 2.9.2 4.9-1.4 1.1.3 2.3.5 3.6.5 5.5 0 10-4.1 10-9.2S17.5 2.5 12 2.5z" />
                    </svg>
                    <span>適性を確認して応募する（LINEで相談）</span>
                  </button>
                  <p className="text-sm font-bold text-slate-500">
                    「今の自分で大丈夫かな？と思ったら、まずはお話だけでもOKです」
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="relative mx-auto inline-block">
            <div className="absolute -left-4 -top-4 text-4xl opacity-20">❝</div>
            <div className="max-w-xl text-base font-bold leading-relaxed text-slate-700 md:text-lg">
              {editable(closingLine1, 'closingLine1', 'block')}
              {editable(closingLine2, 'closingLine2', 'block')}
              {editable(closingLine3, 'closingLine3', 'block')}
            </div>
            <div className="absolute -bottom-4 -right-4 text-4xl opacity-20">❞</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckSheet;
