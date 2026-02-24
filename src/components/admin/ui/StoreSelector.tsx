import { mockStores } from '@/data/admin-mockData';
import { Store } from '@/types/dashboard';

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
  // Add an "All Stores" option to the list of stores
  const stores: (Store | { id: string; name: string; slug: string })[] = [
    { id: 'all', name: '全店舗', slug: 'all' },
    ...mockStores,
  ];

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
        className="w-full rounded-md border border-gray-700 bg-brand-primary p-2 text-white sm:w-auto"
        aria-label="店舗を選択"
      >
        {stores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>
    </div>
  );
}
