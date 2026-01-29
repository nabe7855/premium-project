'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

// --- Constants (Adjustable) ---
const FPS = 10;
const SPEED_MIN = 40; // px/sec
const SPEED_MAX = 80; // px/sec
const SPRITE_COUNT = 6;
const REAPPEAR_DELAY_MIN = 300; // ms
const REAPPEAR_DELAY_MAX = 1200; // ms
const SCROLL_STOP_DELAY = 200; // ms
const VERTICAL_MARGIN_PERCENT = 10; // 10% from top and bottom
const MIN_Y_DISTANCE = 80; // Minimum distance from previous Y when reappearing

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
    x: -200, // Start off-screen
    y: 0,
    direction: 'right',
    speed: 0,
    visible: false,
    frameIndex: 0,
  });

  const requestRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef<boolean>(false);
  const lastYRef = useRef<number>(0);

  // Initialize mascot at a random edge
  const spawnMascot = useCallback((forceDifferentY = false) => {
    const direction = Math.random() > 0.5 ? 'right' : 'left';
    const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);

    // Calculate vertical range
    const margin = window.innerHeight * (VERTICAL_MARGIN_PERCENT / 100);
    const minY = margin;
    const maxY = window.innerHeight - margin;

    let y = minY + Math.random() * (maxY - minY);

    // Ensure it's different enough from the last position if needed
    if (forceDifferentY && Math.abs(y - lastYRef.current) < MIN_Y_DISTANCE) {
      if (y > (minY + maxY) / 2) {
        y -= MIN_Y_DISTANCE;
      } else {
        y += MIN_Y_DISTANCE;
      }
    }

    lastYRef.current = y;

    // Start off-screen
    const startX = direction === 'right' ? -150 : window.innerWidth + 50;

    setState({
      x: startX,
      y,
      direction,
      speed,
      visible: true,
      frameIndex: 0,
    });
  }, []);

  // Handle Animation Loop
  const animate = useCallback((time: number) => {
    if (lastUpdateRef.current !== undefined) {
      const deltaTime = (time - lastUpdateRef.current) / 1000;

      // Update frame roughly every 100ms (10fps)
      const frameDelta = Math.floor(time / (1000 / FPS));

      setState((prev) => {
        if (!prev.visible || isScrollingRef.current) return prev;

        const moveAmount = prev.speed * deltaTime;
        const newX = prev.direction === 'right' ? prev.x + moveAmount : prev.x - moveAmount;

        // Check if character is completely off-screen
        const isOffScreen =
          (prev.direction === 'right' && newX > window.innerWidth + 150) ||
          (prev.direction === 'left' && newX < -150);

        if (isOffScreen) {
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

  // Spawn logic when visibility changes to false
  useEffect(() => {
    if (!state.visible && !isScrollingRef.current) {
      const delay = REAPPEAR_DELAY_MIN + Math.random() * (REAPPEAR_DELAY_MAX - REAPPEAR_DELAY_MIN);
      const timer = setTimeout(() => {
        spawnMascot(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [state.visible, spawnMascot]);

  // Handle Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      // Immediate hide
      isScrollingRef.current = true;
      setState((s) => ({ ...s, visible: false }));

      // Clear previous timeout
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      // Set timeout to detect stop
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        spawnMascot(false);
      }, SCROLL_STOP_DELAY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial spawn
    spawnMascot();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
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
          // Basic fallback for development if images are missing
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120?text=Sprite';
          }}
        />
      </div>
    </div>
  );
};

export default MascotWalker;
