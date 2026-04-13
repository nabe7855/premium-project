'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  TrendingUp, Users, Target, MousePointer2, 
  Calendar, Sparkles, Loader2, RefreshCw, ChevronRight,
  BarChart3, PieChart as PieChartIcon, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';

interface RecruitAnalyticsProps {
  applications: any[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function RecruitAnalytics({ applications }: RecruitAnalyticsProps) {
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year' | 'all'>('month');
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 1. Data Processing
  const stats = useMemo(() => {
    // 期間フィルタリング
    const now = new Date();
    const filtered = applications.filter(app => {
      const date = new Date(app.createdAt);
      if (period === 'month') return (now.getTime() - date.getTime()) < 30 * 24 * 60 * 60 * 1000;
      if (period === 'quarter') return (now.getTime() - date.getTime()) < 90 * 24 * 60 * 60 * 1000;
      if (period === 'year') return (now.getTime() - date.getTime()) < 365 * 24 * 60 * 60 * 1000;
      return true;
    });

    // 流入経路集計
    const sourceMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {};
    const keywordMap: Record<string, number> = {};
    const storeMap: Record<string, number> = {};
    
    // 時系列データ（直近30日など）
    const timeSeriesMap: Record<string, number> = {};

    filtered.forEach(app => {
      // Source
      const source = app.details?.source || (app.details?.attribution?.referrer ? new URL(app.details.attribution.referrer).hostname : '直接/不明');
      sourceMap[source] = (sourceMap[source] || 0) + 1;

      // Status
      statusMap[app.status] = (statusMap[app.status] || 0) + 1;

      // Keyword
      if (app.details?.keyword) {
        keywordMap[app.details.keyword] = (keywordMap[app.details.keyword] || 0) + 1;
      }

      // Store
      storeMap[app.store] = (storeMap[app.store] || 0) + 1;

      // Time Series (YYYY-MM-DD)
      const dateKey = new Date(app.createdAt).toISOString().split('T')[0];
      timeSeriesMap[dateKey] = (timeSeriesMap[dateKey] || 0) + 1;
    });

    return {
      totalCount: filtered.length,
      sources: Object.entries(sourceMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      statuses: Object.entries(statusMap).map(([name, value]) => ({ name, value })),
      keywords: Object.entries(keywordMap).map(([name, value]) => ({ name, value })).slice(0, 10),
      stores: Object.entries(storeMap).map(([name, value]) => ({ name, value })),
      timeSeries: Object.entries(timeSeriesMap).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date))
    };
  }, [applications, period]);

  // 2. AI Analysis Call
  const generateAIReport = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/recruit-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats, period }),
      });
      const data = await res.json();
      setAiReport(data.content);
    } catch (error) {
      console.error('AI Report Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (stats.totalCount > 0 && !aiReport) {
      generateAIReport();
    }
  }, [stats.totalCount]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
            <Calendar size={16} /> 分析期間
          </div>
          <Select value={period} onValueChange={(val: any) => setPeriod(val)}>
            <SelectTrigger className="w-[180px] bg-slate-950/50 border-slate-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 text-white border-slate-800">
              <SelectItem value="month">直近30日間</SelectItem>
              <SelectItem value="quarter">直近90日間</SelectItem>
              <SelectItem value="year">1年間</SelectItem>
              <SelectItem value="all">全期間</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateAIReport} 
          disabled={isAnalyzing}
          className="gap-2 border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800"
        >
          {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          AIレポートを再生成
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500 uppercase">総応募数</p>
                  <Users className="text-blue-400" size={16} />
                </div>
                <h4 className="text-3xl font-black text-white mt-1">{stats.totalCount}</h4>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500 uppercase">採用決定数</p>
                  <Target className="text-emerald-400" size={16} />
                </div>
                <h4 className="text-3xl font-black text-white mt-1">
                  {stats.statuses.find(s => s.name === 'hired')?.value || 0}
                </h4>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500 uppercase">未対応数</p>
                  <Activity className="text-yellow-400" size={16} />
                </div>
                <h4 className="text-3xl font-black text-white mt-1">
                  {stats.statuses.find(s => s.name === 'pending')?.value || 0}
                </h4>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <TrendingUp size={18} className="text-blue-400" /> 応募推移
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={(val) => val.slice(5)} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base text-white">流入経路 (ホスト名/媒体)</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.sources} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base text-white">選考ステータス分布</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.statuses}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.statuses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Side Panel */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-950/50 to-slate-900/50 border-indigo-500/30 shadow-xl shadow-indigo-500/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-indigo-500 text-white hover:bg-indigo-600 animate-pulse">
                  AI INSIGHT
                </Badge>
                <Sparkles size={18} className="text-indigo-400" />
              </div>
              <CardTitle className="text-xl font-black text-white mt-3 italic uppercase tracking-tighter">
                Strategy Action Plan
              </CardTitle>
              <CardDescription className="text-indigo-300/60 text-xs">
                Gemini 1.5 Flash による採用戦略分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
                    <Loader2 size={40} className="text-indigo-500 animate-spin relative" />
                  </div>
                  <p className="text-xs font-bold text-indigo-300 animate-pulse text-center">
                    直近の応募データを<br />深層解析中...
                  </p>
                </div>
              ) : aiReport ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20 text-slate-300 leading-relaxed text-[13px]">
                    <ReactMarkdown>{aiReport}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-xs text-slate-500">データが不足しているか、エラーが発生しました。</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400 uppercase tracking-widest font-black">店舗別応募シェア</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.stores.map((s, idx) => (
                <div key={s.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-bold">{s.name}</span>
                    <span className="text-slate-500">{((s.value / stats.totalCount) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${(s.value / stats.totalCount) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
