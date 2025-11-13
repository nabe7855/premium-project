import React from 'react';
import { Store } from '../../types/stores';

interface StoreCardProps {
  store: Store;
  isSelected: boolean;
  onSelect: () => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, isSelected, onSelect }) => {
  const selectionClasses = isSelected 
    ? `ring-2 ring-offset-2 ring-offset-gray-900 ring-${store.themeColor}-400 shadow-2xl shadow-${store.themeColor}-500/50 opacity-100`
    : 'ring-2 ring-transparent opacity-60 hover:opacity-90';

  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 ease-out w-full h-full rounded-lg overflow-hidden ${selectionClasses}`}
      onClick={onSelect}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select ${store.name}`}
    >
      <img 
        src={store.portraitUrl} 
        alt={store.name} 
        className="w-full h-full object-cover" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
        <h3 className="font-cinzel font-bold text-white text-base leading-tight drop-shadow-md">{store.name}</h3>
      </div>
    </div>
  );
};

export default StoreCard;
