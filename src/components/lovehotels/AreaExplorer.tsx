'use client';

import { Prefecture } from '@/types/lovehotels';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

interface AreaExplorerProps {
  prefecture: Prefecture;
}

const AreaExplorer: React.FC<AreaExplorerProps> = ({ prefecture }) => {
  const { slug } = useParams();

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full bg-rose-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500">
            Narrow Down By Area
          </div>
          <h2 className="mb-4 text-3xl font-black tracking-tighter text-gray-900">
            {prefecture.name}のエリアから探す
          </h2>
          <p className="mx-auto max-w-lg font-medium text-gray-400">
            {prefecture.name}内の各エリアから、あなたにぴったりのホテルを見つけましょう。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {prefecture.cities.map((city) => (
            <Link
              key={city.id}
              href={`/store/${slug}/hotel/${city.id}`}
              className="group relative overflow-hidden rounded-[2.5rem] border-2 border-gray-50 bg-white p-8 transition-all hover:-translate-y-2 hover:border-rose-500 hover:shadow-2xl hover:shadow-rose-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-1 text-2xl font-black text-gray-900 transition-colors group-hover:text-rose-500">
                    {city.name}
                  </h3>
                  <div className="text-xs font-black uppercase tracking-widest text-gray-300 transition-colors group-hover:text-rose-300">
                    {city.count} HOTELS
                  </div>
                </div>
                <div className="rounded-full bg-gray-50 p-4 transition-colors group-hover:bg-rose-50">
                  <svg
                    className="h-6 w-6 text-gray-300 transition-colors group-hover:text-rose-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {city.areas?.map((area) => (
                  <span
                    key={area}
                    className="rounded-full bg-gray-50 px-3 py-1 text-[10px] font-bold text-gray-400 transition-colors group-hover:bg-rose-100 group-hover:text-rose-600"
                  >
                    #{area}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AreaExplorer;
