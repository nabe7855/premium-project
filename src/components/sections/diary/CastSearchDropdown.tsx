'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // ✅ useParams を追加
import { Search, ChevronDown } from 'lucide-react';
import { mockDiaryPosts } from '@/data/diarydata';

interface CastSearchDropdownProps {
  placeholder?: string;
  className?: string;
}

const CastSearchDropdown: React.FC<CastSearchDropdownProps> = ({
  placeholder = '推しキャストの名前で日記を探す...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCasts, setFilteredCasts] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams(); // ✅ ストアslug取得

  const slug = params?.slug as string;

  // Get unique cast names from posts
  const allCasts = Array.from(new Set(mockDiaryPosts.map((post) => post.castName))).sort();

  useEffect(() => {
    if (searchQuery) {
      const filtered = allCasts.filter((cast) =>
        cast.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredCasts(filtered);
    } else {
      setFilteredCasts(allCasts);
    }
  }, [searchQuery]);

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
    if (!slug) return; // slugがない場合は何もしない
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
        <ChevronDown
          className={`absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-400 transition-transform sm:right-3 ${isOpen ? 'rotate-180' : ''}`}
          size={16}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-pink-200 bg-white shadow-lg sm:max-h-60">
          {filteredCasts.length > 0 ? (
            <>
              <div className="border-b border-pink-100 px-3 py-2 text-xs text-gray-500 sm:text-sm">
                キャストを選択してください
              </div>
              {filteredCasts.map((castName) => {
                const postCount = mockDiaryPosts.filter(
                  (post) => post.castName === castName,
                ).length;
                return (
                  <button
                    key={castName}
                    onClick={() => handleCastSelect(castName)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-pink-50 sm:py-3"
                  >
                    <span className="text-sm text-gray-800 sm:text-base">{castName}</span>
                    <span className="text-xs text-gray-500 sm:text-sm">{postCount}件の日記</span>
                  </button>
                );
              })}
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
