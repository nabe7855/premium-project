import React from 'react';

export const FirstTimeBanner: React.FC = () => {
  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-0 md:px-4">
        <div className="(16/9) relative aspect-video w-full overflow-hidden shadow-lg md:rounded-2xl">
          <img
            src="/初めてのお客様へバナー.png"
            alt="初めての方限定特典 特別割引キャンペーン"
            className="h-full w-full object-cover"
          />
          {/* Link overlay if needed, currently just visual as requested */}
          <div className="absolute inset-0 cursor-pointer transition-colors hover:bg-black/5"></div>
        </div>
      </div>
    </section>
  );
};
