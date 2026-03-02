'use client';
import { supabase } from '@/lib/supabaseClient';
import { ChevronDown, Loader2, Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

interface CastSearchDropdownProps {
  placeholder?: string;
  className?: string;
}

interface CastInfo {
  name: string;
  postCount: number;
}

const CastSearchDropdown: React.FC<CastSearchDropdownProps> = ({
  placeholder = '推しキャストの名前で日記を探す...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allCasts, setAllCasts] = useState<CastInfo[]>([]);
  const [filteredCasts, setFilteredCasts] = useState<CastInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();

  const slug = params?.slug as string;

  useEffect(() => {
    const fetchCasts = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select('id')
          .eq('slug', slug)
          .single();

        if (storeError || !store) throw storeError;

        const { data: castMemberships, error: castError } = await supabase
          .from('cast_store_memberships')
          .select(
            `
            casts (
              name,
              blogs ( id )
            )
          `,
          )
          .eq('store_id', store.id);

        if (castError) throw castError;

        const combinedCasts: Record<string, number> = {};

        castMemberships?.forEach((membership: any) => {
          const castArr = Array.isArray(membership.casts) ? membership.casts : [membership.casts];

          castArr.forEach((cast: any) => {
            if (!cast || !cast.name) return;
            const blogs = Array.isArray(cast.blogs) ? cast.blogs : [];
            if (combinedCasts[cast.name]) {
              combinedCasts[cast.name] += blogs.length;
            } else {
              combinedCasts[cast.name] = blogs.length;
            }
          });
        });

        const casts = Object.keys(combinedCasts)
          .map((name) => ({
            name,
            postCount: combinedCasts[name],
          }))
          .sort((a, b) => b.postCount - a.postCount || a.name.localeCompare(b.name));

        setAllCasts(casts);
        setFilteredCasts(casts);
      } catch (e) {
        console.error('Failed to fetch casts for dropdown:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCasts();
  }, [slug]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = allCasts.filter((cast) =>
        cast.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredCasts(filtered);
    } else {
      setFilteredCasts(allCasts);
    }
  }, [searchQuery, allCasts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCastSelect = (castName: string) => {
    if (!slug) return;
    router.push(`/store/${slug}/diary/cast/${encodeURIComponent(castName)}`);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search
          className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400 sm:left-3"
          size={16}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-pink-200 bg-white py-2 pl-8 pr-8 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 sm:py-3 sm:pl-10 sm:pr-10 sm:text-base"
        />
        <div
          className={`absolute right-2 top-1/2 -translate-y-1/2 transform transition-transform sm:right-3 ${isOpen ? 'rotate-180' : ''}`}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-pink-200 bg-white shadow-lg sm:max-h-60">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-3 py-4 text-center text-sm text-gray-500 sm:text-base">
              <Loader2 size={16} className="animate-spin" /> 読み込み中...
            </div>
          ) : filteredCasts.length > 0 ? (
            <>
              <div className="sticky top-0 border-b border-pink-100 bg-pink-50 px-3 py-2 text-xs text-gray-500 sm:text-sm">
                キャストを選択してください
              </div>
              {filteredCasts.map((cast) => (
                <button
                  key={cast.name}
                  onClick={() => handleCastSelect(cast.name)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-pink-100 sm:py-3"
                >
                  <span className="text-sm font-medium text-gray-800 sm:text-base">
                    {cast.name}
                  </span>
                  <span className="rounded-full border border-pink-100 bg-white px-2 py-0.5 text-xs text-gray-500 sm:text-sm">
                    {cast.postCount}件の日記
                  </span>
                </button>
              ))}
            </>
          ) : (
            <div className="px-3 py-4 text-center text-sm text-gray-500 sm:text-base">
              該当するキャストが見つかりません
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CastSearchDropdown;
