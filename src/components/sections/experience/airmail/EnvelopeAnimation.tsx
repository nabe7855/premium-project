'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef } from 'react';

const EnvelopeAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const largeLetterRef = useRef<HTMLDivElement>(null);

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
        onUpdate: (self: any) => {
          const progressBar = document.getElementById('progress-bar');
          if (progressBar) {
            progressBar.style.width = `${self.progress * 100}%`;
          }
        },
      },
    });

    // Step 1: Initial entrance - stable 3D perspective
    tl.fromTo(
      envelopeRef.current,
      { rotateX: -15, scale: 0.85, opacity: 0 },
      { rotateX: 0, scale: 1, opacity: 1, duration: 0.6 },
    );

    // Step 2: Flap Opens (Strictly around the top long side)
    tl.to(flapRef.current, {
      rotateX: 180,
      duration: 1.2,
      ease: 'power2.inOut',
      transformOrigin: '50% 0%',
    });

    // Step 3: Letter slides up
    tl.to(
      letterRef.current,
      {
        y: -400,
        z: 100,
        rotateZ: -1,
        duration: 1.8,
        ease: 'power2.out',
      },
      '-=0.4',
    );

    // Step 4: Slight scale up for better readability
    tl.to(letterRef.current, {
      scale: 1.05,
      boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.4)',
      duration: 0.5,
    });

    // Step 5: Fade out the small letter
    tl.to(letterRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    });

    // Step 6: Fade out the envelope
    tl.to(
      envelopeRef.current,
      {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      '-=0.4',
    );

    // Step 7: Large letter descends from above
    tl.fromTo(
      largeLetterRef.current,
      {
        y: -800,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power2.out',
      },
      '-=0.2',
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
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-5%] top-[-10%] h-[40vw] w-[40vw] rounded-full bg-blue-50 opacity-60 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] h-[40vw] w-[40vw] rounded-full bg-red-50 opacity-60 blur-[120px]"></div>
      </div>

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

        {/* 2. THE LETTER (The message inside) */}
        <div
          ref={letterRef}
          className="absolute left-[4%] top-[4%] flex h-[92%] w-[92%] flex-col rounded-sm border border-slate-100 bg-white p-3 shadow-lg md:p-6"
          style={{ transform: 'translateZ(1px)', transformStyle: 'preserve-3d' }}
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

        {/* 3. FRONT PANEL (The Pouch / Pocket) */}
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

        {/* 4. THE FLAP (The hinged top lid) */}
        <div
          ref={flapRef}
          className="pointer-events-none absolute left-0 top-0 h-full w-full"
          style={{
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            zIndex: 50,
            transform: 'translateZ(3px)',
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
      </div>

      {/* Large Letter Pages - Descends from above */}
      <div
        ref={largeLetterRef}
        className="absolute inset-0 flex items-center justify-center opacity-0"
        style={{ perspective: '2000px' }}
      >
        <div className="flex gap-8 md:gap-12">
          {/* Page 1 */}
          <div className="h-[500px] w-[350px] overflow-hidden rounded-lg bg-white shadow-2xl md:h-[600px] md:w-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/letter-page-1.png"
              alt="Letter Page 1"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Page 2 */}
          <div className="h-[500px] w-[350px] overflow-hidden rounded-lg bg-white shadow-2xl md:h-[600px] md:w-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/letter-page-2.png"
              alt="Letter Page 2"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Progress tracking footer */}
      <div className="absolute bottom-10 flex flex-col items-center gap-3 opacity-40">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-500">
          Unfolding Sequence
        </span>
        <div className="h-[3px] w-32 overflow-hidden rounded-full bg-slate-100">
          <div
            id="progress-bar"
            className="h-full w-0 bg-blue-600 transition-all duration-150 ease-out"
          ></div>
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
