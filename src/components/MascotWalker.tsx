'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

// --- Constants (Adjustable) ---
const FPS = 10;
const SPEED_MIN = 40; // px/sec
const SPEED_MAX = 80; // px/sec
const SPRITE_COUNT = 6;
const REAPPEAR_DELAY_MIN = 300; // ms
const REAPPEAR_DELAY_MAX = 1200; // ms
const SCROLL_STOP_DELAY = 150; // ms
const VERTICAL_MARGIN_PERCENT = 10; // margin for spawning
const OFF_SCREEN_THRESHOLD = 150; // Distance to be considered fully off-screen

interface MascotState {
  x: number;
  y: number;
  direction: 'left' | 'right';
  speed: number;
  visible: boolean;
  frameIndex: number;
}

const MascotWalker: React.FC = () => {
  const [state, setState] = useState<MascotState>({
    x: -200,
    y: 0,
    direction: 'right',
    speed: 0,
    visible: false,
    frameIndex: 0,
  });

  const requestRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollYRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);

  // Initialize mascot at a random edge
  const spawnMascot = useCallback(() => {
    const direction = Math.random() > 0.5 ? 'right' : 'left';
    const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);

    const margin = window.innerHeight * (VERTICAL_MARGIN_PERCENT / 100);
    const minY = margin;
    const maxY = window.innerHeight - margin;
    const y = minY + Math.random() * (maxY - minY);

    lastYRef.current = y;
    const startX =
      direction === 'right' ? -OFF_SCREEN_THRESHOLD : window.innerWidth + OFF_SCREEN_THRESHOLD;

    setState({
      x: startX,
      y,
      direction,
      speed,
      visible: true,
      frameIndex: 0,
    });
  }, []);

  // Handle Animation Loop (Horizontal movement only)
  const animate = useCallback((time: number) => {
    if (lastUpdateRef.current !== undefined) {
      const deltaTime = (time - lastUpdateRef.current) / 1000;
      const frameDelta = Math.floor(time / (1000 / FPS));

      setState((prev) => {
        if (!prev.visible) return prev;

        const moveAmount = prev.speed * deltaTime;
        const newX = prev.direction === 'right' ? prev.x + moveAmount : prev.x - moveAmount;

        // Horizontal boundary check (off-screen)
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

  // Handle Scroll and Vertical reset
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      setState((prev) => {
        if (!prev.visible) return prev;

        const newY = prev.y - deltaY;

        // Vertical boundary check (If character moves off top or bottom due to scroll)
        const mascotHeight = window.innerWidth * 0.15; // Rough estimate for clamping logic
        const isOffScreenY = newY < -mascotHeight || newY > window.innerHeight + mascotHeight;

        if (isOffScreenY) {
          return { ...prev, visible: false };
        }

        return { ...prev, y: newY };
      });

      // Reset timer to detect scroll stop
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        // When scroll stops, if mascot is gone, spawn a new one
        setState((current) => {
          if (!current.visible) {
            // We can't use spawnMascot directly inside setState, so we handle it via visibility effect
            return current;
          }
          return current;
        });
      }, SCROLL_STOP_DELAY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Re-spawn trigger when visible goes from true -> false
  useEffect(() => {
    if (!state.visible) {
      const delay = REAPPEAR_DELAY_MIN + Math.random() * (REAPPEAR_DELAY_MAX - REAPPEAR_DELAY_MIN);
      const timer = setTimeout(() => {
        spawnMascot();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [state.visible, spawnMascot]);

  // Lifecycle
  useEffect(() => {
    spawnMascot();
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
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
        }}
      >
        <img
          src={`/sprites/side/frame${state.frameIndex + 1}.png`}
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
