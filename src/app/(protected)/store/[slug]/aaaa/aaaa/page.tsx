import React from 'react';
import { BannerSlideSection } from '@/components/sections/BannerSlideSection';
import { TestimonialSection } from '@/components/sections/TestimonialSection';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto space-y-12 px-4 py-8">
        <div className="space-y-4 text-center"></div>

        <TestimonialSection />
        <BannerSlideSection />
      </div>
    </div>
  );
}

export default App;
