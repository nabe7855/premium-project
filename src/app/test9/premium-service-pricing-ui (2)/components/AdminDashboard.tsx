
import React, { useState } from 'react';
import { StoreConfig } from '../types';

interface AdminDashboardProps {
  stores: StoreConfig[];
  onEdit: (store: StoreConfig) => void;
  onPreview: (store: StoreConfig) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdateStoreInfo: (id: string, name: string, slug: string) => void;
}

const StoreCard: React.FC<{
  store: StoreConfig;
  onPreview: (store: StoreConfig) => void;
  onEdit: (store: StoreConfig) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, name: string, slug: string) => void;
}> = ({ store, onPreview, onEdit, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(store.storeName);
  const [slug, setSlug] = useState(store.slug);

  const handleSave = () => {
    onUpdate(store.id, name, slug);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border-2 border-rose-100 rounded-[2rem] p-8 shadow-xl shadow-rose-100/50 flex flex-col hover:border-rose-300 transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          🍓
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold text-rose-300 bg-rose-50 px-3 py-1 rounded-full">
            最終更新: {store.lastUpdated}
          </span>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${isEditing ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-400 hover:bg-rose-100'}`}
          >
            {isEditing ? 'キャンセル' : '情報を設定'}
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-[10px] font-bold text-rose-300 uppercase tracking-widest block mb-1 ml-1">店舗名</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-rose-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-rose-900 focus:ring-2 focus:ring-rose-200 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-rose-300 uppercase tracking-widest block mb-1 ml-1">URL識別子 (SLUG)</label>
            <div className="flex items-center bg-rose-50 rounded-xl px-4 py-2">
              <span className="text-rose-200 text-xs font-medium mr-1">/system/</span>
              <input 
                type="text" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full bg-transparent border-none text-sm font-bold text-rose-900 focus:ring-0 outline-none"
              />
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="w-full py-2 bg-emerald-500 text-white font-bold rounded-xl text-xs hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100"
          >
            保存する
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-rose-900 font-rounded mb-1">{store.storeName}</h3>
          <p className="text-[11px] text-rose-300 font-medium mb-4 flex items-center gap-1">
            <span className="opacity-50 tracking-widest uppercase">URL:</span>
            <span className="text-rose-400 font-bold underline">https://strawberry.jp/{store.slug}</span>
          </p>
          <div className="space-y-1 mb-8">
            <p className="text-xs text-rose-400 flex items-center gap-2">
              <span className="w-1 h-1 bg-rose-300 rounded-full"></span>
              登録コース: {store.courses.length}件
            </p>
            <p className="text-xs text-rose-400 flex items-center gap-2">
              <span className="w-1 h-1 bg-rose-300 rounded-full"></span>
              アクティブキャンペーン: {store.campaigns.length}件
            </p>
          </div>
        </>
      )}

      {!isEditing && (
        <div className="mt-auto grid grid-cols-2 gap-3">
          <button 
            onClick={() => onPreview(store)}
            className="py-3 px-4 bg-rose-50 text-rose-500 font-bold rounded-xl text-sm hover:bg-rose-100 transition-colors"
          >
            プレビュー
          </button>
          <button 
            onClick={() => onEdit(store)}
            className="py-3 px-4 bg-rose-500 text-white font-bold rounded-xl text-sm hover:bg-rose-600 shadow-md shadow-rose-100 transition-colors"
          >
            編集する
          </button>
          <button 
            onClick={() => {
              if(confirm('本当に削除しますか？')) onDelete(store.id);
            }}
            className="col-span-2 py-2 text-[10px] text-rose-300 hover:text-rose-500 font-bold transition-colors"
          >
            店舗データを削除
          </button>
        </div>
      )}
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stores, onEdit, onPreview, onAdd, onDelete, onUpdateStoreInfo }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h2 className="text-4xl font-serif italic text-rose-900">Store Management</h2>
          <p className="text-rose-400 font-bold tracking-widest uppercase text-xs mt-2">店舗別料金設定管理</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>店舗を追加する</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <StoreCard 
            key={store.id} 
            store={store} 
            onPreview={onPreview} 
            onEdit={onEdit} 
            onDelete={onDelete} 
            onUpdate={onUpdateStoreInfo} 
          />
        ))}

        {stores.length === 0 && (
          <div className="col-span-full py-32 text-center">
            <p className="text-rose-300 font-bold italic">店舗が登録されていません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
