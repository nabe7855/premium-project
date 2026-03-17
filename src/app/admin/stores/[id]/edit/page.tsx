// app/admin/stores/[id]/edit/page.tsx
'use client';

import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StoreForm {
  id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  catch_copy?: string;
  image_url?: string;
  theme_color?: string;
  description?: string;
  business_hours?: string;
  reception_hours?: string;
  line_id?: string;
  line_url?: string;
  notification_email?: string;
  external_url?: string;
  use_external_url?: boolean;
}

export default function EditStorePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [form, setForm] = useState<StoreForm | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // 店舗データを取得
  useEffect(() => {
    const loadStore = async () => {
      console.log('📡 Fetching store:', id);
      const { data, error } = await supabase.from('stores').select('*').eq('id', id).single();

      if (error) {
        console.error('❌ Store fetch error:', error);
      } else {
        console.log('✅ Store loaded:', data);
        setForm(data as StoreForm);
      }
    };
    if (id) loadStore();
  }, [id]);

  const handleChange = (key: keyof StoreForm, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  // 画像アップロード
  const handleUpload = async () => {
    if (!file || !form) {
      alert('画像ファイルを選択してください');
      return;
    }

    if (file.size === 0) {
      alert('❌ ファイルサイズが 0 です');
      return;
    }

    setUploading(true);
    const filePath = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('store-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/png',
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      alert('❌ 画像アップロード失敗: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage.from('store-images').getPublicUrl(filePath);

    if (publicData?.publicUrl) {
      setForm((prev) => (prev ? { ...prev, image_url: publicData.publicUrl } : prev));
      alert('✅ 画像をアップロードしました');
    }

    setUploading(false);
  };

  // 更新
  const handleSubmit = async () => {
    if (!form) return;

    console.log('📡 Updating store with data:', form);

    const { error } = await supabase
      .from('stores')
      .update({
        name: form.name,
        slug: form.slug,
        address: form.address,
        phone: form.phone,
        catch_copy: form.catch_copy,
        image_url: form.image_url,
        theme_color: form.theme_color,
        description: form.description,
        business_hours: form.business_hours,
        reception_hours: form.reception_hours,
        line_id: form.line_id,
        line_url: form.line_url,
        notification_email: form.notification_email,
        external_url: form.external_url,
        use_external_url: form.use_external_url,
      })
      .eq('id', id);

    if (error) {
      console.error('❌ Update error:', error);
      alert('❌ エラー: ' + error.message);
    } else {
      console.log('✅ Store updated successfully');
      alert('✅ 更新しました');
      router.push('/admin');
    }
  };

  if (!form)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">店舗情報の編集</h1>
            <p className="mt-1 text-sm text-gray-500">店舗の基本設定と誘導先を管理します</p>
          </div>
          <button
            onClick={() => router.push('/admin/stores')}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            ← 店舗一覧へ戻る
          </button>
        </header>

        {/* 誘導モード選択 */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <label className="mb-4 block text-sm font-bold text-gray-700">誘導モード設定</label>
          <div className="flex w-full gap-2 rounded-lg bg-gray-100 p-1 sm:w-fit">
            <button
              onClick={() =>
                setForm((prev) => (prev ? { ...prev, use_external_url: false } : null))
              }
              className={`flex-1 rounded-md px-8 py-2.5 text-sm font-bold transition sm:flex-none ${!form.use_external_url ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:text-gray-700'}`}
            >
              内部誘導（通常）
            </button>
            <button
              onClick={() => setForm((prev) => (prev ? { ...prev, use_external_url: true } : null))}
              className={`flex-1 rounded-md px-8 py-2.5 text-sm font-bold transition sm:flex-none ${form.use_external_url ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:text-gray-700'}`}
            >
              外部誘導（リダイレクト）
            </button>
          </div>
          <p className="mt-3 text-xs italic text-gray-400">
            {form.use_external_url
              ? '※外部誘導モードでは、トップページのボタンから直接指定URLへ移動させます。最低限の情報のみ設定が必要です。'
              : '※内部誘導モードでは、店舗専用の個別ページを表示します。全ての情報を入力してください。'}
          </p>
        </div>

        <div className="space-y-6">
          {/* 基本セクション: 常に表示される項目（名前、説明、画像） */}
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b pb-2 text-lg font-bold text-gray-800">基本情報</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  店舗名 <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="例: ストロベリーボーイズ新宿店"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={form.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="shinjuku"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                店舗紹介 / 概要 (Overview) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="店舗のキャッチコピーや簡単な紹介文を入力してください"
                rows={4}
                className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                サムネイル / メイン画像 <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <div className="group relative">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="preview"
                      className="aspect-video w-48 rounded-lg border object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex aspect-video w-48 items-center justify-center rounded-lg border bg-gray-100 text-sm text-gray-400">
                      画像なし
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading || !file}
                    className="rounded bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {uploading ? 'アップロード中...' : '画像を確定する'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 外部誘導セクション: 外部誘導モード時のみ */}
          {form.use_external_url && (
            <section className="space-y-4 rounded-xl border border-indigo-200 bg-white p-6 shadow-sm animate-in fade-in slide-in-from-top-2">
              <h2 className="mb-4 flex items-center gap-2 border-b border-indigo-100 pb-2 text-lg font-bold text-indigo-800">
                <span className="rounded bg-indigo-100 p-1 text-indigo-700">🔗</span> 外部リンク設定
              </h2>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  リダイレクト先URL <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-md border border-indigo-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={form.external_url || ''}
                  onChange={(e) => handleChange('external_url', e.target.value)}
                  placeholder="https://example.com/external-store"
                />
                <p className="mt-1 text-xs text-indigo-500">
                  ※ユーザーが入店ボタンを押すと、このURLへ転送されます。
                </p>
              </div>
            </section>
          )}

          {/* 内部情報セクション: 内部誘導モード時のみ */}
          {!form.use_external_url && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
              <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 border-b pb-2 text-lg font-bold text-gray-800">
                  店舗詳細（内部ページ用）
                </h2>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">キャッチコピー</label>
                  <input
                    className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                    value={form.catch_copy || ''}
                    onChange={(e) => handleChange('catch_copy', e.target.value)}
                    placeholder="例: 上質な空間で至福のひとときを"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">住所</label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      value={form.address || ''}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="東京都新宿区..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">電話番号</label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      value={form.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="03-1234-5678"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">営業時間</label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      value={form.business_hours || ''}
                      onChange={(e) => handleChange('business_hours', e.target.value)}
                      placeholder="例: 12:00〜翌朝4時"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">受付時間</label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      value={form.reception_hours || ''}
                      onChange={(e) => handleChange('reception_hours', e.target.value)}
                      placeholder="例: 10:00〜23:00"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 border-b pb-2 text-lg font-bold text-gray-800">
                  SNS & 通知設定
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">LINE ID</label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      value={form.line_id || ''}
                      onChange={(e) => handleChange('line_id', e.target.value)}
                      placeholder="@example"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">LINE URL</label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      value={form.line_url || ''}
                      onChange={(e) => handleChange('line_url', e.target.value)}
                      placeholder="https://line.me/R/ti/p/..."
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      通知用メールアドレス
                    </label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                      value={form.notification_email || ''}
                      onChange={(e) => handleChange('notification_email', e.target.value)}
                      placeholder="contact@example.com"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 border-b pb-2 text-lg font-bold text-gray-800">デザイン設定</h2>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">店舗テーマカラー</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="h-10 w-10 cursor-pointer rounded border border-gray-300"
                      value={form.theme_color || '#a855f7'}
                      onChange={(e) => handleChange('theme_color', e.target.value)}
                    />
                    <span className="font-mono text-sm uppercase text-gray-500">
                      {form.theme_color || '#a855f7'}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* 保存エリア */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/80 p-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl justify-end gap-3">
            <button
              onClick={() => router.push('/admin/stores')}
              className="rounded-lg border border-gray-300 px-6 py-2.5 font-bold text-gray-700 transition hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-indigo-600 px-10 py-2.5 font-bold text-white shadow-lg transition hover:bg-indigo-700"
            >
              店舗情報を保存する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
