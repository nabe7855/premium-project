'use client';
import { MessageCircle, Phone } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Components
import ApplicationForm from '@/components/templates/store/fukuoka/page-templates/recruit/ApplicationForm';
import Benefits from '@/components/templates/store/fukuoka/page-templates/recruit/Benefits';
import CustomerProfiles from '@/components/templates/store/fukuoka/page-templates/recruit/CustomerProfiles';
import FAQ from '@/components/templates/store/fukuoka/page-templates/recruit/FAQ';
import Features from '@/components/templates/store/fukuoka/page-templates/recruit/Features';
import Footer from '@/components/templates/store/fukuoka/page-templates/recruit/Footer';
import Header from '@/components/templates/store/fukuoka/page-templates/recruit/Header';
import Hero from '@/components/templates/store/fukuoka/page-templates/recruit/Hero';
import JobDetails from '@/components/templates/store/fukuoka/page-templates/recruit/JobDetails';
import SalarySimulation from '@/components/templates/store/fukuoka/page-templates/recruit/SalarySimulation';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header isScrolled={isScrolled} />

      <main className="flex-grow">
        <Hero />

        <section id="features" className="bg-white py-20">
          <Features />
        </section>

        <section id="customer-profiles" className="bg-slate-100 py-20">
          <CustomerProfiles />
        </section>

        <section id="details" className="bg-white py-20">
          <JobDetails />
        </section>

        <section id="salary" className="overflow-hidden bg-slate-900 py-20 text-white">
          <SalarySimulation />
        </section>

        <section id="benefits" className="bg-white py-20">
          <Benefits />
        </section>

        <section id="faq" className="bg-slate-50 py-20">
          <FAQ />
        </section>

        <section id="apply" className="relative bg-white py-24">
          <ApplicationForm />
        </section>
      </main>

      <Footer />

      {/* Floating Action Buttons for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-white via-white/80 to-transparent p-4 md:hidden">
        <div className="flex gap-2">
          <a
            href="#apply"
            className="flex flex-1 items-center justify-center rounded-full bg-[#06C755] px-4 py-3 font-bold text-white shadow-lg transition-transform active:scale-95"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            LINEで応募
          </a>
          <a
            href="tel:000-000-0000"
            className="rounded-full bg-amber-500 p-3 text-white shadow-lg transition-transform active:scale-95"
          >
            <Phone className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
