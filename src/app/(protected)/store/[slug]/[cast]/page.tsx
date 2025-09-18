'use client';

import { useState, useEffect } from 'react';
import { getCastBySlug } from '@/lib/getCastData';
import CastHeader from '@/components/cast/CastHeader';
import CastTabs from '@/components/cast/CastTabs';

interface CastDetailPageProps {
  params: { store: string; cast: string };
}

const CastDetailPage = ({ params }: CastDetailPageProps) => {
  const { cast } = params;
  const [castData, setCastData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCastBySlug(cast);
      if (data?.isActive) {
        setCastData(data);
      }
    };
    fetchData();
  }, [cast]);

  if (!cast) {
    return <div className="p-8 text-center text-red-500">無効なURLです。</div>;
  }

  if (!castData) {
    return (
      <div className="p-8 text-center text-gray-500">
        現在このセラピストの情報は表示できません。
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <CastHeader
        name={castData.name}
        catchCopy={castData.catchCopy}
        galleryItems={castData.galleryItems}
      />
      {/* ✅ isSticky は不要なので削除 */}
      <CastTabs cast={castData} />
    </div>
  );
};

export default CastDetailPage;
