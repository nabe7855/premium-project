"use client";
import { useState, useEffect, useMemo } from "react";
import "./test.css";
import CardCarousel from "../../components/matchinganimation/CardCarousel";
import SparkleBackground from "../../components/matchinganimation/SparkleBackground";
import CardFallScene from "../../components/matchinganimation/CardFallScene";

type Scene =
  | "idle"
  | "strawberry_fill"
  | "background_fade"
  | "strawberry_fade"
  | "cards"
  | "whiteout"
  | "results";

/* 🍓 IdleScene：最初の画面 */
const IdleScene = ({
  onStart,
  isActive,
}: {
  onStart: () => void;
  isActive: boolean;
}) => (
  <div
    className="idle-scene"
    style={{
      opacity: isActive ? 1 : 0,
      pointerEvents: isActive ? "auto" : "none",
      transition: "opacity 1s ease-in-out",
      zIndex: 10,
      position: "relative",
    }}
  >
    <h1 className="idle-title">心とろける極上のひとときを、あなたに。</h1>

    <div className="idle-box">
      <h2 className="idle-subtitle">
        相性診断でぴったりのキャストを見つけよう ❤️
      </h2>
      <p className="idle-desc">
        3つの質問に答えるだけで、あなたと相性抜群のキャストをご提案します
      </p>

      <button className="start-button" onClick={onStart}>
        相性診断を始める →
      </button>
      <p className="idle-footer">⏰ 約2分で完了 ｜ 完全無料</p>
    </div>
  </div>
);

/* 🍓 StrawberryOverlay：いちご演出 */
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
        position: "absolute" as const,
      },
    }));
  }, []);

  return (
    <div
      className="strawberry-container"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      {strawberries.map((s) => (
        <div
          key={s.id}
          className={
            fadingOut
              ? "animate-strawberry-exit-up"
              : "animate-strawberry-fill"
          }
          style={s.style}
        >
          🍓
        </div>
      ))}
    </div>
  );
};

/* 🌸 白転シーン */
const WhiteoutScene = () => (
  <div className="whiteout animate-fade-in" />
);

/* 🌈 メイン */
export default function StrawberryCardPage() {
  const [scene, setScene] = useState<Scene>("idle");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (scene === "strawberry_fill") {
      timer = setTimeout(() => setScene("background_fade"), 4500);
    } else if (scene === "background_fade") {
      timer = setTimeout(() => setScene("strawberry_fade"), 1500);
    } else if (scene === "strawberry_fade") {
      timer = setTimeout(() => setScene("cards"), 5000);
    } else if (scene === "cards") {
      timer = setTimeout(() => setScene("whiteout"), 4000);
    } else if (scene === "whiteout") {
      timer = setTimeout(() => setScene("results"), 800);
    }
    return () => timer && clearTimeout(timer);
  }, [scene]);

  return (
    <main className="main-container animate-gradient-pan">
      {/* 🍓 背景の黒フェード */}
      <div
        className={`background-fade ${
          scene === "background_fade" ||
          scene === "strawberry_fade" ||
          scene === "cards"
            ? "opacity-100"
            : "opacity-0"
        }`}
      />

      {/* 🍓 IdleScene（常に表示） */}
      <IdleScene
        onStart={() => setScene("strawberry_fill")}
        isActive={scene === "idle" || scene === "strawberry_fill"}
      />

      {/* 🍓 いちごアニメーション */}
      {(scene === "strawberry_fill" ||
        scene === "background_fade" ||
        scene === "strawberry_fade") && (
        <StrawberryOverlay fadingOut={scene === "strawberry_fade"} />
      )}

      {/* 🌈 トランプ演出 */}
      {scene === "cards" && (
        <>
          <SparkleBackground />
          <CardFallScene />
        </>
      )}

      {/* 🌸 白転 */}
      {scene === "whiteout" && <WhiteoutScene />}

      {/* 💖 結果画面 */}
      {scene === "results" && (
        <CardCarousel onRestart={() => setScene("idle")} />
      )}
    </main>
  );
}
