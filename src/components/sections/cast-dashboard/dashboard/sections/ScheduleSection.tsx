'use client';

import React from 'react';
import CalendarEditor from '../../schedule/CalendarEditor';
import { CastSchedule, CastDiary } from '@/types/cast-dashboard';

interface Props {
  schedules: CastSchedule[];
  diaries: CastDiary[];
  onScheduleUpdate: (updated: CastSchedule[]) => void;
}

export default function ScheduleSection({ schedules, diaries, onScheduleUpdate }: Props) {
  return (
    <CalendarEditor schedules={schedules} onScheduleUpdate={onScheduleUpdate} diaries={diaries} />
  );
}
