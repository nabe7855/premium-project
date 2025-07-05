import { useState, useEffect } from 'react';
import { TimeBasedTheme } from '@/types/videos';

const themes: Record<string, TimeBasedTheme> = {
  morning: {
    name: 'Morning Fresh',
    background: 'from-blue-50 to-indigo-100',
    accent: 'from-blue-500 to-indigo-600',
    text: 'text-gray-800',
    cardBg: 'bg-white/80 backdrop-blur-sm',
  },
  afternoon: {
    name: 'Afternoon Bright',
    background: 'from-orange-50 to-pink-100',
    accent: 'from-orange-500 to-pink-600',
    text: 'text-gray-800',
    cardBg: 'bg-white/80 backdrop-blur-sm',
  },
  evening: {
    name: 'Evening Warm',
    background: 'from-purple-100 to-pink-200',
    accent: 'from-purple-500 to-pink-600',
    text: 'text-gray-800',
    cardBg: 'bg-white/70 backdrop-blur-sm',
  },
  night: {
    name: 'Night Calm',
    background: 'from-slate-900 to-purple-900',
    accent: 'from-purple-400 to-pink-500',
    text: 'text-white',
    cardBg: 'bg-white/10 backdrop-blur-sm border border-white/20',
  },
};

export const useTimeBasedTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<TimeBasedTheme>(themes.morning);
  const [isNightMode, setIsNightMode] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      let themeKey: string;

      if (hour >= 5 && hour < 11) themeKey = 'morning';
      else if (hour >= 11 && hour < 17) themeKey = 'afternoon';
      else if (hour >= 17 && hour < 21) themeKey = 'evening';
      else themeKey = 'night';

      setCurrentTheme(themes[themeKey]);
      setIsNightMode(themeKey === 'night');
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return { currentTheme, isNightMode };
};
