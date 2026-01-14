'use client';

import {
  deleteMaster,
  getAmenities,
  getAreas,
  getCities,
  getPrefectures,
  getServices,
  upsertMaster,
} from '@/lib/lovehotelApi';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PlusIcon } from '../admin-assets/Icons';

type MasterType = 'prefectures' | 'cities' | 'areas' | 'amenities' | 'services';

export default function MasterManagement() {
  const [activeTab, setActiveTab] = useState<MasterType>('prefectures');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection for child items
  const [prefectures, setPrefectures] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Modal/Form state
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadItems();
    if (activeTab === 'cities' || activeTab === 'areas') loadPrefs();
    if (activeTab === 'areas') loadCities();
  }, [activeTab]);

  const loadItems = async () => {
    setLoading(true);
    try {
      let data: any[] = [];
      switch (activeTab) {
        case 'prefectures':
          data = await getPrefectures();
          break;
        case 'cities':
          data = await getCities();
          break;
        case 'areas':
          data = await getAreas();
          break;
        case 'amenities':
          data = await getAmenities();
          break;
        case 'services':
          data = await getServices();
          break;
      }
      setItems(data);
    } catch (error) {
      console.error(error);
      toast.error('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const loadPrefs = async () => {
    try {
      const data = await getPrefectures();
      setPrefectures(data);
    } catch (e) {}
  };

  const loadCities = async () => {
    try {
      const data = await getCities();
      setCities(data);
    } catch (e) {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tableMap: Record<MasterType, string> = {
      prefectures: 'lh_prefectures',
      cities: 'lh_cities',
      areas: 'lh_areas',
      amenities: 'lh_amenities',
      services: 'lh_services',
    };

    try {
      // Clean up formData to remove joined data that shouldn't be sent to Supabase
      const submissionData = { ...formData };
      Object.keys(submissionData).forEach((key) => {
        if (key.startsWith('lh_') || typeof submissionData[key] === 'object') {
          delete submissionData[key];
        }
      });

      console.log(`[handleSave] Saving to ${tableMap[activeTab]}:`, submissionData);
      await upsertMaster(tableMap[activeTab], submissionData);
      toast.success('保存しました');
      setShowModal(false);
      loadItems();
    } catch (error) {
      console.error('[handleSave] Error:', error);
      toast.error('保存に失敗しました');
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm('削除してよろしいですか？')) return;
    const tableMap: Record<MasterType, string> = {
      prefectures: 'lh_prefectures',
      cities: 'lh_cities',
      areas: 'lh_areas',
      amenities: 'lh_amenities',
      services: 'lh_services',
    };

    try {
      await deleteMaster(tableMap[activeTab], id);
      toast.success('削除しました');
      loadItems();
    } catch (error) {
      console.error(error);
      toast.error('削除に失敗しました。関連データが存在する可能性があります。');
    }
  };

  const openModal = (item: any = null) => {
    setEditItem(item);
    if (item) {
      setFormData(item);
    } else {
      const initial: any = { name: '' };
      if (activeTab === 'prefectures') initial.id = '';
      if (activeTab === 'cities') {
        initial.id = '';
        initial.prefecture_id = '';
      }
      if (activeTab === 'areas') {
        initial.id = '';
        initial.city_id = '';
      }
      setFormData(initial);
    }
    setShowModal(true);
  };

  const tabs: { id: MasterType; label: string }[] = [
    { id: 'prefectures', label: '都道府県' },
    { id: 'cities', label: '市区町村' },
    { id: 'areas', label: 'エリア' },
    { id: 'amenities', label: 'アメニティ' },
    { id: 'services', label: 'サービス' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex w-fit flex-wrap gap-2 rounded-xl border border-white/10 bg-brand-secondary p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-brand-accent text-white shadow-lg'
                : 'text-brand-text-secondary hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          {tabs.find((t) => t.id === activeTab)?.label}一覧
        </h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2 text-white transition-opacity hover:opacity-90"
        >
          <PlusIcon />
          <span>新規追加</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-brand-secondary shadow-xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-brand-text-secondary">
              <th className="px-6 py-4 font-semibold">
                {activeTab === 'prefectures' || activeTab === 'cities' || activeTab === 'areas'
                  ? 'ID / '
                  : ''}
                名前
              </th>
              {(activeTab === 'cities' || activeTab === 'areas') && (
                <th className="px-6 py-4 font-semibold">所属</th>
              )}
              <th className="px-6 py-4 text-right font-semibold">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-white">
                  読み込み中...
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="text-white transition-colors hover:bg-white/5">
                  <td className="px-6 py-4">
                    {(activeTab === 'prefectures' ||
                      activeTab === 'cities' ||
                      activeTab === 'areas') && (
                      <span className="mr-2 font-mono text-xs text-brand-text-secondary">
                        [{item.id}]
                      </span>
                    )}
                    {item.name}
                  </td>
                  {activeTab === 'cities' && (
                    <td className="px-6 py-4 text-sm text-brand-text-secondary">
                      {item.lh_prefectures?.name}
                    </td>
                  )}
                  {activeTab === 'areas' && (
                    <td className="px-6 py-4 text-sm text-brand-text-secondary">
                      {item.lh_cities?.name}
                    </td>
                  )}
                  <td className="space-x-2 px-6 py-4 text-right">
                    <button
                      onClick={() => openModal(item)}
                      className="p-2 text-brand-text-secondary hover:text-white"
                    >
                      修正
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-brand-secondary p-6 shadow-2xl">
            <h3 className="mb-6 text-xl font-bold text-white">{editItem ? '編集' : '新規追加'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              {(activeTab === 'prefectures' || activeTab === 'cities' || activeTab === 'areas') && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-text-secondary">
                    ID (英名)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editItem}
                    className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent disabled:opacity-50"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-brand-text-secondary">
                  名称
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {activeTab === 'cities' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-text-secondary">
                    都道府県
                  </label>
                  <select
                    required
                    className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white"
                    value={formData.prefecture_id}
                    onChange={(e) => setFormData({ ...formData, prefecture_id: e.target.value })}
                  >
                    <option value="">選択してください</option>
                    {prefectures.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'areas' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-text-secondary">
                    市区町村
                  </label>
                  <select
                    required
                    className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white"
                    value={formData.city_id}
                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                  >
                    <option value="">選択してください</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg px-4 py-2 text-white hover:bg-white/5"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-brand-accent px-6 py-2 font-bold text-white hover:opacity-90"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
