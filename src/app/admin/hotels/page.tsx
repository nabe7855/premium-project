'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { exportHotelsToCSV, importHotelsFromCSV } from '@/lib/hotel/hotelActions';
import { Download, FileUp, Loader2, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function HotelCSVManagementPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportHotelsToCSV();
      if (result.success && result.csv) {
        // Blobを作成してダウンロード
        const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute(
          'download',
          `hotels_backup_${new Date().toISOString().split('T')[0]}.csv`,
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('エクスポートが完了しました');
      } else {
        toast.error(result.error || 'エクスポートに失敗しました');
      }
    } catch (error) {
      toast.error('エラーが発生しました');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('ファイルを選択してください');
      return;
    }

    setIsImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const result = await importHotelsFromCSV(text);
        if (result.success) {
          toast.success(`${result.count}件のホテルデータの処理が完了しました`);
          setFile(null);
        } else {
          toast.error(result.error || 'インポートに失敗しました');
        }
        setIsImporting(false);
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error('エラーが発生しました');
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">ホテルデータ管理</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Export Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              バックアップ・エクスポート
            </CardTitle>
            <CardDescription>
              現在のすべてのホテルと口コミデータをCSV形式でダウンロードします。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExport} disabled={isExporting} className="w-full">
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileUp className="mr-2 h-4 w-4" />
              )}
              CSVをダウンロード
            </Button>
          </CardContent>
        </Card>

        {/* Import Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              一括インポート・更新
            </CardTitle>
            <CardDescription>
              CSVファイルをアップロードして、ホテルデータを一括登録・更新します。
              既存のIDがある場合は更新、ない場合は新規作成されます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="file" accept=".csv" onChange={handleFileChange} disabled={isImporting} />
            <Button
              onClick={handleImport}
              disabled={!file || isImporting}
              variant="secondary"
              className="w-full"
            >
              {isImporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              インポート実行
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 rounded-lg border bg-slate-50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">運用のヒント</h2>
        <ul className="list-inside list-disc space-y-2 text-slate-600">
          <li>
            <strong>AIを活用した追加</strong>:
            スクレイピングしたデータをAIに渡し、「このCSVフォーマットに合わせて」と指示してデータを作成させるのが最短です。
          </li>
          <li>
            <strong>一括更新</strong>:
            エクスポートしたCSVをExcelで開き、一気に修正してインポートし直すことで一括更新が可能です。
          </li>
          <li>
            <strong>口コミの紐付け</strong>:
            ホテル1件につき複数行ある場合、それぞれの行に異なる口コミを記載することで、1つのホテルに複数の口コミを紐付けられます。
          </li>
        </ul>
      </div>
    </div>
  );
}
