'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CastDiary } from '@/types/cast';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  castId: string;
  initialData?: CastDiary; // 編集時に渡す
  onSave: (data: Omit<CastDiary, 'createdAt'>) => void; // ✅ id を含める
  onCancel: () => void;
}

interface TagMaster {
  id: string;
  name: string;
  is_active: boolean;
}

export default function DiaryEditor({ castId, initialData, onSave, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string; filePath: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [presetTags, setPresetTags] = useState<TagMaster[]>([]);
  const [uploading, setUploading] = useState(false);

  // ✅ 初期データセット
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setTags(initialData.tags);
      // 既存画像: url と file_path 両方を持たせる
      setExistingImages(
        (initialData.images || []).map((url) => ({
          url,
          filePath: url.split('/').slice(-2).join('/'), // 👈 file_path を推定（保存時に正しく渡す）
        }))
      );
    }
  }, [initialData]);

  // ✅ タグマスター取得
  useEffect(() => {
    const loadTags = async () => {
      const { data, error } = await supabase
        .from('blog_tag_master')
        .select('id, name, is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (!error) setPresetTags(data || []);
    };
    loadTags();
  }, []);

  // ✅ 画像追加
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    setFiles((prev) => [...prev, ...Array.from(selected)]);
  };

  // ✅ 新規プレビュー削除
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ 既存画像削除（Storage + DBからも消す）
  const removeExistingImage = async (filePath: string) => {
    try {
      await supabase.storage.from('diary').remove([filePath]);
      await supabase.from('blog_images').delete().eq('file_path', filePath);
      setExistingImages((prev) => prev.filter((img) => img.filePath !== filePath));
    } catch (err) {
      console.error('❌ 画像削除エラー:', err);
    }
  };

  // ✅ タグ操作
  const addTag = (tag?: string) => {
    const newTag = (tag ?? tagInput).trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput('');
  };
  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // ✅ 保存処理（新規・更新）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let blogId = initialData?.id;

      if (!initialData) {
        // ---- 新規作成 ----
        const { data: blog, error: blogError } = await supabase
          .from('blogs')
          .insert({ cast_id: castId, title, content })
          .select()
          .single();
        if (blogError) throw blogError;
        blogId = blog.id;
      } else {
        // ---- 更新 ----
        const { error: updateError } = await supabase
          .from('blogs')
          .update({ title, content })
          .eq('id', blogId);
        if (updateError) throw updateError;

        // タグ・画像の関係はクリア済みなので再登録
        await supabase.from('blog_tags').delete().eq('blog_id', blogId);
      }

      // ---- 新規アップロード画像 ----
      const newImageUrls: string[] = [];
      for (const file of files) {
        const filePath = `diary/${uuidv4()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from('diary').upload(filePath, file);
        if (!uploadError) {
          const url = supabase.storage.from('diary').getPublicUrl(filePath).data.publicUrl;
          newImageUrls.push(url);
          await supabase.from('blog_images').insert({
            blog_id: blogId,
            image_url: url,
            file_path: filePath, // 👈 削除用に保存
          });
        }
      }

      // ---- タグ保存 ----
      for (const tagName of tags) {
        let { data: existing } = await supabase
          .from('blog_tag_master')
          .select('id')
          .eq('name', tagName)
          .maybeSingle();

        let tagId = existing?.id;
        if (!tagId) {
          const { data: newTag } = await supabase
            .from('blog_tag_master')
            .insert({ name: tagName, is_active: true })
            .select()
            .single();
          tagId = newTag.id;
        }

        await supabase.from('blog_tags').insert({ blog_id: blogId, tag_id: tagId });
      }

      // ---- 親に通知 ----
      onSave({
         id: initialData?.id ?? '', // ✅ 新規は空文字 / 編集は既存id
  castId,
  title,
  content,
  images: [...existingImages.map((i) => i.url), ...newImageUrls],
  tags,
      });
    } catch (err) {
      console.error('❌ 保存エラー:', err);
    } finally {
      setUploading(false);
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4 pb-32">
      {/* タイトル */}
      <input
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2"
      />

      {/* 本文 */}
      <textarea
        placeholder="本文"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded p-2 min-h-[120px]"
      />

      {/* 既存画像プレビュー */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {existingImages.map((img, index) => (
            <div key={index} className="relative">
              <img src={img.url} alt={`existing-${index}`} className="w-full h-24 object-cover rounded" />
              <button
                type="button"
                onClick={() => removeExistingImage(img.filePath)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 新規ファイル選択 */}
      <label className="block w-full p-4 text-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-pink-50">
        <span className="text-gray-600">📸 写真を追加</span>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>

      {/* 新規プレビュー */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, index) => (
            <div key={index} className="relative">
              <img src={URL.createObjectURL(file)} alt={`preview-${index}`} className="w-full h-24 object-cover rounded" />
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* タグ入力 */}
      <div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="タグを入力してEnter"
            className="flex-1 border rounded px-2 py-1"
          />
          <button type="button" onClick={() => addTag()} className="bg-pink-500 text-white px-3 rounded">
            追加
          </button>
        </div>

        {/* プリセットタグ */}
        <div className="flex flex-wrap gap-2 mt-2">
          {presetTags.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => addTag(preset.name)}
              className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-pink-100 hover:text-pink-600"
            >
              #{preset.name}
            </button>
          ))}
        </div>

        {/* 選択済みタグ */}
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span key={tag} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full flex items-center gap-1 text-sm">
              #{tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-pink-500">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 固定ボタン */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-2 z-50 shadow-md">
        <button type="submit" disabled={uploading} className="flex-1 bg-blue-500 text-white py-3 rounded text-lg">
          {uploading ? '保存中...' : initialData ? '更新' : '保存'}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-300 py-3 rounded text-lg">
          キャンセル
        </button>
      </div>
    </form>
  );
}
