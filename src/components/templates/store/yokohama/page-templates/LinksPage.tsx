
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { StoreLinksConfig } from '@/lib/store/storeLinksConfig';

interface LinksPageProps {
  slug: string;
  storeName: string;
  links: any[];
  config: StoreLinksConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

export default function LinksPage({
  slug,
  storeName,
  links,
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}: LinksPageProps) {
  const displayStoreName = storeName.replace('店', '');

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/10 blur-[100px]" />
          <div className="absolute right-1/4 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-amber-500/10 blur-[100px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 backdrop-blur-sm">
            <span 
              contentEditable={isEditing}
              onBlur={(e) => onUpdate?.('hero', 'subtitle', e.currentTarget.textContent)}
              suppressContentEditableWarning
              className="text-xs font-bold uppercase tracking-widest text-rose-300 outline-none"
            >
              {config.hero.subtitle || `${storeName} Partner Sites`}
            </span>
          </div>
          <h1 
            contentEditable={isEditing}
            onBlur={(e) => onUpdate?.('hero', 'title', e.currentTarget.innerText)}
            suppressContentEditableWarning
            className="mb-6 bg-gradient-to-br from-white via-rose-100 to-amber-200 bg-clip-text font-serif text-4xl font-black tracking-tight text-transparent outline-none sm:text-6xl"
          >
            {config.hero.title || (isEditing ? 'おすすめパートナーサイト' : `${displayStoreName}おすすめパートナーサイト`)}
          </h1>
          <p 
            contentEditable={isEditing}
            onBlur={(e) => onUpdate?.('hero', 'description', e.currentTarget.innerText)}
            suppressContentEditableWarning
            className="mx-auto max-w-2xl text-base leading-relaxed text-slate-400 outline-none sm:text-lg"
          >
            {config.hero.description || (isEditing ? 'テキストを入力してください' : `ストロベリーボーイズ${displayStoreName}店が厳選した、信頼できる女性用風俗情報サイト・求人サイト・関連メディアをご紹介します。`)}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {links.length} サイト掲載中
            </div>
          </div>
        </div>
      </div>

      {/* Back link */}
      {!isEditing && (
        <div className="container mx-auto px-4 pb-4">
          <Link
            href={`/store/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-white"
          >
            ← {storeName} トップへ戻る
          </Link>
        </div>
      )}

      {/* Partner Links by Category */}
      <main className="container mx-auto px-4 pb-24">
        {links.length === 0 ? (
          <div className="py-24 text-center text-slate-500">
            <p className="text-lg">現在、掲載中のサイトはありません。</p>
          </div>
        ) : (
          <div className="space-y-20">
            {config.categories.filter(c => c.isVisible !== false).map((cat) => {
              const catLinks = links.filter((l: any) => l.category === cat.id);
              if (catLinks.length === 0 && !isEditing) return null;
              
              return (
                <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
                  <div className="mb-10 flex flex-col items-center text-center sm:flex-row sm:text-left">
                    <div>
                      <h2
                        id={`cat-${cat.id}`}
                        contentEditable={isEditing}
                        onBlur={(e) => {
                          const newCategories = config.categories.map((c) =>
                            c.id === cat.id ? { ...c, label: e.currentTarget.textContent || c.label } : c
                          );
                          onUpdate?.('categories', 'items', newCategories);
                        }}
                        suppressContentEditableWarning
                        className="mb-1 font-serif text-2xl font-bold tracking-tight text-white outline-none sm:text-3xl"
                      >
                        {cat.label}
                      </h2>
                      <p
                        contentEditable={isEditing}
                        onBlur={(e) => {
                          const newCategories = config.categories.map((c) =>
                            c.id === cat.id ? { ...c, desc: e.currentTarget.textContent || c.desc } : c
                          );
                          onUpdate?.('categories', 'items', newCategories);
                        }}
                        suppressContentEditableWarning
                        className="text-sm text-slate-500 outline-none"
                      >
                        {cat.desc}
                      </p>
                    </div>
                    <div className="ml-auto hidden h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent sm:ml-6 sm:block" />

                    {isEditing && (
                      <div className="ml-4 flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newCategories = config.categories.map((c) =>
                              c.id === cat.id ? { ...c, isVisible: !c.isVisible } : c
                            );
                            onUpdate?.('categories', 'items', newCategories);
                          }}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                            cat.isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {cat.isVisible ? '表示中' : '非表示'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {catLinks.map((link: any, index: number) => (
                      <a
                        key={link.id}
                        href={isEditing ? undefined : link.site_url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/5 shadow-xl ring-1 ring-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/30 hover:bg-white/10 hover:shadow-rose-500/10"
                      >
                        <div className="relative aspect-[16/7] w-full overflow-hidden bg-slate-900/50">
                          {/* Blurred background for inconsistent aspect ratios */}
                          {link.banner_url && (
                             <div 
                               className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl scale-110 grayscale-[30%]"
                               style={{ backgroundImage: `url(${link.banner_url})` }}
                             />
                           )}

                          {link.banner_url ? (
                            <Image
                              src={link.banner_url}
                              alt={`${link.site_name} バナー`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="relative z-10 h-full w-full object-contain p-2 opacity-95 transition-transform duration-500 group-hover:scale-105"
                              priority={index < 3}
                              unoptimized
                            />
                          ) : (
                            <div className="flex aspect-[16/7] w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                              <span className="text-4xl opacity-40">🔗</span>
                            </div>
                          )}

                          {isEditing && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold backdrop-blur-md">
                                バナー変更
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="font-bold text-white group-hover:text-rose-200 transition-colors">
                            {link.site_name}
                          </h3>
                          {link.description && (
                            <p className="mt-2 mb-3 flex-1 text-sm leading-relaxed text-slate-400 line-clamp-2">
                              {link.description}
                            </p>
                          )}
                          <div className="mt-auto pt-2 flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="truncate">{link.site_url.replace(/^https?:\/\//, '')}</span>
                          </div>
                        </div>

                        {/* Hover accent line */}
                        <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-rose-500 to-amber-500 transition-transform duration-300 group-hover:scale-x-100" />
                      </a>
                    ))}
                    
                    {isEditing && (
                      <button className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-700 bg-gray-900/40 transition-colors hover:bg-gray-900/60 hover:border-brand-accent/50 group">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent/20 text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all">
                          <span className="text-2xl">+</span>
                        </div>
                        <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300">
                          リンクを追加
                        </span>
                      </button>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
