import { PageData } from '@/components/admin/news/types';
import { CampaignConfig } from '@/lib/store/storeTopConfig';
import { ArrowLeft, ArrowRight, ChevronRight, Zap } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import SectionTitle from '../components/SectionTitle';

const defaultCampaigns: any[] = [
  {
    id: 1,
    title: '初回限定キャンペーン',
    desc: '全コース¥2,000 OFF！初めての方も安心してお試しいただけます。ご予約時にサイトを見たとお伝えください。',
    badge: 'Limited',
    color: 'primary',
    icon: 'Gift',
    imageUrl:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'SNSフォロー特典',
    desc: '公式Instagramをフォロー＆DMで指名料が1回無料に。最新の出勤情報や限定動画も配信中です。',
    badge: 'Campaign',
    color: 'secondary',
    icon: 'Instagram',
    imageUrl:
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    title: '深夜割スタート',
    desc: '23時以降のご予約で、アロマオイルオプションをサービス中。一日の疲れを極上の香りで癒やしませんか。',
    badge: 'NEW',
    color: 'primary',
    icon: 'Zap',
    imageUrl:
      'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=800',
  },
];

interface CampaignSectionProps {
  config?: CampaignConfig;
  newsPages?: PageData[];
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const CampaignSection: React.FC<CampaignSectionProps> = ({
  config,
  newsPages = [],
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const params = useParams();
  const router = useRouter();
  const storeSlug = params.slug as string;

  // ニュースページのソートロジック
  const sortedNewsPages = React.useMemo(() => {
    let pages = [...newsPages];
    const orderedIds = config?.orderedNewsPageIds || [];

    if (orderedIds.length > 0) {
      pages.sort((a, b) => {
        const indexA = orderedIds.indexOf(a.id);
        const indexB = orderedIds.indexOf(b.id);
        if (indexA === -1 && indexB === -1) return b.updatedAt - a.updatedAt;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    } else {
      pages.sort((a, b) => b.updatedAt - a.updatedAt);
    }
    return pages;
  }, [newsPages, config?.orderedNewsPageIds]);

  const handleTextUpdate = (key: string, value: string) => {
    if (onUpdate) {
      onUpdate('campaign', key, value);
    }
  };

  const moveOrder = (index: number, direction: 'prev' | 'next') => {
    if (!onUpdate) return;
    const currentOrder = sortedNewsPages.map((p) => p.id);
    const newIndex = direction === 'prev' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentOrder.length) return;

    const newOrder = [...currentOrder];
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    onUpdate('campaign', 'orderedNewsPageIds', newOrder);
  };

  return (
    <section
      id="campaign"
      className="bg-primary-50/50 border-primary-100/50 border-y py-16 transition-all duration-300 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="group/title relative">
          <SectionTitle
            en={config?.subHeading || 'News & Campaigns'}
            ja={config?.heading || '最新情報・キャンペーン'}
          />
          {isEditing && (
            <div className="absolute right-0 top-0 flex gap-2">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleTextUpdate('heading', e.currentTarget.innerText)}
                className="hidden"
              />
              <div className="rounded border bg-white/80 px-2 py-1 text-[10px] text-slate-400">
                表示テキストは直接クリックして編集
              </div>
            </div>
          )}
        </div>

        <div className="flex snap-x gap-8 overflow-x-auto px-6 pb-8 scrollbar-hide md:grid md:grid-cols-3 md:px-0">
          {sortedNewsPages.map((page: PageData, idx: number) => (
            <div
              key={page.id}
              className="border-primary-100/20 group relative flex min-w-[300px] snap-center flex-col overflow-hidden rounded-[2.5rem] border bg-white shadow-sm transition-all duration-500 hover:shadow-xl md:min-w-0"
            >
              {isEditing && (
                <div className="absolute right-4 top-4 z-50 flex gap-2">
                  <button
                    onClick={() => moveOrder(idx, 'prev')}
                    disabled={idx === 0}
                    className="rounded-full bg-white/90 p-2 text-slate-600 shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    onClick={() => moveOrder(idx, 'next')}
                    disabled={idx === sortedNewsPages.length - 1}
                    className="rounded-full bg-white/90 p-2 text-slate-600 shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              <div className="relative h-48 overflow-hidden md:h-56">
                <NextImage
                  src={
                    page.thumbnailUrl ||
                    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800'
                  }
                  alt={page.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute left-4 top-4">
                  <span
                    className={`bg-primary-500 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg`}
                  >
                    {page.status === 'published' ? 'NEW' : 'DRAFT'}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 rounded-xl bg-white/20 p-2 text-white backdrop-blur-md">
                  <Zap size={20} />
                </div>
              </div>

              <div className="flex flex-grow flex-col p-6 text-left md:p-8">
                <h3
                  className={`mb-4 font-serif text-lg font-bold leading-snug tracking-wide text-slate-800 md:text-xl`}
                >
                  {page.title}
                </h3>
                <p
                  className={`mb-6 line-clamp-3 flex-grow text-xs leading-relaxed text-slate-500 md:text-sm`}
                >
                  {page.shortDescription || '詳細を見る'}
                </p>
                {!isEditing && (
                  <Link
                    href={`/store/${storeSlug}/news/${page.slug}`}
                    className="flex items-center justify-between border-t border-neutral-50 pt-4"
                  >
                    <span className="text-primary-400 group-hover:text-primary-600 text-[10px] font-bold uppercase tracking-widest transition-colors">
                      Read More
                    </span>
                    <div className="bg-primary-50 rounded-full p-2 transition-transform group-hover:translate-x-1">
                      <ChevronRight size={16} className="text-primary-500" />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ))}

          {isEditing && sortedNewsPages.length === 0 && (
            <div className="border-primary-200 col-span-3 rounded-[2.5rem] border-2 border-dashed p-12 text-center">
              <p className="font-bold text-slate-400">
                ニュース管理ページで作成・公開されたページがここに表示されます。
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CampaignSection;
