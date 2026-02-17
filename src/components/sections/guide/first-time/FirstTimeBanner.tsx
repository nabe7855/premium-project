import { EditableImage } from '@/components/admin/EditableImage';
import React from 'react';

interface FirstTimeBannerProps {
  config?: {
    imageUrl: string;
    isVisible: boolean;
  };
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File) => void;
}

export const FirstTimeBanner: React.FC<FirstTimeBannerProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const data = config || {
    imageUrl: '/初めてのお客様へバナー.png',
    isVisible: true,
  };

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section className={`w-full bg-white ${!data.isVisible ? 'opacity-50' : ''}`}>
      <div className="container mx-auto px-0 md:px-4">
        <div className="relative w-full overflow-hidden md:rounded-2xl">
          <EditableImage
            isEditing={isEditing}
            src={data.imageUrl}
            alt="初めての方限定特典 特別割引キャンペーン"
            onUpload={(file) => onImageUpload?.('banner', file)}
            className="block h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
};
