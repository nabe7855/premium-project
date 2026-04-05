'use client';

import React from 'react';
import { 
  History, 
  RotateCcw, 
  Download, 
  Trash2, 
  Clock,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface HistoryManagerProps {
  title: string;
  history: any[];
  onApply: (config: any) => void;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  onRefresh: () => Promise<void>;
  isLoading?: boolean;
}

export default function HistoryManager({ 
  title, 
  history, 
  onApply, 
  onDelete, 
  onRefresh,
  isLoading = false 
}: HistoryManagerProps) {
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const handleApply = (item: any) => {
    onApply(item.config);
    toast.success('履歴から設定をプレビューに反映しました。「公開/保存」ボタンを押すと本番に反映されます。');
  };

  const handleDownload = (item: any) => {
    try {
      const dataStr = JSON.stringify(item.config, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}_backup_${format(new Date(item.created_at), 'yyyyMMdd_HHmm')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('ダウンロードに失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const result = await onDelete(id);
      if (result.success) {
        toast.success('履歴を削除しました');
        await onRefresh();
      } else {
        toast.error(result.error || '削除に失敗しました');
      }
    } catch (e) {
      toast.error('エラーが発生しました');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-pink-500/30 bg-pink-500/5 text-pink-600 hover:bg-pink-500/10">
          <History className="mr-2 h-4 w-4" />
          <span>履歴（バックアップ）</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] border-l-gray-700 bg-brand-secondary text-white">
        <SheetHeader className="pb-4 border-b border-gray-700">
          <SheetTitle className="text-white flex items-center gap-2">
            <History className="h-5 w-5 text-pink-500" />
            {title} - 履歴管理
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            自動保存または手動保存された過去の設定（直近20件）を確認・復元できます。
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex items-center justify-between px-1 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            バックアップ履歴一覧
          </span>
          {isLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />}
        </div>

        <ScrollArea className="h-[calc(100vh-200px)] pt-2 pr-4">
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 opacity-50">
                <Clock className="h-12 w-12 mb-4" />
                <p>履歴データがまだありません</p>
                <p className="text-[10px]">保存を行うとここに履歴が作成されます</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-brand-primary/30 p-4 transition-all hover:border-pink-500/40 hover:bg-brand-primary/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-200">
                          {format(new Date(item.created_at), 'yyyy/MM/dd HH:mm:ss', { locale: ja })}
                        </span>
                        {history[0].id === item.id && (
                          <span className="inline-flex items-center rounded-full bg-pink-500/10 px-2 py-0.5 text-[10px] font-bold text-pink-500 ring-1 ring-inset ring-pink-500/20">
                            最新
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500">ID: {item.id.substring(0, 8)}...</p>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                        title="ファイルをダウンロード"
                        onClick={() => handleDownload(item)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting === item.id}
                        className="h-8 w-8 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                        title="削除"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2">
                    <Button
                      onClick={() => handleApply(item)}
                      className="w-full h-8 bg-pink-500 text-white hover:bg-pink-600 font-bold transition-all"
                    >
                      <RotateCcw className="mr-2 h-3 w-3" />
                      このバージョンを適用する
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-blue-300">💡 安心ポイント</p>
              <p className="text-[10px] leading-relaxed text-blue-300/80">
                「適用」を押しても、管理画面上のプレビューが書き換わるだけです。実際のサイトには、その後「公開」ボタンを押すまで反映されません。
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
