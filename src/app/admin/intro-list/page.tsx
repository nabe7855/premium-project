'use client';

import React, { useState } from 'react';
import IntroList from '@/components/admin/pages/IntroList';
import { GeneratedIntroPage } from '@/types/dashboard';

export default function IntroListPage() {
  const [introPages, setIntroPages] = useState<GeneratedIntroPage[]>([]);

  return <IntroList introPages={introPages} setIntroPages={setIntroPages} />;
}
