import React, { useState } from 'react';
import { plugins } from '../data/plugins';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { Star, ShoppingCart, Eye, Search, Filter, ShieldCheck, Zap, Sparkles, Code2 } from 'lucide-react';

const PluginsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, openLivePreview } = useCart();
  const { formatPrice } = useCurrency();

  const categories = [
    { id: 'all', name: 'All Plugins' },
    { id: 'wordpress', name: 'WordPress Plugins' },
    { id: 'react', name: 'React Hooks & Libraries' },
    { id: 'figma', name: 'Figma Plugins' },
    { id: 'shopify', name: 'Shopify Plugins' },
    { id: 'webflow', name: 'Webflow Apps' }
  ];

  const filteredPlugins = plugins.filter(plugin => {
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    const matchesSearch = plugin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          plugin.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-4 h-4 text-purple-600" /> Premium Extensions & Libraries
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Plugins & Extensions</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Supercharge your workflow with battle-tested plugins for WordPress, React, Figma, Shopify, and Webflow.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'bg-white dark:bg-navy-900 text-gray-700 dark:text-gray-300 hover:bg-purple-50 border border-gray-200 dark:border-navy-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search plugins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
          </div>
        </div>

        {/* Plugins Grid */}
        {filteredPlugins.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-800">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">No plugins found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try clearing your search query or selecting another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlugins.map(plugin => (
              <div
                key={plugin.id}
                className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Plugin Card Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-navy-950">
                    <img
                      src={plugin.image}
                      alt={plugin.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-purple-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {plugin.categoryName}
                    </div>
                  </div>

                  {/* Plugin Card Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-extrabold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                        {plugin.title}
                      </h3>
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{plugin.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-3">
                      {plugin.subtitle}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {plugin.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-1.5 mb-5 border-t border-gray-100 dark:border-navy-800 pt-4">
                      {plugin.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {plugin.tags.map((tag, idx) => (
                        <span key={idx} className="text-[11px] font-semibold px-2 py-0.5 bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="p-6 pt-0 border-t border-gray-100 dark:border-navy-800/80 mt-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-gray-400 block">Lifetime License</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      {formatPrice(plugin.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openLivePreview(plugin)}
                      className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl transition-colors"
                      title="Live Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => addToCart(plugin)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-purple-500/25 transition-all duration-200 active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PluginsPage;
