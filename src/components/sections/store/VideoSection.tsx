'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Play, Eye, Calendar } from 'lucide-react';
import type { Video } from '@/types/store';

export default function VideoSection() {
  const { store } = useStore();

  if (store.videos.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">最新動画更新</h2>
          <p className="text-lg text-gray-300">キャストたちの魅力をもっと知ってください</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {store.videos.map((video: Video) => (
            <div
              key={video.id}
              className="overflow-hidden rounded-2xl bg-gray-800 transition-all duration-300 hover:scale-105 hover:bg-gray-700"
            >
              <div className="group relative cursor-pointer">
                <img src={video.thumbnail} alt={video.title} className="h-48 w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className={`bg-gradient-to-r ${store.theme.gradient} rounded-full p-4`}>
                    <Play className="h-8 w-8 fill-white text-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-sm text-white">
                  {video.duration}
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-3 line-clamp-2 text-lg font-bold">{video.title}</h3>

                <div className="mb-4 flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{video.views.toLocaleString()}回再生</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{video.date}</span>
                  </div>
                </div>

                <Button
                  className={`w-full bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} rounded-full font-semibold text-white`}
                >
                  <Play className="mr-2 h-4 w-4" />
                  動画を見る
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            className="rounded-full border-white/30 px-8 py-3 text-lg font-semibold text-white hover:bg-white/10"
          >
            すべての動画を見る
          </Button>
        </div>
      </div>
    </section>
  );
}
