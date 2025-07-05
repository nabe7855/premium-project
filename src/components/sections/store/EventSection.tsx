'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Zap, Gift, Radio } from 'lucide-react';

const getEventIcon = (type: string) => {
  switch (type) {
    case 'live':
      return <Radio className="w-5 h-5" />;
    case 'campaign':
      return <Gift className="w-5 h-5" />;
    case 'event':
      return <Zap className="w-5 h-5" />;
    default:
      return <Calendar className="w-5 h-5" />;
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
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {store.city}店限定イベント
          </h2>
          <p className="text-gray-600 text-lg">
            特別な時間をお過ごしいただけるイベント情報
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {store.events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`bg-gradient-to-r ${store.theme.gradient} text-white`}>
                    {getEventIcon(event.type)}
                    <span className="ml-1">{getEventTypeLabel(event.type)}</span>
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {event.description}
                </p>
                
                <Button
                  className={`w-full bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} text-white rounded-full font-semibold`}
                >
                  詳細を見る
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="px-8 py-3 rounded-full text-lg font-semibold"
          >
            すべてのイベントを見る
          </Button>
        </div>
      </div>
    </section>
  );
}