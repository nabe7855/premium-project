'use client';

import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface DictionarySearchProps {
  articles: any[];
}

export default function DictionarySearch({ articles }: DictionarySearchProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    return articles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          (a.excerpt && a.excerpt.toLowerCase().includes(query.toLowerCase())),
      )
      .slice(0, 10);
  }, [query, articles]);

  return (
    <div className="relative mx-auto max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="気になる言葉を入力（例：流れ、指名、料金）"
          className="h-14 w-full rounded-2xl border-none bg-white px-14 text-[15px] shadow-xl shadow-gray-200/50 transition-shadow focus:ring-2 focus:ring-pink-200"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* 検索結果ドロップダウン */}
      {query && (
        <div className="absolute left-0 right-0 top-full z-50 mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
          {filtered.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {filtered.map((article) => (
                <Link
                  key={article.id}
                  href={`/amolab/jiten/words/${article.slug}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                  onClick={() => setQuery('')}
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
                    <Search size={14} />
                  </div>
                  <div className="text-left">
                    <div className="text-[14px] font-bold text-gray-800">{article.title}</div>
                    {article.excerpt && (
                      <div className="line-clamp-1 text-[11px] text-gray-400">
                        {article.excerpt}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-10 text-center text-[14px] text-gray-400">
              「{query}」に一致する用語は見つかりませんでした。
            </div>
          )}
        </div>
      )}
    </div>
  );
}
