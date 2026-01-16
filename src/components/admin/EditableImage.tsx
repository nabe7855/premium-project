import { cn } from '@/lib/utils';
import { Camera } from 'lucide-react';
import React, { useRef } from 'react';

interface EditableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  isEditing?: boolean;
  onUpload?: (file: File) => void;
  storageKey?: string; // Identifier for DB saving later
}

export const EditableImage: React.FC<EditableImageProps> = ({
  isEditing = false,
  onUpload,
  className,
  storageKey,
  alt,
  ...props
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

  if (!isEditing) {
    return <img className={className} alt={alt || ''} {...props} />;
  }

  return (
    <div
      className={cn('group relative cursor-pointer overflow-hidden', className)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <img
        className={cn('h-full w-full object-cover transition-all', className)}
        alt={alt || ''}
        {...props}
      />

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
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
      />
    </div>
  );
};
