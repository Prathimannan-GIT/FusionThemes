import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Layers } from 'lucide-react';
import { useTemplates } from '../context/TemplateContext';
import { useCart } from '../context/CartContext';
import TemplateCard from '../components/TemplateCard';

const AllTemplatesPage = () => {
  const { templates, categories } = useTemplates();
  const { searchQuery, setSearchQuery } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(50);
  const [sortBy, setSortBy] = useState('popular');

  let filtered = templates.filter(t => {
    const matchesSearch = !searchQuery || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesPrice = t.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.sales - a.sales;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pb-20 transition-colors">
      
      {/* Header Banner */}
      <div className="bg-[#0A0D18] text-white py-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Explore All Website Templates</h1>
          <p className="text-gray-400 text-sm mt-2">Browse over 1,000+ handpicked React, HTML, & UI Kit website templates.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Filter */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setMaxPrice(50); }}
                  className="text-xs text-purple-600 font-semibold hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Categories</span>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex justify-between items-center transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>All Templates</span>
                    <span>({templates.length})</span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex justify-between items-center transition-colors ${
                        selectedCategory === cat.slug
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        selectedCategory === cat.slug
                          ? 'bg-purple-700/80 text-white'
                          : 'bg-gray-100 dark:bg-navy-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price Slider */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Max Price</span>
                  <span className="text-purple-600 font-bold">${maxPrice}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="50" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

            </div>
          </div>

          {/* Main Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-white dark:bg-navy-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter templates..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-400">Showing {filtered.length} results</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-bold"
                >
                  <option value="popular">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AllTemplatesPage;
