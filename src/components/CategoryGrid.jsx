import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import CategoryCard from './CategoryCard';
import { useTemplates } from '../context/TemplateContext';

const CategoryGrid = () => {
  const { categories } = useTemplates();
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-purple-50/25 to-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-purple-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100/70 border border-purple-200 text-purple-800 text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>18 Curated Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Browse by Categories
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Explore our hand-crafted, production-ready website templates tailored for your niche.
            </p>
          </div>

          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 mt-3 sm:mt-0 transition-all group shrink-0 shadow-xs"
          >
            <span>View All 18 Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 18 Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoryGrid;
