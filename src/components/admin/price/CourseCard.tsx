import React from 'react';
import { Course } from './types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="mb-8 overflow-hidden rounded-[2rem] border-2 border-rose-100 bg-white shadow-lg shadow-rose-100/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-rose-200/60">
      <div className="flex items-center gap-5 border-b border-rose-50 bg-gradient-to-br from-rose-50 to-white p-8">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-rose-100 text-3xl">
          {course.icon}
        </div>
        <div>
          <h3 className="font-rounded text-xl font-bold leading-tight text-rose-900 md:text-2xl">
            {course.name}
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-rose-400 md:text-sm">
            {course.description}
          </p>
        </div>
      </div>

      <div className="space-y-8 p-6 md:p-8">
        {/* Time & Price List */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-400"></div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-300">
              Time & Price
            </h4>
          </div>
          <div className="space-y-3">
            {course.plans.map((plan, idx) => {
              const isRecommended = course.id === 'standard' && plan.minutes === 120;
              return (
                <div key={idx} className="relative">
                  {isRecommended && (
                    <div className="absolute -top-4 left-4 z-10 animate-bounce">
                      <div className="flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1 text-[9px] font-black text-white shadow-lg md:text-[10px]">
                        <span>✨</span>
                        <span>初心者におすすめ</span>
                        <div className="absolute bottom-[-3px] left-4 h-1.5 w-1.5 rotate-45 bg-rose-500"></div>
                      </div>
                    </div>
                  )}
                  <div
                    className={`flex flex-col gap-1 rounded-2xl border px-5 py-4 transition-all md:flex-row md:items-center md:justify-between md:gap-4 ${
                      isRecommended
                        ? 'border-rose-200 bg-rose-50 shadow-sm'
                        : 'border-rose-50/50 bg-rose-50/30'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-rose-800 md:text-lg">
                          {plan.minutes >= 600
                            ? `${plan.minutes / 60}時間`
                            : plan.minutes === 0
                              ? 'FREE TIME'
                              : `${plan.minutes} min`}
                        </span>
                        {plan.subLabel && (
                          <span className="rounded-full border border-rose-100 bg-white px-2 py-0.5 text-[9px] font-bold text-rose-500 md:text-[10px]">
                            {plan.subLabel}
                          </span>
                        )}
                      </div>
                      {plan.discountInfo && (
                        <div className="mt-0.5 flex items-center gap-1">
                          <span className="rounded bg-rose-500 px-1 text-[10px] font-bold text-white">
                            HOT
                          </span>
                          <span className="text-[10px] font-bold text-rose-500 md:text-[11px]">
                            ※{plan.discountInfo}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="self-end text-xl font-black text-rose-500 md:self-center md:text-2xl">
                      ¥{plan.price.toLocaleString()}
                    </span>
                  </div>
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
  );
};

export default CourseCard;
