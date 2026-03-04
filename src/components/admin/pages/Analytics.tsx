'use client';

import Card from '@/components/admin/ui/Card';
import StoreSelector from '@/components/admin/ui/StoreSelector';
import { getAnalyticsData, getAvailableMonths } from '@/lib/actions/analytics';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#3E7BFA', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Analytics() {
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMonths = async () => {
      const months = await getAvailableMonths(selectedStore);
      setAvailableMonths(months);
      // // もし現在選択中の月が取得した利用可能日時に含まれていなければ 'all' にリセットする
      if (selectedMonth !== 'all' && !months.includes(selectedMonth)) {
        setSelectedMonth('all');
      }
    };
    fetchMonths();
  }, [selectedStore]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getAnalyticsData(selectedStore, selectedMonth);
      setData(result);
      setIsLoading(false);
    };
    fetchData();
  }, [selectedStore, selectedMonth]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-4 text-center text-red-500">データが読み込めませんでした。</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">予約・顧客データ分析</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-xl border border-gray-700/50 bg-brand-secondary p-3 shadow-lg">
            <label
              htmlFor="month-selector"
              className="text-sm font-medium text-brand-text-secondary"
            >
              対象月を選択
            </label>
            <select
              id="month-selector"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-md border border-indigo-500/50 bg-indigo-500/10 p-2 text-sm font-bold text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="all" className="bg-white text-black">
                全期間
              </option>
              {availableMonths.map((m) => (
                <option key={m} value={m} className="bg-white text-black">
                  {m.replace('-', '年 ')}月
                </option>
              ))}
            </select>
          </div>
          <StoreSelector selectedStore={selectedStore} onStoreChange={setSelectedStore} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card title="累計完了予約数">
          <p className="py-6 text-center text-4xl font-bold">
            {data.totalCompleted}{' '}
            <span className="text-lg font-normal text-brand-text-secondary">件</span>
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="月別予約完了推移">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    borderColor: '#374151',
                    color: '#fff',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" name="完了数" fill="#3E7BFA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="年代別分布 (カウンセリング/アンケートより)">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.ageChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.ageChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    borderColor: '#374151',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="集客経路（アンケート結果）">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.sourceChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name }: any) => name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.sourceChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    borderColor: '#374151',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="満足度分布">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.satisfactionChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    borderColor: '#374151',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" name="回答数" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="お客様の悩みや関心事（上位抽出）">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.needsChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    borderColor: '#374151',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" name="該当数" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
