'use client';

import { mockMonthlyTrend, mockStats } from '@/services/mockData';
import { AlertCircle, Award, MessageSquareText, PlayCircle, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AdminDashboard: React.FC = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">管理ダッシュボード</h2>
          <p className="text-sm text-slate-500">事後アンケート集計結果（改善専用データ）</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
            <PlayCircle className="h-4 w-4" />
            統計データを公開用に出力
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '累計回答数', value: mockStats.totalResponses, icon: Users, color: 'indigo' },
          {
            label: '平均満足度',
            value: `★ ${mockStats.averageSatisfaction}`,
            icon: Award,
            color: 'emerald',
          },
          { label: '改善要望', value: '42件', icon: AlertCircle, color: 'amber' },
          { label: '回答率', value: '38%', icon: TrendingUp, color: 'violet' },
        ].map((kpi, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {kpi.label}
              </span>
              <kpi.icon className={`h-5 w-5 text-${kpi.color}-500`} />
            </div>
            <div className="text-2xl font-bold text-slate-800">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Satisfaction Trend */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-700">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            満足度推移（月次）
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMonthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <YAxis
                  domain={[0, 5]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="satisfaction"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4f46e5' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-700">
            <Users className="h-4 w-4 text-emerald-500" />
            流入経路分析
          </h3>
          <div className="flex h-64 flex-col items-center md:flex-row">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockStats.sourceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockStats.sourceDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Improvement Ranking */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-sm font-bold text-slate-700">改善要望ランキング</h3>
          <div className="space-y-4">
            {mockStats.improvementRequests.map((req, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{req.name}</span>
                  <span>{req.count}件</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-indigo-500"
                    style={{ width: `${(req.count / mockStats.totalResponses) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Service Ranking */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-sm font-bold text-slate-700">期待される新サービス</h3>
          <div className="space-y-4">
            {mockStats.serviceRequests.map((req, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{req.name}</span>
                  <span>{req.count}件</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${(req.count / mockStats.totalResponses) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Free Text Samples (Mock) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-700">
          <MessageSquareText className="h-4 w-4 text-slate-400" />
          自由記述フィードバック（最新抜粋）
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            '受付の方の対応がとても丁寧で安心しました。サイトの予約カレンダーがもう少し見やすいと嬉しいです。',
            '施術は最高でした。ただ、部屋の温度が少し低く感じたので、調整できるようにしてほしいです。',
            'YouTubeを見て来店しました。動画通りの雰囲気で楽しめました。リピーター向けの割引があれば嬉しいです。',
            '技術にムラがあると感じることがありますが、今回の方は非常に上手でした。指名がしやすくなると助かります。',
          ].map((text, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm italic leading-relaxed text-slate-600"
            >
              "{text}"
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
