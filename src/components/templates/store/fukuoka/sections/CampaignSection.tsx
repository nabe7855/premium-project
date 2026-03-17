import { PageData } from '@/components/admin/news/types';
import { CampaignConfig } from '@/lib/store/storeTopConfig';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
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
      <div className="mx-auto max-w-4xl px-4">
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

        <div className="my-8 flex flex-col items-center gap-1 md:my-10">
          <div className="h-px w-full max-w-[80%] bg-primary/50"></div>
          <div className="h-px w-full max-w-[80%] bg-primary/50"></div>
        </div>

        <div className="px-2 md:px-8">
          <ul className="flex flex-col">
            {sortedNewsPages.slice(0, 5).map((page: PageData, idx: number) => (
              <li
                key={page.id}
                className="group relative flex items-center justify-between border-b border-slate-300 py-4 transition-colors hover:bg-white/50"
              >
                {isEditing && (
                  <div className="absolute -left-12 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-1">
                    <button
                      onClick={() => moveOrder(idx, 'prev')}
                      disabled={idx === 0}
                      className="rounded bg-white p-1 text-slate-600 shadow transition-transform hover:scale-110 disabled:opacity-50"
                    >
                      <ArrowLeft size={14} className="rotate-90" />
                    </button>
                    <button
                      onClick={() => moveOrder(idx, 'next')}
                      disabled={idx === sortedNewsPages.length - 1}
                      className="rounded bg-white p-1 text-slate-600 shadow transition-transform hover:scale-110 disabled:opacity-50"
                    >
                      <ArrowRight size={14} className="rotate-90" />
                    </button>
                  </div>
                )}

                <Link
                  href={`/store/${storeSlug}/news/${page.slug}`}
                  className="flex w-full min-w-0 items-center justify-between gap-4 pr-4"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md shadow-sm md:h-20 md:w-20">
                        <NextImage
                          src={
                            page.thumbnailUrl ||
                            'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=200'
                          }
                          alt={page.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="80px"
                        />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <time className="text-xs text-slate-700">
                        {new Date(page.updatedAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </time>
                      <span className="rounded-full border border-green-600 bg-white px-3 py-0.5 text-[10px] font-bold text-green-700">
                        お知らせ
                      </span>
                    </div>
                    <h3 className="truncate font-bold text-slate-800 md:text-lg">{page.title}</h3>
                  </div>
                  <ChevronRight size={20} className="group-hover:text-primary-600 text-slate-600" />
                </Link>
              </li>
            ))}
          </ul>

          {isEditing && sortedNewsPages.length === 0 && (
            <div className="border-primary-200 rounded-[1rem] border-2 border-dashed p-12 text-center">
              <p className="font-bold text-slate-600">
                ニュース管理ページで作成・公開されたページがここに表示されます。
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href={`/store/${storeSlug}/news`}
              className="inline-block rounded-full bg-[#006699] px-10 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 md:text-base"
            >
              すべてを見る
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignSection;
