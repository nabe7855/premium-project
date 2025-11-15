import React, { useState } from 'react';
import { Store } from '@/types/dashboard';
import { mockStores } from '@/data/admin-mockData';
import Card from '@/components/admin/ui/Card';

// Component for displaying an existing store's card
const StoreCard: React.FC<{ store: Store }> = ({ store }) => (
    <Card title={store.name}>
        <img src={store.photoUrl} alt={store.name} className="w-full h-32 object-cover rounded-md mb-4"/>
        <p className="text-sm text-brand-text-secondary font-semibold mb-2">{store.catchphrase}</p>
        <p className="text-xs text-gray-400 mb-2 h-10 overflow-hidden">{store.overview}</p>
        <p className="text-xs text-gray-400">{store.address}</p>
        <p className="text-xs text-gray-400">{store.phone}</p>
        <button className="mt-4 w-full text-center bg-brand-accent/80 hover:bg-brand-accent text-white font-bold py-2 px-4 rounded">
            編集
        </button>
    </Card>
);

// Main page for creating and managing stores
export default function StoreManagement() {
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [newStore, setNewStore] = useState<Omit<Store, 'id' | 'photoUrl'>>({
    name: '',
    catchphrase: '',
    overview: '',
    address: '',
    phone: '',
  });

  const handleInputChange = <K extends keyof typeof newStore,>(key: K, value: (typeof newStore)[K]) => {
    setNewStore(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    const createdStore: Store = {
      id: `store-${Date.now()}`,
      photoUrl: 'https://picsum.photos/400/200',
      ...newStore,
    };
    setStores(prev => [createdStore, ...prev]);
    // Reset form
    setNewStore({ name: '', catchphrase: '', overview: '', address: '', phone: '' });
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form for creating a new store */}
        <div className="lg:col-span-1">
            <Card title="新規店舗作成">
                <form onSubmit={handleCreateStore} className="space-y-4">
                    <div>
                        <label className="text-sm text-brand-text-secondary">店舗名</label>
                        <input type="text" value={newStore.name} onChange={e => handleInputChange('name', e.target.value)} required className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1" />
                    </div>
                     <div>
                        <label className="text-sm text-brand-text-secondary">キャッチコピー</label>
                        <input type="text" value={newStore.catchphrase} onChange={e => handleInputChange('catchphrase', e.target.value)} required className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1" />
                    </div>
                    <div>
                        <label className="text-sm text-brand-text-secondary">店舗概要</label>
                        <textarea value={newStore.overview} onChange={e => handleInputChange('overview', e.target.value)} required rows={3} className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1"></textarea>
                    </div>
                    <div>
                        <label className="text-sm text-brand-text-secondary">住所</label>
                        <input type="text" value={newStore.address} onChange={e => handleInputChange('address', e.target.value)} required className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1" />
                    </div>
                     <div>
                        <label className="text-sm text-brand-text-secondary">電話番号</label>
                        <input type="tel" value={newStore.phone} onChange={e => handleInputChange('phone', e.target.value)} required className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1" />
                    </div>
                     <div>
                        <label className="text-sm text-brand-text-secondary">店舗写真</label>
                        <input type="file" className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-blue-600"/>
                    </div>
                    <button type="submit" className="w-full bg-brand-accent hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md">
                        店舗を作成
                    </button>
                </form>
            </Card>
        </div>

        {/* List of existing stores */}
        <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stores.map(store => <StoreCard key={store.id} store={store} />)}
            </div>
        </div>
    </div>
  );
}