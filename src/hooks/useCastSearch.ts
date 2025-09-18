'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Cast, ScoredCast } from '@/types/cast';
import { getCastsByStoreSlug } from '@/lib/getCastsByStoreSlug';
import { getRecommendedCasts } from '@/utils/compatibilityCalculator';

type SortOption = 'default' | 'reviewCount' | 'newest' | 'todayAvailable';

interface UseCastSearchOptions {
  resetFiltersForDiagnosis?: boolean;
  storeSlug?: string;
}

export const useCastSearch = (options: UseCastSearchOptions = {}) => {
  const { storeSlug } = options;
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollPositionRef = useRef<number>(0);

  const isDiagnosisResult = !!(
    searchParams.get('mbti') ||
    searchParams.get('animalType') ||
    searchParams.get('loveStyles')
  );
  const shouldResetFilters =
    isDiagnosisResult && options.resetFiltersForDiagnosis !== false;

  // ✅ State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    shouldResetFilters
      ? []
      : searchParams.get('tags')?.split(',').filter(Boolean) || []
  );
  const [ageRange, setAgeRange] = useState<[number, number]>([
    shouldResetFilters ? 20 : parseInt(searchParams.get('ageMin') || '20'),
    shouldResetFilters ? 50 : parseInt(searchParams.get('ageMax') || '50'),
  ]);
  const [sortBy, setSortBy] = useState<SortOption>(
    shouldResetFilters
      ? 'default'
      : (searchParams.get('sort') as SortOption) || 'default'
  );
  const [selectedMBTI, setSelectedMBTI] = useState(
    shouldResetFilters ? '' : searchParams.get('mbti') || ''
  );
  const [selectedFaceTypes, setSelectedFaceTypes] = useState<string[]>(
    shouldResetFilters
      ? []
      : searchParams.get('faceTypes')?.split(',').filter(Boolean) || []
  );

  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 DBからキャスト取得
  useEffect(() => {
    const fetchCasts = async () => {
      try {
        setIsLoading(true);
        if (!storeSlug) {
          console.warn('⚠️ storeSlug が指定されていません');
          setCasts([]);
          return;
        }

        const castsData = await getCastsByStoreSlug(storeSlug);

        // 在籍中だけに絞る
        const activeCasts = (castsData ?? []).filter(
          (c) => c.isActive === true   // ✅ 修正
        );

        setCasts(activeCasts);
      } catch (error) {
        console.error('❌ キャストデータの取得に失敗:', error);
        setCasts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCasts();
  }, [storeSlug]);

  // スクロール位置保持
  const saveScrollPosition = () => {
    scrollPositionRef.current = window.scrollY;
  };

  const restoreScrollPosition = () => {
    setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, 0);
  };

  // 🔹 フィルタリング & ソート
  const filteredAndSortedCasts: (Cast | ScoredCast)[] = useMemo(() => {
    if (!Array.isArray(casts)) return [];

    if (isDiagnosisResult) {
      const userMBTI = searchParams.get('mbti') || '';
      const userAnimal = searchParams.get('animalType') || '';
      const userLoveStyle = searchParams.get('loveStyles') || '';

      // ✅ ScoredCast[] を返す
      return getRecommendedCasts(casts, userMBTI, userAnimal, userLoveStyle);
    }

    // 通常検索
    let filtered = casts.filter((cast) => {
      const matchesSearch =
        !searchTerm ||
        cast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cast.catchCopy?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => cast.tags?.includes(tag));
      const matchesAge =
        cast.age !== undefined &&
        cast.age >= ageRange[0] &&
        cast.age <= ageRange[1];
      const matchesMBTI = !selectedMBTI || cast.mbtiType === selectedMBTI;
      const matchesFaceType =
        selectedFaceTypes.length === 0 ||
        selectedFaceTypes.some((type) => cast.faceType?.includes(type));

      return (
        matchesSearch &&
        matchesTags &&
        matchesAge &&
        matchesMBTI &&
        matchesFaceType
      );
    });

    // ソート処理
    switch (sortBy) {
      case 'reviewCount':
        filtered = filtered.sort(
          (a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
        );
        break;
      case 'newest':
        filtered = filtered.sort((a, b) =>
          (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
        );
        break;
      case 'todayAvailable':
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.sort((a, b) => {
          const aAvailable = (a.availability?.[today]?.length ?? 0) > 0;
          const bAvailable = (b.availability?.[today]?.length ?? 0) > 0;
          if (aAvailable && !bAvailable) return -1;
          if (!aAvailable && bAvailable) return 1;
          return 0;
        });
        break;
      default:
        filtered = filtered.sort(
          (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
        );
        break;
    }

    return filtered;
  }, [
    casts,
    searchTerm,
    selectedTags,
    ageRange,
    sortBy,
    selectedMBTI,
    selectedFaceTypes,
    isDiagnosisResult,
  ]);

  // 🔹 URL 更新
  const updateSearchParams = (updates: Record<string, string | null>) => {
    saveScrollPosition();
    const params = new URLSearchParams(searchParams.toString());

    const diagnosisParams = ['mbti', 'animalType', 'loveStyles'];
    const currentDiagnosisParams: Record<string, string> = {};
    diagnosisParams.forEach((param) => {
      const value = params.get(param);
      if (value) currentDiagnosisParams[param] = value;
    });

    Object.entries(updates).forEach(([key, value]) => {
      value === null || value === ''
        ? params.delete(key)
        : params.set(key, value);
    });

    Object.entries(currentDiagnosisParams).forEach(([key, value]) => {
      params.set(key, value);
    });

    router.push(`?${params.toString()}`, { scroll: false });
    restoreScrollPosition();
  };

  const handleCastSelect = (cast: Cast) => {
    router.push(`/store/${storeSlug}/cast/${cast.id}`);
  };

  const toggleFavorite = (castId: string) => {
    setFavorites((prev) =>
      prev.includes(castId)
        ? prev.filter((id) => id !== castId)
        : [...prev, castId]
    );
  };

  return {
    searchTerm,
    selectedTags,
    ageRange,
    sortBy,
    selectedMBTI,
    selectedFaceTypes,
    showFilters,
    favorites,
    filteredAndSortedCasts,
    isLoading,
    setSearchTerm: (value: string) => {
      setSearchTerm(value);
      updateSearchParams({ search: value || null });
    },
    setSelectedTags: (tags: string[]) => {
      setSelectedTags(tags);
      updateSearchParams({
        tags: tags.length > 0 ? tags.join(',') : null,
      });
    },
    setAgeRange: (range: [number, number]) => {
      setAgeRange(range);
      updateSearchParams({
        ageMin: range[0].toString(),
        ageMax: range[1].toString(),
      });
    },
    setSortBy: (sort: SortOption) => {
      setSortBy(sort);
      updateSearchParams({
        sort: sort === 'default' ? null : sort,
      });
    },
    setSelectedMBTI: (mbti: string) => {
      setSelectedMBTI(mbti);
      updateSearchParams({ mbti: mbti || null });
    },
    setSelectedFaceTypes: (types: string[]) => {
      setSelectedFaceTypes(types);
      updateSearchParams({
        faceTypes: types.length > 0 ? types.join(',') : null,
      });
    },
    setShowFilters,
    handleCastSelect,
    toggleFavorite,
    isDiagnosisResult,
    resetFilters: () => {
      saveScrollPosition();
      setSearchTerm('');
      setSelectedTags([]);
      setSelectedFaceTypes([]);
      setSelectedMBTI('');
      setAgeRange([20, 50]);
      setSortBy('default');
      if (storeSlug) {
        router.push(`/store/${storeSlug}`, { scroll: false });
      }
      restoreScrollPosition();
    },
    setOriginalCasts: setCasts, // ✅ 外部からキャスト更新可
  };
};
