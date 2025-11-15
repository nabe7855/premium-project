'use client';

import React, { useState } from 'react';
import AdvertisingList from '@/components/admin/pages/AdvertisingList';
import { AdvertisementPost } from '@/types/dashboard';

export default function AdvertisingListPage() {
  // ✅ ローカルで State を持つ
  const [advertisementPosts, setAdvertisementPosts] = useState<AdvertisementPost[]>([]);

  return (
    <AdvertisingList
      advertisementPosts={advertisementPosts}
      setAdvertisementPosts={setAdvertisementPosts}
    />
  );
}
