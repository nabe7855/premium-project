'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  TrendingUp, Users, Target, MousePointer2, 
  Calendar, Sparkles, Loader2, RefreshCw, ChevronRight,
  BarChart3, PieChart as PieChartIcon, Activity, Monitor, Smartphone, CircleHelp
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

    // 集計用マップ
    const sourceMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {};
    const keywordMap: Record<string, number> = {};
    const storeMap: Record<string, number> = {};
    const deviceMap: Record<string, number> = { mobile: 0, pc: 0, unknown: 0 };
    const timeSeriesMap: Record<string, number> = {};

    filtered.forEach(app => {
      // Source / Referrer
      const source = app.details?.source || (app.details?.attribution?.referrer ? new URL(app.details.attribution.referrer).hostname : '直接入力 / 不明');
      sourceMap[source] = (sourceMap[source] || 0) + 1;

      // Status
      statusMap[app.status] = (statusMap[app.status] || 0) + 1;

      // Device
      const device = app.details?.attribution?.device || 'unknown';
      if (device === 'mobile') deviceMap.mobile++;
      else if (device === 'desktop' || device === 'pc') deviceMap.pc++;
      else deviceMap.unknown++;

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
      sources: Object.entries(sourceMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10),
      statuses: Object.entries(statusMap).map(([name, value]) => ({ name, value })),
      devices: [
        { name: 'モバイル', value: deviceMap.mobile, icon: <Smartphone className="text-blue-400" size={14} /> },
        { name: 'PC', value: deviceMap.pc, icon: <Monitor className="text-indigo-400" size={14} /> },
        { name: '不明', value: deviceMap.unknown, icon: <CircleHelp className="text-slate-500" size={14} /> }
      ].filter(d => d.value > 0),
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
      {/* Filters & Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800 shadow-inner">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <Calendar size={14} className="text-blue-500" /> Analysis Period
          </div>
          <Select value={period} onValueChange={(val: any) => setPeriod(val)}>
            <SelectTrigger className="w-[180px] h-9 bg-slate-950/50 border-slate-800 text-white rounded-lg hover:border-blue-500/50 transition-colors shadow-lg">
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
          className="h-9 px-4 gap-2 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500 hover:text-white transition-all rounded-lg font-bold"
        >
          {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          AIレポートを再生成
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900/50 border-slate-800 relative overflow-hidden group">
              <div className="absolute -top-1 -right-1 p-2 opacity-5 font-black text-6xl select-none group-hover:scale-110 transition-transform">#</div>
              <CardContent className="pt-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Applications</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-4xl font-black text-white mt-1 tabular-nums tracking-tighter">{stats.totalCount}</h4>
                  <span className="text-xs text-slate-500 font-bold">応募</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 relative overflow-hidden group">
              <div className="absolute -top-1 -right-1 p-2 opacity-5 font-black text-6xl select-none group-hover:scale-110 transition-transform">OK</div>
              <CardContent className="pt-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hired Applicants</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-4xl font-black text-emerald-400 mt-1 tabular-nums tracking-tighter">
                    {stats.statuses.find(s => s.name === 'hired')?.value || 0}
                  </h4>
                  <span className="text-xs text-slate-500 font-bold">採用</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 tracking-wider">Device Segmentation</p>
                <div className="grid grid-cols-2 gap-3">
                  {stats.devices.map(d => (
                    <div key={d.name} className="flex flex-col p-2 rounded-lg bg-slate-950/40 border border-slate-800/50">
                      <div className="flex items-center gap-1.5 mb-1">
                        {d.icon}
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{d.name}</span>
                      </div>
                      <span className="text-xl font-black text-white tabular-nums tracking-tighter leading-none">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Series Chart */}
          <Card className="bg-slate-900/50 border-slate-800 overflow-hidden shadow-xl">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <TrendingUp size={18} className="text-blue-400" /> 応募トレンドの推移
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">日次ベースの応募数増減</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={(val) => val.slice(5)} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 7, fill: '#60a5fa' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Analysis Tables & Pie Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            <Card className="bg-slate-900/50 border-slate-800 shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-950/50 border-b border-slate-800 py-3">
                <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MousePointer2 size={14} className="text-blue-500" /> 流入元分析（分析表）
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-800/50">
                  {stats.sources.map((s, idx) => (
                    <div key={s.name} className="flex items-center justify-between p-3.5 px-5 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] text-slate-600 font-bold tabular-nums w-4">#{idx + 1}</span>
                        <p className="text-xs text-slate-200 font-bold truncate">{s.name}</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <Badge variant="outline" className="text-[10px] bg-blue-500/5 text-blue-400 border-blue-500/10 px-2 py-0 h-5 tabular-nums">
                          {s.value} 応募
                        </Badge>
                        <div className="w-10 text-right">
                          <span className="text-[10px] text-slate-500 font-black">
                            {((s.value / stats.totalCount) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {stats.sources.length === 0 && (
                    <p className="text-xs text-slate-600 py-12 text-center italic">データ不足により集計できません</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">選考ステータスの内訳</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.statuses}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={8}
                      dataKey="value"
                      cornerRadius={4}
                    >
                      {stats.statuses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Action Plan Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#0c0f1d] to-[#040608] border-indigo-500/30 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl" />
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-500/30 px-3 hover:bg-indigo-600/30 transition-all font-black text-[9px] uppercase tracking-[0.2em]">
                  Intelligent Analysis
                </Badge>
                <Sparkles size={16} className="text-indigo-400 animate-pulse" />
              </div>
              <CardTitle className="text-xl font-black text-white mt-4 italic tracking-tighter flex items-center gap-2">
                Strategy Action Plan 
                <ChevronRight size={18} className="text-indigo-600" />
              </CardTitle>
              <CardDescription className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-normal">
                応募流入経路とデバイス傾向に基づいた<br />AI採用コンサルティング
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-5">
                  <div className="relative">
                    <div className="absolute inset-[-12px] animate-spin rounded-full border-t-2 border-indigo-500/40 border-r-2 border-transparent" />
                    <Loader2 size={32} className="text-indigo-500 animate-spin" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[10px] font-black text-indigo-300 animate-pulse uppercase tracking-[0.2em]">Processing Metadata</p>
                    <p className="text-[9px] text-slate-500 font-medium">流入元とデバイスの相関関係を解析中...</p>
                  </div>
                </div>
              ) : aiReport ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-slate-300 leading-relaxed text-[13px] shadow-inner backdrop-blur-sm">
                    <ReactMarkdown>{aiReport}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center rounded-2xl bg-slate-950/50 border border-slate-800 border-dashed">
                  <Activity size={24} className="mx-auto text-slate-700 mb-3" />
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">No Intelligence Data</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Metrics */}
          <Card className="bg-slate-900/50 border-slate-800 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] text-slate-500 uppercase tracking-widest font-black">店舗別応募シェア</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.stores.map((s, idx) => (
                <div key={s.name} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] px-0.5">
                    <span className="text-slate-200 font-bold">{s.name}</span>
                    <span className="text-slate-500 font-black tabular-nums">{((s.value / stats.totalCount) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000" 
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
