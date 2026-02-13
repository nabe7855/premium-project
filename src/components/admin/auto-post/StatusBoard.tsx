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
    <div className="space-y-4 duration-500 animate-in fade-in md:space-y-6">
      {/* ワーカー概要カード */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-white/5 bg-brand-primary/40 p-4 md:flex-row md:items-center md:rounded-2xl md:p-6">
        <div className="flex items-center gap-3 md:gap-4">
          <div
            className={`rounded-xl p-3 md:rounded-2xl md:p-4 ${data?.worker.isActive ? 'bg-green-500/10' : 'bg-red-500/10'}`}
          >
            <Activity
              className={`h-6 w-6 md:h-8 md:w-8 ${data?.worker.isActive ? 'animate-pulse text-green-500' : 'text-red-500'}`}
            />
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-white md:text-lg">
              システム状況:
              <span className={data?.worker.isActive ? 'text-green-500' : 'text-red-500'}>
                {data?.worker.isActive ? '稼働中' : 'オフライン'}
              </span>
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-brand-text-secondary md:mt-1 md:text-sm">
              <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
              最終確認:{' '}
              {data?.worker.lastActiveAt
                ? new Date(data.worker.lastActiveAt).toLocaleString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })
                : '記録なし'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsLoading(true);
            fetchStatus();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2.5 text-xs font-medium text-white transition-all hover:bg-white/10 md:w-auto md:text-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 md:h-4 md:w-4 ${isLoading ? 'animate-spin' : ''}`} />
          最新の状態に更新
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-2">
        {/* 更新ボタン実行履歴 */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-brand-primary/40 md:rounded-2xl">
          <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 p-3 text-[10px] font-bold uppercase tracking-wider text-white md:p-4 md:text-sm">
            <RefreshCw className="h-3.5 w-3.5 text-brand-accent md:h-4 md:w-4" />
            更新ボタン実行履歴 (直近10件)
          </div>
          <div className="max-h-[300px] flex-1 overflow-x-auto overflow-y-auto md:max-h-[400px]">
            {data?.updateLogs.length === 0 ? (
              <div className="p-8 text-center text-[10px] italic text-brand-text-secondary md:text-xs">
                履歴がありません。
              </div>
            ) : (
              <table className="min-w-full text-left text-[10px] md:text-xs">
                <thead className="sticky top-0 z-10 border-b border-white/5 bg-brand-primary text-brand-text-secondary">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-2 font-medium md:px-4 md:py-3">
                      日時
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium md:px-4 md:py-3">
                      サイト
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium md:px-4 md:py-3">
                      結果
                    </th>
                    <th className="px-3 py-2 font-medium md:px-4 md:py-3">内容</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.updateLogs.map((log) => (
                    <tr key={log.id} className="transition-colors hover:bg-white/5">
                      <td className="whitespace-nowrap px-3 py-2 text-brand-text-secondary md:px-4 md:py-3">
                        {new Date(log.created_at).toLocaleString('ja-JP', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[8px] font-bold uppercase md:text-[10px] ${
                            log.site_name === 'kaikan'
                              ? 'bg-blue-400/10 text-blue-400'
                              : 'bg-purple-400/10 text-purple-400'
                          }`}
                        >
                          {log.site_name}
                        </span>
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3">
                        {log.status === 'success' || log.status === 'skipped' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 md:h-4 md:w-4" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-500 md:h-4 md:w-4" />
                        )}
                      </td>
                      <td className="max-w-[120px] truncate border-l px-3 py-2 text-brand-text-secondary md:max-w-[200px] md:border-l-0 md:px-4 md:py-3">
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
        <div className="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-brand-primary/40 md:rounded-2xl">
          <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 p-3 text-[10px] font-bold uppercase tracking-wider text-white md:p-4 md:text-sm">
            <Terminal className="h-3.5 w-3.5 text-brand-accent md:h-4 md:w-4" />
            自動投稿アクションログ
          </div>
          <div className="max-h-[300px] flex-1 space-y-2 overflow-y-auto p-3 md:max-h-[400px] md:space-y-3 md:p-4">
            {data?.postLogs.length === 0 ? (
              <div className="py-8 text-center text-[10px] italic text-brand-text-secondary md:text-xs">
                ログがありません。
              </div>
            ) : (
              data?.postLogs.map((log) => (
                <div key={log.id} className="flex gap-2 text-[10px] md:gap-3 md:text-xs">
                  <span className="whitespace-nowrap pt-0.5 font-mono text-brand-text-secondary opacity-50">
                    [
                    {new Date(log.created_at).toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    ]
                  </span>
                  <div className="min-w-0 space-y-0.5 md:space-y-1">
                    <p className="break-words text-white">
                      <span
                        className={`mr-1.5 font-bold md:mr-2 ${
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
                      <p className="truncate text-[9px] italic text-brand-text-secondary md:text-[10px]">
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
