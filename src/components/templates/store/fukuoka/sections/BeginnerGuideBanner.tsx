'use client';
import { BeginnerGuideConfig } from '@/lib/store/storeTopConfig';
import { Camera } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface BeginnerGuideBannerProps {
  config?: BeginnerGuideConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const BeginnerGuideBanner: React.FC<BeginnerGuideBannerProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const params = useParams();
  const slug = params?.slug as string;

  if (!config || !config.isVisible) return null;

  // We handle dynamic slug replacement if the link has `{slug}`
  const finalLink = config.link.replace('{slug}', slug || '');

  return (
    <section id="beginnerGuide" className="relative z-30 w-full bg-white px-2 py-3">
      <div className="group/section relative mx-auto max-w-7xl">
        <Link
          href={isEditing ? '#' : finalLink}
          onClick={(e) => {
            if (isEditing) e.preventDefault();
          }}
          className="group relative block w-full overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-rose-200/50 active:scale-[0.99]"
        >
          <img
            src={config.imageUrl || '/女性用風俗初体験の方はこちら.png'}
            alt="女性用風俗初体験の方はこちら"
            className="h-auto w-full object-contain"
          />
          {/* Shine effect */}
          {!isEditing && (
            <div className="absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          )}

          {isEditing && (
            <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file && onImageUpload) {
                      onImageUpload('beginnerGuide', file, undefined, 'imageUrl');
                    }
                  };
                  input.click();
                }}
                className="flex items-center gap-2 rounded-full bg-brand-accent px-6 py-3 font-bold text-white shadow-lg hover:bg-brand-accent/90"
              >
                <Camera size={20} />
                新しい画像を追加
              </button>
            </div>
          )}
        </Link>
        {isEditing && (
          <div className="pointer-events-auto absolute -right-2 top-2 z-50 rounded-lg bg-black/80 p-2 opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover/section:opacity-100">
            <h3 className="mb-2 text-xs font-bold text-gray-300">リンク先の変更</h3>
            <input
              type="text"
              value={config.link}
              onChange={(e) => onUpdate?.('beginnerGuide', 'link', e.target.value)}
              className="w-48 rounded bg-white/10 px-2 py-1 text-xs text-white"
              placeholder="/store/{slug}/first-time"
            />
            <p className="mt-1 text-[10px] text-gray-400">※ {'{slug}'} は店舗名に置き換わります</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BeginnerGuideBanner;
