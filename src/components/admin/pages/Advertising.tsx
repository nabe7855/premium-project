'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/admin/ui/Card';
import StatCard from '@/components/admin/ui/StatCard';
import ResponsivePieChart from '@/components/admin/ui/ResponsivePieChart';
import ResponsiveChart from '@/components/admin/ui/ResponsiveChart';
import StoreSelector from '@/components/admin/ui/StoreSelector';
import {
  mockInquiryData,
  mockInquiriesTrendData,
  mockRoiData,
  mockWebAccessData,
  mockReviewStats,
  mockReviewDistributionData,
} from '@/data/admin-mockData';
import { ChartData } from '@/types/dashboard';

export default function Advertising() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [inquiryPeriod, setInquiryPeriod] = useState<keyof ChartData>('daily');
  const [roiPeriod, setRoiPeriod] = useState<keyof ChartData>('daily');
  const [webAccessPeriod, setWebAccessPeriod] = useState<keyof ChartData>('daily');
  const [selectedStore, setSelectedStore] = useState('all');

  const [storeInquiryData, setStoreInquiryData] = useState(mockInquiryData);
  const [storeInquiriesTrendData, setStoreInquiriesTrendData] = useState(mockInquiriesTrendData);
  const [storeRoiData, setStoreRoiData] = useState(mockRoiData);
  const [storeWebAccessData, setStoreWebAccessData] = useState(mockWebAccessData);

  useEffect(() => {
    if (selectedStore === 'all') {
      setStoreInquiryData(mockInquiryData);
      setStoreInquiriesTrendData(mockInquiriesTrendData);
      setStoreRoiData(mockRoiData);
      setStoreWebAccessData(mockWebAccessData);
      return;
    }

    const factor = ((selectedStore.charCodeAt(0) % 100) / 100) * 0.5 + 0.5;

    const randomize = (data: ChartData): ChartData => {
      const result: ChartData = {};
      for (const key in data) {
        const periodKey = key as keyof ChartData;
        if (data[periodKey]) {
          result[periodKey] = data[periodKey]!.map(item => ({
            ...item,
            // ✅ undefinedなら0にする
            value:
              typeof item.value === 'number'
                ? Math.round(item.value * factor)
                : item.value ?? 0,
          }));
        }
      }
      return result;
    };

    setStoreInquiryData(
      mockInquiryData.map(d => ({
        ...d,
        value: typeof d.value === 'number' ? Math.round(d.value * factor) : d.value ?? 0,
      }))
    );
    setStoreInquiriesTrendData(randomize(mockInquiriesTrendData));
    setStoreRoiData(randomize(mockRoiData));
    setStoreWebAccessData(randomize(mockWebAccessData));
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
          onClick={e => {
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

  return (
    <div className="space-y-6">
      {/* ✅ 店舗セレクター */}
      <StoreSelector selectedStore={selectedStore} onStoreChange={setSelectedStore} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Inquiries Card */}
        <div>
          <div onClick={() => handleCardClick('inquiries')} className="cursor-pointer">
            <StatCard title="総問い合わせ数（月間）" value="1,234" change={12} description="前月比" />
          </div>
          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
              expandedCard === 'inquiries' ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <div className="space-y-4">
                <Card title="問い合わせ経路（月間)">
                  <ResponsivePieChart data={storeInquiryData} />
                </Card>
                <Card
                  title="総問い合わせ数推移"
                  extra={
                    <PeriodTabs
                      periods={
                        Object.keys(storeInquiriesTrendData).filter(
                          p => storeInquiriesTrendData[p as keyof ChartData]?.length
                        ) as (keyof ChartData)[]
                      }
                      activePeriod={inquiryPeriod}
                      setActivePeriod={setInquiryPeriod}
                    />
                  }
                >
                  <ResponsiveChart
                    data={storeInquiriesTrendData[inquiryPeriod] || []}
                    type="line"
                    dataKeys={[{ key: 'value', name: '件数', fill: '#3E7BFA' }]}
                    unit="件"
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Card */}
        <div>
          <div onClick={() => handleCardClick('roi')} className="cursor-pointer">
            <StatCard title="広告費用対効果 (ROI)" value="215%" change={8} description="前月比" />
          </div>
          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
              expandedCard === 'roi' ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <Card
                title="ROI推移"
                extra={
                  <PeriodTabs
                    periods={
                      Object.keys(storeRoiData).filter(
                        p => storeRoiData[p as keyof ChartData]?.length
                      ) as (keyof ChartData)[]
                    }
                    activePeriod={roiPeriod}
                    setActivePeriod={setRoiPeriod}
                  />
                }
              >
                <ResponsiveChart
                  data={storeRoiData[roiPeriod] || []}
                  type="line"
                  dataKeys={[{ key: 'value', name: 'ROI', fill: '#10B981' }]}
                  unit="%"
                />
              </Card>
            </div>
          </div>
        </div>

        {/* Web Access Card */}
        <div>
          <div onClick={() => handleCardClick('webAccess')} className="cursor-pointer">
            <StatCard title="Webアクセス数（本日）" value="1,024" change={-5} description="昨日比" />
          </div>
          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
              expandedCard === 'webAccess' ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <Card
                title="Webアクセス数推移"
                extra={
                  <PeriodTabs
                    periods={
                      Object.keys(storeWebAccessData).filter(
                        p => storeWebAccessData[p as keyof ChartData]?.length
                      ) as (keyof ChartData)[]
                    }
                    activePeriod={webAccessPeriod}
                    setActivePeriod={setWebAccessPeriod}
                  />
                }
              >
                <ResponsiveChart
                  data={storeWebAccessData[webAccessPeriod] || []}
                  type="bar"
                  dataKeys={[{ key: 'value', name: 'アクセス数', fill: '#F59E0B' }]}
                  unit="件"
                />
              </Card>
            </div>
          </div>
        </div>

        {/* Customer Review Card */}
        <div>
          <div onClick={() => handleCardClick('reviews')} className="cursor-pointer">
            <StatCard
              title="顧客レビュー評価"
              value={`${mockReviewStats.avg} / 5.0`}
              change={0.1}
              changeType="point"
              description="前月比"
            />
          </div>
          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
              expandedCard === 'reviews' ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <div className="space-y-4">
                <Card title="顧客満足度サマリー">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{mockReviewStats.total}</p>
                      <p className="text-brand-text-secondary text-sm">総レビュー件数</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-400">
                        {mockReviewStats.complaints}
                      </p>
                      <p className="text-brand-text-secondary text-sm">クレーム件数</p>
                    </div>
                  </div>
                </Card>
                <Card title="レビュー評価内訳">
                  <ResponsiveChart
                    data={mockReviewDistributionData}
                    type="bar"
                    dataKeys={[{ key: 'value', name: '件数', fill: '#8B5CF6' }]}
                    unit="件"
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
