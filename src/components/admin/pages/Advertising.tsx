import React, { useState } from 'react';
import Card from '@/components/admin/ui/Card';
import StatCard from '@/components/admin/ui/StatCard';
import ResponsivePieChart from '@/components/admin/ui/ResponsivePieChart';
import ResponsiveChart from '@/components/admin/ui/ResponsiveChart';
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Total Inquiries Card */}
        <div>
          <div onClick={() => handleCardClick('inquiries')} className="cursor-pointer">
            <StatCard title="総問い合わせ数（月間）" value="1,234" change={12} description="前月比" />
          </div>
          <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${expandedCard === 'inquiries' ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <div className="space-y-4">
                <Card title="問い合わせ経路（月間）">
                    <ResponsivePieChart data={mockInquiryData} />
                </Card>
                <Card 
                  title="総問い合わせ数推移"
                  extra={
                    <PeriodTabs
                        periods={Object.keys(mockInquiriesTrendData).filter(p => mockInquiriesTrendData[p as keyof ChartData]?.length) as (keyof ChartData)[]}
                        activePeriod={inquiryPeriod}
                        setActivePeriod={setInquiryPeriod}
                    />
                  }
                >
                    <ResponsiveChart data={mockInquiriesTrendData[inquiryPeriod] || []} type='line' dataKeys={[{ key: 'value', name: '件数', fill: '#3E7BFA' }]} unit="件" />
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
          <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${expandedCard === 'roi' ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <Card 
                title="ROI推移"
                extra={
                  <PeriodTabs
                      periods={Object.keys(mockRoiData).filter(p => mockRoiData[p as keyof ChartData]?.length) as (keyof ChartData)[]}
                      activePeriod={roiPeriod}
                      setActivePeriod={setRoiPeriod}
                  />
                }
              >
                <ResponsiveChart data={mockRoiData[roiPeriod] || []} type='line' dataKeys={[{ key: 'value', name: 'ROI', fill: '#10B981' }]} unit="%" />
              </Card>
            </div>
          </div>
        </div>
        
        {/* Web Access Card */}
        <div>
          <div onClick={() => handleCardClick('webAccess')} className="cursor-pointer">
            <StatCard title="Webアクセス数（本日）" value="1,024" change={-5} description="昨日比" />
          </div>
          <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${expandedCard === 'webAccess' ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <Card 
                title="Webアクセス数推移"
                extra={
                  <PeriodTabs
                      periods={Object.keys(mockWebAccessData).filter(p => mockWebAccessData[p as keyof ChartData]?.length) as (keyof ChartData)[]}
                      activePeriod={webAccessPeriod}
                      setActivePeriod={setWebAccessPeriod}
                  />
                }
              >
                <ResponsiveChart data={mockWebAccessData[webAccessPeriod] || []} type='bar' dataKeys={[{ key: 'value', name: 'アクセス数', fill: '#F59E0B' }]} unit="件" />
              </Card>
            </div>
          </div>
        </div>
        
        {/* Customer Review Card */}
        <div>
          <div onClick={() => handleCardClick('reviews')} className="cursor-pointer">
            <StatCard title="顧客レビュー評価" value={`${mockReviewStats.avg} / 5.0`} change={0.1} changeType="point" description="前月比" />
          </div>
          <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${expandedCard === 'reviews' ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <div className="space-y-4">
                <Card title="顧客満足度サマリー">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold">{mockReviewStats.total}</p>
                        <p className="text-brand-text-secondary text-sm">総レビュー件数</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-400">{mockReviewStats.complaints}</p>
                        <p className="text-brand-text-secondary text-sm">クレーム件数</p>
                    </div>
                  </div>
                </Card>
                <Card title="レビュー評価内訳">
                  <ResponsiveChart data={mockReviewDistributionData} type='bar' dataKeys={[{ key: 'value', name: '件数', fill: '#8B5CF6' }]} unit="件" />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}