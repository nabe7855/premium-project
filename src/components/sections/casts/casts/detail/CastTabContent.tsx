'use client';

import React from 'react';

interface CastTabContentProps {
  activeTab: 'basic' | 'story' | 'schedule' | 'reviews' | 'videos';
}

const CastTabContent: React.FC<CastTabContentProps> = ({ activeTab }) => {
  return (
    <div className="px-4 py-6 mt-[160px]">
      {activeTab === 'basic' && <div>基本情報コンテンツ</div>}
      {activeTab === 'story' && <div>ストーリー</div>}
      {activeTab === 'schedule' && <div>スケジュール</div>}
      {activeTab === 'reviews' && <div>口コミ</div>}
      {activeTab === 'videos' && <div>動画</div>}
    </div>
  );
};

export default CastTabContent;
