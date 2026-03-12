import { PageData, SectionData } from '@/components/admin/news/types';
import React from 'react';

interface NewsPageRendererProps {
  page: PageData;
}

const NewsPageRenderer: React.FC<NewsPageRendererProps> = ({ page }) => {
  // Separate sections into Content and CTA
  const contentSections = page.sections.filter((s) => s.type !== 'cta');
  const ctaSections = page.sections.filter((s) => s.type === 'cta');

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
          <h1 className="mb-6 font-serif text-3xl font-black leading-tight text-slate-900 md:text-[32px]">
            {page.title}
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <time dateTime={new Date(page.updatedAt).toISOString()}>
              {new Date(page.updatedAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        {/* Lead Content (First Content Section's Description or Hero Image) */}
        <div className="article-body">
          {contentSections.map((section, idx) => (
            <SectionRenderer key={section.id} section={section} isFirst={idx === 0} />
          ))}
        </div>

        {/* Tags Section (Style from Image 1) */}
        {(page.category || (page.tags && page.tags.length > 0)) && (
          <div className="mt-16 border-t border-slate-100 pt-10">
            <h3 className="mb-6 text-[15px] font-bold leading-none text-slate-900">
              この記事が参加している募集
            </h3>

            {/* Main Tag Card (Category as main recruitment) */}
            {page.category && (
              <div className="mb-6 block">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-5 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50/20">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-[24px] font-black text-slate-400">
                      #
                    </div>
                    <span className="text-[17px] font-bold text-slate-900">{page.category}</span>
                  </div>
                  <span className="text-[13px] font-medium text-slate-400">
                    {Math.floor(Math.random() * 1000 + 100).toLocaleString()}件
                  </span>
                </div>
              </div>
            )}

            {/* Small Hashtag Buttons */}
            {page.tags && page.tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {page.tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-[15px] font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action / CTA Section - Moved to bottom */}
        {ctaSections.length > 0 && (
          <div className="mt-10 space-y-8 border-t border-slate-100 pt-10">
            {ctaSections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))}
          </div>
        )}
      </article>
    </div>
  );
};

const SectionRenderer: React.FC<{ section: SectionData; isFirst?: boolean }> = ({
  section,
  isFirst,
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
          {content.imageUrl && <img src={content.imageUrl} alt="" className={imgClass} />}
          {content.description && (
            <p className={`${pClass} text-lg font-medium italic`}>{content.description}</p>
          )}
          {content.title && <h2 className={h2Class}>{content.title}</h2>}
        </div>
      );

    case 'campaign':
      return (
        <div className="mb-12 overflow-hidden rounded-2xl border border-rose-100 bg-rose-50/30 p-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-rose-500">
            {content.subtitle || 'Information'}
          </p>
          <h3 className="mb-6 text-2xl font-black text-slate-900">{content.title}</h3>
          <p className={pClass}>{content.description}</p>
          {content.imageUrl && <img src={content.imageUrl} className={imgClass} alt="" />}
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
          <div className={pClass}>{content.description}</div>
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
                <img src={item.imageUrl} className="h-full w-full object-cover" alt="" />
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
