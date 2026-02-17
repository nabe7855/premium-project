'use client';

import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Eye,
  Image as ImageIcon,
  ImagePlus,
  Layout,
  Loader2,
  PenLine,
  Save,
  Sparkles,
  Type,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface GeneratedPost {
  title: string;
  body: string;
  genre?: string;
}

type PostSiteType = 'kaikan' | 'kaikanwork' | 'kaikanwork_news';

interface PostGeneratorProps {
  initialData?: any;
  onCancel?: () => void;
}

export default function PostGenerator({ initialData, onCancel }: PostGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [siteType, setSiteType] = useState<PostSiteType>(() => {
    if (initialData) {
      if (initialData.target_site === 'kaikanwork') {
        return initialData.content_type === 'news' ? 'kaikanwork_news' : 'kaikanwork';
      }
      return 'kaikan';
    }
    return 'kaikan';
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // フォームフィールド
  const [genre, setGenre] = useState('なし');
  const [scheduledDate, setScheduledDate] = useState('');
  const [status, setStatus] = useState<'公開' | '下書き'>('公開');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualBody, setManualBody] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const genres = ['なし', 'お得情報', 'お店情報', 'セラピ情報'];

  // 編集モードの初期化
  useEffect(() => {
    if (initialData) {
      setGenre(initialData.genre || 'なし');

      // タイムゾーンを考慮して、UTC文字列をローカルの datetime-local 形式に変換
      if (initialData.scheduled_at) {
        const d = new Date(initialData.scheduled_at);
        // ローカル時間に変換して YYYY-MM-DDTHH:mm 形式にする
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        setScheduledDate(`${year}-${month}-${day}T${hours}:${minutes}`);
      } else {
        setScheduledDate('');
      }

      setImageUrl(initialData.images?.[0] || null);
      setGeneratedPost({
        title: initialData.title,
        body: initialData.body,
        genre: initialData.genre,
      });
      // 編集時は手動モードをデフォルトに
      setIsManualMode(true);
      setManualTitle(initialData.title);
      setManualBody(initialData.body);
    }
  }, [initialData]);

  // サイトタイプが変わったらジャンルをリセット
  useEffect(() => {
    if (!initialData && siteType !== 'kaikan') {
      setGenre('なし');
    }
  }, [siteType, initialData]);

  const handleGenerate = async () => {
    if (!topic) return;

    setIsGenerating(true);
    setGeneratedPost(null);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/ai/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, site_type: siteType }),
      });

      if (!response.ok) throw new Error('生成に失敗しました');

      const data = await response.json();
      setGeneratedPost(data);
      if (data.genre && siteType === 'kaikan') {
        setGenre(data.genre);
      }
    } catch (error: any) {
      console.error(error);
      alert('AI生成中にエラーが発生しました: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'auto-posts'); // 専用フォルダ

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('アップロードに失敗しました');
      const data = await response.json();
      setImageUrl(data.url);
    } catch (error: any) {
      console.error(error);
      alert('画像アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (isApproved: boolean) => {
    if (!generatedPost) return;

    setIsSaving(true);
    try {
      let target_site = 'kaikan';
      let content_type = 'news';

      if (siteType === 'kaikanwork') {
        target_site = 'kaikanwork';
        content_type = 'blog';
      } else if (siteType === 'kaikanwork_news') {
        target_site = 'kaikanwork';
        content_type = 'news';
      }

      const payload = {
        id: initialData?.id, // IDがあれば更新
        target_site,
        content_type,
        title: generatedPost.title,
        body: generatedPost.body,
        genre: siteType === 'kaikan' ? genre : null,
        scheduled_at:
          (siteType === 'kaikan' || siteType === 'kaikanwork_news') && scheduledDate
            ? new Date(scheduledDate).toISOString()
            : null,
        status: isApproved ? 'approved' : 'draft',
        images: imageUrl ? [imageUrl] : [],
      };

      const response = await fetch('/api/ai/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('保存に失敗しました');

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        if (onCancel) {
          onCancel(); // 編集完了後に一覧に戻る
        } else {
          setGeneratedPost(null);
          setTopic('');
          setImageUrl(null);
        }
      }, 3000);
    } catch (error: any) {
      console.error(error);
      alert('保存中にエラーが発生しました: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 duration-500 animate-in fade-in slide-in-from-bottom-4 lg:grid-cols-2 lg:gap-8">
      {/* 入力設定エリア */}
      <div className="space-y-4 md:space-y-6">
        <div className="space-y-4 rounded-xl border border-white/5 bg-brand-primary/40 p-4 md:space-y-6 md:rounded-2xl md:p-6">
          <div className="mb-1 flex items-center gap-2 font-medium text-white md:mb-2">
            <Layout className="h-4 w-4 text-brand-accent md:h-5 md:w-5" />
            <h3 className="text-sm md:text-base">投稿設定</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-brand-text-secondary md:text-xs">
                投稿先サイト・種別
              </label>
              <div className="flex flex-col gap-2 md:gap-3">
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <button
                    onClick={() => setSiteType('kaikan')}
                    className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-all md:rounded-xl md:px-4 md:py-3 md:text-sm ${
                      siteType === 'kaikan'
                        ? 'border-brand-accent bg-brand-accent/10 text-white shadow-[0_0_15px_rgba(var(--brand-accent-rgb),0.2)]'
                        : 'border-white/5 bg-brand-primary text-brand-text-secondary hover:border-white/20'
                    }`}
                  >
                    kaikan (お店ニュース)
                  </button>
                  <button
                    onClick={() => setSiteType('kaikanwork')}
                    className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-all md:rounded-xl md:px-4 md:py-3 md:text-sm ${
                      siteType === 'kaikanwork'
                        ? 'border-brand-accent bg-brand-accent/10 text-white shadow-[0_0_15px_rgba(var(--brand-accent-rgb),0.2)]'
                        : 'border-white/5 bg-brand-primary text-brand-text-secondary hover:border-white/20'
                    }`}
                  >
                    kaikanwork (店長ブログ)
                  </button>
                </div>
                <button
                  onClick={() => setSiteType('kaikanwork_news')}
                  className={`w-full rounded-lg border px-3 py-2.5 text-xs font-medium transition-all md:rounded-xl md:px-4 md:py-3 md:text-sm ${
                    siteType === 'kaikanwork_news'
                      ? 'border-brand-accent bg-brand-accent/10 text-white shadow-[0_0_15px_rgba(var(--brand-accent-rgb),0.2)]'
                      : 'border-white/5 bg-brand-primary text-brand-text-secondary hover:border-white/20'
                  }`}
                >
                  kaikanwork (求人ニュース)
                </button>
              </div>
            </div>

            {/* ジャンル選択 (kaikanのみ) */}
            {siteType === 'kaikan' && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
                  ジャンル
                </label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenre(g)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                        genre === g
                          ? 'border-brand-accent bg-brand-accent text-white'
                          : 'border-white/5 bg-brand-primary text-brand-text-secondary hover:border-white/20'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* モード切替タブ */}
            <div className="flex rounded-xl bg-brand-primary p-1">
              <button
                onClick={() => setIsManualMode(false)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                  !isManualMode
                    ? 'bg-brand-accent text-white shadow-lg'
                    : 'text-brand-text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                <Sparkles className={`h-3.5 w-3.5 ${!isManualMode ? 'animate-pulse' : ''}`} />
                AI生成
              </button>
              <button
                onClick={() => setIsManualMode(true)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                  isManualMode
                    ? 'bg-amber-500 text-white shadow-lg'
                    : 'text-brand-text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                <PenLine className="h-3.5 w-3.5" />
                手動入力
              </button>
            </div>

            {isManualMode ? (
              <div className="space-y-3 duration-300 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-secondary">
                    記事タイトル
                  </label>
                  <input
                    type="text"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="タイトルを入力してください..."
                    className="w-full rounded-xl border border-white/10 bg-brand-primary px-4 py-3 text-sm text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-secondary">
                    記事本文
                  </label>
                  <textarea
                    value={manualBody}
                    onChange={(e) => setManualBody(e.target.value)}
                    placeholder="本文を入力してください..."
                    className="h-32 w-full resize-none rounded-xl border border-white/10 bg-brand-primary px-4 py-3 text-sm text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 md:h-40"
                  />
                </div>
                <button
                  onClick={() => {
                    setGeneratedPost({ title: manualTitle, body: manualBody });
                    setSaveSuccess(false);
                  }}
                  disabled={!manualTitle || !manualBody}
                  className="w-full rounded-xl bg-amber-500/20 py-3 text-xs font-bold text-amber-500 transition-all hover:bg-amber-500/30 disabled:opacity-50"
                >
                  プレビューに反映
                </button>
              </div>
            ) : (
              <div className="space-y-3 duration-300 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-secondary">
                  生成テーマ / プロンプト
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={
                    siteType === 'kaikan'
                      ? '例：タイムサービス開始の告知。60分コースがお得なことを強調。'
                      : siteType === 'kaikanwork_news'
                        ? '例：【急募】週末入れるセラピストさん大募集！バック率アップ中。'
                        : '例：最近の店内の雰囲気や, スタッフの何気ない日常について。'
                  }
                  className="h-32 w-full resize-none rounded-xl border border-white/10 bg-brand-primary px-4 py-3 text-sm text-white transition-all focus:border-brand-accent/50 focus:outline-none focus:ring-1 focus:ring-brand-accent/50 md:h-40"
                />
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className={`flex w-full items-center justify-center gap-3 rounded-xl py-4 font-bold transition-all ${
                isGenerating || !topic
                  ? 'cursor-not-allowed bg-white/5 text-brand-text-secondary'
                  : 'bg-gradient-to-r from-brand-accent to-brand-accent/80 text-white hover:shadow-[0_0_20px_rgba(var(--brand-accent-rgb),0.4)]'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  AIが記事を作成中...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  AI記事を生成する
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* プレビューエリア */}
      <div className="space-y-4 md:space-y-6">
        <div className="relative flex h-full min-h-[400px] flex-col rounded-xl border border-white/5 bg-brand-primary/40 p-4 md:min-h-[500px] md:rounded-2xl md:p-6">
          <div className="mb-4 flex items-center justify-between md:mb-6">
            <div className="flex items-center gap-2 font-medium text-white">
              <Eye className="h-4 w-4 text-brand-accent md:h-5 md:w-5" />
              <h3 className="text-sm md:text-base">プレビュー・修正</h3>
            </div>
            {generatedPost && (
              <div className="flex gap-2">
                <span className="animate-pulse rounded bg-brand-accent/20 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-brand-accent md:text-[10px]">
                  AI Generated
                </span>
              </div>
            )}
          </div>

          {/* 保存成功メッセージ */}
          {saveSuccess && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-brand-primary/95 duration-300 animate-in fade-in md:rounded-2xl">
              <div className="space-y-3 text-center md:space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-12 w-12 animate-bounce text-green-500 md:h-16 md:w-16" />
                </div>
                <h4 className="text-lg font-bold text-white md:text-xl">保存完了！</h4>
                <p className="text-xs text-brand-text-secondary md:text-sm">
                  予約リストに追加されました。
                </p>
              </div>
            </div>
          )}

          {!generatedPost && !isGenerating && (
            <div className="flex flex-1 flex-col items-center justify-center space-y-3 italic text-brand-text-secondary opacity-50 md:space-y-4">
              <Sparkles className="h-10 w-10 stroke-[1] md:h-12 md:w-12" />
              <p className="px-6 text-center text-xs md:px-10 md:text-sm">
                左側の設定を入力して生成ボタンを押すと、
                <br />
                具体的な投稿内容をプレビューできます。
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="flex-1 space-y-4 md:space-y-6">
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded bg-white/5 md:h-4 md:w-20" />
                <div className="h-8 w-full animate-pulse rounded-lg bg-white/5 md:h-10" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded bg-white/5 md:h-4 md:w-20" />
                <div className="h-48 w-full animate-pulse rounded-xl bg-white/5 md:h-64" />
              </div>
            </div>
          )}

          {generatedPost && !isGenerating && (
            <div className="flex flex-1 flex-col space-y-4 duration-300 animate-in fade-in zoom-in-95 md:space-y-6">
              {/* タイトル入力 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-brand-text-secondary md:gap-2 md:text-[10px]">
                    <Type className="h-3 w-3 text-brand-accent" /> タイトル
                  </label>
                  {(siteType === 'kaikan' || siteType === 'kaikanwork_news') && (
                    <span
                      className={`text-[9px] font-bold md:text-[10px] ${generatedPost.title.length > 60 ? 'text-red-500' : 'text-brand-text-secondary'}`}
                    >
                      {generatedPost.title.length} / 60文字
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={generatedPost.title}
                  onChange={(e) => setGeneratedPost({ ...generatedPost, title: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-bold text-white transition-all focus:border-brand-accent/50 focus:outline-none md:px-4 md:py-3 md:text-sm"
                />
              </div>

              {/* 画像アップロード */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-brand-text-secondary md:gap-2 md:text-[10px]">
                  <ImageIcon className="h-3 w-3 text-brand-accent" /> 投稿画像
                </label>
                <div className="group/img relative aspect-video overflow-hidden rounded-xl border-2 border-dashed border-white/10 bg-white/5">
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        onClick={() => setImageUrl(null)}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover/img:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brand-text-secondary transition-colors hover:text-white"
                    >
                      {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin md:h-8 md:w-8" />
                      ) : (
                        <>
                          <ImagePlus className="h-6 w-6 stroke-[1] md:h-8 md:w-8" />
                          <span className="text-[10px] md:text-xs">
                            クリックして画像をアップロード
                          </span>
                          <span className="text-[9px] opacity-50 md:text-[10px]">
                            推奨: {siteType === 'kaikanwork_news' ? '700x300' : '500x500'}
                          </span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>

              {/* 本文入力 */}
              <div className="flex flex-1 flex-col space-y-2">
                <label className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-brand-text-secondary md:gap-2 md:text-[10px]">
                  <Layout className="h-3 w-3 text-brand-accent" />{' '}
                  {siteType === 'kaikanwork_news' ? '求人ニュース内容' : '本文内容'}
                </label>
                <textarea
                  value={generatedPost.body}
                  onChange={(e) => setGeneratedPost({ ...generatedPost, body: e.target.value })}
                  className="min-h-[100px] w-full flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs leading-relaxed text-white transition-all focus:border-brand-accent/50 focus:outline-none md:min-h-[120px] md:px-4 md:py-3 md:text-sm"
                />
              </div>

              {/* 予約設定 または ステータス */}
              <div className="grid grid-cols-1 gap-4 border-t border-white/5 pt-4 md:grid-cols-2">
                {siteType === 'kaikan' || siteType === 'kaikanwork_news' ? (
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-brand-text-secondary md:gap-2 md:text-[10px]">
                      <CalendarIcon className="h-3 w-3 text-brand-accent" /> 予約日時
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-2 font-mono text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-brand-accent/50 md:px-3 md:text-xs"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-brand-text-secondary md:gap-2 md:text-[10px]">
                      <Clock className="h-3 w-3 text-brand-accent" /> 公開ステータス
                    </label>
                    <div className="flex gap-2">
                      {['公開', '下書き'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(s as any)}
                          className={`flex-1 rounded-lg border py-1.5 text-[9px] font-bold transition-all md:text-[10px] ${
                            status === s
                              ? 'border-brand-accent bg-brand-accent text-white'
                              : 'border-white/5 bg-brand-primary text-brand-text-secondary hover:border-white/20'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <button
                    onClick={() => {
                      if (onCancel) {
                        onCancel();
                      } else {
                        handleSave(false);
                      }
                    }}
                    disabled={isSaving}
                    className="flex-1 rounded-lg border border-white/10 bg-brand-primary py-3 text-[10px] font-bold text-white transition-all hover:border-white/30 disabled:opacity-50 md:rounded-xl md:text-xs"
                  >
                    {onCancel ? 'キャンセル' : '下書き'}
                  </button>
                  {!onCancel && (
                    <button
                      onClick={() => handleSave(false)}
                      disabled={isSaving}
                      className="hidden rounded-lg border border-white/10 bg-brand-primary py-3 text-[10px] font-bold text-white transition-all hover:border-white/30 disabled:opacity-50 md:block md:rounded-xl md:text-xs"
                    >
                      下書き保存
                    </button>
                  )}
                  <button
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                    className="flex flex-[2] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-accent to-brand-accent/80 py-3 text-[10px] font-bold text-white transition-all hover:shadow-lg hover:shadow-brand-accent/20 disabled:opacity-50 md:rounded-xl md:text-xs"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {initialData ? '変更を保存' : '承認して予約'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
