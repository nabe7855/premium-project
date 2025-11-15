'use client';

import React, { useState } from 'react';
import AICopywriter from '@/components/admin/pages/AICopywriter';
import { AdvertisementPost } from '@/types/dashboard';

export default function AICopywriterPage() {
  const [_advertisementPosts, setAdvertisementPosts] = useState<AdvertisementPost[]>([]);

  return (
    <AICopywriter setAdvertisementPosts={setAdvertisementPosts} />
  );
}
