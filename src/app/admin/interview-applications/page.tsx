'use client';

import { useEffect, useState } from 'react';
import { getInterviewApplications, updateInterviewApplicationStatus } from '@/lib/actions/interview';

export default function InterviewApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = async () => {
    setIsLoading(true);
    const result = await getInterviewApplications();
    if (result.success && result.applications) {
      setApplications(result.applications);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const result = await updateInterviewApplicationStatus(id, newStatus);
    if (result.success) {
      fetchApplications();
    } else {
      alert('ステータスの更新に失敗しました: ' + result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-brand-text">体験談インタビュー応募一覧</h1>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">応募日時</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">テーマ</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ご利用時期</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">希望手段</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">連絡先</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">読み込み中...</td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">応募はまだありません。</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(app.created_at).toLocaleString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={app.theme}>{app.theme}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{app.usage_period}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{app.interview_method}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={app.contact_info}>{app.contact_info}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent ${
                          app.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : app.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="pending">未対応</option>
                        <option value="contacted">連絡済み</option>
                        <option value="published">記事化完了</option>
                        <option value="declined">辞退・見送り</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
