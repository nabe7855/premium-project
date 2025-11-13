import React, { useState, useMemo } from "react";
import "../../app/test/test.css";

const castData = [
  {
    id: 1,
    name: "Hana",
    match: 95,
    image: "https://picsum.photos/seed/picsum1/400/600",
    description:
      "明るく元気なひまわりのような女の子。一緒にいると自然と笑顔になれる。",
  },
  {
    id: 2,
    name: "Yuki",
    match: 88,
    image: "https://picsum.photos/seed/picsum2/400/600",
    description: "クールでミステリウスな雰囲気。でも、心の中はとても温かい。",
  },
  {
    id: 3,
    name: "Sora",
    match: 76,
    image: "https://picsum.photos/seed/picsum3/400/600",
    description: "優しくておっとりした性格。彼女の癒やしのオーラに包まれたい。",
  },
];

/* ✨背景のふわふわ粒 */
const FloatingParticles = () => {
  const particleCount = 30;
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => {
      const size = Math.random() * 8 + 4;
      const isPink = Math.random() > 0.5;
      return {
        id: i,
        style: {
          left: `${Math.random() * 100}vw`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: isPink
            ? "rgba(255, 182, 193, 0.6)"
            : "rgba(255, 255, 255, 0.7)",
          boxShadow: `0 0 8px ${
            isPink
              ? "rgba(255, 182, 193, 0.8)"
              : "rgba(255, 255, 255, 0.9)"
          }`,
          animationDuration: `${Math.random() * 20 + 15}s`,
          animationDelay: `${Math.random() * 15}s`,
        },
      };
    });
  }, []);

  return (
    <div className="floating-container">
      {particles.map((p) => (
        <div key={p.id} className="floating-particle" style={p.style} />
      ))}
    </div>
  );
};

/* ◀ ▶ ナビゲーションアイコン */
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ff5b9e"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ff5b9e"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 5l7 7-7 7" />
  </svg>
);

interface CardCarouselProps {
  onRestart: () => void;
}

/* 💘 メイン：結果スライダー */
export default function CardCarousel({ onRestart }: CardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCard = () => setActiveIndex((prev) => (prev + 1) % castData.length);
  const prevCard = () =>
    setActiveIndex((prev) => (prev - 1 + castData.length) % castData.length);

  const getCardStyle = (index: number) => {
    const offset = index - activeIndex;
    let transform = "";
    let zIndex = castData.length - Math.abs(offset);
    let opacity = 0;

    if (offset === 0) {
      transform = "translateX(0) translateZ(0) rotateY(0deg) scale(1)";
      opacity = 1;
    } else if (offset === 1 || offset === -(castData.length - 1)) {
      transform =
        "translateX(60%) translateZ(-250px) rotateY(-55deg) scale(0.8)";
      opacity = 0.5;
    } else if (offset === -1 || offset === castData.length - 1) {
      transform =
        "translateX(-60%) translateZ(-250px) rotateY(55deg) scale(0.8)";
      opacity = 0.5;
    } else {
      transform = `translateX(${
        Math.sign(offset) * 110
      }%) translateZ(-500px) rotateY(${
        Math.sign(offset) * 70
      }deg) scale(0.7)`;
      opacity = 0;
    }

    return {
      transform,
      zIndex,
      transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
      opacity,
    };
  };

  return (
    <div className="carousel-container">
      <FloatingParticles />

      <div className="carousel-header">
        <h2 className="carousel-title">あなたにぴったりのキャストはこちら！</h2>
      </div>

      <div className="carousel-stage">
        {castData.map((cast, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={cast.id}
              className="carousel-card"
              style={getCardStyle(index)}
            >
              <div
                className={`card-inner ${isActive ? "animate-card-glow" : ""}`}
              >
                <img
                  src={cast.image}
                  alt={cast.name}
                  className="card-image"
                />
                <h3 className="card-name">{cast.name}</h3>
                <p className="card-desc">{cast.description}</p>
                <div className="card-match">
                  <p className="match-label">相性</p>
                  <p className="match-value">
                    {cast.match}
                    <span className="match-percent">%</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ナビゲーション */}
      <div className="carousel-nav">
        <button onClick={prevCard} className="nav-btn">
          <ChevronLeftIcon />
        </button>
        <button onClick={nextCard} className="nav-btn">
          <ChevronRightIcon />
        </button>
      </div>

      {/* もう一度ボタン */}
      <div className="restart-wrap">
        <button onClick={onRestart} className="restart-btn">
          もう一度相性診断をする
        </button>
      </div>
    </div>
  );
}
