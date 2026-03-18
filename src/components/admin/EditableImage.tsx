'use client';

import { cn } from '@/lib/utils';
import { Camera } from 'lucide-react';
import NextImage from 'next/image';
import React, { useRef } from 'react';

/**
 * 管理画面などで利用される編集可能な画像コンポーネント
 * Next.jsのImageコンポーネントを使用するように最適化されています。
 */
interface EditableImageProps {
  src: string;
  isEditing?: boolean;
  onUpload?: (file: File) => void;
  storageKey?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  isEditing = false,
  onUpload,
  className,
  storageKey,
  alt,
  src,
  priority = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing && fileInputRef.current) {
      console.log('🎨 EditableImage: Clicked', storageKey || alt);
      e.preventDefault();
      e.stopPropagation();
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('🎨 EditableImage: File selected', file.name);
      if (onUpload) onUpload(file);
    }
  };

  // 画像要素本体 (Next.js Imageを使用)
  const imageElement = (
    <NextImage
      src={src}
      alt={alt || ''}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
      className={cn('object-cover transition-all', className)}
    />
  );

  if (!isEditing) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        {imageElement}
      </div>
    );
  }

  return (
    <div
      className={cn('group relative cursor-pointer overflow-hidden', className)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {imageElement}

      {/* 編集用オーバーレイ */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex flex-col items-center text-white">
          <Camera className="mb-2 h-8 w-8" />
          <span className="text-sm font-bold">画像を変更</span>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
