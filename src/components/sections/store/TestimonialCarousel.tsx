'use client';
import React, { useState, useEffect } from 'react';
import { Star, Quote, Heart } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  displayDuration?: number;
  fadeTransition?: number;
  className?: string;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  displayDuration = 5000,
  fadeTransition = 800,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsVisible(true);
        setTimeout(() => setIsTransitioning(false), fadeTransition / 2);
      }, fadeTransition / 2);
    }, displayDuration);

    return () => clearInterval(interval);
  }, [testimonials.length, displayDuration, fadeTransition]);

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  const renderStars = (rating: number) => {
    return (
      <div className="flex justify-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 transition-all duration-300 ${
              i < rating ? 'fill-current text-rose-400 drop-shadow-sm' : 'text-rose-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`relative flex min-h-[280px] items-center justify-center ${className}`}>
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-10 h-20 w-20 animate-pulse rounded-full bg-gradient-to-br from-pink-200 to-rose-300 opacity-20"></div>
        <div className="absolute bottom-16 right-12 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-purple-200 to-pink-300 opacity-20 delay-1000"></div>
        <div className="absolute right-20 top-1/2 h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-blue-200 to-purple-300 opacity-20 delay-500"></div>
      </div>

      <div
        className={`transition-all duration-${fadeTransition} transform ease-in-out ${
          isVisible && !isTransitioning
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-6 scale-95 opacity-0'
        }`}
      >
        <div className="relative mx-auto max-w-2xl">
          {/* Main testimonial card */}
          <div className="relative mx-4 rounded-3xl border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-pink-50 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
            {/* Decorative corner elements */}
            <div className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 opacity-60"></div>
            <div className="absolute -right-3 -top-1 h-4 w-4 rounded-full bg-gradient-to-br from-purple-300 to-rose-400 opacity-60"></div>

            {/* Quote icon with elegant styling */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform rounded-full bg-gradient-to-br from-rose-400 via-pink-400 to-purple-500 p-3 shadow-lg">
              <Quote className="h-5 w-5 text-white" />
            </div>

            {/* Testimonial content */}
            <div className="space-y-6 pt-4">
              {/* Rating with elegant styling */}
              <div className="flex justify-center">{renderStars(currentTestimonial.rating)}</div>

              {/* Content with beautiful typography */}
              <blockquote className="relative text-center text-lg font-light italic leading-relaxed text-gray-700 sm:text-xl">
                <span className="absolute -left-2 -top-2 font-serif text-4xl text-rose-300">"</span>
                <span className="relative z-10">{currentTestimonial.content}</span>
                <span className="absolute -bottom-4 -right-2 font-serif text-4xl text-rose-300">
                  "
                </span>
              </blockquote>

              {/* Author section with elegant design */}
              <div className="flex items-center justify-center space-x-4 pt-6">
                <div className="relative">
                  {currentTestimonial.avatar && (
                    <>
                      <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 opacity-30 blur-sm"></div>
                      <img
                        src={currentTestimonial.avatar}
                        alt={currentTestimonial.name}
                        className="border-3 relative h-16 w-16 rounded-full border-white object-cover shadow-lg"
                      />
                    </>
                  )}
                  {!currentTestimonial.avatar && (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-300 to-pink-400 shadow-lg">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h4 className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-lg font-semibold text-gray-800 text-transparent sm:text-xl">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-sm font-light text-gray-500 sm:text-base">
                    {currentTestimonial.role}
                    {currentTestimonial.company && (
                      <span className="text-gray-400"> • {currentTestimonial.company}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Elegant speech bubble tail - moved to right side */}
            <div className="absolute -bottom-3 right-8">
              <div className="h-6 w-6 rotate-45 transform border-b border-r border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50 shadow-sm"></div>
            </div>
          </div>

          {/* Floating hearts decoration */}
          <div className="absolute -right-4 -top-6 animate-bounce text-rose-300 opacity-60">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <div className="absolute -bottom-4 -left-6 animate-bounce text-pink-300 opacity-60 delay-300">
            <Heart className="h-4 w-4 fill-current" />
          </div>
        </div>

        {/* Elegant progress dots */}
        {testimonials.length > 1 && (
          <div className="mt-10 flex justify-center space-x-3">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-500 ease-in-out ${
                  index === currentIndex
                    ? 'h-3 w-8 bg-gradient-to-r from-rose-400 to-pink-500 shadow-lg'
                    : 'h-3 w-3 bg-rose-200 hover:bg-rose-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Subtle animated background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-rose-100 via-transparent to-pink-100"></div>
      </div>
    </div>
  );
};
