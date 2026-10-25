import React from 'react';
import Hero from '../components/Hero';
import TechMarquee from '../components/TechMarquee';
import CategoryGrid from '../components/CategoryGrid';
import SpotlightTemplate from '../components/SpotlightTemplate';
import FeaturedTemplates from '../components/FeaturedTemplates';
import TestimonialsSection from '../components/TestimonialsSection';
import TrustBanner from '../components/TrustBanner';
import CtaBanner from '../components/CtaBanner';

const Home = () => {
  return (
    <main className="min-h-screen bg-white transition-colors duration-200">
      <Hero />
      <TechMarquee />
      <CategoryGrid />
      <SpotlightTemplate />
      <FeaturedTemplates />
      <TestimonialsSection />
      <TrustBanner />
      <CtaBanner />
    </main>
  );
};

export default Home;
