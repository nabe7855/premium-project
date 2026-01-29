'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

// --- Constants (Adjustable) ---
const FPS = 8; // Reduced from 10
const SPEED_MIN = 32; // Reduced from 40
const SPEED_MAX = 64; // Reduced from 80
const SPRITE_COUNT = 6;
const IDLE_SPRITE_COUNT = 4;
const REAPPEAR_DELAY_MIN = 210; // Reduced from 300 (30% reduction)
const REAPPEAR_DELAY_MAX = 840; // Reduced from 1200 (30% reduction)
const SCROLL_STOP_DELAY = 150; // ms
const VERTICAL_MARGIN_PERCENT = 10;
const OFF_SCREEN_THRESHOLD = 150;
const MESSAGE_DURATION = 3000; // ms
const IDLE_CHANCE = 0.005; // Chance per frame to start being idle
const IDLE_DURATION_MIN = 2000; // ms
const IDLE_DURATION_MAX = 4000; // ms

const MESSAGES = [
  'こんにちは！',
  'いい天気だね！',
  'お散歩中だよ〜',
  'お仕事頑張って！',
  'なでなでして〜',
  '今日はいいことあるかも！',
  'るんるん♪',
];

interface MascotState {
  x: number;
  y: number;
  direction: 'left' | 'right';
  speed: number;
  visible: boolean;
  frameIndex: number;
  isIdle: boolean;
  message: string | null;
}

const MascotWalker: React.FC = () => {
  const [state, setState] = useState<MascotState>({
    x: -200,
    y: 0,
    direction: 'right',
    speed: 0,
    visible: false,
    frameIndex: 0,
    isIdle: false,
    message: null,
  });

  const requestRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollYRef = useRef<number>(0);

  const spawnMascot = useCallback(() => {
    const direction = Math.random() > 0.5 ? 'right' : 'left';
    const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
    const margin = window.innerHeight * (VERTICAL_MARGIN_PERCENT / 100);
    const minY = margin;
    const maxY = window.innerHeight - margin;
    const y = minY + Math.random() * (maxY - minY);
    const startX =
      direction === 'right' ? -OFF_SCREEN_THRESHOLD : window.innerWidth + OFF_SCREEN_THRESHOLD;

    setState((prev) => ({
      ...prev,
      x: startX,
      y,
      direction,
      speed,
      visible: true,
      frameIndex: 0,
      isIdle: false,
      message: null,
    }));
  }, []);

  const handleMascotClick = () => {
    const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setState((prev) => ({ ...prev, message: randomMessage, isIdle: true }));

    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    messageTimeoutRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, message: null, isIdle: false }));
    }, MESSAGE_DURATION);
  };

  const animate = useCallback((time: number) => {
    if (lastUpdateRef.current !== undefined) {
      const deltaTime = (time - lastUpdateRef.current) / 1000;
      const frameDelta = Math.floor(time / (1000 / FPS));

      setState((prev) => {
        if (!prev.visible) return prev;

        // Random idle trigger
        if (!prev.isIdle && !prev.message && Math.random() < IDLE_CHANCE) {
          const idleTime =
            IDLE_DURATION_MIN + Math.random() * (IDLE_DURATION_MAX - IDLE_DURATION_MIN);
          if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
          idleTimeoutRef.current = setTimeout(() => {
            setState((s) => ({ ...s, isIdle: false }));
          }, idleTime);
          return { ...prev, isIdle: true };
        }

        if (prev.isIdle) {
          // While idle, don't move X, but animate idle frames at half speed (approx 5fps)
          const idleFrameDelta = Math.floor(time / (1000 / (FPS / 2)));
          return {
            ...prev,
            frameIndex: idleFrameDelta % IDLE_SPRITE_COUNT,
          };
        }

        const moveAmount = prev.speed * deltaTime;
        const newX = prev.direction === 'right' ? prev.x + moveAmount : prev.x - moveAmount;

        const isOffScreenX =
          (prev.direction === 'right' && newX > window.innerWidth + OFF_SCREEN_THRESHOLD) ||
          (prev.direction === 'left' && newX < -OFF_SCREEN_THRESHOLD);

        if (isOffScreenX) {
          return { ...prev, visible: false };
        }

        return {
          ...prev,
          x: newX,
          frameIndex: frameDelta % SPRITE_COUNT,
        };
      });
    }
    lastUpdateRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      setState((prev) => {
        if (!prev.visible) return prev;
        const newY = prev.y - deltaY;
        const mascotSize = window.innerWidth * 0.15;
        const isOffScreenY = newY < -mascotSize || newY > window.innerHeight + mascotSize;
        if (isOffScreenY) return { ...prev, visible: false };
        return { ...prev, y: newY };
      });

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setState((current) => current);
      }, SCROLL_STOP_DELAY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!state.visible) {
      const delay = REAPPEAR_DELAY_MIN + Math.random() * (REAPPEAR_DELAY_MAX - REAPPEAR_DELAY_MIN);
      const timer = setTimeout(() => {
        spawnMascot();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [state.visible, spawnMascot]);

  useEffect(() => {
    spawnMascot();
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [spawnMascot, animate]);

  if (!state.visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${state.x}px`,
          top: `${state.y}px`,
          width: '15vw',
          minWidth: '48px',
          maxWidth: '120px',
          transform: `translate(-50%, -50%) scaleX(${state.direction === 'left' ? -1 : 1})`,
          transition: 'none',
          willChange: 'transform, left, top',
          pointerEvents: 'auto', // Enable clicking the mascot
          cursor: 'pointer',
        }}
        onClick={handleMascotClick}
      >
        {/* Speech Bubble */}
        {state.message && (
          <div
            style={{
              position: 'absolute',
              bottom: '110%',
              left: '50%',
              transform: `translateX(-50%) scaleX(${state.direction === 'left' ? -1 : 1})`, // Un-flip the bubble text
              background: 'white',
              padding: '8px 12px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              color: '#333',
              fontWeight: 'bold',
              border: '2px solid #ff99cc',
            }}
          >
            {state.message}
            {/* Triangle for bubble */}
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid white',
              }}
            />
          </div>
        )}

        <img
          src={`/sprites/${state.isIdle ? 'idle' : 'side'}/frame${state.frameIndex + 1}.png`}
          alt="Mascot"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120?text=Sprite';
          }}
        />
      </div>
    </div>
  );
};

export default MascotWalker;
