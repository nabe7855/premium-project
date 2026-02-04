import { PageData, SectionData } from '@/components/admin/news/types';
import React from 'react';

interface NewsPageRendererProps {
  page: PageData;
}

const NewsPageRenderer: React.FC<NewsPageRendererProps> = ({ page }) => {
  return (
    <div className="w-full bg-white">
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
};

const SectionRenderer: React.FC<{ section: SectionData }> = ({ section }) => {
  const { type, content } = section;

  switch (type) {
    case 'hero':
      return (
        <section className="relative flex h-[500px] items-center justify-center overflow-hidden text-center md:h-[700px]">
          {content.imageUrl && (
            <img
              src={content.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
          <div className="relative z-10 max-w-5xl px-8">
            <h1
              className="mb-6 font-black leading-[1.1] text-white"
              style={{
                fontSize: `${content.titleStyle?.size || 64}px`,
                transform: `translate(${(content.titleStyle?.x || 50) - 50}%, ${(content.titleStyle?.y || 35) - 35}%)`,
              }}
            >
              {content.title}
            </h1>
            <p
              className="mb-12 font-medium uppercase tracking-[0.2em] text-white/95"
              style={{
                fontSize: `${content.subtitleStyle?.size || 22}px`,
                transform: `translate(${(content.subtitleStyle?.x || 50) - 50}%, ${(content.subtitleStyle?.y || 50) - 50}%)`,
              }}
            >
              {content.subtitle}
            </p>
            {content.buttonText && (
              <div
                style={{
                  transform: `translate(${(content.buttonStyle?.x || 50) - 50}%, ${(content.buttonStyle?.y || 72) - 72}%)`,
                }}
              >
                <button className="rounded-full bg-white px-14 py-5 font-black text-slate-900 shadow-2xl transition-transform hover:scale-105">
                  {content.buttonText}
                </button>
              </div>
            )}
          </div>
        </section>
      );

    case 'campaign':
      return (
        <section className="bg-white px-10 py-32">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-20 lg:flex-row">
            <div className="flex-1 text-left">
              <p className="mb-6 border-l-4 border-rose-500 pl-4 text-xs font-black uppercase tracking-[0.4em] text-rose-500">
                {content.subtitle || 'Limited Campaign'}
              </p>
              <h2 className="mb-10 text-5xl font-black leading-tight tracking-tighter text-slate-900 lg:text-6xl">
                {content.title}
              </h2>
              <p className="mb-12 whitespace-pre-wrap text-xl font-medium leading-loose text-slate-500">
                {content.description}
              </p>
              {content.buttonText && (
                <button className="rounded-[1.5rem] bg-slate-900 px-12 py-5 font-black text-white shadow-2xl transition-all hover:bg-rose-600">
                  {content.buttonText}
                </button>
              )}
            </div>
            <div className="aspect-[4/5] w-full flex-1 overflow-hidden rounded-[4rem] shadow-2xl lg:rotate-2">
              <img
                src={
                  content.imageUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622'
                }
                className="h-full w-full object-cover"
                alt=""
              />
            </div>
          </div>
        </section>
      );

    case 'text_block':
      return (
        <section className="bg-white px-10 py-32">
          <div className="mx-auto max-w-4xl text-center md:text-left">
            {content.title && (
              <div className="mb-14">
                <h2 className="mb-6 text-5xl font-black leading-tight tracking-tight text-slate-900">
                  {content.title}
                </h2>
                <div className="h-2 w-24 rounded-full bg-rose-500" />
              </div>
            )}
            <div className="whitespace-pre-wrap text-2xl font-light italic leading-[2] tracking-wide text-slate-500">
              {content.description}
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="relative overflow-hidden bg-slate-900 px-10 py-40">
          <div className="absolute left-0 top-0 h-full w-full">
            <div className="absolute right-0 top-0 -mr-96 -mt-96 h-[800px] w-[800px] animate-pulse rounded-full bg-rose-600 opacity-20 blur-[180px]" />
            <div className="absolute bottom-0 left-0 -mb-48 -ml-48 h-[600px] w-[600px] rounded-full bg-rose-900 opacity-20 blur-[150px]" />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h2 className="mb-10 text-6xl font-black leading-tight tracking-tighter text-white drop-shadow-2xl md:text-7xl">
              {content.title}
            </h2>
            <p className="mx-auto mb-20 max-w-3xl text-2xl font-medium leading-relaxed tracking-wide text-slate-400">
              {content.subtitle}
            </p>
            {content.buttonText && (
              <button className="rounded-full bg-rose-600 px-20 py-7 text-2xl font-black text-white shadow-2xl transition-all hover:scale-105 hover:bg-white hover:text-slate-900 active:scale-95">
                {content.buttonText}
              </button>
            )}
          </div>
        </section>
      );

    case 'gallery':
      return (
        <section className="bg-slate-900 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-24 text-center text-4xl font-black uppercase italic tracking-[0.4em] text-white opacity-90">
              {content.title || 'Visual Narrative'}
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
              {(content.items || []).map((item: any, i: number) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-[2.5rem] shadow-2xl ${i % 3 === 0 ? 'md:col-span-2 md:row-span-2' : 'aspect-square'}`}
                >
                  <img src={item.imageUrl} className="h-full w-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
};

export default NewsPageRenderer;
