import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Layers, 
  Award, 
  RefreshCw, 
  Headphones, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Star, 
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
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

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    navigate('/templates');
  };

  const trendingTags = [
    { name: 'AI SaaS', bg: 'bg-violet-100 text-violet-700 hover:bg-violet-200 border-violet-200' },
    { name: 'Portfolio', bg: 'bg-sky-100 text-sky-700 hover:bg-sky-200 border-sky-200' },
    { name: 'eCommerce', bg: 'bg-pink-100 text-pink-700 hover:bg-pink-200 border-pink-200' },
    { name: 'Web3 & Crypto', bg: 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200' },
    { name: 'Agency', bg: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200' },
    { name: 'Landing Page', bg: 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200' }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-100/70 via-purple-50/60 via-sky-50/50 to-pink-100/70 text-slate-900 py-16 sm:py-20 lg:py-24 border-b border-purple-100">
      {/* Vibrant Ambient Glow Spheres */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[550px] h-[550px] bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-[110px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-sky-400/30 to-indigo-400/25 rounded-full blur-[100px] pointer-events-none animate-float-delayed" />
      <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-amber-300/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Subtle Pattern Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-7 text-left">

            {/* Top Live Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-purple-200/90 text-purple-800 text-xs font-bold shadow-lg shadow-purple-500/10 backdrop-blur-md hover:border-purple-400 transition-all">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-extrabold text-purple-900">New Release:</span>
              <span className="text-gray-700">Synapse AI & EtherVault Web3 Templates</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 ml-0.5" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.12]">
              Premium Website Templates for{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                Every Need
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-700 max-w-2xl font-medium leading-relaxed">
              Explore 1,000+ hand-crafted, production-ready website templates & UI kits. Crafted with React, Vite, and Tailwind CSS for creators, agencies, and high-growth brands.
            </p>

            {/* Search Input Bar */}
            <form onSubmit={handleSearch} className="max-w-xl relative group">
              <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-purple-500/10 p-1.5 transition-all duration-300 focus-within:ring-4 focus-within:ring-purple-400/30 border-2 border-purple-200/70 focus-within:border-purple-500">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search templates (e.g. AI SaaS, Portfolio, Dashboard)..."
                  className="w-full pl-5 pr-28 py-3.5 text-gray-900 placeholder-gray-400 bg-transparent text-sm sm:text-base font-medium focus:outline-none rounded-xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 text-xs sm:text-sm cursor-pointer shadow-md"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>

            {/* Quick Trending Searches with colorful pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="flex items-center gap-1 font-bold text-gray-700 mr-1">
                <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                Popular:
              </span>
              {trendingTags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => handleTagClick(tag.name)}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition-all duration-200 cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${tag.bg}`}
                >
                  {tag.name}
                </button>
              ))}
            </div>

            {/* Feature Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-purple-200/60">

              <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-purple-100 shadow-xs">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-extrabold text-gray-950 leading-tight">1,000+</span>
                  <span className="text-xs text-gray-600 font-medium">Templates</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-blue-100 shadow-xs">
                <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-extrabold text-gray-950 leading-tight">Ultra High</span>
                  <span className="text-xs text-gray-600 font-medium">Design Quality</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-extrabold text-gray-950 leading-tight">Free Updates</span>
                  <span className="text-xs text-gray-600 font-medium">For Lifetime</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-pink-100 shadow-xs">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
                  <Headphones className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-extrabold text-gray-950 leading-tight">24/7 Support</span>
                  <span className="text-xs text-gray-600 font-medium">From Authors</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Dynamic Animated Template Showcase Deck */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-lg lg:max-w-none">

              {/* Floating Live Activity Toast with colorful styling */}
              <div className="absolute -top-6 -left-6 z-30 bg-white/95 backdrop-blur-md border border-purple-200 rounded-2xl p-3 shadow-xl shadow-purple-500/15 hidden sm:flex items-center gap-3 animate-float">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left text-xs">
                  <p className="font-bold text-gray-900 flex items-center gap-1.5">
                    <span>Live Sale</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </p>
                  <p className="text-gray-600 text-[11px]">Synapse AI Platform purchased ($29)</p>
                </div>
              </div>

              {/* Stacked Preview Mockups with clean light cards and rich color accents */}
              <div className="relative space-y-4">

                {/* Primary Card */}
                <div className="bg-white border-2 border-purple-200/80 rounded-3xl p-3.5 shadow-2xl shadow-purple-500/15 transition-all duration-300 hover:border-purple-400 hover:shadow-purple-500/25 group">
                  <div className="h-48 sm:h-56 rounded-2xl overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
                      alt="Synapse AI Platform"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-4">
                      <div className="w-full flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-[10px] font-bold uppercase text-white shadow-sm">
                              Featured · AI SaaS
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                              <Star className="w-3 h-3 fill-amber-300" />
                              4.98
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-extrabold text-white mt-1">
                            Synapse - Generative AI Copilot
                          </h4>
                        </div>
                        <span className="text-base font-black text-white bg-purple-600 px-3 py-1 rounded-xl shadow-md">
                          $29
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Offset Floating Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-blue-200 rounded-2xl p-2.5 shadow-lg shadow-sky-500/10 transition-transform duration-300 hover:-translate-y-1 group">
                    <div className="h-28 rounded-xl overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80"
                        alt="EtherVault Web3"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-blue-600 text-[9px] font-bold text-white uppercase">
                        Web3
                      </span>
                    </div>
                    <div className="p-2 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-gray-900 block truncate">EtherVault DeFi</span>
                        <span className="text-[10px] text-gray-500">Crypto UI</span>
                      </div>
                      <span className="text-[11px] text-blue-600 font-extrabold">$26</span>
                    </div>
                  </div>

                  <div className="bg-white border border-pink-200 rounded-2xl p-2.5 shadow-lg shadow-pink-500/10 transition-transform duration-300 hover:-translate-y-1 group">
                    <div className="h-28 rounded-xl overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80"
                        alt="Nova Portfolio"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-pink-600 text-[9px] font-bold text-white uppercase">
                        Portfolio
                      </span>
                    </div>
                    <div className="p-2 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-gray-900 block truncate">Nova 3D</span>
                        <span className="text-[10px] text-gray-500">Minimalist</span>
                      </div>
                      <span className="text-[11px] text-pink-600 font-extrabold">$19</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating Bottom Performance Pill */}
              <div className="absolute -bottom-5 -right-4 z-30 bg-white/95 backdrop-blur-md border border-emerald-200 rounded-2xl px-4 py-2.5 shadow-xl shadow-emerald-500/10 hidden sm:flex items-center gap-2.5 animate-float-delayed">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left text-xs">
                  <p className="font-extrabold text-gray-900">99/100 Lighthouse</p>
                  <p className="text-[10px] text-gray-600">Clean & Validated Code</p>
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
