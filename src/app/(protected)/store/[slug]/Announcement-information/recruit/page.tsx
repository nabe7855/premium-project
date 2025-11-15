import React from 'react';
import SideNavigation from '@/components/sections/recruit/SideNavigation';
import Hero from '@/components/sections/recruit/Hero';
import Statistics from '@/components/sections/recruit/Statistics';
import MessageSection from '@/components/sections/recruit/MessageSection';
import WhyChooseUs from '@/components/sections/recruit/WhyChooseUs';
import CareerPath from '@/components/sections/recruit/CareerPath';
import Testimonials from '@/components/sections/recruit/Testimonials';
import WorkStyleDiagnosis from '@/components/sections/recruit/WorkStyleDiagnosis';
import JobRequirements from '@/components/sections/recruit/JobRequirements';
import FAQ from '@/components/sections/recruit/FAQ';
import ApplicationForm from '@/components/sections/recruit/ApplicationForm';
import Footer from '@/components/sections/recruit/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <SideNavigation />
      <Hero />
      <Statistics />
      <MessageSection />
      <WhyChooseUs />
      <CareerPath />
      <Testimonials />
      <WorkStyleDiagnosis />
      <JobRequirements />
      <FAQ />
      <ApplicationForm />
      <Footer />
    </div>
  );
}

export default App;
