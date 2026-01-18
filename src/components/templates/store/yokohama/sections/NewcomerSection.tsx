import { NewcomerConfig } from '@/lib/store/storeTopConfig';
import React from 'react';

interface NewcomerSectionProps {
  config?: NewcomerConfig;
}

const NewcomerSection: React.FC<NewcomerSectionProps> = ({ config }) => {
  if (!config || !config.isVisible) return null;

  return (
    <section id="newcomer" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Image-matching Header */}
        <div className="mb-12 overflow-hidden rounded-xl bg-gradient-to-r from-[#9C7E4F] via-[#C4A97A] to-[#9C7E4F] py-6 text-center text-white shadow-lg md:py-8">
          <h2 className="mb-2 font-serif text-xl font-bold tracking-[0.2em] md:text-3xl">
            {config.heading}
          </h2>
          <p className="text-sm font-medium tracking-widest md:text-xl">{config.courseText}</p>
        </div>

        {/* Horizontal Slider / Grid */}
        <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 md:mx-0 md:grid md:grid-cols-4 md:gap-8 md:px-0">
          {config.items.map((item) => (
            <div key={item.id} className="min-w-[280px] snap-center md:min-w-0">
              <div className="group relative mb-4">
                {/* Image with brown/gold border matching the image */}
                <div className="relative aspect-[3/4] overflow-hidden border-[3px] border-[#C4A97A] shadow-md transition-all duration-500 group-hover:shadow-xl">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* "New Face" Badge */}
                  <div className="absolute right-4 top-4 flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-[#C4A97A] bg-white/95 text-center shadow-sm">
                    <span className="font-serif text-[10px] leading-none text-[#9C7E4F]">New</span>
                    <span className="font-serif text-[10px] leading-none text-[#9C7E4F]">Face</span>
                  </div>
                </div>
              </div>

              <div className="px-1 text-left">
                <h3 className="mb-1 font-serif text-xl font-bold tracking-widest text-slate-800">
                  {item.name}
                </h3>
                <p className="font-serif text-sm tracking-widest text-[#9C7E4F]">
                  {item.age} / <span className="text-[#C4A97A]">T</span>
                  {item.height}cm
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewcomerSection;
