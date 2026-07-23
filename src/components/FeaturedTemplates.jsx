import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TemplateCard from './TemplateCard';
import { templates } from '../data/templates';

const FeaturedTemplates = () => {
  const featured = templates.filter(t => t.isFeatured);

  return (
    <section className="py-16 bg-gray-50/60 dark:bg-navy-900/40 border-t border-b border-gray-100 dark:border-gray-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-gray-200/60 dark:border-gray-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Featured Templates
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
              Check out our handpicked premium templates.
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

        {/* Featured Templates Grid matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((item) => (
            <TemplateCard key={item.id} template={item} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedTemplates;
