import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Tv,
  Maximize2,
  ShoppingCart, 
  ExternalLink, 
  RotateCw,
  Sparkles,
  Loader2,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const VIEWPORTS = [
  {
    id: '368',
    width: '368px',
    numWidth: 368,
    label: '368px',
    device: 'Mobile',
    icon: Smartphone
  },
  {
    id: '768',
    width: '768px',
    numWidth: 768,
    label: '768px',
    device: 'Tablet',
    icon: Tablet
  },
  {
    id: '1024',
    width: '1024px',
    numWidth: 1024,
    label: '1024px',
    device: 'Laptop',
    icon: Monitor
  },
  {
    id: '1440',
    width: '1440px',
    numWidth: 1440,
    label: '1440px',
    device: 'Desktop',
    icon: Tv
  },
  {
    id: 'full',
    width: '100%',
    numWidth: null,
    label: 'Full View',
    device: 'Responsive',
    icon: Maximize2
  }
];

const LivePreviewModal = () => {
  const { livePreviewTemplate, setLivePreviewTemplate, addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [activeViewport, setActiveViewport] = useState('1440'); // default desktop or full
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [addedToCartToast, setAddedToCartToast] = useState(false);
  const iframeRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLivePreviewTemplate(null);
      }
    };
    if (livePreviewTemplate) {
      window.addEventListener('keydown', handleKeyDown);
      setIsLoading(true);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [livePreviewTemplate, setLivePreviewTemplate]);

  if (!livePreviewTemplate) return null;

  const currentVp = VIEWPORTS.find((v) => v.id === activeViewport) || VIEWPORTS[3];

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addToCart(livePreviewTemplate);
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-navy-950/98 backdrop-blur-md text-white animate-in fade-in duration-200 select-none">
      
      {/* ==================== TOP PREVIEW TOOLBAR ==================== */}
      <header className="h-16 px-3 sm:px-6 bg-navy-900 border-b border-gray-800 flex items-center justify-between z-20 shrink-0 shadow-lg">
        
        {/* Left: Close & Template Meta */}
        <div className="flex items-center space-x-3 max-w-[35%] sm:max-w-none">
          <button
            onClick={() => setLivePreviewTemplate(null)}
            className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer border border-gray-700/60"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-white truncate max-w-[180px] sm:max-w-xs md:max-w-sm">
              {livePreviewTemplate.title}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span className="text-purple-400 font-extrabold">{formatPrice(livePreviewTemplate.price)}</span>
              <span>•</span>
              <span className="truncate">{livePreviewTemplate.categoryName}</span>
            </div>
          </div>
        </div>

        {/* Center: Exact Viewport Switcher (368px, 768px, 1024px, 1440px, Full) */}
        <div className="flex items-center gap-1 bg-gray-950/90 p-1.5 rounded-2xl border border-gray-800 shadow-inner">
          {VIEWPORTS.map((vp) => {
            const IconComponent = vp.icon;
            const isSelected = activeViewport === vp.id;

            return (
              <button
                key={vp.id}
                onClick={() => setActiveViewport(vp.id)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`}
                title={`${vp.device} View (${vp.label})`}
              >
                <IconComponent className="w-3.5 h-3.5 shrink-0" />
                <span className="font-mono text-[11px]">{vp.label}</span>
                <span className="text-[10px] opacity-75 hidden md:inline font-sans">({vp.device})</span>
              </button>
            );
          })}

          {/* Reload Frame Button */}
          <button
            onClick={handleRefresh}
            className="ml-1 p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition-colors"
            title="Reload Demo Frame"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions (Direct link & Buy / Cart) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Active Width Pill Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800/60 border border-gray-700/60 text-xs font-mono text-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{currentVp.width === '100%' ? 'Responsive 100%' : currentVp.width}</span>
          </div>

          {/* Open in separate new tab */}
          {livePreviewTemplate.demoUrl && (
            <a
              href={livePreviewTemplate.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-gray-700"
              title="Open raw website in new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open Tab</span>
            </a>
          )}

          {/* Add to Cart / Buy Button */}
          <button
            onClick={handleAddToCart}
            className={`px-3.5 sm:px-4 py-2 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              addedToCartToast
                ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25'
            }`}
          >
            {addedToCartToast ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Buy ({formatPrice(livePreviewTemplate.price)})</span>
              </>
            )}
          </button>
        </div>

      </header>

      {/* ==================== INTERACTIVE VIEWPORT CANVAS ==================== */}
      <main className="flex-1 bg-[#07090F] p-2 sm:p-4 md:p-6 overflow-hidden flex flex-col items-center justify-start relative">
        
        {/* Frame Outer Wrapper with Smooth Width Animation */}
        <div 
          style={{ 
            width: currentVp.width, 
            maxWidth: '100%',
            height: '100%' 
          }}
          className="transition-all duration-300 ease-out flex flex-col bg-slate-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden relative"
        >
          {/* Simulated Browser Chrome / Device Top Bar */}
          <div className="h-9 px-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between shrink-0 select-none">
            {/* Window control dots */}
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Address bar mock */}
            <div className="flex-1 max-w-md mx-4">
              <div className="flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-lg bg-gray-950/80 border border-gray-800 text-[11px] font-mono text-gray-400 truncate">
                <span className="text-emerald-400 text-xs">🔒</span>
                <span className="truncate">{livePreviewTemplate.demoUrl || 'https://fusionthemes.com/preview'}</span>
              </div>
            </div>

            {/* Right frame badge */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/80 font-bold">
                {currentVp.label} {currentVp.numWidth ? `(${currentVp.numWidth}px)` : ''}
              </span>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div className="flex-1 relative w-full h-[calc(100%-36px)] bg-white overflow-hidden">
            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-slate-900 flex flex-col items-center justify-center space-y-3 text-center p-6">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Loading Live Interactive Demo...</p>
                  <p className="text-xs text-gray-400">Rendering {livePreviewTemplate.title} at {currentVp.label}</p>
                </div>
              </div>
            )}

            {/* Interactive Live Demo Iframe */}
            {livePreviewTemplate.demoUrl ? (
              <iframe
                key={iframeKey}
                ref={iframeRef}
                src={livePreviewTemplate.demoUrl}
                title={`${livePreviewTemplate.title} Live Preview`}
                onLoad={() => setIsLoading(false)}
                className="w-full h-full border-0 bg-white"
                allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-gray-800 bg-gray-50">
                <Sparkles className="w-12 h-12 text-purple-600 mb-3" />
                <h4 className="text-lg font-bold">Demo Preview Unavailable</h4>
                <p className="text-xs text-gray-500 mt-1">A live preview link is being prepared for this item.</p>
              </div>
            )}
          </div>

        </div>

      </main>

    </div>
  );
};

export default LivePreviewModal;
