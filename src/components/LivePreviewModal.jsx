import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, ShoppingCart, ExternalLink, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const LivePreviewModal = () => {
  const { livePreviewTemplate, setLivePreviewTemplate, addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [device, setDevice] = useState('desktop');

  if (!livePreviewTemplate) return null;

  const getWidth = () => {
    switch (device) {
      case 'mobile': return 'w-[375px]';
      case 'tablet': return 'w-[768px]';
      default: return 'w-full';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-navy-950/95 backdrop-blur-md text-white animate-in fade-in duration-200">
      
      {/* Top Demo Bar */}
      <header className="h-16 px-4 sm:px-6 bg-navy-900 border-b border-gray-800 flex items-center justify-between z-10">
        
        {/* Template info */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLivePreviewTemplate(null)}
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-bold text-sm text-white line-clamp-1">{livePreviewTemplate.title}</h3>
            <span className="text-xs text-purple-400 font-medium">{formatPrice(livePreviewTemplate.price)} • {livePreviewTemplate.categoryName}</span>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="hidden sm:flex items-center bg-gray-800/80 p-1 rounded-xl border border-gray-700">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              device === 'desktop' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              device === 'tablet' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Tablet className="w-4 h-4" />
            Tablet
          </button>

          <button
            onClick={() => setDevice('mobile')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              device === 'mobile' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              addToCart(livePreviewTemplate);
              setLivePreviewTemplate(null);
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buy ({formatPrice(livePreviewTemplate.price)})</span>
          </button>
        </div>

      </header>

      {/* Frame Container */}
      <div className="flex-1 bg-gray-950 overflow-auto p-4 flex justify-center items-start">
        <div className={`h-full transition-all duration-300 ${getWidth()} bg-white rounded-xl shadow-2xl overflow-hidden relative border border-gray-800`}>
          
          {/* Simulated Webpage View */}
          <div className="w-full h-full overflow-y-auto bg-white text-gray-900">
            {/* Header Mock */}
            <div className="bg-navy-950 text-white p-6 border-b border-gray-800">
              <div className="flex justify-between items-center max-w-5xl mx-auto">
                <span className="font-bold text-xl text-purple-400">{livePreviewTemplate.title} Live Preview</span>
                <span className="text-xs bg-purple-900/60 text-purple-300 px-3 py-1 rounded-full border border-purple-700">Interactive Demo View</span>
              </div>
            </div>

            {/* Main Visual Demo */}
            <div className="p-8 max-w-5xl mx-auto space-y-8">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
                <img 
                  src={livePreviewTemplate.bannerImage || livePreviewTemplate.image} 
                  alt="Live Demo Preview" 
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                  <span className="px-3 py-1 bg-purple-600 text-xs font-bold w-max rounded-md mb-2">{livePreviewTemplate.categoryName}</span>
                  <h1 className="text-3xl font-extrabold">{livePreviewTemplate.title}</h1>
                  <p className="text-gray-300 text-sm mt-2 max-w-2xl">{livePreviewTemplate.subtitle}</p>
                </div>
              </div>

              {/* Template Specs & Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-3">Template Features</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {livePreviewTemplate.features?.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-lg text-purple-950 mb-2">Ready to launch your website?</h4>
                    <p className="text-sm text-purple-800">
                      Get instant access to full source files, documentation, and lifetime updates.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(livePreviewTemplate);
                      setLivePreviewTemplate(null);
                    }}
                    className="mt-6 w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
                  >
                    Get Template Now - {formatPrice(livePreviewTemplate.price)}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LivePreviewModal;
