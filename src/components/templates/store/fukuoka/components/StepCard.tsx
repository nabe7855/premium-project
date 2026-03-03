import { EditableImage } from '@/components/admin/EditableImage';
import React from 'react';

interface StepCardProps {
  num: number;
  icon?: React.ReactNode;
  title: React.ReactNode;
  desc: React.ReactNode;
  imageSrc?: string;
  isEditing?: boolean;
  onImageUpload?: (file: File) => void;
}

const StepCard: React.FC<StepCardProps> = ({
  num,
  icon,
  title,
  desc,
  imageSrc,
  isEditing,
  onImageUpload,
}) => (
  <div className="group relative flex w-full flex-row items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-all hover:shadow-md md:p-5">
    {/* Step Number Badge */}
    <div className="from-primary-400 to-primary-500 absolute -left-2 -top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br font-serif text-sm font-bold text-white shadow-md">
      {num}
    </div>

    {/* Image container - Left side */}
    <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50 sm:h-24 sm:w-32 md:h-28 md:w-36">
      {imageSrc ? (
        <EditableImage
          isEditing={isEditing}
          src={imageSrc}
          alt=""
          onUpload={onImageUpload}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="text-primary-500 bg-primary-50 flex h-full w-full items-center justify-center">
          {icon}
        </div>
      )}
    </div>

    {/* Text content - Right side */}
    <div className="flex min-w-0 flex-1 flex-col justify-center">
      <div className="mb-2 inline-flex w-fit items-center gap-2 border-b border-neutral-100 pb-1 pr-4">
        <h3 className="truncate text-base font-bold text-slate-800 sm:text-lg">{title}</h3>
      </div>
      <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 sm:line-clamp-3 sm:text-sm">
        {desc}
      </p>
    </div>
  </div>
);

export default StepCard;
