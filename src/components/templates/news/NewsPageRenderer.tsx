import { PageData, SectionData } from '@/components/admin/news/types';
import { RichTextContent } from '@/lib/utils/news-renderer';
import React from 'react';

interface NewsPageRendererProps {
  page: PageData;
  storeSlug?: string;
}

function resolveImageAlts(pageTitle: string, sections: SectionData[]): Map<string, string> {
  const altMap = new Map<string, string>();
  let imageCounter = 0;

  sections.forEach((sec) => {
    const { type, content } = sec;
    if ((type === 'hero' || type === 'campaign') && content.imageUrl) {
      const customAlt = content.alt?.trim();
      let finalAlt = '';
      if (customAlt) {
        finalAlt = customAlt;
      } else {
        imageCounter += 1;
        finalAlt = pageTitle ? (imageCounter === 1 ? pageTitle : `${pageTitle} (${imageCounter})`) : '';
      }
      altMap.set(`${sec.id}-main`, finalAlt);
    } else if (type === 'gallery' && Array.isArray(content.items)) {
      content.items.forEach((item: any, idx: number) => {
        if (item.imageUrl) {
          const customAlt = item.alt?.trim() || content.alt?.trim();
          let finalAlt = '';
          if (customAlt) {
            finalAlt = customAlt;
          } else {
            imageCounter += 1;
            finalAlt = pageTitle ? (imageCounter === 1 ? pageTitle : `${pageTitle} (${imageCounter})`) : '';
          }
          altMap.set(`${sec.id}-item-${idx}`, finalAlt);
        }
      });
    }
  });

  return altMap;
}

const NewsPageRenderer: React.FC<NewsPageRendererProps> = ({ page, storeSlug }) => {
  // Separate sections into Content and CTA
  const effectiveSections = (storeSlug && (page.storeSettings?.[storeSlug] as any)?.sections) || page.sections || [];
  const contentSections = effectiveSections.filter((s: any) => s.type !== 'cta');
  const ctaSections = effectiveSections.filter((s: any) => s.type === 'cta');
  const altMap = resolveImageAlts(page.title || '', effectiveSections);

  return (
    <div className="w-full bg-white pb-10 pt-10">
      <article className="mx-auto max-w-[680px] px-6">
        {/* Header Hierarchy: Title -> Date -> Category */}
        <header className="mb-12">
          {page.category && (
            <span className="mb-4 inline-block text-sm font-bold tracking-wider text-rose-500">
              {page.category}
            </span>
          )}
          <p className="mb-2 text-[10px] sm:text-xs text-slate-400 font-normal">
            女性用風俗 ストロベリーボーイズ{storeSlug === 'fukuoka' ? '福岡（博多・天神・中洲）' : '横浜（みなとみらい・関内）'} | お店ニュース
          </p>
          <h1 className="mb-6 font-serif text-3xl font-black leading-tight text-slate-900 md:text-[32px]">
            {page.title}
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <time dateTime={new Date(storeSlug && page.storeSettings?.[storeSlug]?.publishedAt ? page.storeSettings[storeSlug].publishedAt : page.updatedAt).toISOString()}>
              {new Date(storeSlug && page.storeSettings?.[storeSlug]?.publishedAt ? page.storeSettings[storeSlug].publishedAt : page.updatedAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        {/* Lead Content (First Content Section's Description or Hero Image) */}
        <div className="article-body">
          {contentSections.map((section: any, idx: number) => (
            <SectionRenderer key={section.id} section={section} isFirst={idx === 0} altMap={altMap} pageTitle={page.title} />
          ))}
        </div>

        {/* 🚀 店舗ニュース用 SEO集客おすすめタグカード (店舗に応じた厳密分離) */}
        {(() => {
          const isFukuoka = storeSlug === 'fukuoka';
          const seoTags = isFukuoka ? [
            { label: '＃福岡女性用風俗', href: '/store/fukuoka/area/hakata' },
            { label: '＃福岡女風', href: '/store/fukuoka/area/tenjin' },
            { label: '＃博多女風', href: '/store/fukuoka/area/hakata' },
            { label: '＃天神女性用風俗', href: '/store/fukuoka/area/tenjin' },
            { label: '＃博多駅ホテル出張', href: '/store/fukuoka/area/hakata' },
            { label: '＃福岡女風料金相場', href: '/store/fukuoka/price' },
            { label: '＃女風バレない', href: '/store/fukuoka/first-time' },
          ] : [
            { label: '＃横浜女性用風俗', href: '/store/yokohama/area/kannai' },
            { label: '＃横浜女風', href: '/store/yokohama/area/minatomirai' },
            { label: '＃関内女風', href: '/store/yokohama/area/kannai' },
            { label: '＃みなとみらい女性用風俗', href: '/store/yokohama/area/minatomirai' },
            { label: '＃関内ホテル出張', href: '/store/yokohama/area/kannai' },
            { label: '＃横浜女風料金相場', href: '/store/yokohama/price' },
            { label: '＃女風バレない', href: '/store/yokohama/first-time' },
          ];

          return (
            <div className="mt-12 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/60 to-pink-50/30 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-rose-600">
                <span className="text-base">✨</span>
                <span>{isFukuoka ? '福岡店' : '横浜店'}注目の関連検索キーワード</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                {seoTags.map((tagObj, idx) => (
                  <a
                    key={idx}
                    href={tagObj.href}
                    className={`rounded-full px-3.5 py-1.5 transition-all duration-200 ${
                      idx < 2
                        ? 'bg-rose-500 text-white font-bold shadow-xs hover:bg-rose-600'
                        : 'bg-white text-slate-700 font-medium border border-rose-200 hover:border-rose-400 hover:text-rose-600'
                    }`}
                  >
                    {tagObj.label}
                  </a>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Action / CTA Section - Moved to bottom */}
        {ctaSections.length > 0 && (
          <div className="mt-10 space-y-8 border-t border-slate-100 pt-10">
            {ctaSections.map((section: any) => (
              <SectionRenderer key={section.id} section={section} altMap={altMap} />
            ))}
          </div>
        )}
      </article>
    </div>
  );
};

const SectionRenderer: React.FC<{ section: SectionData; isFirst?: boolean; altMap: Map<string, string>; pageTitle?: string }> = ({
  section,
  isFirst,
  altMap,
  pageTitle,
}) => {
  const { type, content } = section;

  // Typography Constants
  const pClass =
    'text-[16px] leading-[1.9] tracking-[0.02em] text-slate-700 mb-6 whitespace-pre-wrap';
  const h2Class = 'text-[24px] font-bold leading-snug text-slate-900 mt-12 mb-4';
  const imgClass = 'my-8 w-full rounded-xl object-cover shadow-sm';

  switch (type) {
    case 'hero':
      return (
        <div className="mb-12">
          {content.imageUrl && (
            <img
              src={content.imageUrl}
              alt={altMap.get(`${section.id}-main`) || ''}
              className={imgClass}
            />
          )}
          {content.description && (
            <RichTextContent
              content={content.description}
              className={`${pClass} text-lg font-medium italic`}
            />
          )}
          {content.title && content.title.replace(/[「」『』\s]/g, '') !== pageTitle?.replace(/[「」『』\s]/g, '') && <h2 className={h2Class}>{content.title}</h2>}
        </div>
      );

    case 'campaign':
      return (
        <div className="mb-12 overflow-hidden rounded-2xl border border-rose-100 bg-rose-50/30 p-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-rose-500">
            {content.subtitle || 'Information'}
          </p>
          <h3 className="mb-6 text-2xl font-black text-slate-900">{content.title}</h3>
          <RichTextContent content={content.description || ''} className={pClass} />
          {content.imageUrl && (
            <img
              src={content.imageUrl}
              className={imgClass}
              alt={altMap.get(`${section.id}-main`) || ''}
            />
          )}
          {content.buttonText && (
            <button className="mt-4 rounded-full bg-slate-900 px-10 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
              {content.buttonText}
            </button>
          )}
        </div>
      );

    case 'text_block':
      return (
        <div className="mb-8">
          {content.title && <h2 className={h2Class}>{content.title}</h2>}
          <RichTextContent content={content.description || ''} className={pClass} />
        </div>
      );

    case 'cta':
      return (
        <div className="rounded-3xl bg-slate-900 p-8 text-center shadow-2xl md:p-12">
          <h2 className="mb-6 text-3xl font-black text-white md:text-4xl">{content.title}</h2>
          <p className="mb-10 text-lg font-medium text-slate-400">{content.subtitle}</p>
          {content.buttonText && (
            <button className="rounded-full bg-rose-600 px-12 py-5 text-xl font-black text-white shadow-xl transition-all hover:scale-105 hover:bg-white hover:text-slate-900">
              {content.buttonText}
            </button>
          )}
        </div>
      );

    case 'gallery':
      return (
        <div className="my-12">
          <h2 className={h2Class}>{content.title || 'Gallery'}</h2>
          <div className="grid grid-cols-2 gap-4">
            {(content.items || []).map((item: any, i: number) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl">
                <img
                  src={item.imageUrl}
                  className="h-full w-full object-cover"
                  alt={altMap.get(`${section.id}-item-${i}`) || ''}
                />
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default NewsPageRenderer;
