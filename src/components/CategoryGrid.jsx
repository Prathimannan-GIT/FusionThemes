import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CategoryCard from './CategoryCard';
import { categories } from '../data/categories';

const CategoryGrid = () => {
  return (
    <section className="py-16 bg-white dark:bg-navy-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Browse by Categories
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
              Explore our top quality templates across all categories.
            </p>
          </div>

          <Link
            to="/templates"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mt-3 sm:mt-0 transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 12 Category Grid matching requirement */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoryGrid;
