import { saveRecruitPageConfig } from '@/actions/recruit';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { stores } from '@/data/stores';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { toast } from 'sonner';
import LandingPage, { LandingPageConfig } from './LandingPage';

export default function RecruitEditor() {
  const [selectedStore, setSelectedStore] = React.useState('tokyo');
  const [isSaving, setIsSaving] = React.useState(false);

  // Currently static, but prepared for dynamic config per store
  const [config, setConfig] = React.useState<LandingPageConfig>({
    hero: {
      isVisible: true,
    },
  });

  const handleUpdate = (section: string, key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveRecruitPageConfig(selectedStore, config);
      if (result.success) {
        toast.success('変更を保存しました');
      } else {
        toast.error(`保存に失敗しました: ${result.error}`);
      }
    } catch (e) {
      toast.error('保存中にエラーが発生しました');
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Store Selector Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-white/90 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">採用ページ編集</h2>
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-[250px] bg-white text-gray-900">
              <SelectValue placeholder="店舗を選択" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(stores).map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.emoji} {store.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">※ 画像をクリックして変更できます</div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isSaving ? '保存中...' : '変更を保存'}
          </Button>
        </div>
      </div>

      {/* Main Content Preview */}
      <div className="min-h-screen overflow-hidden rounded-lg border bg-slate-50 shadow-lg">
        {/* Pass disabled editing props */}
        {/* Wrap in HashRouter to provide context for child components using useNavigate */}
        <HashRouter>
          <LandingPage
            config={config}
            isEditing={true}
            onUpdate={handleUpdate}
            onOpenChat={() => {}}
            onOpenForm={() => {}}
          />
        </HashRouter>
      </div>
    </div>
  );
}
