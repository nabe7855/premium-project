'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Zap, Gift, Radio } from 'lucide-react';

const getEventIcon = (type: string) => {
  switch (type) {
    case 'live':
      return <Radio className="h-5 w-5" />;
    case 'campaign':
      return <Gift className="h-5 w-5" />;
    case 'event':
      return <Zap className="h-5 w-5" />;
    default:
      return <Calendar className="h-5 w-5" />;
  }
};

const getEventTypeLabel = (type: string) => {
  switch (type) {
    case 'live':
      return 'ライブ配信';
    case 'campaign':
      return 'キャンペーン';
    case 'event':
      return 'イベント';
    default:
      return 'イベント';
  }
};

export default function EventSection() {
  const { store } = useStore();

  if (store.events.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{store.city}店限定イベント</h2>
          <p className="text-lg text-gray-600">特別な時間をお過ごしいただけるイベント情報</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {store.events.map((event) => (
            <div
              key={event.id}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="relative">
                <img src={event.image} alt={event.title} className="h-48 w-full object-cover" />
                <div className="absolute left-4 top-4">
                  <Badge className={`bg-gradient-to-r ${store.theme.gradient} text-white`}>
                    {getEventIcon(event.type)}
                    <span className="ml-1">{getEventTypeLabel(event.type)}</span>
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                {/* 日付部分に Clock アイコンを追加 */}
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{event.date}</span> {/* イベント日付を表示 */}
                </div>

                <h3 className="mb-3 text-xl font-bold">{event.title}</h3>

                <p className="mb-4 leading-relaxed text-gray-600">{event.description}</p>

                <Button
                  className={`w-full bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} rounded-full font-semibold text-white`}
                >
                  詳細を見る
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="rounded-full px-8 py-3 text-lg font-semibold">
            すべてのイベントを見る
          </Button>
        </div>
      </div>
    </section>
  );
}
