'use client';

import { uploadPriceImage } from '@/lib/actions/priceConfig';
import type { EditableCampaign } from '@/types/priceConfig';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

interface CampaignEditorProps {
  campaigns: EditableCampaign[];
  storeSlug: string;
  onUpdate: (campaigns: EditableCampaign[]) => void;
}

export default function CampaignEditor({ campaigns, storeSlug, onUpdate }: CampaignEditorProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addCampaign = () => {
    const newCampaign: EditableCampaign = {
      title: '新しいキャンペーン',
      description: '',
      image_url: '',
      need_entry: false,
      accent_text: 'CAMPAIGN',
      price_info: '',
      display_order: campaigns.length,
    };
    onUpdate([...campaigns, newCampaign]);
  };

  const updateCampaign = (index: number, updates: Partial<EditableCampaign>) => {
    const newCampaigns = [...campaigns];
    newCampaigns[index] = { ...newCampaigns[index], ...updates };
    onUpdate(newCampaigns);
  };

  const deleteCampaign = (index: number) => {
    if (!confirm('このキャンペーンを削除しますか？')) return;
    const newCampaigns = campaigns.filter((_, i) => i !== index);
    onUpdate(newCampaigns);
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    const result = await uploadPriceImage(file, `campaign-${storeSlug}`);
    setUploadingIndex(null);

    if (result.success && result.url) {
      updateCampaign(index, { image_url: result.url });
    } else {
      alert('画像のアップロードに失敗しました: ' + result.error);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-rose-900">キャンペーン設定</h3>
        <button
          onClick={addCampaign}
          className="flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-200"
        >
          <Plus className="h-4 w-4" />
          キャンペーン追加
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {campaigns.map((campaign, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-rose-100 bg-rose-50/30 transition-shadow hover:shadow-md"
          >
            {/* 上部：画像と基本情報 */}
            <div className="flex flex-col gap-4 p-4 sm:flex-row">
              {/* 画像エリア */}
              <div className="w-full shrink-0 sm:w-48">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
                  {campaign.image_url ? (
                    <img
                      src={campaign.image_url}
                      alt="キャンペーン画像"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      NO IMAGE
                    </div>
                  )}
                  <label className="absolute bottom-2 right-2 cursor-pointer rounded-lg bg-white/90 p-2 shadow hover:bg-white">
                    <Upload className="h-4 w-4 text-rose-500" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      disabled={uploadingIndex === index}
                      className="hidden"
                    />
                  </label>
                  {uploadingIndex === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                      <span className="text-xs font-bold text-rose-500">UP...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* テキスト入力エリア */}
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={campaign.title}
                  onChange={(e) => updateCampaign(index, { title: e.target.value })}
                  className="w-full rounded-lg border border-rose-200 p-2 font-bold text-rose-900"
                  placeholder="キャンペーンタイトル"
                />
                <textarea
                  value={campaign.description || ''}
                  onChange={(e) => updateCampaign(index, { description: e.target.value })}
                  className="w-full rounded-lg border border-rose-200 p-2 text-sm text-rose-600"
                  rows={2}
                  placeholder="キャンペーン詳細"
                />
              </div>
            </div>

            {/* 下部：追加情報 */}
            <div className="border-t border-rose-100 bg-white p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-bold text-rose-400">
                    アクセントテキスト
                  </label>
                  <input
                    type="text"
                    value={campaign.accent_text}
                    onChange={(e) => updateCampaign(index, { accent_text: e.target.value })}
                    className="w-full rounded-lg border border-rose-200 p-1.5 text-sm"
                    placeholder="例: WELCOME DISCOUNT"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-bold text-rose-400">
                    金額/割引情報
                  </label>
                  <input
                    type="text"
                    value={campaign.price_info || ''}
                    onChange={(e) => updateCampaign(index, { price_info: e.target.value })}
                    className="w-full rounded-lg border border-rose-200 p-1.5 text-sm"
                    placeholder="例: 1,000円OFF"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100">
                    <input
                      type="checkbox"
                      checked={campaign.need_entry}
                      onChange={(e) => updateCampaign(index, { need_entry: e.target.checked })}
                      className="accent-rose-500"
                    />
                    要エントリー
                  </label>
                  <button
                    onClick={() => deleteCampaign(index)}
                    className="rounded-lg bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
                    title="削除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {campaigns.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-rose-100 py-8 text-center text-rose-400">
            キャンペーンが設定されていません
          </div>
        )}
      </div>
    </div>
  );
}
