'use client';

import {
  deleteRecruitApplication,
  getRecruitApplications,
  updateApplicationStatus,
  updateRecruitAdminData,
} from '@/actions/recruit';
import { Save, ListFilter, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecruitAnalytics from '@/components/admin/recruit/RecruitAnalytics';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    contacted: 'bg-blue-100 text-blue-800',
    interviewed: 'bg-purple-100 text-purple-800',
    hired: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  const labels: Record<string, string> = {
    pending: '未対応',
    contacted: '連絡済み',
    interviewed: '面接済み',
    hired: '採用',
    rejected: '不採用',
  };
  return <Badge className={styles[status]}>{labels[status] || status}</Badge>;
};

export default function InterviewReservationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [adminMemo, setAdminMemo] = useState<string>('');
  const [interviewDate, setInterviewDate] = useState<string>('');
  const [isSavingAdminData, setIsSavingAdminData] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    const data = await getRecruitApplications();
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    const result = await updateApplicationStatus(id, status);
    if (result.success) {
      toast.success('ステータスを更新しました');
      fetchApplications();
    } else {
      toast.error('更新に失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteRecruitApplication(id);
    if (result.success) {
      toast.success('応募データを削除しました');
      fetchApplications();
    } else {
      toast.error('削除に失敗しました');
    }
  };

  const handleOpenDetail = (app: any) => {
    setSelectedApp(app);
    setAdminMemo(app.adminMemo || '');
    setInterviewDate(app.interviewDate || '');
  };

  const handleSaveAdminData = async () => {
    if (!selectedApp) return;
    console.log('🖱️ Save button clicked. Sending to server:', { id: selectedApp.id, adminMemo, interviewDate });
    setIsSavingAdminData(true);
    const result = await updateRecruitAdminData(selectedApp.id, {
      adminMemo,
      interviewDate,
    });
    console.log('📡 Server responded:', result);
    if (result.success) {
      toast.success('管理情報を保存しました');
      fetchApplications();
    } else {
      toast.error('保存に失敗しました');
    }
    setIsSavingAdminData(false);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const storeLower = (app.store || '').toLowerCase();
    const matchesStore =
      storeFilter === 'all' ||
      (storeFilter === 'fukuoka' && (storeLower === 'fukuoka' || app.store === '福岡店')) ||
      (storeFilter === 'yokohama' && (storeLower === 'yokohama' || app.store === '横浜店')) ||
      (storeFilter === 'tokyo' && (storeLower === 'tokyo' || app.store === '東京店'));
    const matchesName = app.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesStore && matchesName;
  });

  return (
    <div className="space-y-6 p-6 min-h-screen bg-[#050608]">
      <Tabs defaultValue="list" className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">求人・面接管理</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Applicant Pipeline & Intelligence</p>
          </div>
          <TabsList className="bg-slate-900 border border-slate-800 p-1">
            <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <ListFilter size={16} /> 応募者一覧
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <BarChart3 size={16} /> 募集分析レポート
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="space-y-6 outline-none">
          <div className="flex flex-wrap items-center justify-end gap-4">
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-slate-900 border-slate-800 text-slate-300">
                  <SelectValue placeholder="状況フィルタ" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-white border-slate-800 shadow-xl">
                  <SelectItem value="all">全ステータス</SelectItem>
                  <SelectItem value="pending">未対応</SelectItem>
                  <SelectItem value="contacted">連絡済み</SelectItem>
                  <SelectItem value="interviewed">面接済み</SelectItem>
                  <SelectItem value="hired">採用</SelectItem>
                  <SelectItem value="rejected">不採用</SelectItem>
                </SelectContent>
              </Select>

              <Select value={storeFilter} onValueChange={setStoreFilter}>
                <SelectTrigger className="w-[150px] bg-slate-900 border-slate-800 text-slate-300">
                  <SelectValue placeholder="店舗フィルタ" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-white border-slate-800 shadow-xl">
                  <SelectItem value="all">全店舗</SelectItem>
                  <SelectItem value="fukuoka">福岡店</SelectItem>
                  <SelectItem value="yokohama">横浜店</SelectItem>
                  <SelectItem value="tokyo">東京店</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="名前で検索..."
                className="w-[200px] bg-slate-900 border-slate-800 text-white placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

      <Card className="border-slate-800 bg-slate-900/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="border-slate-800">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="font-bold text-slate-300">名前</TableHead>
                <TableHead className="font-bold text-slate-300">種別</TableHead>
                <TableHead className="font-bold text-slate-300">店舗</TableHead>
                <TableHead className="font-bold text-slate-300">応募日時</TableHead>
                <TableHead className="font-bold text-slate-300">ステータス</TableHead>
                <TableHead className="text-right font-bold text-slate-300">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center text-slate-400">
                    読み込み中...
                  </TableCell>
                </TableRow>
              ) : filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <TableRow key={app.id} className="border-slate-800 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{app.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {app.type === 'chatbot' ? 'チャット' : '簡易'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{app.store}</TableCell>
                    <TableCell className="text-slate-300">
                      {new Date(app.createdAt).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDetail(app)}>
                            詳細を見る
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[95vh] max-w-4xl overflow-y-auto bg-white p-0 text-slate-900 shadow-2xl">
                          {selectedApp && (
                            <div className="flex flex-col">
                              {/* Header Section */}
                              <div className="border-b bg-slate-50 p-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Badge className="mb-2" variant="secondary">
                                        {selectedApp.type === 'chatbot'
                                          ? '🤖 チャットボット応募'
                                          : '📝 簡易WEB応募'}
                                      </Badge>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="mb-2 h-6 w-6 text-slate-400 hover:text-red-500"
                                          >
                                            <span className="text-sm">🗑️</span>
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-white">
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>応募データの削除</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              この応募者情報を削除しますか？この操作は取り消せません。
                                              添付されている写真もストレージから完全に削除されます。
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleDelete(selectedApp.id)}
                                              className="bg-red-600 hover:bg-red-700"
                                            >
                                              削除する
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                    <DialogTitle className="text-3xl font-bold text-slate-900">
                                      {selectedApp.name}
                                    </DialogTitle>
                                    <p className="mt-1 text-sm text-slate-500">
                                      応募日時:{' '}
                                      {new Date(selectedApp.createdAt).toLocaleString('ja-JP')} ・
                                      希望店舗: {selectedApp.store}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                      現在のステータス
                                    </p>
                                    <div className="mt-1">
                                      <StatusBadge status={selectedApp.status} />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-0 md:grid-cols-12">
                                {/* Left Column: Details */}
                                <div className="col-span-1 border-r p-8 md:col-span-7">
                                  <div className="space-y-8">
                                    {/* Contact & Personal */}
                                    <section>
                                      <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                                        <span className="h-4 w-1 bg-amber-500"></span>
                                        基本情報
                                      </h3>
                                      <div className="rounded-xl border bg-slate-50/50 p-4">
                                        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
                                          <div>
                                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                              電話番号
                                            </dt>
                                            <dd className="mt-0.5 font-semibold text-slate-700">
                                              {selectedApp.phone || '-'}
                                            </dd>
                                          </div>
                                          <div>
                                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                              メール
                                            </dt>
                                            <dd className="mt-0.5 font-semibold text-slate-700">
                                              {selectedApp.email || '-'}
                                            </dd>
                                          </div>
                                          <div className="col-span-2">
                                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                              住所
                                            </dt>
                                            <dd className="mt-0.5 font-semibold text-slate-700">
                                              {selectedApp.address || '-'}
                                            </dd>
                                          </div>
                                          <div>
                                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                              年齢
                                            </dt>
                                            <dd className="mt-0.5 font-semibold text-slate-700">
                                              {selectedApp.age ? `${selectedApp.age} 歳` : '-'}
                                            </dd>
                                          </div>
                                          <div>
                                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                              身長 / 体重
                                            </dt>
                                            <dd className="mt-0.5 font-semibold text-slate-700">
                                              {selectedApp.height ? `${selectedApp.height}cm` : '-'}{' '}
                                              /{' '}
                                              {selectedApp.weight ? `${selectedApp.weight}kg` : '-'}
                                            </dd>
                                          </div>
                                        </dl>
                                      </div>
                                    </section>

                                    {/* Message / PR */}
                                    {(selectedApp.message ||
                                      (selectedApp.details as any)?.experience) && (
                                      <section>
                                        <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                                          <span className="h-4 w-1 bg-amber-500"></span>
                                          自己PR・メッセージ
                                        </h3>
                                        <div className="space-y-4 rounded-xl border bg-slate-50/50 p-4">
                                          {selectedApp.message && (
                                            <div>
                                              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                自己PR・質問
                                              </dt>
                                              <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                                {selectedApp.message}
                                              </dd>
                                            </div>
                                          )}
                                          {(selectedApp.details as any)?.experience && (
                                            <div>
                                              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                業務経歴
                                              </dt>
                                              <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                                {(selectedApp.details as any).experience}
                                              </dd>
                                            </div>
                                          )}
                                          {(selectedApp.details as any)?.qualifications && (
                                            <div>
                                              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                資格
                                              </dt>
                                              <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                                {(selectedApp.details as any).qualifications}
                                              </dd>
                                            </div>
                                          )}
                                        </div>
                                      </section>
                                    )}

                                    {/* Extra Details */}
                                    {selectedApp.details && (
                                      <section>
                                        <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                                          <span className="h-4 w-1 bg-amber-500"></span>
                                          詳細回答
                                        </h3>
                                        <div className="rounded-xl border bg-slate-50/50 p-4">
                                          <dl className="grid grid-cols-2 gap-4">
                                            <div>
                                              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                就業状況
                                              </dt>
                                              <dd className="mt-0.5 text-sm font-semibold text-slate-700">
                                                {(selectedApp.details as any).employment ===
                                                'employed'
                                                  ? '就業中'
                                                  : '未就業'}
                                              </dd>
                                            </div>
                                            <div>
                                              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                セラピスト経験
                                              </dt>
                                              <dd className="mt-0.5 text-sm font-semibold text-slate-700">
                                                {(selectedApp.details as any).therapist_exp ===
                                                'yes'
                                                  ? 'あり'
                                                  : 'なし'}
                                              </dd>
                                            </div>
                                            <div>
                                              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                YouTube出演
                                              </dt>
                                              <dd className="mt-0.5 text-sm font-semibold text-slate-700">
                                                {(selectedApp.details as any).youtube === 'yes'
                                                  ? '可能'
                                                  : (selectedApp.details as any).youtube ===
                                                      'mask_ok'
                                                    ? 'マスク可'
                                                    : '不可'}
                                              </dd>
                                            </div>
                                            <div>
                                              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                深夜交通手段
                                              </dt>
                                              <dd className="mt-0.5 text-sm font-semibold text-slate-700">
                                                {(selectedApp.details as any).transport === 'yes'
                                                  ? '出せる'
                                                  : '出せない'}
                                              </dd>
                                            </div>
                                            <div className="col-span-2">
                                              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                流入元 / キーワード
                                              </dt>
                                              <dd className="mt-0.5 text-sm font-semibold text-slate-700">
                                                {(selectedApp.details as any).source || '-'}{' '}
                                                {(selectedApp.details as any).keyword
                                                  ? ` (${(selectedApp.details as any).keyword})`
                                                  : ''}
                                              </dd>
                                            </div>
                                          </dl>
                                        </div>
                                      </section>
                                    )}

                                    {/* System Attribution (New) */}
                                    {(selectedApp.details as any)?.attribution && (
                                      <section>
                                        <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                                          <span className="h-4 w-1 bg-indigo-500"></span>
                                          システム検出の流入情報
                                        </h3>
                                        <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                                          <dl className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                              <dt className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                                リファラー (遷移元)
                                              </dt>
                                              <dd className="mt-0.5 break-all text-xs font-medium text-slate-600">
                                                {(selectedApp.details as any).attribution.referrer ||
                                                  '直接入力 / 不明'}
                                              </dd>
                                            </div>
                                            <div>
                                              <dt className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                                広告元 (UTM Source)
                                              </dt>
                                              <dd className="mt-0.5 text-sm font-semibold text-slate-700">
                                                {(selectedApp.details as any).attribution
                                                  .utm_source || '-'}
                                              </dd>
                                            </div>
                                            <div>
                                              <dt className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                                キャンペーン
                                              </dt>
                                              <dd className="mt-0.5 text-sm font-semibold text-slate-700">
                                                {(selectedApp.details as any).attribution
                                                  .utm_campaign || '-'}
                                              </dd>
                                            </div>
                                            <div>
                                              <dt className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                                デバイス / 初回訪問
                                              </dt>
                                              <dd className="mt-0.5 text-xs text-slate-600">
                                                <span className="font-bold">
                                                  {(selectedApp.details as any).attribution.device ===
                                                  'mobile'
                                                    ? '📱 モバイル'
                                                    : '💻 PC'}
                                                </span>
                                                <br />
                                                {new Date(
                                                  (selectedApp.details as any).attribution
                                                    .first_visit_at,
                                                ).toLocaleString('ja-JP')}
                                              </dd>
                                            </div>
                                            {/* Google Click ID (GCLID) がある場合 */}
                                            {(selectedApp.details as any).attribution.gclid && (
                                              <div>
                                                <dt className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                                  Google広告ID
                                                </dt>
                                                <dd className="mt-0.5 truncate text-[10px] text-slate-500">
                                                  {(selectedApp.details as any).attribution.gclid}
                                                </dd>
                                              </div>
                                            )}
                                          </dl>
                                        </div>
                                      </section>
                                    )}

                                    {/* Simulation Result */}
                                    {selectedApp.simulationResult && (
                                      <section>
                                        <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                                          <span className="h-4 w-1 bg-amber-500"></span>
                                          収入シミュレーション
                                        </h3>
                                        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
                                          <div className="absolute -right-4 -top-4 text-6xl opacity-10">
                                            💰
                                          </div>
                                          <div className="relative z-10 text-center md:text-left">
                                            <p className="text-xs font-bold text-amber-700">
                                              診断された想定月収
                                            </p>
                                            <div className="mt-2 flex items-baseline justify-center gap-2 md:justify-start">
                                              <span className="text-5xl font-black tracking-tight text-amber-600">
                                                {(selectedApp.simulationResult as any).income}
                                              </span>
                                              <span className="text-xl font-bold text-amber-700">
                                                万円 / 月
                                              </span>
                                            </div>
                                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1">
                                              <span className="text-xs font-bold text-amber-800">
                                                性格適性:{' '}
                                                {(selectedApp.simulationResult as any).personality}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </section>
                                    )}

                                    {/* Status Update */}
                                    <section className="pt-4">
                                      <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                                        <span className="h-4 w-1 bg-blue-500"></span>
                                        対応状況の更新
                                      </h3>
                                      <div className="flex gap-2">
                                        <Select
                                          defaultValue={selectedApp.status}
                                          onValueChange={(val: string) =>
                                            handleStatusUpdate(selectedApp.id, val)
                                          }
                                        >
                                          <SelectTrigger className="bg-white">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="bg-white shadow-xl">
                                            <SelectItem value="pending">未対応</SelectItem>
                                            <SelectItem value="contacted">連絡済み</SelectItem>
                                            <SelectItem value="interviewed">面接済み</SelectItem>
                                            <SelectItem value="hired">採用</SelectItem>
                                            <SelectItem value="rejected">不採用</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </section>
                                  </div>
                                </div>

                                {/* Right Column: Photos */}
                                <div className="col-span-1 bg-slate-50/30 p-8 md:col-span-5">
                                  <section>
                                    <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                                      <span className="h-4 w-1 bg-emerald-500"></span>
                                      添付写真 ({selectedApp.photos?.length || 0}枚)
                                    </h3>
                                    {selectedApp.photos && selectedApp.photos.length > 0 ? (
                                      <div className="grid grid-cols-2 gap-3">
                                        {selectedApp.photos.map((photo: any, i: number) => (
                                          <div
                                            key={photo.id}
                                            className="group relative overflow-hidden rounded-xl border-2 border-white shadow-md transition-all hover:scale-[1.02]"
                                          >
                                            <img
                                              src={photo.url}
                                              className="aspect-[3/4] w-full object-cover"
                                              alt={`Portrait ${i + 1}`}
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="flex h-32 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                                        <span className="text-3xl">📷</span>
                                        <p className="mt-2 text-sm font-medium">
                                          写真が添付されていません
                                        </p>
                                      </div>
                                    )}
                                  </section>

                                  <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                        <Save size={16} className="text-blue-500" />
                                        管理者用メモ / 予定
                                      </h3>
                                      <Button
                                        size="sm"
                                        onClick={handleSaveAdminData}
                                        disabled={isSavingAdminData}
                                        className="h-8 bg-blue-600 hover:bg-blue-700"
                                      >
                                        {isSavingAdminData ? '保存中...' : '保存する'}
                                      </Button>
                                    </div>

                                    <div className="space-y-4">
                                      <div>
                                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                          面接予定日時
                                        </label>
                                        <Input
                                          placeholder="例: 3/15 14:00〜"
                                          value={interviewDate}
                                          onChange={(e) => setInterviewDate(e.target.value)}
                                          className="border-slate-200 bg-slate-50"
                                        />
                                      </div>

                                      <div>
                                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                          管理者メモ
                                        </label>
                                        <Textarea
                                          placeholder="面接時の印象や特記事項など..."
                                          value={adminMemo}
                                          onChange={(e) => setAdminMemo(e.target.value)}
                                          rows={6}
                                          className="resize-none border-slate-200 bg-slate-50 text-sm"
                                        />
                                      </div>
                                    </div>

                                    <p className="text-[10px] text-slate-400">
                                      ※メモ内容は管理者間でのみ共有されます。
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <div className="rounded-full bg-slate-100 p-6 text-5xl">🔍</div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-slate-600">
                          一致するデータがありません
                        </p>
                        <p className="text-sm text-slate-400">
                          検索条件やフィルタ設定を変更してみてください。
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setStatusFilter('all');
                          setStoreFilter('all');
                          setSearchTerm('');
                        }}
                        className="mt-2"
                      >
                        フィルタをリセット
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="outline-none">
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400">
              分析データを読み込み中...
            </div>
          ) : (
            <RecruitAnalytics applications={applications} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
