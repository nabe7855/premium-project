import React from 'react';
import { mockStores } from '@/data/admin-mockData';
import { Store } from '@/types/dashboard';

interface StoreSelectorProps {
  selectedStore: string;
  onStoreChange: (storeId: string) => void;
  className?: string;
}

// A reusable dropdown component to filter data by store
export default function StoreSelector({ selectedStore, onStoreChange, className = '' }: StoreSelectorProps) {
  // Add an "All Stores" option to the list of stores
  const stores: (Store | { id: string; name: string })[] = [{ id: 'all', name: '全店舗' }, ...mockStores];

  return (
    <div className={`bg-brand-secondary p-4 rounded-xl shadow-lg border border-gray-700/50 ${className}`}>
      <label htmlFor="store-selector" className="text-sm font-medium text-brand-text-secondary mr-3">
        表示対象の店舗を選択
      </label>
      <select
        id="store-selector"
        value={selectedStore}
        onChange={(e) => onStoreChange(e.target.value)}
        className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full sm:w-auto text-white"
        aria-label="店舗を選択"
      >
        {stores.map(store => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>
    </div>
  );
}
