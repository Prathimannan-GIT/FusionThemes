import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { categories } from '../data/categories';
import { templates } from '../data/templates';
import TemplateCard from '../components/TemplateCard';

const CategoryPage = () => {
  const { slug } = useParams();
  const category = categories.find(c => c.slug === slug) || categories[0];
  
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price-low', 'price-high', 'rating'

  // Filter templates by category
  let categoryTemplates = templates.filter(t => t.category === category.slug || t.category === category.id);
  
  // If specific category has fewer templates in mock set, generate populated list using dataset
  if (categoryTemplates.length < 4) {
    categoryTemplates = [
      ...categoryTemplates,
      ...templates.map((t, idx) => ({
        ...t,
        id: `${t.id}-${category.slug}-${idx}`,
        category: category.slug,
        categoryName: category.name,
        title: `${category.name} Theme ${idx + 1} - ${t.title.split('-')[0]}`
      }))
    ].slice(0, 12);
  }

  // Apply search query filter
  if (search.trim()) {
    categoryTemplates = categoryTemplates.filter(t => 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply sorting
  categoryTemplates.sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.sales - a.sales; // popular
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pb-20 transition-colors">
      
      {/* Category Hero Banner */}
      <div className="bg-[#0A0D18] text-white py-16 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-semibold text-gray-400 mb-4">
            <Link to="/" className="hover:text-purple-400">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/templates" className="hover:text-purple-400">Categories</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-purple-400">{category.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/50 text-purple-300 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{category.count}+ Templates Available</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {category.name} Templates
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-2 leading-relaxed">
                {category.description}
              </p>
            </div>

            {/* Category Quick Pills */}
            <div className="flex flex-wrap gap-2 max-w-sm">
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    cat.slug === category.slug
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : 'bg-navy-900 text-gray-300 border-gray-800 hover:border-purple-500'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-navy-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${category.name} templates...`}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <ArrowUpDown className="w-4 h-4 text-purple-600" />
              <span className="font-semibold">Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Templates Grid */}
        {categoryTemplates.length === 0 ? (
          <div className="bg-white dark:bg-navy-900 p-12 rounded-3xl text-center space-y-4 border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No templates found</h3>
            <p className="text-xs text-gray-400">Try adjusting your search criteria or explore other categories.</p>
            <button
              onClick={() => setSearch('')}
              className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-700 transition-colors"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryPage;
