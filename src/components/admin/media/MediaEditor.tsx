'use client';

import {
  createMediaArticle,
  getAllTags,
  MediaArticleData,
  updateMediaArticle,
} from '@/lib/actions/media';
import { uploadMediaImage } from '@/lib/uploadMediaImage';
import {
  ChevronLeftIcon,
  ImageIcon,
  SaveIcon,
  Tag as TagIcon,
  UploadIcon,
  XCircleIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface MediaEditorProps {
  initialData?: any;
  articleId?: string;
}

export default function MediaEditor({ initialData, articleId }: MediaEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [formData, setFormData] = useState<MediaArticleData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    thumbnail_url: initialData?.thumbnail_url || '',
    target_audience: initialData?.target_audience || 'user',
    status: initialData?.status || 'draft',
    category: initialData?.category || 'amolab',
    seo_title: initialData?.seo_title || '',
    seo_description: initialData?.seo_description || '',
    author_name: initialData?.author_name || 'アモラボ編集部',
  });
  const [tagsInput, setTagsInput] = useState<string>(
    initialData?.tags?.map((t: any) => t.tag.name).join(', ') || '',
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.thumbnail_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isContentUploading, setIsContentUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchTags = async () => {
      const result = await getAllTags();
      if (result.success) {
        setAvailableTags(result.tags || []);
      }
    };
    fetchTags();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (tagName: string) => {
    const currentTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');
    if (!currentTags.includes(tagName)) {
      setTagsInput(currentTags.length > 0 ? `${tagsInput}, ${tagName}` : tagName);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(formData.thumbnail_url || null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const url = await uploadMediaImage(selectedFile);
      if (url) {
        setFormData((prev) => ({ ...prev, thumbnail_url: url }));
        setSelectedFile(null);
        alert('画像をアップロードしました。');
      } else {
        alert('画像のアップロードに失敗しました。');
      }
    } catch (error) {
      console.error(error);
      alert('アップロード中にエラーが発生しました。');
    } finally {
      setIsUploading(false);
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsContentUploading(true);
    try {
      const url = await uploadMediaImage(file);
      if (url) {
        // 現在のカーソル位置に画像を挿入
        const markdownImage = `\n![イメージ](${url})\n`;
        const textarea = textareaRef.current;

        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = formData.content;
          const newContent = text.substring(0, start) + markdownImage + text.substring(end);

          setFormData((prev) => ({ ...prev, content: newContent }));

          // カーソル位置を更新（少し遅延させてフォーカス）
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + markdownImage.length, start + markdownImage.length);
          }, 10);
        } else {
          // テキストエリアの参照がない場合は末尾に追加
          setFormData((prev) => ({ ...prev, content: prev.content + markdownImage }));
        }
      } else {
        alert('画像のアップロードに失敗しました。');
      }
    } catch (error) {
      console.error(error);
      alert('アップロード中にエラーが発生しました。');
    } finally {
      setIsContentUploading(false);
      if (contentImageInputRef.current) contentImageInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      alert('タイトル、URLスラグ、本文は必須です。');
      return;
    }

    setIsSaving(true);
    const tagsArray = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      let result;
      if (articleId) {
        result = await updateMediaArticle(articleId, formData, tagsArray);
      } else {
        result = await createMediaArticle(formData, tagsArray);
      }

      if (result.success) {
        alert('記事を保存しました！');
        router.refresh();
        router.push('/admin/media-management');
      } else {
        alert('保存エラー: ' + result.error);
      }
    } catch (error: any) {
      alert('システムエラーが発生しました: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/media-management"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow hover:text-gray-700"
          >
            <ChevronLeftIcon size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {articleId ? '記事を編集' : '新規記事作成'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-brand-accent px-6 py-2.5 font-bold text-white shadow-md transition-colors hover:bg-pink-600 disabled:opacity-50"
        >
          <SaveIcon size={18} />
          {isSaving ? '保存中...' : '保存する'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-6 md:col-span-2">
          {/* Title */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-bold text-gray-700">記事タイトル *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="初心者必見！女性用風俗の選び方..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* Editor Placeholder */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-bold text-gray-700">本文 (Markdown形式) *</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={contentImageInputRef}
                  onChange={handleContentImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => contentImageInputRef.current?.click()}
                  disabled={isContentUploading}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-600 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50"
                >
                  <UploadIcon size={14} className={isContentUploading ? 'animate-bounce' : ''} />
                  {isContentUploading ? 'アップロード中...' : '画像を本文に挿入'}
                </button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={20}
              placeholder="# 大見出し&#10;ここに本文を入力してください..."
              className="w-full rounded-lg border border-gray-300 p-4 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <p className="mt-2 text-xs text-brand-text-secondary">
              ※後日リッチテキストエディタ(画像をドラッグ＆ドロップできる画面)にアップグレード予定です。
            </p>
          </div>

          {/* Excerpt */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              抜粋・まとめ文 (任意)
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt || ''}
              onChange={handleChange}
              rows={3}
              placeholder="記事の一覧に表示される短い説明文を記述します。"
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          {/* Settings */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 border-b pb-2 text-base font-bold text-gray-800">公開設定</h3>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold text-gray-700">ステータス</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="draft">下書き (非公開)</option>
                <option value="published">公開</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold text-gray-700">
                ターゲット (対象)
              </label>
              <select
                name="target_audience"
                value={formData.target_audience}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="user">お客様向け（ガイド・安心要素）</option>
                <option value="recruit">求職者向け（採用・面接・悩み）</option>
              </select>
              <p className="mt-1 text-[11px] text-gray-500">
                ここで選んだ項に合わせて、最終的なメディア掲載先が[お客様用]か[採用用]に自動で振り分けられます。
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold text-gray-700">カテゴリー</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="amolab">アモラボ</option>
                <option value="ikeo">イケオ・ラボ</option>
                <option value="sweetstay">Sweet Stay (ホテルメディア)</option>
                <option value="amolab-jiten">女風辞典</option>
              </select>
              <p className="mt-1 text-[11px] text-gray-500">掲載先のメディア媒体を選択します。</p>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold text-gray-700">URLスラグ *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="how-to-choose"
                className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                  URLの一部になります（例：/amolab/how-to-choose）。英語とハイフンを推奨。
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                <div className="flex items-center gap-2">
                  <TagIcon size={16} />
                  タグ (カンマ区切り)
                </div>
              </label>
              <input
                type="text"
                name="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="初回, 選び方, 面接"
                className="w-full rounded-lg border border-gray-300 p-2.5 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />

              {/* 既存タグの選択肢 */}
              {availableTags.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-bold text-gray-400">
                    登録済みのタグ（クリックで追加）:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleAddTag(tag.name)}
                        className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium text-gray-600 transition-colors hover:bg-brand-secondary hover:text-white"
                      >
                        + {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold text-gray-700">サムネイル画像</label>

              {/* プレビューエリア */}
              <div className="mb-4">
                {previewUrl ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-50 shadow-inner">
                    <img
                      src={previewUrl}
                      alt="Thumbnail preview"
                      className="h-full w-full object-cover"
                    />
                    {selectedFile && (
                      <button
                        onClick={clearSelectedFile}
                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                      >
                        <XCircleIcon size={20} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-2 text-gray-400" size={32} />
                      <p className="text-xs text-gray-500">画像が未選択です</p>
                    </div>
                  </div>
                )}
              </div>

              {/* アップロード操作 */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <ImageIcon size={18} />
                    画像を選択
                  </button>

                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={isUploading}
                      className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
                    >
                      <UploadIcon size={18} />
                      {isUploading ? '中...' : 'アップロード'}
                    </button>
                  )}
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-[10px] font-bold uppercase text-gray-400">URL</span>
                  </div>
                  <input
                    type="text"
                    name="thumbnail_url"
                    value={formData.thumbnail_url || ''}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-lg border border-gray-300 p-2.5 pl-12 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>
              </div>

              <p className="mt-2 text-[11px] text-gray-500">
                画像を直接アップロードするか、外部URLを入力してください。
              </p>
            </div>
          </div>

          {/* SEO */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 border-b pb-2 text-base font-bold text-gray-800">SEO設定</h3>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold text-gray-700">SEO タイトル</label>
              <input
                type="text"
                name="seo_title"
                value={formData.seo_title || ''}
                onChange={handleChange}
                placeholder="検索結果用のタイトル"
                className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-gray-700">SEO 説明文</label>
              <textarea
                name="seo_description"
                value={formData.seo_description || ''}
                onChange={handleChange}
                rows={4}
                placeholder="検索結果で表示される説明文（120文字程度）"
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
