"use client";

import React, { useState, useEffect, useMemo } from "react";
import CardCarousel from "@/components/testanimations/CardCarousel";

type Scene =
  | "idle"
  | "strawberry_fill"
  | "background_fade"
  | "strawberry_fade"
  | "cards"
  | "whiteout"
  | "results";


/* Idle Scene -------------------------------------------------------- */
const IdleScene = ({ onStart }: { onStart: () => void }) => (
  <div className="w-full min-h-screen flex flex-col justify-center items-center bg-transparent p-4">
    <div className="text-center mb-10">
      <h1 className="text-3xl font-lora text-gray-700 tracking-wider">
        心とろける極上のひとときを、あなたに。
      </h1>
    </div>

    <div className="bg-white/80 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-lg border border-pink-100 max-w-4xl w-full">
      <div className="text-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 inline-flex items-center gap-2">
          <span className="text-red-500 text-2xl">❤️</span>
          相性診断でぴったりのキャストを見つけよう
        </h2>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          3つの質問に答えるだけで、あなたと相性抜群のキャストをご提案します
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 my-8">
        {/* MBTI */}
        <div className="bg-[#fff9f9]/80 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold text-gray-700 text-sm">MBTI診断</label>
            <span className="text-xl">🧠</span>
          </div>
          <div className="relative">
            <select className="w-full p-2 bg-white border border-gray-300 rounded appearance-none text-gray-500 text-sm cursor-pointer">
              <option>選択してください</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              ▼
            </div>
          </div>
        </div>

        {/* 動物占い */}
        <div className="bg-[#fff9f9]/80 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold text-gray-700 text-sm">動物占い</label>
            <span className="text-xl text-red-400">🤍</span>
          </div>
          <div className="relative">
            <select className="w-full p-2 bg-white border border-gray-300 rounded appearance-none text-gray-500 text-sm cursor-pointer">
              <option>選択してください</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              ▼
            </div>
          </div>
        </div>

        {/* 希望シチュエーション */}
        <div className="bg-[#fff9f9]/80 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold text-gray-700 text-sm">希望シチュエーション</label>
            <span className="text-xl text-red-400">✨</span>
          </div>
          <div className="relative">
            <select className="w-full p-2 bg-white border border-gray-300 rounded appearance-none text-gray-500 text-sm cursor-pointer">
              <option>選択してください</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              ▼
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onStart}
          className="bg-pink-500 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 inline-flex items-center gap-2 animate-button-pulse"
        >
          相性診断を始める →
        </button>
        <p className="text-gray-500 text-xs mt-4">
          <span>⏰ 約2分で完了</span>
          <span className="mx-2">|</span>
          <span className="font-bold text-red-500">完全無料</span>
        </p>
      </div>
    </div>
  </div>
);

/* Strawberry Overlay ------------------------------------------------ */
const StrawberryOverlay = ({ fadingOut }: { fadingOut: boolean }) => {
  const strawberryCount = 300;
  const strawberries = useMemo(() => {
    return Array.from({ length: strawberryCount }).map((_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        animationDuration: `2.5s`,
        animationDelay: `${Math.random() * 1.5}s`,
        fontSize: `${Math.random() * 120 + 30}px`,
        filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.2))",
      },
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-20 pointer-events-none">
      {strawberries.map((s) => (
        <div
          key={s.id}
          className={fadingOut ? "animate-strawberry-exit-up" : "animate-strawberry-fill"}
          style={s.style}
        >
          🍓
        </div>
      ))}
    </div>
  );
};

/* Sparkles ----------------------------------------------------------- */
const TrumpSparkleEffect = () => {
  const sparkleCount = 100;
  const sparkles = useMemo(() => {
    return Array.from({ length: sparkleCount }).map((_, i) => {
      const isPink = Math.random() > 0.4;
      return {
        id: i,
        className: `sparkle-heart ${isPink ? "sparkle-heart-pink" : "sparkle-heart-white"}`,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          fontSize: `${Math.random() * 50 + 30}px`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${1.5 + Math.random()}s`,
        },
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {sparkles.map((s) => (
        <div key={s.id} className={s.className} style={s.style}>
          ♡
        </div>
      ))}
    </div>
  );
};

/* Card Fall Scene --------------------------------------------------- */
const CardFallScene = () => {
  const cards = [
    { id: 1, delay: 0.2, animationClass: "animate-card-tumble-in-left" },
    { id: 2, delay: 0, animationClass: "animate-card-tumble-in-center" },
    { id: 3, delay: 0.2, animationClass: "animate-card-tumble-in-right" },
  ];

  return (
    <div className="absolute inset-0 bg-transparent flex justify-center items-center [perspective:1000px] overflow-hidden">
      <TrumpSparkleEffect />
      <div className="relative w-full h-full flex justify-center items-center">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`absolute w-48 h-72 rounded-xl shadow-2xl flex justify-center items-center trump-card-style ${card.animationClass}`}
            style={{ animationDelay: `${card.delay}s` }}
          >
            <div className="text-5xl animate-symbol-glow" style={{ textShadow: "0 0 10px #ff007f" }}>
              🍓
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Whiteout Scene ---------------------------------------------------- */
const WhiteoutScene = () => (
  <div className="absolute inset-0 bg-white animate-fade-in transition-opacity duration-500 z-40"></div>
);

/* Main App ---------------------------------------------------------- */
export default function App() {
  const [scene, setScene] = useState<Scene>("idle");

  const startAnimation = () => {
    setScene("strawberry_fill");
  };

  const restartAnimation = () => {
    setScene("idle");
  };

  useEffect(() => {
    let timerId: number | undefined;
    if (scene === "strawberry_fill") {
      timerId = window.setTimeout(() => {
        setScene("background_fade");
      }, 4500);
    } else if (scene === "background_fade") {
      timerId = window.setTimeout(() => setScene("strawberry_fade"), 1500);
    } else if (scene === "strawberry_fade") {
      timerId = window.setTimeout(() => setScene("cards"), 5000);
    } else if (scene === "cards") {
      timerId = window.setTimeout(() => setScene("whiteout"), 4000);
    } else if (scene === "whiteout") {
      timerId = window.setTimeout(() => setScene("results"), 600);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [scene]);

  return (
    <main className="w-full h-screen relative overflow-hidden animate-gradient-pan">
      {/* 背景フェード */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-[1500ms] ease-in-out pointer-events-none z-10 ${
          scene === "background_fade" || scene === "strawberry_fade" || scene === "cards"
            ? "opacity-100"
            : "opacity-0"
        }`}
      />

      <div className="relative w-full h-full z-0">
        {(scene === "idle" ||
          scene === "strawberry_fill" ||
          scene === "background_fade" ||
          scene === "strawberry_fade") && <IdleScene onStart={startAnimation} />}

        {scene === "whiteout" && <WhiteoutScene />}

        {scene === "results" && <CardCarousel onRestart={restartAnimation} />}
      </div>

      {scene === "cards" && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <CardFallScene />
        </div>
      )}

      {(scene === "strawberry_fill" ||
        scene === "background_fade" ||
        scene === "strawberry_fade") && (
        <StrawberryOverlay fadingOut={scene === "strawberry_fade"} />
      )}
    </main>
  );
}
