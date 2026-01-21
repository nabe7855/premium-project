
import React from 'react';
import { OptionItem, TransportItem } from '../types';

interface SimplePriceListProps {
  items: (OptionItem | TransportItem)[];
  title: string;
}

const SimplePriceList: React.FC<SimplePriceListProps> = ({ items, title }) => {
  return (
    <div className="bg-white border-2 border-rose-100 rounded-[2rem] overflow-hidden shadow-lg shadow-rose-100/50">
      <div className="px-8 py-5 border-b border-rose-50 bg-rose-50/50">
        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest text-center">{title}</h3>
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
            ? (typeof (item as TransportItem).price === 'number' 
               ? `${(item as TransportItem).price.toLocaleString()}円` 
               : (item as TransportItem).label)
            : `${prefix}${(item as OptionItem).price.toLocaleString()}円`;

          return (
            <div key={item.id} className="p-6 md:px-8 flex flex-col md:flex-row md:justify-between md:items-center hover:bg-rose-50/20 transition-colors gap-2 md:gap-4">
              <div className="flex-1">
                <h4 className="text-xl font-bold text-rose-900 font-rounded">
                  {isTransport ? (item as TransportItem).area : (item as OptionItem).name}
                </h4>
                <p className="text-sm text-rose-400 mt-1 leading-relaxed">
                  {isTransport ? ((item as TransportItem).note || (item as TransportItem).label) : (item as OptionItem).description}
                </p>
              </div>
              <div className="flex flex-col md:items-end">
                <div className="flex items-baseline gap-1 md:text-right">
                  <span className="text-2xl font-black text-rose-500">
                    {priceDisplay}
                  </span>
                </div>
                {isOption && (item as OptionItem).isRelative && (
                  <span className="text-[10px] text-rose-300 font-bold">※コース料金に対して</span>
                )}
                {isTransport && typeof (item as TransportItem).price === 'number' && (
                  <span className="text-[10px] text-rose-300 font-bold">※別途交通費</span>
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
