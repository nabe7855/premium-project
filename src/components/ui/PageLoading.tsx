import React from 'react';

const PageLoading: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="relative mb-8 flex flex-col items-center">
        {/* Loading Sprite Animation (Ichigo-chan) */}
        <div className="animate-loading-sprite" />

        {/* Text */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="animate-pulse text-xl font-black tracking-widest text-[#FF8BA7]">
            ちょっと待ってね
          </p>
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-[#FF8BA7] to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default PageLoading;
