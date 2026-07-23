import React from 'react';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedTemplates from '../components/FeaturedTemplates';
import TrustBanner from '../components/TrustBanner';

const Home = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <CategoryGrid />
      <FeaturedTemplates />
      <TrustBanner />
    </main>
  );
};

export default Home;
