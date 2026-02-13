'use client';

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Post {
  id: string;
  target_site: string;
  content_type: string;
  title: string;
  scheduled_at: string | null;
  status: string;
}

interface PostCalendarProps {
  onEdit?: (post: Post) => void;
}

export default function PostCalendar({ onEdit }: PostCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // 全ての投稿を取得してカレンダーにマッピング
      const response = await fetch(`/api/ai/get-posts?status=all`);
      if (!response.ok) throw new Error('取得に失敗しました');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const calendarDays = [];
  const totalDays = daysInMonth(currentDate);
  const firstDay = firstDayOfMonth(currentDate);

  // 前月の空白
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // 今月の日付
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  const getPostsForDay = (day: number) => {
    return posts.filter((post) => {
      if (!post.scheduled_at) return false;
      const scheduledDate = new Date(post.scheduled_at);
      return (
        scheduledDate.getFullYear() === currentDate.getFullYear() &&
        scheduledDate.getMonth() === currentDate.getMonth() &&
        scheduledDate.getDate() === day
      );
    });
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="space-y-4 duration-500 animate-in fade-in md:space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          <CalendarIcon className="h-5 w-5 text-brand-accent" />
          {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="rounded-lg border border-white/5 bg-white/5 p-2 text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="rounded-lg border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-white hover:bg-white/10"
          >
            今日
          </button>
          <button
            onClick={nextMonth}
            className="rounded-lg border border-white/5 bg-white/5 p-2 text-white hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-white/5 bg-white/5">
        {weekDays.map((day, idx) => (
          <div
            key={day}
            className={`bg-brand-secondary/50 py-2 text-center text-[10px] font-bold md:text-xs ${idx === 0 ? 'text-red-400' : idx === 6 ? 'text-blue-400' : 'text-brand-text-secondary'}`}
          >
            {day}
          </div>
        ))}
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                className="min-h-[80px] bg-brand-primary/20 md:min-h-[120px]"
              />
            );
          }

          const dayPosts = getPostsForDay(day);
          const isToday =
            new Date().getDate() === day &&
            new Date().getMonth() === currentDate.getMonth() &&
            new Date().getFullYear() === currentDate.getFullYear();

          return (
            <div
              key={day}
              className={`relative min-h-[80px] bg-brand-primary/40 p-1 transition-colors hover:bg-brand-primary/60 md:min-h-[120px] md:p-2 ${isToday ? 'ring-1 ring-inset ring-brand-accent/50' : ''}`}
            >
              <span
                className={`text-[10px] font-bold md:text-sm ${isToday ? 'text-brand-accent' : 'text-white/60'} ${idx % 7 === 0 ? 'text-red-400/60' : idx % 7 === 6 ? 'text-blue-400/60' : ''}`}
              >
                {day}
              </span>
              <div className="mt-1 space-y-1 overflow-hidden">
                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-3 w-3 animate-spin text-brand-accent/20" />
                  </div>
                ) : (
                  dayPosts.slice(0, 3).map((post) => (
                    <button
                      key={post.id}
                      onClick={() => onEdit?.(post as any)}
                      className={`w-full truncate rounded px-1 py-0.5 text-left text-[8px] font-medium transition-all hover:brightness-125 md:px-1.5 md:text-[10px] ${
                        post.target_site === 'kaikan'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-indigo-500/20 text-indigo-300'
                      } ${post.status === 'posted' ? 'opacity-50 grayscale' : ''}`}
                      title={post.title}
                    >
                      {new Date(post.scheduled_at!).getHours()}:
                      {String(new Date(post.scheduled_at!).getMinutes()).padStart(2, '0')}{' '}
                      {post.title}
                    </button>
                  ))
                )}
                {dayPosts.length > 3 && (
                  <div className="text-center text-[8px] text-brand-text-secondary md:text-[10px]">
                    他 {dayPosts.length - 3} 件
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-white/5 bg-brand-primary/20 p-4">
        <div className="flex items-center gap-2 text-[10px] text-brand-text-secondary md:text-xs">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span>kaikan (お店ニュース)</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-brand-text-secondary md:text-xs">
          <div className="h-2 w-2 rounded-full bg-indigo-500" />
          <span>kaikanwork (ブログ/求人)</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-brand-text-secondary md:text-xs">
          <div className="h-2 w-2 rounded-full bg-white opacity-20" />
          <span>投稿済み (グレーアウト)</span>
        </div>
      </div>
    </div>
  );
}
