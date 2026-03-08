'use client';

/**
 * Global Loading UI for Next.js App Router
 * Displays the provided MP4 video as a centered loading animation.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        {/* Loading Sprite Animation */}
        <div className="animate-loading-sprite" />

        {/* Stylish Text */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="animate-pulse text-sm font-black uppercase tracking-[0.3em] text-[#FF8BA7]">
            Loading
          </span>
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#FF8BA7] to-transparent" />
        </div>
      </div>
    </div>
  );
}
