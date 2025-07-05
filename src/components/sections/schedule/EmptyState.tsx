import React from 'react';
import { Calendar, Heart } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-casts' | 'no-favorites' | 'no-available';
  onDateChange?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, onDateChange }) => {
  const getContent = () => {
    switch (type) {
      case 'no-casts':
        return {
          icon: <Calendar className="w-12 h-12 text-gray-400" />,
          title: '本日はお休みをいただいております',
          description: '別の日をチェックしてみてね！',
          action: '他の日を見る'
        };
      case 'no-favorites':
        return {
          icon: <Heart className="w-12 h-12 text-gray-400" />,
          title: 'お気に入りキャストの出勤はありません',
          description: '他の日程をチェックしてみてください',
          action: '全てのキャストを見る'
        };
      case 'no-available':
        return {
          icon: <Calendar className="w-12 h-12 text-gray-400" />,
          title: '予約可能なキャストはいません',
          description: 'キャンセル待ちをご検討ください',
          action: '全てのキャストを見る'
        };
      default:
        return {
          icon: <Calendar className="w-12 h-12 text-gray-400" />,
          title: '表示できるキャストがいません',
          description: '条件を変更してみてください',
          action: 'フィルターを変更する'
        };
    }
  };

  const content = getContent();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl">🍓</span>
        </div>
      </div>
      
      <div className="flex justify-center mb-4">
        {content.icon}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-6">{content.description}</p>
      
      {onDateChange && (
        <button
          onClick={onDateChange}
          className="px-6 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors"
        >
          {content.action}
        </button>
      )}
    </div>
  );
};

export default EmptyState;