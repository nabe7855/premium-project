import React, { useState } from 'react';
import { Heart, Sun, Moon, Coffee, Sparkles } from 'lucide-react';
import { MoodRecommendation } from '@/types/videos';

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  currentTheme: any;
}

const moodOptions: MoodRecommendation[] = [
  {
    mood: 'healing',
    title: '癒されたい',
    description: '疲れた心を優しく包み込む',
    icon: 'heart',
    color: 'from-green-400 to-emerald-500',
  },
  {
    mood: 'romance',
    title: 'ときめきたい',
    description: '特別な時間を一緒に過ごす',
    icon: 'sparkles',
    color: 'from-pink-400 to-rose-500',
  },
  {
    mood: 'motivation',
    title: '励まされたい',
    description: '前向きな気持ちになりたい',
    icon: 'sun',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    mood: 'sleep',
    title: '眠りたい',
    description: 'ぐっすり眠れる声を聞きたい',
    icon: 'moon',
    color: 'from-indigo-400 to-purple-500',
  },
];

const iconMap = {
  heart: Heart,
  sparkles: Sparkles,
  sun: Sun,
  moon: Moon,
  coffee: Coffee,
};

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect, currentTheme }) => {
  const [selectedMood, setSelectedMood] = useState<string>('');

  const handleMoodClick = (mood: string) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="mb-4 text-center sm:mb-6">
        <h2 className={`mb-2 text-xl font-bold sm:text-2xl ${currentTheme.text}`}>
          今日はどんな気分？
        </h2>
        <p className={`text-sm sm:text-base ${currentTheme.text} opacity-70`}>
          あなたの気分に合わせて、最適な動画をお選びします
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {moodOptions.map((option) => {
          const IconComponent = iconMap[option.icon as keyof typeof iconMap];
          const isSelected = selectedMood === option.mood;

          return (
            <button
              key={option.mood}
              onClick={() => handleMoodClick(option.mood)}
              className={`transform rounded-2xl p-4 transition-all duration-300 hover:scale-105 sm:p-6 ${
                isSelected
                  ? `bg-gradient-to-br ${option.color} text-white shadow-lg`
                  : `${currentTheme.cardBg} hover:shadow-md`
              } ${isSelected ? 'ring-2 ring-white ring-opacity-50' : ''} `}
            >
              <div className="flex flex-col items-center text-center">
                <IconComponent
                  size={28}
                  className={`mb-2 sm:mb-3 ${isSelected ? 'text-white' : 'text-gray-600'}`}
                />
                <h3
                  className={`mb-1 text-sm font-bold sm:text-base ${isSelected ? 'text-white' : currentTheme.text}`}
                >
                  {option.title}
                </h3>
                <p
                  className={`text-xs sm:text-sm ${isSelected ? 'text-white/90' : currentTheme.text + ' opacity-70'}`}
                >
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
