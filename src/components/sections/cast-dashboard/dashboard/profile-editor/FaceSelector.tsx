import React, { useRef, useState } from 'react';
import { CastProfile, FeatureMaster } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';
import { Loader2, Sparkles, Camera, ArrowRight, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { FACE_TYPES } from '@/data/faceTypes';

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
  featureMasters?: FeatureMaster[];
}

// 質問データの定義
const DIAGNOSTIC_QUESTIONS = [
  // 軸1: 世代感 (A: スウィート/子供顔, B: ビター/大人顔)
  {
    text: 'Q1. 実年齢より…',
    options: { A: '若く見られることが多い', B: '大人っぽく見られることが多い' },
    axis: 'generation',
  },
  {
    text: 'Q2. 顔の縦の比率は…',
    options: { A: 'やや短め（幼いバランス）', B: '長め（大人っぽいバランス）' },
    axis: 'generation',
  },
  {
    text: 'Q3. 全体的なあなたの雰囲気は…',
    options: { A: '親しみやすくカジュアル', B: '落ち着いていてクール・セクシー' },
    axis: 'generation',
  },
  // 軸2: 形状 (A: まろやか/曲線, B: すっきり/直線)
  {
    text: 'Q4. 顔の輪郭の印象は？',
    options: { A: '丸みがある・卵型', B: '骨っぽさがある・シャープなベース型' },
    axis: 'shape',
  },
  {
    text: 'Q5. 目元の形は？',
    options: { A: '丸みがある・二重でパッチリ', B: '切れ長・一重や奥二重でスッキリ' },
    axis: 'shape',
  },
  {
    text: 'Q6. 鼻や唇の印象は？',
    options: { A: '小ぶりで丸みがある・ぽってり', B: '鼻筋が通っている・薄めの唇' },
    axis: 'shape',
  },
  // 軸3: 濃さ (A: ソフト/繊細, B: リッチ/はっきり)
  {
    text: 'Q7. 各パーツ（目や鼻など）の大きさは？',
    options: { A: '小さめ〜普通・すっきりしている', B: '大きくてはっきりしている' },
    axis: 'intensity',
  },
  {
    text: 'Q8. 眉毛や骨格の主張は？',
    options: { A: '薄め・細め・柔らかい', B: 'しっかり濃いめ・骨格がハッキリ' },
    axis: 'intensity',
  },
  {
    text: 'Q9. 第一印象でよく言われるのは？',
    options: { A: '「優しそう・儚げ」', B: '「目力がある・華やか」' },
    axis: 'intensity',
  },
];

type Answers = Record<number, 'A' | 'B'>;

export default function FaceSelector({ form, onChange, featureMasters }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<{
    faceType: string;
    reason: string;
    features?: string[];
  } | null>(null);

  // 診断アンケートのステート
  const [isDiagnosticMode, setIsDiagnosticMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const faceOptions = (featureMasters ?? []).filter((f) => f.category === 'face');

  if (faceOptions.length === 0) {
    return (
      <p className="rounded bg-red-50 p-2 text-sm text-red-500">
        顔タイプのマスターが未設定です。管理画面から追加してください。
      </p>
    );
  }

  const handleAnswer = (choice: 'A' | 'B') => {
    const newAnswers = { ...answers, [currentStep]: choice };
    setAnswers(newAnswers);

    if (currentStep < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Answers) => {
    let generationA = 0;
    let shapeA = 0;
    let intensityA = 0;

    DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
      const isA = finalAnswers[idx] === 'A';
      if (q.axis === 'generation' && isA) generationA++;
      if (q.axis === 'shape' && isA) shapeA++;
      if (q.axis === 'intensity' && isA) intensityA++;
    });

    const isSweet = generationA >= 2;
    const isMellow = shapeA >= 2;
    const isSoft = intensityA >= 2;

    let resultName = '';
    let reasonText = '';

    if (isSweet && isMellow && isSoft) {
      resultName = '章姫（あきひめ）';
      reasonText = '優しくてふんわりしたマイルドな愛され系です。塩顔寄りの可愛い顔立ち。';
    } else if (isSweet && isMellow && !isSoft) {
      resultName = 'とちおとめ';
      reasonText = '愛嬌120%の王道弟系！パーツがハッキリしていてエネルギッシュな魅力があります。';
    } else if (isSweet && !isMellow && isSoft) {
      resultName = 'パールホワイト';
      reasonText = '儚げな透明感抜群！スッキリ繊細でミステリアスな塩顔ボーイです。';
    } else if (isSweet && !isMellow && !isSoft) {
      resultName = 'さがほのか';
      reasonText = 'キリッと爽やか！男らしさとフレッシュな若々しさを兼ね備えたアクティブ系です。';
    } else if (!isSweet && isMellow && isSoft) {
      resultName = '淡雪（あわゆき）';
      reasonText = '上品でエレガント。色気がありつつもアンニュイで優雅な貴公子タイプです。';
    } else if (!isSweet && isMellow && !isSoft) {
      resultName = 'あまおう';
      reasonText = '華やかでセクシー！圧倒的な大人の色気とゴージャスさを放つ王様クラスです。';
    } else if (!isSweet && !isMellow && isSoft) {
      resultName = 'ゆめのか';
      reasonText = '知性的でスマート。シュッとした綺麗な顔立ちを持つ涼しげなイケメンです。';
    } else if (!isSweet && !isMellow && !isSoft) {
      resultName = 'スカイベリー';
      reasonText = 'シャープで洗練されたクールな大人。スタイリッシュで男らしい頼れるタイプです。';
    }

    setDiagnosisResult({
      faceType: resultName,
      reason: reasonText,
    });

    // Match with feature options
    const matchedOption = faceOptions.find((opt) => opt.name.includes(resultName));
    if (matchedOption) {
      onChange('faceId', matchedOption.id);
      toast.success(`診断完了！あなたは「${resultName}」タイプです`);
    } else {
      toast.warning(`診断結果（${resultName}）が見つかりませんでしたが、データは生成されました。`);
    }
    setIsDiagnosticMode(false);
  };

  const resetDiagnostic = () => {
    setIsDiagnosticMode(true);
    setCurrentStep(0);
    setAnswers({});
    setDiagnosisResult(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setDiagnosisResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/cast/analyze-face', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('AI診断に失敗しました');

      const data = await res.json();
      setDiagnosisResult(data);

      const matchedOption = faceOptions.find((opt) => opt.name.includes(data.faceType));
      if (matchedOption) {
        onChange('faceId', matchedOption.id);
        toast.success(`AIが「${data.faceType}」と判定しました！`);
      } else {
        toast.warning('顔タイプがマスタに見つかりませんでしたが、近しいものを自動選択してください。');
      }
    } catch (err) {
      console.error(err);
      toast.error('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const selectedFaceName = faceOptions.find((f) => f.id === form.faceId)?.name;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="block text-sm font-medium text-gray-700">顔タイプ</label>
        
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetDiagnostic}
            disabled={isAnalyzing}
            className="flex w-fit items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-bold text-pink-600 shadow-sm transition-all hover:bg-pink-100 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            質問に答えて診断する
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            {isAnalyzing ? '判定中...' : '顔写真でAI診断'}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          capture="user"
        />
      </div>

      {isDiagnosticMode && (
        <div className="rounded-2xl border border-pink-200 bg-white p-6 shadow-sm animate-in zoom-in-95">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-pink-500">
              顔タイプ診断（{currentStep + 1} / {DIAGNOSTIC_QUESTIONS.length}）
            </span>
            <button
              onClick={() => setIsDiagnosticMode(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              キャンセル
            </button>
          </div>
          
          <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div 
              className="h-full bg-pink-400 transition-all duration-300" 
              style={{ width: `${((currentStep) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }} 
            />
          </div>

          <p className="mb-6 text-center text-lg font-bold text-gray-800">
            {DIAGNOSTIC_QUESTIONS[currentStep].text}
          </p>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <button
              onClick={() => handleAnswer('A')}
              className="flex items-center justify-between rounded-xl border-2 border-pink-100 bg-pink-50/50 p-4 text-left font-medium text-gray-700 transition-all hover:border-pink-300 hover:bg-pink-100/50 active:scale-95"
            >
              <span>A. {DIAGNOSTIC_QUESTIONS[currentStep].options.A}</span>
              <ArrowRight className="h-4 w-4 text-pink-400" />
            </button>
            <button
              onClick={() => handleAnswer('B')}
              className="flex items-center justify-between rounded-xl border-2 border-indigo-100 bg-indigo-50/50 p-4 text-left font-medium text-gray-700 transition-all hover:border-indigo-300 hover:bg-indigo-100/50 active:scale-95"
            >
              <span>B. {DIAGNOSTIC_QUESTIONS[currentStep].options.B}</span>
              <ArrowRight className="h-4 w-4 text-indigo-400" />
            </button>
          </div>
        </div>
      )}

      {diagnosisResult && !isDiagnosticMode && (() => {
        const faceData = FACE_TYPES.find(f => diagnosisResult.faceType.includes(f.name) || f.name.includes(diagnosisResult.faceType));
        return (
          <div className="relative overflow-hidden rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50 to-white p-5 shadow-sm animate-in fade-in slide-in-from-top-2">
            <button 
              onClick={() => setDiagnosisResult(null)}
              className="absolute right-3 top-3 z-10 text-pink-300 hover:text-pink-500 bg-white/50 rounded-full p-1 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {faceData && (
                <div className="shrink-0 w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-pink-100">
                  <img src={faceData.imageUrl} alt={faceData.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
                <div className="mb-2 flex items-center justify-center sm:justify-start gap-2 text-base font-bold text-pink-600">
                  <Sparkles className="h-5 w-5 fill-pink-600 shrink-0" />
                  <span>あなたは「{diagnosisResult.faceType}」タイプ！</span>
                </div>
                {faceData && (
                  <p className="text-[13px] font-bold text-pink-500 mb-2">
                    {faceData.description.split('\n')[0]}
                  </p>
                )}
                <p className="text-xs leading-relaxed text-gray-600 bg-white/60 p-2 rounded-lg border border-pink-100/50">
                  {diagnosisResult.reason}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="flex flex-col gap-3 mt-4">
        <span className="text-xs font-bold text-gray-500 bg-gray-50 w-fit px-3 py-1 rounded-full border border-gray-100">
          手動で選択・変更する 👇
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {faceOptions.map((opt) => {
            const isSelected = form.faceId === opt.id;
            const faceData = FACE_TYPES.find(f => opt.name.includes(f.name) || f.name.includes(opt.name));
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange('faceId', opt.id)}
                className={`relative flex flex-col items-center rounded-xl border-2 p-2 sm:p-3 transition-all duration-300 overflow-hidden group ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50/80 shadow-md ring-2 ring-pink-500/10'
                    : 'border-transparent bg-gray-50 hover:border-pink-200 hover:bg-pink-50/50 hover:shadow-sm'
                }`}
              >
                {faceData && (
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 mb-2 rounded-full overflow-hidden border-2 transition-all duration-300 ${isSelected ? 'border-pink-500 scale-105' : 'border-white shadow-sm group-hover:scale-105 group-hover:border-pink-200'}`}>
                    <img src={faceData.imageUrl} alt={opt.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <span className={`text-[11px] sm:text-xs font-bold text-center leading-tight ${isSelected ? 'text-pink-600' : 'text-gray-600 group-hover:text-pink-500'}`}>
                  {opt.name}
                </span>
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm">
                    <span className="text-[10px] leading-none mb-[1px]">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <p className="text-[10px] text-gray-400">
        ※写真は公開されません。診断結果はマッチングの精度向上や最適な接客スタイルの提案に使用されます。
      </p>
    </div>
  );
}
