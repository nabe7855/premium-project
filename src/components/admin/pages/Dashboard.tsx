"use client";

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/admin/ui/StatCard';
import Card from '@/components/admin/ui/Card';
import ResponsiveChart from '@/components/admin/ui/ResponsiveChart';
import StoreSelector from '@/components/admin/ui/StoreSelector';
import { 
  mockSalesData,
  mockAvgCogsData,
  mockNewCustomersData,
  mockRepeatRateData,
  mockAttendanceRateData,
  mockDesignationsData,
} from '@/data/admin-mockData';
import { ChartData, TimeSeriesData } from '@/types/dashboard';

// The main dashboard view, presenting key performance indicators (KPIs) in a grid layout.
export default function Dashboard() {
  const [selectedStore, setSelectedStore] = useState('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // State for KPIs
  const [totalSales, setTotalSales] = useState("¥1,250,000");
  const [avgCogs, setAvgCogs] = useState("¥25,000");
  const [newCustomers, setNewCustomers] = useState("15");
  const [repeatRate, setRepeatRate] = useState("65%");
  const [castStats, setCastStats] = useState({ total: 50, attendanceRate: '82%', avgDesignations: 4.5, turnoverRate: '5%' });
  
  // State for chart data
  const [salesData, setSalesData] = useState<ChartData>(mockSalesData);
  const [avgCogsData, setAvgCogsData] = useState<ChartData>(mockAvgCogsData);
  const [newCustomersData, setNewCustomersData] = useState<ChartData>(mockNewCustomersData);
  const [repeatRateData, setRepeatRateData] = useState<ChartData>(mockRepeatRateData);
  const [attendanceRateData, setAttendanceRateData] = useState<ChartData>(mockAttendanceRateData);
  const [designationsData, setDesignationsData] = useState<ChartData>(mockDesignationsData);
  
  // State for chart periods
  const [salesPeriod, setSalesPeriod] = useState<keyof ChartData>('daily');
  const [avgCogsPeriod, setAvgCogsPeriod] = useState<keyof ChartData>('daily');
  const [newCustomersPeriod, setNewCustomersPeriod] = useState<keyof ChartData>('daily');
  const [repeatRatePeriod, setRepeatRatePeriod] = useState<keyof ChartData>('weekly');
  const [attendanceRatePeriod, setAttendanceRatePeriod] = useState<keyof ChartData>('daily');
  const [designationsPeriod, setDesignationsPeriod] = useState<keyof ChartData>('daily');

  useEffect(() => {
    // FIX: Updated randomizeChartData to be more type-safe. This resolves errors related to type assignment and arithmetic operations on potentially non-numeric types.
    const randomizeChartData = (chartData: ChartData, f: number): ChartData => {
        const randomized: ChartData = {};
        for (const key in chartData) {
            const periodKey = key as keyof ChartData;
            if (chartData[periodKey]) {
              randomized[periodKey] = chartData[periodKey]!.map(item => {
                  const newItem: TimeSeriesData = { ...item };
                  Object.keys(item).forEach(itemKey => {
                      if (itemKey !== 'name') {
                          const value = item[itemKey];
                          if (typeof value === 'number') {
                            newItem[itemKey] = Math.round(value * f);
                          }
                      }
                  });
                  return newItem;
              });
            }
        }
        return randomized;
    };

    if (selectedStore === 'all') {
      setTotalSales("¥1,250,000");
      setAvgCogs("¥25,000");
      setNewCustomers("15");
      setRepeatRate("65%");
      setCastStats({ total: 50, attendanceRate: '82%', avgDesignations: 4.5, turnoverRate: '5%' });
      setSalesData(mockSalesData);
      setAvgCogsData(mockAvgCogsData);
      setNewCustomersData(mockNewCustomersData);
      setRepeatRateData(mockRepeatRateData);
      setAttendanceRateData(mockAttendanceRateData);
      setDesignationsData(mockDesignationsData);
      return;
    }

    const storeIdNumber = selectedStore.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const factor = ((storeIdNumber % 100) / 100) * 0.5 + 0.4; // 0.4 to 0.9

    setTotalSales(`¥${Math.round(1250000 * factor).toLocaleString()}`);
    setAvgCogs(`¥${Math.round(25000 * (0.8 + factor * 0.4)).toLocaleString()}`);
    setNewCustomers(`${Math.round(15 * factor)}`);
    setRepeatRate(`${Math.round(65 * (0.9 + factor * 0.2))}%`);
    setCastStats({
        total: Math.round(50 * factor),
        attendanceRate: `${Math.round(82 * (0.95 + factor * 0.1))}%`,
        avgDesignations: parseFloat((4.5 * (0.8 + factor * 0.4)).toFixed(1)),
        turnoverRate: `${Math.round(5 * (0.7 + factor * 0.6))}%`
    });
    
    setSalesData(randomizeChartData(mockSalesData, factor));
    setAvgCogsData(randomizeChartData(mockAvgCogsData, factor));
    setNewCustomersData(randomizeChartData(mockNewCustomersData, factor));
    setRepeatRateData(randomizeChartData(mockRepeatRateData, factor));
    setAttendanceRateData(randomizeChartData(mockAttendanceRateData, factor));
    setDesignationsData(randomizeChartData(mockDesignationsData, factor));

  }, [selectedStore]);

  const handleCardClick = (cardKey: string) => {
    setExpandedCard(prev => (prev === cardKey ? null : cardKey));
  };

  const PeriodTabs: React.FC<{
    periods: (keyof ChartData)[];
    activePeriod: keyof ChartData;
    setActivePeriod: (period: keyof ChartData) => void;
  }> = ({ periods, activePeriod, setActivePeriod }) => (
    <div className="flex space-x-1 bg-brand-primary p-1 rounded-lg">
      {periods.map(period => (
        <button
          key={period}
          onClick={(e) => {
            e.stopPropagation();
            setActivePeriod(period);
          }}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 ${
            activePeriod === period
              ? 'bg-brand-accent text-white'
              : 'text-brand-text-secondary hover:bg-brand-secondary hover:text-white'
          }`}
        >
          {{ daily: '日', weekly: '週', monthly: '月', yearly: '年' }[period]}
        </button>
      ))}
    </div>
  );
  
  const renderChartCard = (
    title: string,
    chartData: ChartData,
    activePeriod: keyof ChartData,
    setPeriod: (period: keyof ChartData) => void,
    chartType: 'line' | 'bar',
    unit: string,
    dataKeys: { key: string; name: string; fill: string }[]
  ) => (
    <Card 
        title={title}
        extra={
            <PeriodTabs
                periods={Object.keys(chartData).filter(p => chartData[p as keyof ChartData]?.length) as (keyof ChartData)[]}
                activePeriod={activePeriod}
                setActivePeriod={setPeriod}
            />
        }
    >
        <ResponsiveChart data={chartData[activePeriod] || []} type={chartType} dataKeys={dataKeys} unit={unit} />
    </Card>
  );

  return (
    <div className="space-y-6">
      <StoreSelector selectedStore={selectedStore} onStoreChange={setSelectedStore} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        <div>
          <div onClick={() => handleCardClick('sales')} className="cursor-pointer">
            <StatCard title="総売上（本日）" value={totalSales} change={5.2} description="昨日比" />
          </div>
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedCard === 'sales' ? 'max-h-[400px] mt-4' : 'max-h-0'}`}>
            {renderChartCard("売上推移", salesData, salesPeriod, setSalesPeriod, 'line', '¥', [{ key: 'value', name: '実績', fill: '#3E7BFA' }])}
          </div>
        </div>

        <div>
          <div onClick={() => handleCardClick('cogs')} className="cursor-pointer">
            <StatCard title="顧客単価（本日）" value={avgCogs} change={-1.5} description="昨日比" />
          </div>
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedCard === 'cogs' ? 'max-h-[400px] mt-4' : 'max-h-0'}`}>
            {renderChartCard("顧客単価推移", avgCogsData, avgCogsPeriod, setAvgCogsPeriod, 'line', '¥', [{ key: 'value', name: '実績', fill: '#3E7BFA' }])}
          </div>
        </div>
        
        <div>
          <div onClick={() => handleCardClick('newCustomers')} className="cursor-pointer">
            <StatCard title="新規顧客数" value={newCustomers} change={10} description="本日" />
          </div>
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedCard === 'newCustomers' ? 'max-h-[400px] mt-4' : 'max-h-0'}`}>
             {renderChartCard("新規顧客数推移", newCustomersData, newCustomersPeriod, setNewCustomersPeriod, 'bar', '人', [{ key: 'value', name: '件数', fill: '#3E7BFA' }])}
          </div>
        </div>

        <div>
          <div onClick={() => handleCardClick('repeatRate')} className="cursor-pointer">
            <StatCard title="リピート率" value={repeatRate} change={2} description="今週" />
          </div>
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedCard === 'repeatRate' ? 'max-h-[400px] mt-4' : 'max-h-0'}`}>
            {renderChartCard("リピート率推移", repeatRateData, repeatRatePeriod, setRepeatRatePeriod, 'line', '%', [{ key: 'value', name: '実績', fill: '#3E7BFA' }])}
          </div>
        </div>
        
        <Card title="売上比率" className="md:col-span-2 lg:col-span-2">
          <div className="flex flex-col space-y-2">
              <p className="text-brand-text-secondary">新規 / リピーター</p>
              <div className="w-full bg-gray-700 rounded-full h-4">
                  <div className="bg-brand-accent h-4 rounded-full" style={{width: '35%'}}></div>
              </div>
              <div className="flex justify-between text-sm">
                  <span>新規: 35%</span>
                  <span>リピーター: 65%</span>
              </div>
          </div>
        </Card>

        <div className="md:col-span-2 lg:col-span-2">
            <div onClick={() => handleCardClick('castStatus')} className="cursor-pointer">
                <Card title="キャスト状況">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">{castStats.total}</p>
                            <p className="text-brand-text-secondary text-sm">在籍キャスト数</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{castStats.attendanceRate}</p>
                            <p className="text-brand-text-secondary text-sm">出勤率</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{castStats.avgDesignations}</p>
                            <p className="text-brand-text-secondary text-sm">平均指名本数</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-400">{castStats.turnoverRate}</p>
                            <p className="text-brand-text-secondary text-sm">離職率（月）</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedCard === 'castStatus' ? 'max-h-[800px] mt-4' : 'max-h-0'}`}>
                <div className="space-y-4">
                    {renderChartCard("出勤率推移", attendanceRateData, attendanceRatePeriod, setAttendanceRatePeriod, 'line', '%', [{ key: 'value', name: '出勤率', fill: '#3E7BFA' }])}
                    {renderChartCard("指名・フリー本数推移", designationsData, designationsPeriod, setDesignationsPeriod, 'bar', '本', 
                        [
                            { key: 'designations', name: '指名', fill: '#3E7BFA' },
                            { key: 'free', name: 'フリー', fill: '#10B981' }
                        ]
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}