import React, { useRef, useState } from 'react';
import { CastProfile, FeatureMaster } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';
import { Loader2, Sparkles, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
  featureMasters?: FeatureMaster[];
}

export default function FaceSelector({ form, onChange, featureMasters }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<{
    faceType: string;
    reason: string;
    features: string[];
  } | null>(null);

  const options = (featureMasters ?? []).filter((f) => f.category === 'face');

  if (options.length === 0) {
    return (
      <p className="rounded bg-red-50 p-2 text-sm text-red-500">
        顔タイプのマスターが未設定です。管理画面から追加してください。
      </p>
    );
  }

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

      // 自動で選択肢に反映
      const matchedOption = options.find((opt) => opt.name === data.faceType);
      if (matchedOption) {
        onChange('faceId', matchedOption.id);
        toast.success(`AIが「${data.faceType}」と判定しました！`);
      } else {
        toast.warning('AIは判定しましたが、マスターデータに一致する項目が見つかりませんでした。');
      }
    } catch (err) {
      console.error(err);
      toast.error('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsAnalyzing(false);
      // reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="block text-sm font-medium text-gray-700">顔タイプ</label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isAnalyzing ? '判定中...' : 'AIで顔タイプを診断'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          capture="user" // スマホカメラ優先
        />
      </div>

      {diagnosisResult && (
        <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4 animate-in fade-in slide-in-from-top-2">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-purple-700">
            <Sparkles className="h-4 w-4" />
            AI診断結果: {diagnosisResult.faceType}
          </div>
          <p className="mb-2 text-xs leading-relaxed text-purple-600">
            {diagnosisResult.reason}
          </p>
          <div className="flex flex-wrap gap-1">
            {diagnosisResult.features.map((f, i) => (
              <span key={i} className="rounded-md bg-white px-2 py-0.5 text-[10px] text-purple-500">
                #{f}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = form.faceId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange('faceId', opt.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                isSelected
                  ? 'border-pink-500 bg-pink-500 text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {opt.name}
            </button>
          );
        })}
      </div>
      
      <p className="text-[10px] text-gray-400">
        ※写真は公開されません。診断結果はマッチングの精度向上に使用されます。
      </p>
    </div>
  );
}
