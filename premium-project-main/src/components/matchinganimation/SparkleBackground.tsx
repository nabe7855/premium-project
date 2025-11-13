import React, { useMemo } from "react";

/* 💖 背景で常にふわっと動く光の粒 */
export default function SparkleBackground() {
  const sparkleCount = 40;
  const sparkles = useMemo(() => {
    return Array.from({ length: sparkleCount }).map((_, i) => {
      const isPink = Math.random() > 0.5;
      const size = Math.random() * 8 + 4;
      return {
        id: i,
        style: {
          left: `${Math.random() * 100}vw`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: isPink
            ? "rgba(255, 182, 193, 0.5)"
            : "rgba(255, 255, 255, 0.6)",
          boxShadow: `0 0 6px ${
            isPink
              ? "rgba(255, 182, 193, 0.8)"
              : "rgba(255, 255, 255, 0.9)"
          }`,
          animationDuration: `${Math.random() * 18 + 10}s`,
          animationDelay: `${Math.random() * 12}s`,
        },
      };
    });
  }, []);

  return (
    <div className="sparkle-background">
      {sparkles.map((s) => (
        <div key={s.id} className="sparkle-particle" style={s.style} />
      ))}
    </div>
  );
}
