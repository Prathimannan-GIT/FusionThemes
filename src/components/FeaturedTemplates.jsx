import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import TemplateCard from './TemplateCard';
import { useTemplates } from '../context/TemplateContext';

const FeaturedTemplates = () => {
  const { templates } = useTemplates();
  const [activeFilter, setActiveFilter] = useState('All');
  const allFeatured = templates.filter(t => t.isFeatured);

  const filterTabs = [
    { label: 'All', category: 'All' },
    { label: 'AI & SaaS', category: 'ai-tools,saas' },
    { label: 'Business', category: 'business' },
    { label: 'Portfolio', category: 'portfolio' },
    { label: 'eCommerce', category: 'ecommerce' },
    { label: 'Web3 & Crypto', category: 'crypto-web3' },
  ];

  const filtered = activeFilter === 'All'
    ? allFeatured
    : allFeatured.filter(item => {
        const tab = filterTabs.find(t => t.label === activeFilter);
        if (!tab) return true;
        const cats = tab.category.split(',');
        return cats.includes(item.category);
      });

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-pink-50/20 via-purple-50/25 to-white border-t border-b border-purple-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-purple-100 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-bold mb-2 shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Trending & Handpicked</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Featured Templates
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Top rated, production-ready premium templates vetted by design experts.
            </p>
          </div>

          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 transition-all group shrink-0 shadow-xs"
          >
            <span>Browse All {templates.length}+ Templates</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.label)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                    : 'bg-white text-gray-700 border border-purple-100 hover:border-purple-300 hover:bg-purple-50/70 shadow-xs'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Featured Templates Grid (8 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <TemplateCard key={item.id} template={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
            <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No featured templates in this category yet.</p>
            <button
              onClick={() => setActiveFilter('All')}
              className="mt-3 text-xs font-bold text-purple-600 hover:underline"
            >
              Reset filter
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedTemplates;
