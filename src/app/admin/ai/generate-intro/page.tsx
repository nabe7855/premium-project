'use client';

import React, { useState } from 'react';
import AIGenerateIntro from '@/components/admin/pages/AIGenerateIntro';
import { GeneratedIntroPage } from '@/types/dashboard';

export default function AIGenerateIntroPage() {
  const [_introPages, setIntroPages] = useState<GeneratedIntroPage[]>([]);

  return <AIGenerateIntro setIntroPages={setIntroPages} />;
}
