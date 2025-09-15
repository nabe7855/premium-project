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

  // 画像アップロード（直下保存）
  const handleUpload = async () => {
    if (!file || !form) {
      alert('画像ファイルを選択してください');
      return;
    }

    console.log('📂 File selected:', file);
    console.log('📏 File size:', file.size);

    if (file.size === 0) {
      alert('❌ ファイルサイズが 0 です');
      return;
    }

    setUploading(true);

    const filePath = `${Date.now()}-${file.name}`; // ✅ バケット直下に保存
    console.log('📡 Uploading to bucket=store-images, path=', filePath);

    const { error: uploadError } = await supabase.storage
      .from('store-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/png', // ✅ contentType を明示
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      alert('❌ 画像アップロード失敗: ' + uploadError.message);
      setUploading(false);
      return;
    }

    console.log('✅ Upload succeeded');

    const { data: publicData } = supabase.storage
      .from('store-images')
      .getPublicUrl(filePath);

    console.log('🌍 Public URL result:', publicData);

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

      <button onClick={handleSubmit}>更新</button>
    </div>
  );
}
