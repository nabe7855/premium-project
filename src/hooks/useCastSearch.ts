'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Cast } from '@/types/caststypes';
import { getAllCasts } from '@/data/services/castService';
import { getRecommendedCasts } from '@/utils/compatibilityCalculator';

type SortOption = 'default' | 'reviewCount' | 'newest' | 'todayAvailable';

interface UseCastSearchOptions {
  resetFiltersForDiagnosis?: boolean;
}

export const useCastSearch = (options: UseCastSearchOptions = {}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollPositionRef = useRef<number>(0);

  const isDiagnosisResult = !!(
    searchParams.get('mbti') ||
    searchParams.get('animalType') ||
    searchParams.get('loveStyles')
  );
  const shouldResetFilters = isDiagnosisResult && options.resetFiltersForDiagnosis !== false;

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    if (shouldResetFilters) return [];
    return searchParams.get('tags')?.split(',').filter(Boolean) || [];
  });
  const [ageRange, setAgeRange] = useState<[number, number]>([
    shouldResetFilters ? 20 : parseInt(searchParams.get('ageMin') || '20'),
    shouldResetFilters ? 50 : parseInt(searchParams.get('ageMax') || '50'),
  ]);
  const [sortBy, setSortBy] = useState<SortOption>(
    shouldResetFilters ? 'default' : (searchParams.get('sort') as SortOption) || 'default',
  );
  const [selectedMBTI, setSelectedMBTI] = useState(() => {
    return shouldResetFilters ? '' : searchParams.get('mbti') || '';
  });
  const [selectedFaceTypes, setSelectedFaceTypes] = useState<string[]>(() => {
    if (shouldResetFilters) return [];
    return searchParams.get('faceTypes')?.split(',').filter(Boolean) || [];
  });

  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCasts = async () => {
      try {
        setIsLoading(true);
        const castsData = await getAllCasts();
        setCasts(castsData ?? []); // fallback to empty array
      } catch (error) {
        console.error('キャストデータの取得に失敗:', error);
        setCasts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCasts();
  }, []);

  const saveScrollPosition = () => {
    scrollPositionRef.current = window.scrollY;
  };

  const restoreScrollPosition = () => {
    setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, 0);
  };

  const filteredAndSortedCasts = useMemo(() => {
    if (!Array.isArray(casts)) return [];

    console.log('キャスト検索実行:', { searchTerm, selectedTags, ageRange, sortBy });

    if (isDiagnosisResult) {
      const userMBTI = searchParams.get('mbti') || '';
      const userAnimal = searchParams.get('animalType') || '';
      const userLoveStyle = searchParams.get('loveStyles') || '';

      let recommendedCasts = getRecommendedCasts(casts, userMBTI, userAnimal, userLoveStyle);

      let filtered = recommendedCasts.filter((cast) => {
        const matchesSearch =
          !searchTerm ||
          cast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cast.catchphrase?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTags =
          selectedTags.length === 0 || selectedTags.some((tag) => cast.tags?.includes(tag));
        const matchesAge = cast.age >= ageRange[0] && cast.age <= ageRange[1];
        const matchesMBTI = !selectedMBTI || cast.mbtiType === selectedMBTI;
        const matchesFaceType =
          selectedFaceTypes.length === 0 ||
          selectedFaceTypes.some((type) => cast.faceType?.includes(type));

        return matchesSearch && matchesTags && matchesAge && matchesMBTI && matchesFaceType;
      });

      switch (sortBy) {
        case 'reviewCount':
          filtered = filtered.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case 'newest':
          filtered = filtered.sort((a, b) => a.reviewCount - b.reviewCount);
          break;
        case 'todayAvailable':
          const today = new Date().toISOString().split('T')[0];
          filtered = filtered.sort((a, b) => {
            const aAvailable = a.isOnline || a.availability?.[today]?.length > 0;
            const bAvailable = b.isOnline || b.availability?.[today]?.length > 0;
            return aAvailable && !bAvailable ? -1 : !aAvailable && bAvailable ? 1 : 0;
          });
          break;
        default:
          filtered = filtered.sort(
            (a, b) => (b as any).compatibilityScore - (a as any).compatibilityScore,
          );
          break;
      }

      return filtered;
    }

    let filtered = casts.filter((cast) => {
      const matchesSearch =
        cast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cast.catchphrase?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((tag) => cast.tags?.includes(tag));
      const matchesAge = cast.age >= ageRange[0] && cast.age <= ageRange[1];
      const matchesMBTI = !selectedMBTI || cast.mbtiType === selectedMBTI;
      const matchesFaceType =
        selectedFaceTypes.length === 0 ||
        selectedFaceTypes.some((type) => cast.faceType?.includes(type));

      return matchesSearch && matchesTags && matchesAge && matchesMBTI && matchesFaceType;
    });

    switch (sortBy) {
      case 'reviewCount':
        filtered = filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        filtered = filtered.sort((a, b) => a.reviewCount - b.reviewCount);
        break;
      case 'todayAvailable':
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.sort((a, b) => {
          const aAvailable = a.isOnline || a.availability?.[today]?.length > 0;
          const bAvailable = b.isOnline || b.availability?.[today]?.length > 0;
          return aAvailable && !bAvailable ? -1 : !aAvailable && bAvailable ? 1 : 0;
        });
        break;
      default:
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [
    searchTerm,
    selectedTags,
    ageRange,
    sortBy,
    selectedMBTI,
    selectedFaceTypes,
    isDiagnosisResult,
    shouldResetFilters,
    casts,
  ]);

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
      value === null || value === '' ? params.delete(key) : params.set(key, value);
    });

    Object.entries(currentDiagnosisParams).forEach(([key, value]) => {
      params.set(key, value);
    });

    router.push(`?${params.toString()}`, { scroll: false });
    restoreScrollPosition();
  };

  const handleCastSelect = (cast: Cast) => {
    router.push(`/store/tokyo/cast/${cast.id}`);
  };

  const toggleFavorite = (castId: string) => {
    setFavorites((prev) =>
      prev.includes(castId) ? prev.filter((id) => id !== castId) : [...prev, castId],
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
      updateSearchParams({ tags: tags.length > 0 ? tags.join(',') : null });
    },
    setAgeRange: (range: [number, number]) => {
      setAgeRange(range);
      updateSearchParams({ ageMin: range[0].toString(), ageMax: range[1].toString() });
    },
    setSortBy: (sort: SortOption) => {
      setSortBy(sort);
      updateSearchParams({ sort: sort === 'default' ? null : sort });
    },
    setSelectedMBTI: (mbti: string) => {
      setSelectedMBTI(mbti);
      updateSearchParams({ mbti: mbti || null });
    },
    setSelectedFaceTypes: (types: string[]) => {
      setSelectedFaceTypes(types);
      updateSearchParams({ faceTypes: types.length > 0 ? types.join(',') : null });
    },
    setShowFilters,
    handleCastSelect,
    toggleFavorite,
    isDiagnosisResult,
    resetFilters: () => {
      saveScrollPosition();

      const diagnosisParams = ['mbti', 'animalType', 'loveStyles'];
      const currentDiagnosisParams: Record<string, string> = {};
      diagnosisParams.forEach((param) => {
        const value = searchParams.get(param);
        if (value) currentDiagnosisParams[param] = value;
      });

      setSearchTerm('');
      setSelectedTags([]);
      setSelectedFaceTypes([]);
      setSelectedMBTI('');
      setAgeRange([20, 50]);
      setSortBy('default');

      const hasDiagnosisResults = Object.keys(currentDiagnosisParams).length > 0;
      if (hasDiagnosisResults) {
        const params = new URLSearchParams();
        Object.entries(currentDiagnosisParams).forEach(([key, value]) => {
          params.set(key, value);
        });
        router.push(`?${params.toString()}`, { scroll: false });
      } else {
        router.push('/', { scroll: false });
      }

      restoreScrollPosition();
    },
  };
};
