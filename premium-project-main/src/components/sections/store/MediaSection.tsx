'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, Newspaper } from 'lucide-react';

export default function MediaSection() {
  const { store } = useStore();

  if (store.media.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Newspaper className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold md:text-4xl">メディア掲載</h2>
          </div>
          <p className="text-lg text-gray-600">各種メディアでご紹介いただいています</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {store.media.map((media) => (
            <div
              key={media.id}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative">
                <img src={media.image} alt={media.title} className="h-48 w-full object-cover" />
                <div className="absolute right-4 top-4">
                  <Badge className="bg-blue-600 text-white hover:bg-blue-700">MEDIA</Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{media.date}</span>
                </div>

                <h3 className="mb-2 line-clamp-2 text-lg font-bold">{media.title}</h3>

                <p className="mb-4 font-medium text-gray-600">{media.publication}</p>

                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => window.open(media.url, '_blank')}
                >
                  記事を読む
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
