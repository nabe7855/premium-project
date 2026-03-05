export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="relative mb-8 flex flex-col items-center">
        {/* Loading Video */}
        <video className="h-64 w-64 object-contain shadow-2xl" autoPlay muted loop playsInline>
          <source src="/読み込み用動画.webm" type="video/webm" />
          <p>お使いのブラウザはビデオタグをサポートしていません。</p>
        </video>

        {/* Text */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="animate-pulse text-xl font-black tracking-widest text-[#FF8BA7]">
            ちょっと待ってね
          </p>
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-[#FF8BA7] to-transparent" />
        </div>
      </div>
    </div>
  );
}
