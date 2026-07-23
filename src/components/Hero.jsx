import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Layers, Award, RefreshCw, Headphones, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Hero = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { setSearchQuery } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query.trim());
      navigate('/templates');
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0A0D18] text-white py-16 lg:py-24 border-b border-gray-800/60">
      {/* Radial Background Glow FX */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Top Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Over 1,000+ Premium Web Assets Ready</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Premium Website Templates for Every Need
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl font-normal leading-relaxed">
              Discover 1000+ professionally designed website templates suitable for any business, portfolio, blog, or eCommerce store.
            </p>

            {/* Search Input Bar matching screenshot */}
            <form onSubmit={handleSearch} className="max-w-xl relative group">
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-1.5 transition-all duration-300 focus-within:ring-4 focus-within:ring-purple-500/30">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for templates..."
                  className="w-full pl-5 pr-14 py-3.5 text-gray-900 placeholder-gray-400 bg-transparent text-base font-medium focus:outline-none rounded-xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Feature Badges Row matching screenshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-800/80">
              
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 rounded-xl bg-gray-800/70 border border-gray-700/60 text-purple-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-white leading-tight">1000+</span>
                  <span className="text-xs text-gray-400 font-medium">Templates</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 rounded-xl bg-gray-800/70 border border-gray-700/60 text-purple-400">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-white leading-tight">High Quality</span>
                  <span className="text-xs text-gray-400 font-medium">Designs</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 rounded-xl bg-gray-800/70 border border-gray-700/60 text-purple-400">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-white leading-tight">Regular</span>
                  <span className="text-xs text-gray-400 font-medium">Updates</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 rounded-xl bg-gray-800/70 border border-gray-700/60 text-purple-400">
                  <Headphones className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-white leading-tight">Dedicated</span>
                  <span className="text-xs text-gray-400 font-medium">Support</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Isometric Template Showcase Cards matching screenshot */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-md lg:max-w-none perspective-1000">
              
              {/* Stacked Preview Mockups */}
              <div className="relative space-y-4">
                
                {/* Top Floating Card */}
                <div className="transform rotate-2 hover:rotate-0 transition-transform duration-500 bg-navy-900 border border-purple-500/30 rounded-2xl p-3 shadow-2xl shadow-purple-900/40 backdrop-blur-md">
                  <div className="h-44 sm:h-52 rounded-xl overflow-hidden relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                      alt="Template Preview" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-purple-600 text-[10px] font-bold uppercase text-white">Business</span>
                        <h4 className="text-sm font-bold text-white mt-1">Consultix Corporate Template</h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Offset Floating Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="transform -rotate-3 hover:rotate-0 transition-transform duration-500 bg-navy-900 border border-blue-500/30 rounded-2xl p-2.5 shadow-xl">
                    <div className="h-28 rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80" 
                        alt="Nova Portfolio"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="p-2">
                      <span className="text-[11px] font-bold text-gray-200 block truncate">Nova Portfolio</span>
                      <span className="text-[10px] text-purple-400 font-semibold">$19</span>
                    </div>
                  </div>

                  <div className="transform rotate-3 hover:rotate-0 transition-transform duration-500 bg-navy-900 border border-pink-500/30 rounded-2xl p-2.5 shadow-xl">
                    <div className="h-28 rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80" 
                        alt="Shoply Store" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <span className="text-[11px] font-bold text-gray-200 block truncate">Shoply Store</span>
                      <span className="text-[10px] text-purple-400 font-semibold">$19</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
