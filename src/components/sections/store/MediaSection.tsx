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
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Newspaper className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold">メディア掲載</h2>
          </div>
          <p className="text-gray-600 text-lg">
            各種メディアでご紹介いただいています
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {store.media.map((media) => (
            <div key={media.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src={media.image}
                  alt={media.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                    MEDIA
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{media.date}</span>
                </div>
                
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{media.title}</h3>
                
                <p className="text-gray-600 mb-4 font-medium">{media.publication}</p>
                
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => window.open(media.url, '_blank')}
                >
                  記事を読む
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}