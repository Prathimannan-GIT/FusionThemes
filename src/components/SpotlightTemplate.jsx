import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  ShoppingCart, 
  Star, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ArrowRight,
  Flame,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTemplates } from '../context/TemplateContext';

const SpotlightTemplate = () => {
  const [deviceMode, setDeviceMode] = useState('desktop');
  const { addToCart, setLivePreviewTemplate } = useCart();
  const { formatPrice } = useCurrency();
  const { templates } = useTemplates();

  const dynamicTemplate = templates.find(t => t.id === 'neuromatrix-ai-intelligence');

  const spotlightItem = dynamicTemplate || {
    id: 'neuromatrix-ai-intelligence',
    title: 'NeuroMatrix - Enterprise Machine Learning',
    subtitle: 'Sovereign AI Infrastructure, Custom LLM Fine-Tuning & Vector Intelligence',
    category: 'ai-tools',
    categoryName: 'AI & Machine Learning',
    price: 32,
    rating: 4.99,
    reviewsCount: 220,
    sales: 1850,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://empsf168it-tech.github.io/Ai-Ml_Website-/',
    features: [
      'Built with React 18, Vite & Tailwind CSS',
      'Live Model Inference Latency & Benchmark Charts',
      'Interactive AI Prompt Playgrounds & Chat Canvas',
      'GPU Cluster Allocation & Compute Pricing Calculator',
      '100% Responsive & WCAG 2.1 AA Accessible',
      'Free Lifetime Updates & 24/7 Author Support'
    ]
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50/80 via-purple-50/90 to-pink-50/80 text-slate-900 relative overflow-hidden border-t border-b border-purple-100">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-pink-400/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-purple-200 text-purple-800 text-xs font-bold shadow-md shadow-purple-500/10">
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Theme of the Week · Editor's Spotlight</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950">
            Experience Future-Ready Design
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Every week our design team highlights a flagship template that sets new standards in code quality, micro-interactions, and visual elegance.
          </p>
        </div>

        {/* Showcase Light Glass Card */}
        <div className="bg-white border-2 border-purple-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-purple-500/15">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column: Interactive Screen Preview Frame */}
            <div className="lg:col-span-7 flex flex-col items-center">
              
              {/* Device Mode Switcher */}
              <div className="flex items-center gap-2 bg-purple-50/80 border border-purple-200 p-1.5 rounded-2xl mb-4 shadow-xs">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    deviceMode === 'desktop'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-purple-900 hover:bg-white/80'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setDeviceMode('tablet')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    deviceMode === 'tablet'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-purple-900 hover:bg-white/80'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>Tablet</span>
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    deviceMode === 'mobile'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-purple-900 hover:bg-white/80'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>

              {/* Dynamic Frame Container based on device mode */}
              <div 
                className={`relative transition-all duration-500 rounded-2xl overflow-hidden border-2 border-purple-200 shadow-xl group ${
                  deviceMode === 'desktop'
                    ? 'w-full aspect-[16/10]'
                    : deviceMode === 'tablet'
                    ? 'w-[80%] aspect-[4/3]'
                    : 'w-[280px] sm:w-[320px] aspect-[9/16]'
                }`}
              >
                {/* Browser top chrome bar */}
                <div className="bg-purple-50/90 px-4 py-2 flex items-center justify-between border-b border-purple-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="px-3 py-0.5 rounded-full bg-white border border-purple-200 text-[10px] text-purple-700 font-mono truncate max-w-[200px] shadow-xs">
                    https://synapse-ai.fusionthemes.com
                  </div>
                  <span className="text-[10px] text-purple-600 font-bold">LIVE PREVIEW</span>
                </div>

                <div className="relative w-full h-[calc(100%-32px)] overflow-hidden bg-slate-100">
                  <img
                    src={spotlightItem.image}
                    alt={spotlightItem.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                    <div className="flex items-center justify-between w-full">
                      <span className="px-3 py-1 rounded-xl bg-purple-600 text-xs font-bold text-white shadow-lg">
                        AI Studio Mode
                      </span>
                      <span className="text-xs text-white font-medium bg-black/60 px-3 py-1 rounded-xl backdrop-blur-md">
                        Interactive Demo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Template Info & Value Highlights */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-lg bg-violet-100 border border-violet-200 text-violet-800 text-xs font-extrabold shadow-xs">
                    AI & Machine Learning
                  </span>
                  {spotlightItem.rating && spotlightItem.reviewsCount > 0 ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{typeof spotlightItem.rating === 'number' ? spotlightItem.rating.toFixed(1) : spotlightItem.rating}</span>
                      <span className="text-gray-500 font-medium">({spotlightItem.reviewsCount} reviews)</span>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-gray-500">No ratings yet</span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  {spotlightItem.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                  {spotlightItem.subtitle}
                </p>
              </div>

              {/* Price & Discount Pill */}
              <div className="flex items-baseline gap-3 py-2 border-y border-purple-100">
                <span className="text-3xl font-black text-purple-700">
                  {formatPrice(spotlightItem.price)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(spotlightItem.price + 20)}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-extrabold shadow-xs">
                  Save 40% Today
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5">
                {spotlightItem.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => setLivePreviewTemplate(spotlightItem)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all duration-200 active:scale-95 cursor-pointer"
                  title="Open Responsive Preview (368px, 768px, 1024px, 1440px)"
                >
                  <Eye className="w-4 h-4" />
                  <span>Demo</span>
                </button>

                <button
                  onClick={() => addToCart(spotlightItem)}
                  className="w-full sm:w-auto flex-1 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Get Template ({formatPrice(spotlightItem.price)})</span>
                </button>

                <Link
                  to={`/template/${spotlightItem.id}`}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <span>Details</span>
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default SpotlightTemplate;
