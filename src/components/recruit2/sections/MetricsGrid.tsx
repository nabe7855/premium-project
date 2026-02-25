'use client';

import { EditableImage } from '@/components/admin/EditableImage';
import React from 'react';

interface MetricsGridProps {
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
  brandingImages?: {
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
  };
  metricsLabel?: string;
  metricsValue?: string;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({
  isEditing = false,
  onUpdate,
  brandingImages,
  metricsLabel = 'Fan Retention Rate',
  metricsValue = '94.2%',
}) => {
  console.log('[MetricsGrid] Rendered with brandingImages:', brandingImages);
  const [localPreviews, setLocalPreviews] = React.useState<Record<string, string>>({});

  const handleUpload = (key: string) => (file: File) => {
    console.log(`[MetricsGrid] handleUpload for key=${key}, file=${file.name}`);
    const previewUrl = URL.createObjectURL(file);
    setLocalPreviews((prev) => ({ ...prev, [key]: previewUrl }));
    if (onUpdate) onUpdate(key, file);
  };

  return (
    <section className="relative overflow-hidden bg-black py-24 text-white">
      {/* Decorative background elements - subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/10 blur-[120px]"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Visuals - 2x2 Grid */}
          <div className="relative">
            <div className="relative z-10 grid grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-4 md:space-y-8 md:pt-12">
                <div className="aspect-[3/4] overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
                  <EditableImage
                    src={localPreviews.image1 || brandingImages?.image1 || '/キャストモデル１.png'}
                    className="h-full w-full object-cover brightness-75 filter transition-all duration-700 hover:brightness-100"
                    alt="Professional 1"
                    isEditing={isEditing}
                    onUpload={handleUpload('image1')}
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
                  <EditableImage
                    src={localPreviews.image2 || brandingImages?.image2 || '/キャストモデル２.png'}
                    className="h-full w-full object-cover brightness-75 filter transition-all duration-700 hover:brightness-100"
                    alt="Professional 2"
                    isEditing={isEditing}
                    onUpload={handleUpload('image2')}
                  />
                </div>
              </div>
              <div className="space-y-4 md:space-y-8">
                <div className="aspect-square overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
                  <EditableImage
                    src={localPreviews.image3 || brandingImages?.image3 || '/キャストモデル３.png'}
                    className="h-full w-full object-cover brightness-75 filter transition-all duration-700 hover:brightness-100"
                    alt="Professional 3"
                    isEditing={isEditing}
                    onUpload={handleUpload('image3')}
                  />
                </div>
                <div className="aspect-[3/4] overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
                  <EditableImage
                    src={
                      localPreviews.image4 ||
                      brandingImages?.image4 ||
                      'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=600'
                    }
                    className="h-full w-full object-cover brightness-75 filter transition-all duration-700 hover:brightness-100"
                    alt="Professional 4"
                    isEditing={isEditing}
                    onUpload={handleUpload('image4')}
                  />
                </div>
              </div>
            </div>

            {/* Floating metrics badge */}
            <div className="animate-bounce-slow absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-3xl border-4 border-slate-950 bg-amber-600 p-6 text-white shadow-2xl md:p-10">
              {isEditing ? (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdate?.('metricsLabel', e.currentTarget.innerText)}
                  className="mb-1 cursor-text text-[10px] font-bold uppercase tracking-widest opacity-80 outline-none hover:bg-black/10 md:text-sm"
                >
                  {metricsLabel}
                </div>
              ) : (
                <div className="mb-1 text-[10px] font-bold uppercase tracking-widest opacity-80 md:text-sm">
                  {metricsLabel}
                </div>
              )}
              {isEditing ? (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdate?.('metricsValue', e.currentTarget.innerText)}
                  className="cursor-text font-serif text-3xl font-bold outline-none hover:bg-black/10 md:text-5xl"
                >
                  {metricsValue}
                </div>
              ) : (
                <div className="font-serif text-3xl font-bold md:text-5xl">{metricsValue}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { margin-top: -10px; }
          50% { margin-top: 10px; }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default MetricsGrid;
