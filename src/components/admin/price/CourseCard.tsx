import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { Course } from './types';

interface CourseCardProps {
  course: Course;
  defaultOpen?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-[2rem] border-2 border-rose-100 bg-white shadow-lg shadow-rose-100/50 transition-all duration-300">
      {/* Accordion Header - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-5 border-b border-rose-50 bg-gradient-to-br from-rose-50 to-white p-6 transition-all hover:from-rose-100 hover:to-rose-50 md:p-8"
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-100 text-3xl">
          {course.icon && (course.icon.startsWith('http') || course.icon.startsWith('/')) ? (
            <img src={course.icon} alt="" className="h-full w-full object-cover" />
          ) : (
            course.icon || '🍓'
          )}
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-rounded text-xl font-bold leading-tight text-rose-900 md:text-2xl">
            {course.name}
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-rose-400 md:text-sm">
            {course.description}
          </p>
        </div>
        <ChevronDown
          className={`h-6 w-6 shrink-0 text-rose-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Accordion Content - Collapsible */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-8 p-6 md:p-8">
          {/* Time & Price List - 2 Column Grid (Always) */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-400"></div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-300">
                Time & Price
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-x-6">
              {course.plans.map((plan, idx) => {
                const isRecommended = course.id === 'standard' && plan.minutes === 120;
                return (
                  <div
                    key={idx}
                    className={`group relative flex items-center justify-between gap-2 border-b border-dotted py-3 transition-all ${
                      isRecommended ? 'border-rose-200 bg-rose-50/50' : 'border-rose-100/50'
                    }`}
                  >
                    {isRecommended && (
                      <div className="absolute -left-1 -top-2 z-10 sm:-left-2">
                        <div className="flex items-center gap-0.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[7px] font-black text-white shadow-sm sm:px-2 sm:text-[8px]">
                          <span>✨</span>
                          <span className="hidden sm:inline">おすすめ</span>
                        </div>
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-block shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700 sm:px-3 sm:py-1 sm:text-xs">
                          {plan.minutes >= 600
                            ? `${plan.minutes / 60}時間`
                            : plan.minutes === 0
                              ? 'FREE'
                              : `${plan.minutes}min`}
                        </span>
                        {plan.subLabel && (
                          <span className="text-[10px] font-bold text-rose-400">
                            {plan.subLabel}
                          </span>
                        )}
                      </div>
                      {plan.discountInfo && (
                        <div className="flex items-center gap-1">
                          <span className="shrink-0 rounded bg-rose-500 px-1 text-[7px] font-bold text-white sm:text-[8px]">
                            HOT
                          </span>
                          <span className="min-w-0 truncate text-[8px] font-bold text-rose-500 sm:text-[9px]">
                            {plan.discountInfo}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="shrink-0 text-base font-black text-rose-900 sm:text-lg">
                      ¥{plan.price.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Info Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-orange-100/50 bg-orange-50/30 p-5">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-orange-400">
                延長料金
              </p>
              <p className="text-sm font-bold text-orange-900 md:text-base">
                30分 /{' '}
                <span className="text-rose-500">¥{course.extensionPer30min.toLocaleString()}</span>
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100/50 bg-emerald-50/30 p-5">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                指名料
              </p>
              <div className="space-y-1 text-xs font-bold text-emerald-900 md:text-sm">
                <div className="flex justify-between">
                  <span>本指名:</span>
                  <span className="text-rose-500">
                    ¥{course.designationFees.first.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="shrink-0">備考:</span>
                  <span className="text-right text-[9px] font-medium leading-tight text-emerald-600/70 md:text-[10px]">
                    {course.designationFees.note || '一律料金。ご希望なしで無料♫'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {course.notes && (
            <div className="rounded-2xl border border-rose-100/50 bg-rose-50/50 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs">📝</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                  Course Notes
                </p>
              </div>
              <p className="whitespace-pre-wrap text-[11px] font-medium leading-relaxed text-rose-800 md:text-xs">
                {course.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
