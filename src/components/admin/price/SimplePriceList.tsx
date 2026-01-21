import React from 'react';
import { OptionItem, TransportItem } from './types';

interface SimplePriceListProps {
  items: (OptionItem | TransportItem)[];
  title: string;
}

const SimplePriceList: React.FC<SimplePriceListProps> = ({ items, title }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border-2 border-rose-100 bg-white shadow-lg shadow-rose-100/50">
      <div className="border-b border-rose-50 bg-rose-50/50 px-8 py-5">
        <h3 className="text-center text-sm font-bold uppercase tracking-widest text-rose-400">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-rose-50">
        {items.map((item) => {
          const isOption = 'description' in item && 'isRelative' in item;
          const isTransport = 'area' in item;

          let prefix = '';
          if (isOption && (item as OptionItem).isRelative) {
            prefix = (item as OptionItem).price > 0 ? '+' : '';
          }

          const priceDisplay = isTransport
            ? typeof (item as TransportItem).price === 'number'
              ? `${(item as TransportItem).price.toLocaleString()}円`
              : (item as TransportItem).label
            : `${prefix}${(item as OptionItem).price.toLocaleString()}円`;

          return (
            <div
              key={item.id}
              className="flex flex-col gap-2 p-6 transition-colors hover:bg-rose-50/20 md:flex-row md:items-center md:justify-between md:gap-4 md:px-8"
            >
              <div className="flex-1">
                <h4 className="font-rounded text-xl font-bold text-rose-900">
                  {isTransport ? (item as TransportItem).area : (item as OptionItem).name}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-rose-400">
                  {isTransport
                    ? (item as TransportItem).note || (item as TransportItem).label
                    : (item as OptionItem).description}
                </p>
              </div>
              <div className="flex flex-col md:items-end">
                <div className="flex items-baseline gap-1 md:text-right">
                  <span className="text-2xl font-black text-rose-500">{priceDisplay}</span>
                </div>
                {isOption && (item as OptionItem).isRelative && (
                  <span className="text-[10px] font-bold text-rose-300">※コース料金に対して</span>
                )}
                {isTransport && typeof (item as TransportItem).price === 'number' && (
                  <span className="text-[10px] font-bold text-rose-300">※別途交通費</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimplePriceList;
