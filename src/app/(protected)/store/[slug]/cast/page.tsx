'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/sections/cast/Hero';
import CastList from '@/components/sections/cast/CastList';

const HomePage: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Hero />
      <CastList />
    </motion.div>
  );
};

export default HomePage;
