'use client';

import { getSupabasePublicUrl } from '@/lib/image-url';
import { supabase } from '@/lib/supabaseClient';
import { compressImage } from '@/lib/utils/imageCompressor';
import { CastDiary } from '@/types/cast';
import { ImagePlus, X, Info, CheckCircle2, Mic, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AudioRecorder from './AudioRecorder';
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
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
  const [publishedAt, setPublishedAt] = useState('');
  const [isCommentEnabled, setIsCommentEnabled] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'standard' | 'voice'>('standard');

  // ✅ SEOアシスト用の状態
  const [charCount, setCharCount] = useState(0);
  const [seoScore, setSeoScore] = useState(0);
  const [seoTips, setSeoTips] = useState<{ text: string; met: boolean }[]>([]);

  useEffect(() => {
    const count = content.length;
    setCharCount(count);

    const tips = [
      { text: 'タイトルを10文字以上にする', met: title.length >= 10 },
      { text: '本文を300文字以上書く（現在: ' + count + '文字）', met: count >= 300 },
      { text: '画像を2枚以上アップロードする', met: (files.length + existingImages.length) >= 2 },
      { text: 'タグを3つ以上設定する', met: tags.length >= 3 },
    ];
    setSeoTips(tips);

    const score = Math.round((tips.filter(t => t.met).length / tips.length) * 100);
    setSeoScore(score);
  }, [title, content, files, existingImages, tags]);

  // ✅ 初期データセット
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setTags(initialData.tags);
      setStatus(initialData.status || 'published');
      setIsCommentEnabled(initialData.isCommentEnabled ?? true);
      if (initialData.publishedAt) {
        // datetime-local 用のフォーマット (YYYY-MM-DDThh:mm)
        const date = new Date(initialData.publishedAt);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        setPublishedAt(`${y}-${m}-${d}T${h}:${min}`);
      }
      // 既存画像: url と file_path 両方を持たせる
      setExistingImages(
        (initialData.images || []).map((url) => ({
          url,
          filePath: url.split('/').slice(-2).join('/'), // 👈 file_path を推定（保存時に正しく渡す）
        })),
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
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    const compressedFiles = await Promise.all(
      Array.from(selected).map((file) => compressImage(file)),
    );
    setFiles((prev) => [...prev, ...compressedFiles]);
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
          .insert({
            cast_id: castId,
            title,
            content,
            status,
            is_comment_enabled: isCommentEnabled,
            published_at:
              status === 'scheduled' && publishedAt
                ? new Date(publishedAt).toISOString()
                : new Date().toISOString(),
          })
          .select()
          .single();
        if (blogError) throw blogError;
        blogId = blog.id;
      } else {
        // ---- 更新 ----
        const { error: updateError } = await supabase
          .from('blogs')
          .update({
            title,
            content,
            status,
            is_comment_enabled: isCommentEnabled,
            published_at:
              status === 'scheduled' && publishedAt
                ? new Date(publishedAt).toISOString()
                : status === 'published'
                  ? new Date().toISOString()
                  : initialData.publishedAt || new Date().toISOString(),
          })
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
        status,
        isCommentEnabled,
        publishedAt:
          status === 'scheduled' ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      });
    } catch (err) {
      console.error('❌ 保存エラー:', err);
    } finally {
      setUploading(false);
      onCancel();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 執筆アシスタントパネル（上部に移動して視認性を向上） */}
      <div className="w-full">
        <div className="rounded-2xl border border-pink-100 bg-white/80 p-5 shadow-lg backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h3 className="text-lg font-black text-gray-800 tracking-tight">執筆アドバイザー</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400">SEOスコア:</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ring-4 ${
                seoScore >= 75 ? 'bg-green-500 text-white ring-green-100' :
                seoScore >= 50 ? 'bg-yellow-400 text-white ring-yellow-100' :
                'bg-gray-200 text-gray-600 ring-gray-50'
              }`}>
                {seoScore}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">チェックリスト</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {seoTips.map((tip, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                      tip.met ? 'bg-green-100 text-green-600' : 'bg-rose-50 text-rose-300'
                    }`}>
                      {tip.met ? (
                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="h-1 w-1 rounded-full bg-current"></div>
                      )}
                    </div>
                    <p className={`text-[11px] font-bold ${tip.met ? 'text-gray-700' : 'text-gray-400'}`}>
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-pink-50/50 p-4">
              <h4 className="mb-1 flex items-center gap-2 text-xs font-black text-pink-700">
                <span>💡</span>
                執筆のコツ
              </h4>
              <p className="text-[10px] font-bold leading-relaxed text-pink-600/80">
                {seoScore >= 75 ? 
                  '素晴らしい日記です！このまま公開しましょう✨' : 
                  '具体的なキーワード（場所や感想）を入れると、検索からお客様が見つけるきっかけになります！'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* メインフォーム */}
      <form onSubmit={handleSubmit} className="relative space-y-4 pb-8">
        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-xl">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-800">
            <span>🖋️</span>
            日記を作成する
          </h2>
      <div className="space-y-6">
        {/* テンプレート選択 */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">投稿テンプレート案（クリックで内容を挿入）</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '日常・つぶやき', desc: '普段の様子を伝えたい時に', icon: '🌸', text: '今日は〇〇に行ってきました！\n\n[ここにエピソードを詳しく書く]\n\nまた明日もお会いできるのを楽しみにしています✨' },
              { label: 'お礼と感想', desc: 'お客様へのメッセージに', icon: '🙏', text: '先日お越しいただいたお客様、ありがとうございました！\n\n[施術の感想や嬉しかったことを書く]\n\n皆様の癒やしになれるよう、これからも頑張ります🌟' },
              { label: '自己紹介', desc: '新しいお客様に向けて', icon: '🎀', text: '改めて自己紹介をさせていただきます！\n\n[趣味や得意なこと、性格などを紹介]\n\nぜひ会いに来てくださいね❤️' },
            ].map((template, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (content && !confirm('本文を上書きします。よろしいですか？')) return;
                  setContent(template.text);
                }}
                className="group relative flex flex-col items-start gap-1 rounded-xl border border-pink-100 bg-pink-50/30 px-4 py-3 text-left transition-all hover:bg-pink-100"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{template.icon}</span>
                  <span className="text-xs font-black text-pink-700">{template.label}</span>
                </div>
                <span className="text-[9px] font-bold text-pink-400">{template.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">タイトル（検索結果や一覧に表示されます）</label>
          <input
            type="text"
            placeholder="読者の目を引くタイトルを入力..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border-gray-100 bg-gray-50/50 p-4 text-lg font-bold text-gray-800 transition-all focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-50"
          />
        </div>

        {/* コンテンツ入力セクション（タブ切り替え） */}
        <div className="space-y-4">
          <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('standard')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === 'standard' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <FileText size={16} />
              通常入力
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('voice')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === 'voice' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Mic size={16} />
              音声アシスト
            </button>
          </div>

          {activeTab === 'voice' ? (
            <div className="space-y-4">
              <AudioRecorder 
                onGenerated={(newContent) => {
                  setContent(newContent);
                  setActiveTab('standard');
                }}
                onCancel={() => setActiveTab('standard')}
              />
              <div className="rounded-xl border border-pink-100 bg-pink-50/30 p-4">
                <p className="text-[10px] font-bold leading-relaxed text-pink-700/80">
                  <span className="mr-1">💡</span>
                  喋り終わった後、AIが自動で300〜500文字程度の日記を作成します。
                  作成された文章は、後から「通常入力」タブで自由に修正できます。
                </p>
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-2 flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>本文（お客様へのメッセージ）</span>
                <span className={charCount >= 300 ? 'text-green-500' : 'text-gray-400'}>
                  {charCount} 文字
                </span>
              </label>
              <textarea
                placeholder="ここに日記の本文を入力してください..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] w-full rounded-xl border-gray-100 bg-gray-50/50 p-4 text-base leading-relaxed text-gray-700 transition-all focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-50"
              />
            </div>
          )}
        </div>
      </div>

      {/* 投稿ステータス設定 */}
      <div className="rounded-lg bg-gray-50 p-4">
        <label className="mb-2 block text-sm font-bold text-gray-700">投稿予約・公開設定</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="status"
              value="published"
              checked={status === 'published'}
              onChange={() => setStatus('published')}
              className="accent-pink-500"
            />
            <span className="text-sm">今すぐ公開</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={status === 'draft'}
              onChange={() => setStatus('draft')}
              className="accent-pink-500"
            />
            <span className="text-sm">下書き保存</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="status"
              value="scheduled"
              checked={status === 'scheduled'}
              onChange={() => setStatus('scheduled')}
              className="accent-pink-500"
            />
            <span className="text-sm">予約投稿</span>
          </label>
        </div>

        {status === 'scheduled' && (
          <div className="mt-3 animate-in fade-in slide-in-from-top-1">
            <label className="mb-1 block text-xs text-gray-500">公開日時を指定</label>
            <input
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              required={status === 'scheduled'}
            />
          </div>
        )}
      </div>

      {/* コメント設定 */}
      <div className="rounded-lg bg-gray-50 p-4">
        <label className="flex cursor-pointer items-center justify-between">
          <div>
            <span className="block text-sm font-bold text-gray-700">コメント機能</span>
            <span className="text-xs text-gray-500">この日記へのコメント投稿を許可する</span>
          </div>
          <input
            type="checkbox"
            checked={isCommentEnabled}
            onChange={(e) => setIsCommentEnabled(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
        </label>
      </div>

      {/* 画像セクション */}
      <div className="rounded-2xl border border-pink-50 bg-white p-6 shadow-sm">
        <label className="mb-4 block text-[10px] font-black uppercase tracking-widest text-gray-400">写メ（1枚以上、複数枚がおすすめ）</label>
        
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* 既存画像 */}
          {existingImages.map((img, index) => (
            <div key={index} className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all hover:ring-4 hover:ring-pink-100">
              <img src={img.url} alt={`existing-${index}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeExistingImage(img.filePath)}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-md transition-all hover:bg-rose-500"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          
          {/* 新規画像プレビュー */}
          {files.map((file, index) => (
            <div key={`new-${index}`} className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all hover:ring-4 hover:ring-pink-100">
              <img src={URL.createObjectURL(file)} alt={`preview-${index}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-md transition-all hover:bg-rose-500"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          {/* アップロードボタン */}
          {(files.length + existingImages.length) < 9 && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-100 bg-pink-50/30 transition-all hover:border-pink-300 hover:bg-pink-50">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-pink-700">写真を追加</span>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* タグセクション */}
      <div className="rounded-2xl border border-pink-50 bg-white p-6 shadow-sm">
        <label className="mb-4 block text-[10px] font-black uppercase tracking-widest text-gray-400">ハッシュタグ（関連付け）</label>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="タグを追加（例：おすすめ）..."
            className="flex-1 rounded-xl border-gray-100 bg-gray-50/50 px-4 py-2 text-sm focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-50"
          />
          <button
            type="button"
            onClick={() => addTag()}
            className="rounded-xl bg-pink-500 px-6 font-bold text-white transition-all hover:bg-pink-600 active:scale-95"
          >
            追加
          </button>
        </div>

        {/* プリセットタグ */}
        <div className="mt-4 flex flex-wrap gap-2">
          {presetTags.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => addTag(preset.name)}
              className="rounded-lg bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-500 transition-all hover:bg-pink-50 hover:text-pink-600"
            >
              + {preset.name}
            </button>
          ))}
        </div>

        {/* 選択済みタグ */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-pink-500 to-rose-400 px-3 py-1.5 text-[11px] font-black tracking-wider text-white shadow-sm"
            >
              #{tag}
              <button 
                type="button" 
                onClick={() => removeTag(tag)} 
                className="ml-1 rounded-full bg-white/20 p-0.5 hover:bg-white/40"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={uploading}
          className="group flex flex-1 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 py-4 text-lg font-black tracking-widest text-white shadow-xl shadow-pink-200 transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:opacity-50"
        >
          {uploading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
          ) : (
            <>
              <span>{initialData ? '更新する' : '公開する'}</span>
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl bg-gray-100 px-8 py-4 text-lg font-black tracking-widest text-gray-400 transition-all hover:bg-gray-200 hover:text-gray-600 active:scale-[0.98]"
        >
          中止
        </button>
      </div>
        </div>
      </form>
    </div>
  );
}
