import React, { useMemo } from "react";
import "../../app/test/test.css";

/* ✨キラキラ背景（SparkleLayer） */
const SparkleLayer = () => {
  const sparkleCount = 80;
  const sparkles = useMemo(() => {
    return Array.from({ length: sparkleCount }).map((_, i) => {
      const isPink = Math.random() > 0.4;
      const size = Math.random() * 40 + 20;
      return (
        <div
          key={i}
          className={`sparkle-heart ${
            isPink ? "sparkle-heart-pink" : "sparkle-heart-white"
          }`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${size}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1.5 + Math.random()}s`,
          }}
        >
          ♡
        </div>
      );
    });
  }, []);

  return <div className="sparkle-layer">{sparkles}</div>;
};

/* 💎 ゆっくりクルクル回転して落ちてくるカード演出 */
export default function CardFallScene() {
  const cards = [
    { id: 1, delay: 0.2, left: "40%" },
    { id: 2, delay: 0.6, left: "55%" },
    { id: 3, delay: 1.0, left: "65%" },
  ];

  return (
    <div className="cardfall-container">
      <SparkleLayer />
      <div className="cardfall-stage">
        {cards.map((card) => (
          <div
            key={card.id}
            className="cardfall-card"
            style={{
              animationDelay: `${card.delay}s`,
              left: card.left,
            }}
          >
            <div className="card-symbol">🍓</div>
          </div>
        ))}
      </div>
    </div>
  );
}
