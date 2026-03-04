'use client';

import { getStores } from '@/lib/actions/reservation';
import { useEffect, useState } from 'react';

interface StoreSelectorProps {
  selectedStore: string;
  onStoreChange: (storeId: string) => void;
  className?: string;
}

// A reusable dropdown component to filter data by store
export default function StoreSelector({
  selectedStore,
  onStoreChange,
  className = '',
}: StoreSelectorProps) {
  const [dbStores, setDbStores] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    async function fetchDbStores() {
      try {
        const stored = await getStores();
        setDbStores(stored || []);
      } catch (err) {
        console.error('Failed to fetch stores', err);
      }
    }
    fetchDbStores();
  }, []);

  // Add an "All Stores" option to the list of stores
  const stores = [{ id: 'all', name: '全店舗', slug: 'all' }, ...dbStores];

  return (
    <div
      className={`rounded-xl border border-gray-700/50 bg-brand-secondary p-4 shadow-lg ${className}`}
    >
      <label
        htmlFor="store-selector"
        className="mr-3 text-sm font-medium text-brand-text-secondary"
      >
        表示対象の店舗を選択
      </label>
      <select
        id="store-selector"
        value={selectedStore}
        onChange={(e) => onStoreChange(e.target.value)}
        className="w-full rounded-md border border-pink-500/50 bg-pink-500/10 p-2 text-sm font-bold text-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 sm:w-auto"
        aria-label="店舗を選択"
      >
        {stores.map((store) => {
          const displayName =
            store.name === '全店舗'
              ? store.name
              : store.name.replace(/ストロベリーボーイズ?/, '').trim();
          const finalName =
            store.name === '全店舗'
              ? displayName
              : displayName.endsWith('店')
                ? displayName
                : `${displayName}店`;
          return (
            <option key={store.id} value={store.id} className="bg-white text-black">
              {finalName}
            </option>
          );
        })}
      </select>
    </div>
  );
}
