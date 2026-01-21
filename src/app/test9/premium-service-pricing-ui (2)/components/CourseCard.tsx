
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white border-2 border-rose-100 rounded-[2rem] overflow-hidden mb-8 shadow-lg shadow-rose-100/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-rose-200/60">
      <div className="p-8 border-b border-rose-50 bg-gradient-to-br from-rose-50 to-white flex items-center gap-5">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-3xl shrink-0">
          {course.icon}
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-rose-900 font-rounded leading-tight">{course.name}</h3>
          <p className="text-[11px] md:text-sm text-rose-400 mt-1 leading-relaxed">{course.description}</p>
        </div>
      </div>
      
      <div className="p-6 md:p-8 space-y-8">
        {/* Time & Price List */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div>
            <h4 className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Time & Price</h4>
          </div>
          <div className="space-y-3">
            {course.plans.map((plan, idx) => {
              const isRecommended = course.id === 'standard' && plan.minutes === 120;
              return (
                <div key={idx} className="relative">
                  {isRecommended && (
                    <div className="absolute -top-4 left-4 z-10 animate-bounce">
                      <div className="bg-rose-500 text-white text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <span>✨</span>
                        <span>初心者におすすめ</span>
                        <div className="absolute bottom-[-3px] left-4 w-1.5 h-1.5 bg-rose-500 rotate-45"></div>
                      </div>
                    </div>
                  )}
                  <div className={`flex flex-col md:flex-row md:justify-between md:items-center py-4 px-5 rounded-2xl border transition-all gap-1 md:gap-4 ${
                    isRecommended 
                    ? 'bg-rose-50 border-rose-200 shadow-sm' 
                    : 'bg-rose-50/30 border-rose-50/50'
                  }`}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base md:text-lg font-bold text-rose-800">
                          {plan.minutes >= 600 ? `${plan.minutes / 60}時間` : (plan.minutes === 0 ? 'FREE TIME' : `${plan.minutes} min`)}
                        </span>
                        {plan.subLabel && (
                          <span className="text-[9px] md:text-[10px] bg-white text-rose-500 font-bold px-2 py-0.5 rounded-full border border-rose-100">
                            {plan.subLabel}
                          </span>
                        )}
                      </div>
                      {plan.discountInfo && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] bg-rose-500 text-white font-bold px-1 rounded">HOT</span>
                          <span className="text-[10px] md:text-[11px] text-rose-500 font-bold">※{plan.discountInfo}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xl md:text-2xl font-black text-rose-500 self-end md:self-center">¥{plan.price.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-orange-50/30 p-5 rounded-2xl border border-orange-100/50">
            <p className="text-[9px] text-orange-400 uppercase font-bold mb-1 tracking-widest">延長料金</p>
            <p className="text-sm md:text-base font-bold text-orange-900">30分 / <span className="text-rose-500">¥{course.extensionPer30min.toLocaleString()}</span></p>
          </div>
          <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100/50">
            <p className="text-[9px] text-emerald-400 uppercase font-bold mb-1 tracking-widest">指名料</p>
            <div className="text-xs md:text-sm space-y-1 text-emerald-900 font-bold">
              <div className="flex justify-between">
                <span>本指名:</span>
                <span className="text-rose-500">¥{course.designationFees.first.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="shrink-0">備考:</span>
                <span className="text-[9px] md:text-[10px] text-emerald-600/70 font-medium text-right leading-tight">
                  {course.designationFees.note || '一律料金。ご希望なしで無料♫'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {course.notes && (
          <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs">📝</span>
              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Course Notes</p>
            </div>
            <p className="text-[11px] md:text-xs text-rose-800 leading-relaxed font-medium whitespace-pre-wrap">
              {course.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
