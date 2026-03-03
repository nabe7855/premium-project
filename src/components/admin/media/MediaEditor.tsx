'use client';

import { createMediaArticle, MediaArticleData, updateMediaArticle } from '@/lib/actions/media';
import { ChevronLeftIcon, SaveIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface MediaEditorProps {
  initialData?: any;
  articleId?: string;
}

export default function MediaEditor({ initialData, articleId }: MediaEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<MediaArticleData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    thumbnail_url: initialData?.thumbnail_url || '',
    target_audience: initialData?.target_audience || 'user',
    status: initialData?.status || 'draft',
    seo_title: initialData?.seo_title || '',
    seo_description: initialData?.seo_description || '',
    author_name: initialData?.author_name || '運営事務局',
  });
  const [tagsInput, setTagsInput] = useState<string>(
    initialData?.tags?.map((t: any) => t.tag.name).join(', ') || '',
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    let result;
    if (articleId) {
      result = await updateMediaArticle(articleId, formData, tagsArray);
    } else {
      result = await createMediaArticle(formData, tagsArray);
    }

    if (result.success) {
      alert('記事を保存しました！');
      router.push('/admin/admin/media-management');
    } else {
      alert('保存エラー: ' + result.error);
    }
    setIsSaving(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/admin/media-management"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* Editor Placeholder */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              本文 (Markdown形式) *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={20}
              placeholder="# 大見出し&#10;ここに本文を入力してください..."
              className="w-full rounded-lg border border-gray-300 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
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
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
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
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent"
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
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="user">お客様向け（ガイド・安心要素）</option>
                <option value="recruit">求職者向け（採用・面接・悩み）</option>
              </select>
              <p className="mt-1 text-[11px] text-gray-500">
                ここで選んだ項に合わせて、最終的なメディア掲載先が[お客様用]か[採用用]に自動で振り分けられます。
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold text-gray-700">URLスラグ *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="how-to-choose"
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                URLの一部になります（例：/magazine/how-to-choose）。英語とハイフンを推奨。
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold text-gray-700">
                タグ (カンマ区切り)
              </label>
              <input
                type="text"
                name="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="初回, 選び方, 面接"
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold text-gray-700">
                サムネイル画像URL
              </label>
              <input
                type="text"
                name="thumbnail_url"
                value={formData.thumbnail_url || ''}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
              <p className="mt-1 text-[11px] text-gray-500">Unsplash等の画像URLを入力します。</p>
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
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent"
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
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
