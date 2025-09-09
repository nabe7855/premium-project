// app/admin/stores/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';

export default function EditStorePage() {
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // 店舗データを取得
  useEffect(() => {
    const loadStore = async () => {
      const { data, error } = await supabase.from('stores').select('*').eq('id', id).single();
      if (error) {
        console.error(error);
      } else {
        setForm(data);
      }
    };
    loadStore();
  }, [id]);

  const handleChange = (key: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // 画像アップロード
  const handleUpload = async () => {
    if (!file) return alert('画像ファイルを選択してください');
    setUploading(true);

    const filePath = `stores/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('store-images')
      .upload(filePath, file, { upsert: true });

    if (error) {
      alert('❌ 画像アップロード失敗: ' + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('store-images').getPublicUrl(filePath);
    setForm((prev: any) => ({ ...prev, image_url: data.publicUrl }));
    setUploading(false);
    alert('✅ 画像をアップロードしました');
  };

  // 更新
  const handleSubmit = async () => {
    const { error } = await supabase.from('stores').update(form).eq('id', id);
    if (error) alert('❌ エラー: ' + error.message);
    else {
      alert('✅ 更新しました');
      window.location.href = '/admin';
    }
  };

  if (!form) return <div>読み込み中...</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">店舗編集</h1>

      <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="店舗名" />
      <input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} placeholder="slug" />
      <input value={form.address || ''} onChange={(e) => handleChange('address', e.target.value)} placeholder="住所" />
      <input value={form.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} placeholder="電話番号" />
      <input value={form.catch_copy || ''} onChange={(e) => handleChange('catch_copy', e.target.value)} placeholder="キャッチコピー" />

      {/* 画像アップロード */}
      <div>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
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
