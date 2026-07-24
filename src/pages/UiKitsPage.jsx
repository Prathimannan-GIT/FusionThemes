import React, { useState } from 'react';
import { uiKits } from '../data/uiKits';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { Star, ShoppingCart, Eye, Search, Layers, ShieldCheck, Sparkles, Layout } from 'lucide-react';

const UiKitsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, openLivePreview } = useCart();
  const { formatPrice } = useCurrency();

  const categories = [
    { id: 'all', name: 'All UI Kits' },
    { id: 'figma-react', name: 'Figma & React Systems' },
    { id: 'mobile', name: 'Mobile App Kits' },
    { id: 'dashboard', name: 'Dashboard & Admin Kits' },
    { id: 'web3', name: 'Web3 & Gaming UI' },
    { id: 'ux', name: 'Wireframing Kits' }
  ];

  const filteredUiKits = uiKits.filter(kit => {
    const matchesCategory = selectedCategory === 'all' || kit.category === selectedCategory;
    const matchesSearch = kit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          kit.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          kit.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Layers className="w-4 h-4 text-violet-600" /> UI Component Libraries & Design Systems
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">UI Kits & Systems</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Speed up your design and code production with pixel-perfect UI kits for Figma, React, Mobile Apps, and Dashboards.
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
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                    : 'bg-white dark:bg-navy-900 text-gray-700 dark:text-gray-300 hover:bg-violet-50 border border-gray-200 dark:border-navy-800'
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
              placeholder="Search UI Kits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
            />
          </div>
        </div>

        {/* UI Kits Grid */}
        {filteredUiKits.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-800">
            <Layout className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">No UI Kits found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try clearing your search query or selecting another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUiKits.map(kit => (
              <div
                key={kit.id}
                className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-200 dark:border-navy-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* UI Kit Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-navy-950">
                    <img
                      src={kit.image}
                      alt={kit.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-violet-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {kit.categoryName}
                    </div>
                  </div>

                  {/* UI Kit Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-extrabold text-gray-900 dark:text-white group-hover:text-violet-600 transition-colors">
                        {kit.title}
                      </h3>
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{kit.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-3">
                      {kit.subtitle}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {kit.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-1.5 mb-5 border-t border-gray-100 dark:border-navy-800 pt-4">
                      {kit.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {kit.tags.map((tag, idx) => (
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
                    <span className="text-xs text-gray-400 block">Single User License</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      {formatPrice(kit.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openLivePreview(kit)}
                      className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl transition-colors"
                      title="Live Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => addToCart(kit)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-violet-500/25 transition-all duration-200 active:scale-95"
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

export default UiKitsPage;
