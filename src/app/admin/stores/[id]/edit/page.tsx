// app/admin/stores/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';

interface StoreForm {
  id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  catch_copy?: string;
  image_url?: string;
  theme_color?: string;
  description?: string; // ✅ 店舗紹介文を追加
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
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', id)
        .single();

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

    const { data: publicData } = supabase.storage
      .from('store-images')
      .getPublicUrl(filePath);

    if (publicData?.publicUrl) {
      setForm((prev) =>
        prev ? { ...prev, image_url: publicData.publicUrl } : prev
      );
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
        description: form.description, // ✅ 店舗紹介文を保存
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
    <div className="p-4 space-y-4">
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
        value={form.catch_copy || ''}
        onChange={(e) => handleChange('catch_copy', e.target.value)}
        placeholder="キャッチコピー"
      />

      {/* 店舗紹介文 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          店舗紹介文
        </label>
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
        {form.image_url && (
          <img src={form.image_url} alt="preview" className="mt-2 h-32 rounded" />
        )}
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
    className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition"
  >
    更新
  </button>
</div>
    </div>
  );
}
