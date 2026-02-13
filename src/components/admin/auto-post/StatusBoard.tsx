'use client';

import { Activity, CheckCircle2, Clock, RefreshCw, Terminal, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatusData {
  worker: {
    isActive: boolean;
    lastActiveAt: string | null;
  };
  updateLogs: any[];
  postLogs: any[];
}

export default function StatusBoard() {
  const [data, setData] = useState<StatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/ai/get-status');
      if (!response.ok) throw new Error('取得に失敗しました');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // 30秒ごとに更新
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 rounded-2xl bg-white/5" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-64 rounded-2xl bg-white/5" />
          <div className="h-64 rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 duration-500 animate-in fade-in">
      {/* ワーカー概要カード */}
      <div className="flex flex-col justify-between gap-6 rounded-2xl border border-white/5 bg-brand-primary/40 p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div
            className={`rounded-2xl p-4 ${data?.worker.isActive ? 'bg-green-500/10' : 'bg-red-500/10'}`}
          >
            <Activity
              className={`h-8 w-8 ${data?.worker.isActive ? 'animate-pulse text-green-500' : 'text-red-500'}`}
            />
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              システム稼働状況:
              <span className={data?.worker.isActive ? 'text-green-500' : 'text-red-500'}>
                {data?.worker.isActive ? '正常稼働中' : 'オフライン'}
              </span>
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-text-secondary">
              <Clock className="h-3.5 w-3.5" />
              最終確認:{' '}
              {data?.worker.lastActiveAt
                ? new Date(data.worker.lastActiveAt).toLocaleString('ja-JP')
                : '記録なし'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsLoading(true);
            fetchStatus();
          }}
          className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          最新の状態に更新
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* 更新ボタン実行履歴 */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-brand-primary/40">
          <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 p-4 text-sm font-bold uppercase tracking-wider text-white">
            <RefreshCw className="h-4 w-4 text-brand-accent" />
            更新ボタン実行履歴 (直近10件)
          </div>
          <div className="max-h-[400px] flex-1 overflow-y-auto">
            {data?.updateLogs.length === 0 ? (
              <div className="p-8 text-center text-xs italic text-brand-text-secondary">
                履歴がありません。
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 border-b border-white/5 bg-brand-primary/95 text-brand-text-secondary backdrop-blur-sm">
                  <tr>
                    <th className="px-4 py-3 font-medium">日時</th>
                    <th className="px-4 py-3 font-medium">サイト</th>
                    <th className="px-4 py-3 font-medium">結果</th>
                    <th className="px-4 py-3 font-medium">メッセージ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.updateLogs.map((log) => (
                    <tr key={log.id} className="transition-colors hover:bg-white/5">
                      <td className="whitespace-nowrap px-4 py-3 text-brand-text-secondary">
                        {new Date(log.created_at).toLocaleString('ja-JP', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            log.site_name === 'kaikan'
                              ? 'bg-blue-400/10 text-blue-400'
                              : 'bg-purple-400/10 text-purple-400'
                          }`}
                        >
                          {log.site_name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {log.status === 'success' || log.status === 'skipped' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </td>
                      <td
                        className="max-w-[150px] truncate px-4 py-3 text-brand-text-secondary"
                        title={log.message}
                      >
                        {log.message || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 自動投稿アクションログ */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-brand-primary/40">
          <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 p-4 text-sm font-bold uppercase tracking-wider text-white">
            <Terminal className="h-4 w-4 text-brand-accent" />
            自動投稿アクションログ
          </div>
          <div className="max-h-[400px] flex-1 space-y-3 overflow-y-auto p-4">
            {data?.postLogs.length === 0 ? (
              <div className="py-8 text-center text-xs italic text-brand-text-secondary">
                ログがありません。
              </div>
            ) : (
              data?.postLogs.map((log) => (
                <div key={log.id} className="flex gap-3 text-xs">
                  <span className="whitespace-nowrap pt-0.5 font-mono text-brand-text-secondary opacity-50">
                    [
                    {new Date(log.created_at).toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    ]
                  </span>
                  <div className="space-y-1">
                    <p className="text-white">
                      <span
                        className={`mr-2 font-bold ${
                          log.action === 'posted'
                            ? 'text-brand-accent'
                            : log.action === 'failed'
                              ? 'text-red-400'
                              : 'text-blue-400'
                        }`}
                      >
                        {log.action.toUpperCase()}
                      </span>
                      {log.message}
                    </p>
                    {log.auto_posts && (
                      <p className="text-[10px] italic text-brand-text-secondary">
                        対象: {log.auto_posts.title} ({log.auto_posts.target_site})
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
