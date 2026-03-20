'use client';

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GripVertical,
  Plus,
  Save,
  Trash2,
  Settings as SettingsIcon,
  GlobeIcon,
  Palette,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Reorder, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { getAllStoresFromDb } from '@/lib/actions/store-actions';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { saveStoreTopConfig } from '@/lib/store/saveStoreTopConfig';
import { BottomNavItemConfig, StoreTopPageConfig, DEFAULT_STORE_TOP_CONFIG } from '@/lib/store/storeTopConfig';
import { IconMap, getIconByName } from '@/lib/utils/icons';

// 内部管理用の型（ID付き）
interface EditableNavItem extends BottomNavItemConfig {
  id: string;
}

const COLOR_PRESETS = [
  { name: 'Slate', class: 'text-slate-600', bg: 'bg-slate-600' },
  { name: 'Pink', class: 'text-pink-500', bg: 'bg-pink-500' },
  { name: 'Amber', class: 'text-amber-500', bg: 'bg-amber-500' },
  { name: 'Blue', class: 'text-blue-500', bg: 'bg-blue-500' },
  { name: 'Green', class: 'text-green-500', bg: 'bg-green-500' },
  { name: 'Rose', class: 'text-rose-500', bg: 'bg-rose-500' },
  { name: 'Emerald', class: 'text-emerald-500', bg: 'bg-emerald-500' },
  { name: 'Violet', class: 'text-violet-500', bg: 'bg-violet-500' },
  { name: 'Red', class: 'text-red-500', bg: 'bg-red-500' },
  { name: 'Sky', class: 'text-sky-500', bg: 'bg-sky-500' },
];

export default function BottomNavManagement() {
  const router = useRouter();
  const [items, setItems] = useState<EditableNavItem[]>([]);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dbStores, setDbStores] = useState<any[]>([]);

  // 1. 初回読み込み: 全店舗取得 & いずれか1店舗の設定を初期値とする
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const storesResult = await getAllStoresFromDb();
        if (storesResult.success) {
          const validStores = (storesResult.stores || []).filter((s: any) => s.slug);
          setDbStores(validStores);
          
          if (validStores.length > 0) {
            const baseStore = validStores[0].slug;
            const configResult = await getStoreTopConfig(baseStore);
            let rawItems: BottomNavItemConfig[] = [];
            
            if (configResult.success && configResult.config) {
               const c = configResult.config as StoreTopPageConfig;
               rawItems = c.footer?.bottomNav || DEFAULT_STORE_TOP_CONFIG.footer.bottomNav;
               setIsBottomNavVisible(c.footer?.isBottomNavVisible ?? true);
            } else {
               rawItems = DEFAULT_STORE_TOP_CONFIG.footer.bottomNav;
            }

            // IDを付与してステートにセット（入力フォーカス維持のため）
            setItems(rawItems.map((item, idx) => ({
              ...item,
              id: (item as any).id || `item-${Date.now()}-${idx}`
            })) as EditableNavItem[]);
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // 2. 「反映」ボタン: 全店舗に一括保存
  const handleSaveToAllStores = async () => {
    if (dbStores.length === 0) return;
    setIsSaving(true);
    
    // 保存時はIDを除去してクリーンなデータにする
    const cleanItems = items.map(({ id, ...rest }) => rest);

    try {
      let successCount = 0;
      let failCount = 0;

      const savePromises = dbStores.map(async (store) => {
        try {
          const configResult = await getStoreTopConfig(store.slug);
          let currentConfig: StoreTopPageConfig;
          
          if (configResult.success && configResult.config) {
            currentConfig = configResult.config as StoreTopPageConfig;
          } else {
            currentConfig = { ...DEFAULT_STORE_TOP_CONFIG };
          }

          const updatedConfig: StoreTopPageConfig = {
            ...currentConfig,
            footer: {
              ...currentConfig.footer,
              bottomNav: cleanItems,
              isBottomNavVisible: isBottomNavVisible,
            },
          };

          const saveResult = await saveStoreTopConfig(store.slug, updatedConfig);
          if (saveResult.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          console.error(`Error saving to ${store.slug}:`, err);
          failCount++;
        }
      });

      await Promise.all(savePromises);

      if (failCount === 0) {
        toast.success(`全${successCount}店舗に設定を反映しました`);
      } else {
        toast.warning(`${successCount}店舗に反映成功、${failCount}店舗で失敗しました`);
      }
    } catch (error) {
      console.error('Error saving global config:', error);
      toast.error('一括保存中にエラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = () => {
    const newItem: EditableNavItem = {
      id: `item-${Date.now()}`,
      label: '新規項目',
      icon: 'HelpCircle',
      href: `/`,
      color: 'text-slate-600',
      isVisible: true,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof EditableNavItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border border-gray-700/50 bg-brand-secondary/50 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-400 hover:text-white">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">固定フッターナビ一括管理</h1>
            <p className="text-xs text-brand-accent font-black mt-1 flex items-center gap-1.5 uppercase tracking-wider">
               <GlobeIcon size={12} />
               全店舗共通設定モード
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSaveToAllStores} disabled={isSaving || dbStores.length === 0} className="bg-brand-accent font-black h-10 px-8 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-105 transition-all text-white active:scale-95">
            <Save className="h-4 w-4 mr-2" />
            反映して保存
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-4">
           {/* Global Visibility */}
           <div className="flex items-center justify-between p-5 rounded-2xl bg-brand-secondary/30 border border-brand-accent/20 shadow-inner">
             <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isBottomNavVisible ? 'bg-brand-accent/20 text-brand-accent' : 'bg-gray-800 text-gray-500'} transition-colors`}>
                  <SettingsIcon size={24} />
                </div>
                <div>
                   <span className="text-sm font-bold text-white block">モバイルナビの表示</span>
                   <p className="text-[10px] text-gray-400 mt-0.5">全てのモバイル画面で下部ナビゲーションを有効にします</p>
                </div>
             </div>
             <Switch checked={isBottomNavVisible} onCheckedChange={setIsBottomNavVisible} className="scale-125 data-[state=checked]:bg-brand-accent" />
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">ナビゲーション構成項目</h2>
                <Button onClick={addItem} variant="ghost" size="sm" className="h-8 text-brand-accent font-bold hover:bg-brand-accent/10 rounded-full px-4 border border-brand-accent/20">
                  <Plus className="h-3.5 w-3.5 mr-1" /> 項目を追加
                </Button>
              </div>

              <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item: any, index) => {
                    const ItemIcon = getIconByName(item.icon);
                    return (
                      <Reorder.Item
                        key={item.id}
                        value={item}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group p-4 rounded-2xl border border-gray-700/50 bg-brand-secondary/40 hover:bg-brand-secondary/60 transition-all hover:border-brand-accent/30 shadow-md relative overflow-hidden"
                      >
                        <div className="flex items-start gap-4 z-10 relative">
                          <div className="mt-2.5 cursor-grab active:cursor-grabbing text-gray-600 group-hover:text-gray-400 transition-colors">
                            <GripVertical size={22} />
                          </div>

                          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {/* Icon & Label */}
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gray-500 tracking-wider">アイコン & 表示名</label>
                                <div className="flex gap-2">
                                   <Popover>
                                      <PopoverTrigger asChild>
                                        <Button variant="outline" className={`h-10 w-10 p-0 border-gray-700 bg-black/20 hover:bg-black/40 ${item.color || 'text-brand-accent'} relative group-hover:border-brand-accent/50`}>
                                          <ItemIcon size={22} />
                                          <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-slate-800 border border-gray-600 flex items-center justify-center">
                                            <ChevronRight size={8} className="text-gray-400" />
                                          </div>
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[320px] p-4 bg-white border-2 border-slate-100 shadow-2xl rounded-2xl" side="bottom">
                                         <p className="text-[10px] font-black text-slate-400 uppercase mb-3 px-1">アイコンを選択</p>
                                         <div className="grid grid-cols-6 gap-2">
                                            {Object.keys(IconMap).map((iconName) => {
                                              const IconComp = IconMap[iconName];
                                              return (
                                                <button
                                                  key={iconName}
                                                  onClick={() => updateItem(index, 'icon', iconName)}
                                                  className={`p-2 rounded-xl border transition-all ${item.icon === iconName ? 'bg-pink-50 border-pink-200 text-pink-500 shadow-sm' : 'border-transparent text-slate-400 hover:bg-slate-50'}`}
                                                  title={iconName}
                                                >
                                                  <IconComp size={20} />
                                                </button>
                                              );
                                            })}
                                         </div>
                                      </PopoverContent>
                                   </Popover>
                                   <input
                                     type="text"
                                     value={item.label}
                                     onChange={(e) => updateItem(index, 'label', e.target.value)}
                                     className="flex-grow bg-black/20 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white font-bold outline-none focus:border-brand-accent/50 transition-all"
                                     placeholder="例: マイページ"
                                   />
                                </div>
                             </div>

                             {/* Color & Href */}
                             <div className="space-y-2 flex flex-col justify-between">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                                    <Palette size={10} /> カラー指定
                                  </label>
                                  <div className="flex flex-wrap gap-2">
                                     {COLOR_PRESETS.map((color) => (
                                       <button
                                         key={color.class}
                                         onClick={() => updateItem(index, 'color', color.class)}
                                         className={`w-6 h-6 rounded-full ${color.bg} transition-all ${item.color === color.class ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110 shadow-lg' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                                         title={color.name}
                                       />
                                     ))}
                                  </div>
                                </div>
                                
                                <div className="space-y-1 mt-2">
                                   <div className="relative">
                                      <input
                                        type="text"
                                        value={item.href}
                                        onChange={(e) => updateItem(index, 'href', e.target.value)}
                                        className="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-2 text-[11px] text-white font-mono focus:border-brand-accent/50 outline-none pr-10"
                                        placeholder="/"
                                      />
                                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                                         <ExternalLink size={12} />
                                      </div>
                                   </div>
                                </div>
                             </div>

                             {/* Actions & Visibility */}
                             <div className="flex items-end justify-between lg:justify-end gap-3">
                                 <div className="flex flex-col gap-2 flex-grow lg:flex-grow-0">
                                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-wider">ステータス</label>
                                    <div className="flex items-center gap-4 bg-black/10 px-4 py-1.5 rounded-xl border border-gray-700/30 w-full">
                                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">表示</span>
                                       <Switch checked={item.isVisible} onCheckedChange={(v) => updateItem(index, 'isVisible', v)} className="scale-90" />
                                    </div>
                                 </div>
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => removeItem(index)}
                                   className="h-10 w-10 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                                 >
                                   <Trash2 size={18} />
                                 </Button>
                             </div>
                          </div>
                        </div>
                      </Reorder.Item>
                    );
                  })}
                </AnimatePresence>
              </Reorder.Group>
           </div>
        </div>

        {/* Device Preview Section */}
        <div className="w-full lg:w-[320px] shrink-0">
           <div className="sticky top-6 rounded-[3.5rem] border-[14px] border-slate-900 bg-slate-100 shadow-2xl overflow-hidden h-[640px] flex flex-col items-center">
              <div className="w-44 h-7 bg-slate-900 rounded-b-[2rem] mb-6 shadow-sm" />
              
              <div className="flex-grow w-full px-5 text-center mt-10">
                <div className="bg-white/60 rounded-3xl p-8 h-64 flex flex-col items-center justify-center border border-white/50 shadow-inner">
                   <div className="w-16 h-16 rounded-3xl bg-slate-200 animate-pulse mb-4 rotate-3" />
                   <div className="w-32 h-2.5 bg-slate-200 rounded animate-pulse mb-2" />
                   <div className="w-24 h-2 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Bottom Nav Mockup */}
              {isBottomNavVisible && items.length > 0 ? (
                <div className="w-full h-24 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-2 relative transition-all">
                   {items.filter(i => i.isVisible).map((item, idx) => {
                     const Icon = getIconByName(item.icon);
                     return (
                        <div key={item.id} className="flex flex-col items-center gap-1 group/preview">
                           <div className={`p-1.5 rounded-xl transition-all ${item.color || 'text-slate-400'}`}>
                              <Icon size={22} />
                           </div>
                           <span className={`text-[8px] font-black tracking-tight text-slate-500`}>{item.label}</span>
                        </div>
                     );
                   })}
                   <div className="absolute bottom-2 w-32 h-1.5 bg-slate-900 rounded-full opacity-10" />
                </div>
              ) : (
                <div className="w-full h-24 bg-slate-50 border-t border-dashed border-slate-200 flex items-center justify-center">
                   <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">Disabled</p>
                </div>
              )}
           </div>
           <p className="text-center text-[10px] font-black text-gray-500 mt-6 uppercase tracking-[0.3em] opacity-40">Dynamic Preview (Mobile)</p>
        </div>
      </div>
    </div>
  );
}
