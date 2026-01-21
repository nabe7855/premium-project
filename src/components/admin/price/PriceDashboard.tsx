import React, { useState } from 'react';
import { StoreConfig } from './types';

interface PriceDashboardProps {
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
    <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border-2 border-rose-100 bg-white p-8 shadow-xl shadow-rose-100/50 transition-all hover:border-rose-300">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-2xl transition-transform group-hover:scale-110">
          🍓
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold text-rose-300">
            最終更新: {store.lastUpdated}
          </span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`rounded-full px-3 py-1 text-[10px] font-bold transition-colors ${isEditing ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-400 hover:bg-rose-100'}`}
          >
            {isEditing ? 'キャンセル' : '情報を設定'}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="mb-8 space-y-4">
          <div>
            <label className="mb-1 ml-1 block text-[10px] font-bold uppercase tracking-widest text-rose-300">
              店舗名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border-none bg-rose-50 px-4 py-2 text-sm font-bold text-rose-900 outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block text-[10px] font-bold uppercase tracking-widest text-rose-300">
              URL識別子 (SLUG)
            </label>
            <div className="flex items-center rounded-xl bg-rose-50 px-4 py-2">
              <span className="mr-1 text-xs font-medium text-rose-200">/system/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full border-none bg-transparent text-sm font-bold text-rose-900 outline-none focus:ring-0"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-emerald-500 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-100 transition-colors hover:bg-emerald-600"
          >
            保存する
          </button>
        </div>
      ) : (
        <>
          <h3 className="font-rounded mb-1 text-2xl font-bold text-rose-900">{store.storeName}</h3>
          <p className="mb-4 flex items-center gap-1 text-[11px] font-medium text-rose-300">
            <span className="uppercase tracking-widest opacity-50">URL:</span>
            <span className="font-bold text-rose-400 underline">
              https://strawberry.jp/{store.slug}
            </span>
          </p>
          <div className="mb-8 space-y-1">
            <p className="flex items-center gap-2 text-xs text-rose-400">
              <span className="h-1 w-1 rounded-full bg-rose-300"></span>
              登録コース: {store.courses.length}件
            </p>
            <p className="flex items-center gap-2 text-xs text-rose-400">
              <span className="h-1 w-1 rounded-full bg-rose-300"></span>
              アクティブキャンペーン: {store.campaigns.length}件
            </p>
          </div>
        </>
      )}

      {!isEditing && (
        <div className="mt-auto grid grid-cols-2 gap-3">
          <button
            onClick={() => onPreview(store)}
            className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-100"
          >
            プレビュー
          </button>
          <button
            onClick={() => onEdit(store)}
            className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white shadow-md shadow-rose-100 transition-colors hover:bg-rose-600"
          >
            編集する
          </button>
          <button
            onClick={() => {
              if (confirm('本当に削除しますか？')) onDelete(store.id);
            }}
            className="col-span-2 py-2 text-[10px] font-bold text-rose-300 transition-colors hover:text-rose-500"
          >
            店舗データを削除
          </button>
        </div>
      )}
    </div>
  );
};

const PriceDashboard: React.FC<PriceDashboardProps> = ({
  stores,
  onEdit,
  onPreview,
  onAdd,
  onDelete,
  onUpdateStoreInfo,
}) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 duration-700 animate-in fade-in">
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-serif text-4xl italic text-rose-900">Store Management</h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-rose-400">
            店舗別料金設定管理
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-8 py-3 font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600"
        >
          <span className="text-xl">+</span>
          <span>店舗を追加する</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <p className="font-bold italic text-rose-300">店舗が登録されていません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceDashboard;
