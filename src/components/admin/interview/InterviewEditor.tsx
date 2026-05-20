'use client';

import { 
  createInterviewArticle, 
  updateInterviewMeta,
  getAllCasts
} from '@/lib/actions/interview';
import { updateMediaArticle } from '@/lib/actions/media';
import { 
  ChevronLeftIcon, 
  EyeIcon, 
  ImageIcon, 
  SaveIcon, 
  SettingsIcon 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import DialogueEditor from './DialogueEditor';
import ParticipantManager from './ParticipantManager';
import ProfileFaqEditor from './ProfileFaqEditor';
import { InterviewData, Participant } from './types';

interface InterviewEditorProps {
  initialData?: any;
  articleId?: string;
}

export default function InterviewEditor({ initialData, articleId }: InterviewEditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'content' | 'profile' | 'settings'>('content');
  const [isSaving, setIsSaving] = useState(false);
  const [availableCasts, setAvailableCasts] = useState<any[]>([]);

  // Initialize form data from initialData
  const [data, setData] = useState<InterviewData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    thumbnail_url: initialData?.thumbnail_url || '',
    status: initialData?.status || 'draft',
    author_name: initialData?.author_name || 'イトウ',
    seo_title: initialData?.seo_title || '',
    seo_description: initialData?.seo_description || '',
    tags: initialData?.tags?.map((t: any) => t.tag.name) || [],
    
    article_type: initialData?.interview_meta?.article_type || 'solo_interview',
    area: initialData?.interview_meta?.area || 'fukuoka',
    series_slug: initialData?.interview_meta?.series_slug || '',
    vol_number: initialData?.interview_meta?.vol_number || 1,
    seo_keywords: initialData?.interview_meta?.seo_keywords || '',
    writer_note: initialData?.interview_meta?.writer_note || [],
    
    sections: initialData?.interview_meta?.dialogue_data?.sections || [],
    profile_fields: initialData?.interview_meta?.profile_data?.fields || [],
    faqs: initialData?.interview_meta?.faq_data?.items || [],
    photos: initialData?.interview_meta?.photos || {},
    
    participants: initialData?.interview_meta?.cast_links?.map((l: any) => {
      const isCast = !!l.cast_id;
      const staffPhotos = initialData?.interview_meta?.photos?.staff_photos || {};
      return {
        id: l.cast_id || `staff-${l.cast_name}`,
        name: l.cast_name,
        photoUrl: isCast ? '' : (staffPhotos[l.cast_name] || ''),
        type: isCast ? 'cast' : 'staff',
      };
    }) || [],
  });

  // キャストマスターデータの取得
  useEffect(() => {
    const fetchCasts = async () => {
      const result = await getAllCasts();
      if (result.success) {
        setAvailableCasts(result.casts || []);
      }
    };
    fetchCasts();
  }, []);

  // キャスト画像情報が取得できたら、participantsのキャストの画像を自動マッピングして反映
  useEffect(() => {
    if (availableCasts.length > 0) {
      setData(prev => ({
        ...prev,
        participants: prev.participants.map(p => {
          if (p.type === 'cast' && !p.photoUrl) {
            const matched = availableCasts.find(c => c.id === p.id);
            if (matched) {
              return { ...p, photoUrl: matched.photoUrl };
            }
          }
          return p;
        })
      }));
    }
  }, [availableCasts]);

  const handleSave = async () => {
    if (!data.title || !data.slug) {
      alert('タイトルとスラグは必須です');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: data.title,
        slug: data.slug,
        content: JSON.stringify(data.sections), // Keeping raw JSON in content for now or meta
        excerpt: data.excerpt,
        thumbnail_url: data.thumbnail_url,
        category: 'interview',
        status: data.status,
        author_name: data.author_name,
        seo_title: data.seo_title,
        seo_description: data.seo_description,
        tags: data.tags,
        meta: {
          article_type: data.article_type,
          area: data.area,
          series_slug: data.series_slug,
          vol_number: data.vol_number,
          seo_keywords: data.seo_keywords,
          writer_note: data.writer_note,
          dialogue_data: { sections: data.sections },
          profile_data: { fields: data.profile_fields },
          faq_data: { items: data.faqs },
          photos: {
            ...data.photos,
            staff_photos: data.participants
              .filter(p => p.type === 'staff')
              .reduce((acc, p) => ({ ...acc, [p.name]: p.photoUrl }), {}),
          },
        },
        cast_links: data.participants.map((p, idx) => ({
          cast_id: p.type === 'cast' ? p.id : null,
          cast_name: p.name,
          role: idx === 0 ? 'interviewee' : 'participant',
          display_order: idx,
        })),
      };

      let result;
      if (articleId) {
        // Update
        const articleUpdate = await updateMediaArticle(articleId, {
          title: data.title,
          slug: data.slug,
          content: data.excerpt,
          excerpt: data.excerpt,
          thumbnail_url: data.thumbnail_url,
          status: data.status,
          category: 'interview',
          target_audience: 'user',
          author_name: data.author_name,
          seo_title: data.seo_title,
          seo_description: data.seo_description,
        }, data.tags);
        
        const metaUpdate = await updateInterviewMeta(articleId, payload.meta as any, payload.cast_links as any);
        
        result = { success: articleUpdate.success && metaUpdate.success };
      } else {
        // Create
        result = await createInterviewArticle(payload as any);
      }

      if (result.success) {
        alert('保存しました！');
        router.push('/admin/interview-management');
      } else {
        alert('保存に失敗しました');
      }
    } catch (e) {
      console.error(e);
      alert('システムエラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-brand-primary/80 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/interview-management"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 hover:text-brand-accent"
          >
            <ChevronLeftIcon size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {articleId ? 'インタビューを編集' : '新規インタビュー作成'}
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">
              Interview Editor v1.0
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50">
            <EyeIcon size={18} />
            プレビュー
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-brand-accent px-6 py-2 text-sm font-bold text-white shadow-lg shadow-brand-accent/20 transition-all hover:bg-pink-600 active:scale-95 disabled:opacity-50"
          >
            <SaveIcon size={18} />
            {isSaving ? '保存中...' : '変更を保存'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 rounded-xl bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${
            activeTab === 'content' ? 'bg-white text-brand-accent shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          対話エディタ
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${
            activeTab === 'profile' ? 'bg-white text-brand-accent shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          プロフィール & FAQ
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${
            activeTab === 'settings' ? 'bg-white text-brand-accent shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          基本・SEO設定
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'content' && (
          <>
            <ParticipantManager 
              participants={data.participants} 
              onChange={(p) => setData({ ...data, participants: p })}
            />
            <DialogueEditor 
              sections={data.sections} 
              participants={data.participants}
              onChange={(s) => setData({ ...data, sections: s })}
            />
          </>
        )}

        {activeTab === 'profile' && (
          <ProfileFaqEditor 
            profileFields={data.profile_fields}
            faqs={data.faqs}
            onChange={(d) => setData({ ...data, profile_fields: d.profileFields, faqs: d.faqs })}
          />
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <label className="mb-2 block text-sm font-bold text-gray-700">インタビュータイトル</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="タイトルを入力..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-accent focus:outline-none"
                />
              </div>
              
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <label className="mb-2 block text-sm font-bold text-gray-700">導入テキスト / 抜粋</label>
                <textarea
                  value={data.excerpt}
                  onChange={(e) => setData({ ...data, excerpt: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 p-4 focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-gray-800">SEO設定</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-500">SEOタイトル</label>
                    <input
                      type="text"
                      value={data.seo_title}
                      onChange={(e) => setData({ ...data, seo_title: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-500">SEOキーワード</label>
                    <input
                      type="text"
                      value={data.seo_keywords}
                      onChange={(e) => setData({ ...data, seo_keywords: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <SettingsIcon size={16} className="text-brand-accent" />
                  掲載設定
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-500">公開状態</label>
                    <select
                      value={data.status}
                      onChange={(e) => setData({ ...data, status: e.target.value as any })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                    >
                      <option value="draft">下書き</option>
                      <option value="published">公開</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-500">URLスラグ</label>
                    <input
                      type="text"
                      value={data.slug}
                      onChange={(e) => setData({ ...data, slug: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-500">エリア</label>
                    <select
                      value={data.area}
                      onChange={(e) => setData({ ...data, area: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                    >
                      <option value="fukuoka">福岡</option>
                      <option value="yokohama">横浜</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <ImageIcon size={16} className="text-brand-accent" />
                  メイン画像
                </h3>
                <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gray-100">
                  {data.thumbnail_url ? (
                    <img src={data.thumbnail_url} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={data.thumbnail_url}
                  onChange={(e) => setData({ ...data, thumbnail_url: e.target.value })}
                  placeholder="画像URLを入力..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-brand-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
