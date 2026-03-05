'use client';

import { getAmenities, getPurposes } from '@/lib/lovehotelApi';
import { Dialog, Transition } from '@headlessui/react';
import { Heart, Sparkles, X } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';

interface DetailedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'purpose' | 'amenity';
  selectedItems: string[];
  onSelect: (id: string) => void;
}

const DetailedSearchModal: React.FC<DetailedSearchModalProps> = ({
  isOpen,
  onClose,
  type,
  selectedItems,
  onSelect,
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const fetchData = type === 'purpose' ? getPurposes() : getAmenities();
    fetchData
      .then((data) => {
        // For amenities, manually add SM/fetish if not exists
        let filtered = data;
        if (type === 'amenity') {
          const hasSM = data.some((a: any) => a.name.includes('SM') || a.name.includes('拘束'));
          if (!hasSM) {
            filtered = [...data, { id: 'special-sm', name: 'SM・拘束設備' }];
          }
        }
        setItems(filtered);
      })
      .finally(() => setLoading(false));
  }, [isOpen, type]);

  const title = type === 'purpose' ? '目的で探す' : '設備で探す';
  const Icon = type === 'purpose' ? Heart : Sparkles;
  const color = type === 'purpose' ? 'indigo' : 'rose';

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[110]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-2xl transition-all md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-50`}
                    >
                      <Icon className={`text-${color}-500`} size={24} />
                    </div>
                    <h3 className="text-xl font-black tracking-tighter text-slate-800">{title}</h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                  {loading ? (
                    <div className="flex h-40 items-center justify-center">
                      <div
                        className={`h-6 w-6 animate-spin rounded-full border-2 border-${color}-500 border-t-transparent`}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => onSelect(item.id)}
                          className={`flex items-center justify-center rounded-2xl border px-4 py-4 text-center transition-all active:scale-95 ${
                            selectedItems.includes(item.id)
                              ? `border-${color}-400 bg-${color}-50 text-${color}-600 font-black shadow-sm`
                              : 'border-slate-100 bg-white font-bold text-slate-600 hover:border-slate-200'
                          }`}
                        >
                          <span className="text-xs sm:text-sm">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    onClick={onClose}
                    className={`flex w-full items-center justify-center rounded-2xl bg-${color}-500 py-4 text-base font-black text-white shadow-xl shadow-${color}-200/50 transition-all hover:brightness-105 active:scale-[0.98]`}
                  >
                    選択を確定する
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DetailedSearchModal;
