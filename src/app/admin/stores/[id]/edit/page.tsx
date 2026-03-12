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

  if (!form) return <div>読み込み中...</div>;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">店舗編集</h1>

      <input
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="店舗名"
      />
      <input
        value={form.slug}
        onChange={(e) => handleChange('slug', e.target.value)}
        placeholder="slug"
      />
      <input
        value={form.address || ''}
        onChange={(e) => handleChange('address', e.target.value)}
        placeholder="住所"
      />
      <input
        value={form.phone || ''}
        onChange={(e) => handleChange('phone', e.target.value)}
        placeholder="電話番号"
      />
      <input
        className="w-full rounded border p-2"
        value={form.catch_copy || ''}
        onChange={(e) => handleChange('catch_copy', e.target.value)}
        placeholder="キャッチコピー"
      />
      <input
        className="w-full rounded border p-2"
        value={form.business_hours || ''}
        onChange={(e) => handleChange('business_hours', e.target.value)}
        placeholder="営業時間 (例: 12:00〜翌朝4時)"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">LINE ID</label>
          <input
            className="w-full rounded border p-2"
            value={form.line_id || ''}
            onChange={(e) => handleChange('line_id', e.target.value)}
            placeholder="@example"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">LINE URL</label>
          <input
            className="w-full rounded border p-2"
            value={form.line_url || ''}
            onChange={(e) => handleChange('line_url', e.target.value)}
            placeholder="https://line.me/R/ti/p/..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">通知用メールアドレス</label>
          <input
            className="w-full rounded border p-2"
            value={form.notification_email || ''}
            onChange={(e) => handleChange('notification_email', e.target.value)}
            placeholder="contact@example.com"
          />
        </div>
        <div className="space-y-2 border-t pt-4 md:col-span-2">
          <h3 className="text-lg font-bold text-gray-800">外部誘導設定</h3>
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.use_external_url || false}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, use_external_url: e.target.checked } : prev))
                }
                className="h-4 w-4 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">外部URLへ誘導する</span>
            </label>
          </div>
          {form.use_external_url && (
            <div>
              <label className="block text-sm font-medium text-gray-700">外部誘導先URL</label>
              <input
                className="w-full rounded border p-2"
                value={form.external_url || ''}
                onChange={(e) => handleChange('external_url', e.target.value)}
                placeholder="https://example.com/external-store"
              />
              <p className="mt-1 text-xs text-gray-500">
                ※チェックが入っている場合、「入店する」ボタンはこのURLへ飛びます。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 店舗紹介文 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">店舗紹介文</label>
        <textarea
          value={form.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="店舗の紹介文を入力してください"
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* 画像アップロード */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button type="button" onClick={handleUpload} disabled={uploading}>
          {uploading ? 'アップロード中...' : '画像アップロード'}
        </button>
        {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-32 rounded" />}
      </div>

      {/* テーマカラー */}
      <div>
        <label>テーマカラー: </label>
        <input
          type="color"
          value={form.theme_color || '#a855f7'}
          onChange={(e) => handleChange('theme_color', e.target.value)}
        />
      </div>

      {/* ✅ 更新ボタン（フッターの上に浮かせる） */}
      <div className="fixed bottom-20 right-6 z-50">
        <button
          onClick={handleSubmit}
          className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
        >
          更新
        </button>
      </div>
    </div>
  );
}
