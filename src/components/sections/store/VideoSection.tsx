'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Play, Eye, Calendar } from 'lucide-react';

export default function VideoSection() {
  const { store } = useStore();

  if (store.videos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            最新動画更新
          </h2>
          <p className="text-gray-300 text-lg">
            キャストたちの魅力をもっと知ってください
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {store.videos.map((video) => (
            <div key={video.id} className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-700 transition-all duration-300 hover:scale-105">
              <div className="relative group cursor-pointer">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={`bg-gradient-to-r ${store.theme.gradient} rounded-full p-4`}>
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold mb-3 line-clamp-2">{video.title}</h3>
                
                <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{video.views.toLocaleString()}回再生</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{video.date}</span>
                  </div>
                </div>
                
                <Button
                  className={`w-full bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} text-white rounded-full font-semibold`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  動画を見る
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="px-8 py-3 rounded-full text-lg font-semibold border-white/30 text-white hover:bg-white/10"
          >
            すべての動画を見る
          </Button>
        </div>
      </div>
    </section>
  );
}