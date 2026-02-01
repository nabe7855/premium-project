'use client';

import { Welcome } from '@/components/sections/guide/first-time/Welcome';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef } from 'react';

const EnvelopeAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const largeLetterRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=4000', // Extended for new animation sequence
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Step 1: Initial entrance - stable 3D perspective
    tl.fromTo(
      envelopeRef.current,
      { rotateX: -15, scale: 0.85, opacity: 0 },
      { rotateX: 0, scale: 1, opacity: 1, duration: 0.6 },
    );

    // Initial state: hide the letter until envelope starts opening
    gsap.set(letterRef.current, { opacity: 0 });

    // Step 2: Flap Opens & Letter Fades In
    tl.to(flapRef.current, {
      rotateX: 180,
      duration: 1.2,
      ease: 'power2.inOut',
      transformOrigin: '50% 0%',
    });

    // Fade in the letter inside the pocket as the flap opens
    tl.to(
      letterRef.current,
      {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.inOut',
      },
      '<+=0.2',
    ); // Start slightly after flap starts lifting

    // Step 3: Letter pops to front and slides up (TRIGGER AFTER FLAP IS OPEN)
    tl.to(
      letterRef.current,
      {
        y: -400, // ★封筒をさらに下げたため、画面中央に来るようにスライド距離を調整（-320から-400へ）
        z: 220, // ★前面への移動
        rotateZ: -1,
        duration: 0.8,
        ease: 'power2.out',
        zIndex: 100, // ★重なり順を確実に最前面へ
        onStart: () => {
          if (letterRef.current) letterRef.current.style.zIndex = '100';
        },
      },
      '>', // 蓋の開き終わり直後に開始
    );

    // Step 4: Slight scale up
    tl.to(
      letterRef.current,
      {
        scale: 1.05,
        boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.4)',
        duration: 0.4,
      },
      '-=0.75',
    );

    // Step 5: Fade out the small letter (Instant fade)
    tl.to(
      letterRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      },
      '-=0.75',
    );

    // Step 6: Fade out the envelope (Sync with letter)
    tl.to(
      envelopeRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      },
      '<',
    );

    // Step 7: Set initial state for large letter
    gsap.set(largeLetterRef.current, {
      y: 100,
      opacity: 0,
      scale: 0.95,
      zIndex: 301, // Boost z-index above flap AND small letter
    });

    // Step 8: Large letter floats up (Fast appearance)
    tl.to(
      largeLetterRef.current,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        onStart: () => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }
        },
      },
      '-=0.7',
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#fafafa]"
    >
      {/* 封筒の出現位置を絶対座標で指定（下から約20%の位置） */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[20%] flex justify-center">
        <div className="pointer-events-auto flex items-center justify-center">
          {/* Main 3D Container */}
          <div
            ref={envelopeRef}
            className="relative h-[240px] w-[340px] md:h-[360px] md:w-[560px]"
            style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
          >
            {/* 1. BACK PANEL (The stationary base) */}
            <div
              className="absolute inset-0 rounded-lg border border-slate-200 bg-[#fbfcf8] shadow-sm"
              style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}
            >
              <AirmailBorder />
              {/* Internal lining pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'radial-gradient(#000 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              ></div>
            </div>

            {/* 2. FRONT PANEL (The Pouch / Pocket) */}
            <div
              className="absolute inset-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
              style={{
                transform: 'translateZ(2px)',
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 50%, 100% 0)',
              }}
            >
              <AirmailBorder />

              {/* Postmark Detail */}
              <div className="absolute right-10 top-10">
                <div className="flex h-24 w-20 rotate-6 flex-col items-center justify-center border-2 border-dashed border-red-300 bg-white p-2 text-center text-xs font-black leading-none text-red-500 shadow-sm">
                  AIR
                  <br />
                  MAIL
                  <br />
                  2024
                </div>
              </div>

              {/* Faux Address Lines */}
              <div className="absolute bottom-14 left-14 space-y-3 opacity-30">
                <div className="h-3 w-64 rounded-full bg-slate-200"></div>
                <div className="h-3 w-48 rounded-full bg-slate-200"></div>
                <div className="h-3 w-56 rounded-full bg-slate-200"></div>
              </div>
            </div>

            {/* 3. THE FLAP (The hinged top lid) */}
            <div
              ref={flapRef}
              className="pointer-events-none absolute left-0 top-0 h-full w-full"
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(3px)', // zIndexを削除
              }}
            >
              {/* FLAP FRONT (Visible when envelope is closed) */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-white shadow-sm"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 50%)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  borderBottom: '1px solid #f1f1f1',
                }}
              >
                <AirmailBorder />
                {/* Wax Seal detail */}
                <div className="z-50 flex h-14 w-14 items-center justify-center rounded-full border-4 border-red-700 bg-red-600 text-2xl font-black text-white shadow-2xl [transform:translateZ(1px)]">
                  A
                </div>
              </div>

              {/* FLAP BACK (Visible when envelope is open) */}
              <div
                className="absolute inset-0 bg-[#f5f4ed]"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 50%)',
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent"></div>
                <div className="absolute left-0 top-0 h-6 w-full overflow-hidden">
                  <AirmailBorder />
                </div>
              </div>
            </div>

            {/* 4. THE LETTER (Message inside) - 最後に記述することで自然な重なり順を確保 */}
            <div
              ref={letterRef}
              className="absolute left-[4%] top-[4%] flex h-[92%] w-[92%] flex-col rounded-sm border border-slate-100 bg-white p-3 shadow-lg md:p-6"
              style={{
                transform: 'translateZ(1px)',
                transformStyle: 'preserve-3d',
                zIndex: 1,
                opacity: 0, // 最初は完全に隠す
              }}
            >
              <h3 className="mb-3 border-b border-slate-100 pb-2 pt-1 text-center font-serif text-lg font-bold leading-tight text-slate-900 md:text-2xl">
                初めてのご利用のお客様へ
              </h3>

              <div className="flex flex-1 flex-col items-center justify-center font-serif text-xs leading-relaxed text-slate-700 md:text-sm">
                <div className="relative mb-2 h-28 w-28 md:h-36 md:w-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/strawberry-bunny.png"
                    alt="Strawberry Bunny"
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="max-w-xs px-2 text-center text-[10px] leading-relaxed md:text-xs">
                  ストロベリーボーイズへようこそ。
                  <br />
                  最高のリラクゼーション体験をあなたに。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Large Letter Pages - Descends from above */}
      <div
        ref={scrollContainerRef}
        className="absolute inset-0 z-[1000] overflow-y-auto overflow-x-hidden"
        style={{ perspective: '2000px', WebkitOverflowScrolling: 'touch' }}
      >
        <div
          ref={largeLetterRef}
          className="flex min-h-full w-full items-start justify-center py-20 opacity-0"
        >
          <div className="w-full max-w-4xl px-4 md:px-0">
            <Welcome />
          </div>
        </div>
      </div>
    </div>
  );
};

const AirmailBorder: React.FC = () => (
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      padding: '12px',
      background: `repeating-linear-gradient(
        -45deg,
        #ef4444,
        #ef4444 20px,
        #ffffff 20px,
        #ffffff 40px,
        #3b82f6 40px,
        #3b82f6 60px,
        #ffffff 60px,
        #ffffff 80px
      )`,
      maskImage: 'linear-gradient(white, white), linear-gradient(white, white)',
      maskClip: 'content-box, padding-box',
      maskComposite: 'exclude',
      WebkitMaskComposite: 'destination-out',
    }}
  />
);

export default EnvelopeAnimation;
