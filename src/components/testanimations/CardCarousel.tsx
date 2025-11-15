"use client"

import React from "react";
import { useState, useMemo, } from "react";



const castData = [
  { id: 1, name: 'Hana', match: 95, image: 'https://picsum.photos/seed/picsum1/400/600', description: '明るく元気なひまわりのような女の子。一緒にいると自然と笑顔になれる。' },
  { id: 2, name: 'Yuki', match: 88, image: 'https://picsum.photos/seed/picsum2/400/600', description: 'クールでミステリウスな雰囲気。でも、心の中はとても温かい。' },
  { id: 3, name: 'Sora', match: 76, image: 'https://picsum.photos/seed/picsum3/400/600', description: '優しくておっとりした性格。彼女の癒やしのオーラに包まれたい。' },
];

const FloatingParticles = () => {
    const particleCount = 30;
    const particles = useMemo(() => {
        return Array.from({ length: particleCount }).map((_, i) => {
            const size = Math.random() * 8 + 4; // 4px to 12px
            const isPink = Math.random() > 0.5;
            return {
                id: i,
                style: {
                    left: `${Math.random() * 100}vw`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: isPink ? 'rgba(255, 182, 193, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                    boxShadow: `0 0 8px ${isPink ? 'rgba(255, 182, 193, 0.8)' : 'rgba(255, 255, 255, 0.9)'}`,
                    animationDuration: `${Math.random() * 20 + 15}s`, // 15s to 35s
                    animationDelay: `${Math.random() * 15}s`,
                },
            };
        });
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
            {particles.map(p => (
                <div key={p.id} className="floating-particle" style={p.style} />
            ))}
        </div>
    );
};


const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

interface CardCarouselProps {
    onRestart: () => void;
}

export default function CardCarousel({ onRestart }: CardCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextCard = () => {
        setActiveIndex((prev) => (prev + 1) % castData.length);
    };

    const prevCard = () => {
        setActiveIndex((prev) => (prev - 1 + castData.length) % castData.length);
    };

    const getCardStyle = (index: number) => {
        const offset = index - activeIndex;
        let transform = '';
        let zIndex = castData.length - Math.abs(offset);
        let opacity = 0;

        if (offset === 0) {
            transform = 'translateX(0) translateZ(0) rotateY(0deg) scale(1)';
            opacity = 1;
        } else if (offset === 1 || offset === - (castData.length - 1)) {
            transform = 'translateX(60%) translateZ(-250px) rotateY(-55deg) scale(0.8)';
            opacity = 0.5;
        } else if (offset === -1 || offset === castData.length - 1) {
            transform = 'translateX(-60%) translateZ(-250px) rotateY(55deg) scale(0.8)';
            opacity = 0.5;
        } else {
           transform = `translateX(${Math.sign(offset) * 110}%) translateZ(-500px) rotateY(${Math.sign(offset) * 70}deg) scale(0.7)`;
           opacity = 0;
        }
        
        return {
            transform,
            zIndex,
            transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
            opacity,
        };
    };

    return (
        <div className="w-full h-screen bg-transparent flex flex-col justify-center items-center p-4 overflow-hidden">
            <FloatingParticles />
            <div className="text-center mb-2 relative z-10">
                <h2 className="text-2xl md:text-3xl font-lora text-gray-800" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    あなたにぴったりのキャストはこちら！
                </h2>
            </div>
            <div className="relative w-full max-w-4xl h-[65vh] md:h-[70vh] flex items-center justify-center [perspective:1200px]">
                {castData.map((cast, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <div
                            key={cast.id}
                            className="absolute w-64 md:w-80 [transform-style:preserve-3d]"
                            style={getCardStyle(index)}
                        >
                            <div className={`relative w-full h-full bg-white rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 transform-gpu border-4 border-white ${isActive ? 'animate-card-glow' : 'shadow-xl'}`}>
                                <img src={cast.image} alt={cast.name} className="w-full h-48 md:h-64 object-cover rounded-xl mb-4"/>
                                <h3 className="text-2xl font-bold text-gray-800">{cast.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{cast.description}</p>
                                <div className="mt-auto w-full">
                                    <p className="text-lg text-rose-500 font-semibold">相性</p>
                                    <p className="text-6xl font-bold text-red-500">{cast.match}<span className="text-3xl">%</span></p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="relative z-50 flex space-x-12 mt-4">
                <button onClick={prevCard} className="bg-white text-pink-500 p-3 rounded-full shadow-lg hover:bg-pink-100 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <ChevronLeftIcon />
                </button>
                <button onClick={nextCard} className="bg-white text-pink-500 p-3 rounded-full shadow-lg hover:bg-pink-100 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <ChevronRightIcon />
                </button>
            </div>
            <div className="relative z-50 mt-8">
                 <button
                    onClick={onRestart}
                    className="bg-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 transform animate-button-pulse focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                    もう一度相性診断をする
                </button>
            </div>
        </div>
    );
}