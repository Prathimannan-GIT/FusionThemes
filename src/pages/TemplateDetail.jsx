import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Eye, 
  ShoppingCart, 
  ShieldCheck, 
  Check, 
  Download, 
  Clock, 
  RefreshCw, 
  ChevronRight,
  Share2,
  Bookmark
} from 'lucide-react';
import { templates } from '../data/templates';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import TemplateCard from '../components/TemplateCard';

const TemplateDetail = () => {
  const { id } = useParams();
  const template = templates.find(t => t.id === id) || templates[0];
  const { addToCart, setLivePreviewTemplate, bookmarks, toggleBookmark } = useCart();
  const { formatPrice } = useCurrency();
  const isBookmarked = bookmarks.includes(template.id);
  const [activeTab, setActiveTab] = useState('overview');
  // Only treat as live if demoUrl exists and isn't a placeholder
  const isLiveUrl = template.demoUrl && !template.demoUrl.includes('example.com');

  const related = templates.filter(t => t.category === template.category && t.id !== template.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pb-20 transition-colors">
      
      {/* Top Breadcrumbs & Title Banner */}
      <div className="bg-white dark:bg-navy-900 border-b border-gray-100 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center space-x-2 text-xs font-semibold text-gray-400 mb-4">
            <Link to="/" className="hover:text-purple-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/category/${template.category}`} className="hover:text-purple-600">{template.categoryName}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-white">{template.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {template.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-3xl">
                {template.subtitle}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleBookmark(template.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isBookmarked 
                    ? 'bg-purple-50 dark:bg-purple-950 border-purple-300 text-purple-600' 
                    : 'bg-white dark:bg-navy-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-purple-300'
                }`}
                title="Save template"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              {isLiveUrl ? (
                <a
                  href={template.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold text-sm rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Live Demo
                </a>
              ) : (
                <span className="px-5 py-3 bg-gray-100 dark:bg-navy-800 text-gray-400 dark:text-gray-500 font-bold text-sm rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-2 cursor-not-allowed select-none">
                  <Eye className="w-4 h-4" />
                  Demo Coming Soon
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery & Description Tabs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Showcase Image */}
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-lg">
              <img 
                src={template.bannerImage || template.image} 
                alt={template.title}
                className="w-full h-[440px] object-cover"
              />
            </div>

            {/* Content Tabs */}
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <div className="flex border-b border-gray-100 dark:border-gray-800 space-x-6 mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Overview & Features
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Reviews ({template.reviewsCount})
                </button>
              </div>

              {activeTab === 'overview' ? (
                <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>{template.description}</p>
                  
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Key Features & Highlights</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {template.features?.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-navy-950 rounded-xl border border-gray-100 dark:border-gray-800/80">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{template.rating} out of 5</span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="p-4 bg-gray-50 dark:bg-navy-950 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-gray-900 dark:text-white">Alex Rivera (Verified Buyer)</span>
                        <span className="text-[11px] text-gray-400">2 days ago</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        "Phenomenal theme code quality! Saved our team over 80 hours of development time. Very easy to customize."
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-navy-950 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-gray-900 dark:text-white">Sarah Jenkins</span>
                        <span className="text-[11px] text-gray-400">1 week ago</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        "Outstanding design aesthetics! Looks extremely modern and clean."
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Pricing Box & Specs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Purchase Card */}
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl sticky top-28 space-y-6">
              
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Regular License</span>
                <span className="text-3xl font-extrabold text-purple-600">{formatPrice(template.price)}</span>
              </div>

              <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300 border-t border-b border-gray-100 dark:border-gray-800 py-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span>Quality checked by Fusion Themes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span>Future updates included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span>6 months support from author</span>
                </div>
              </div>

              <button
                onClick={() => addToCart(template)}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart — {formatPrice(template.price)}</span>
              </button>

              {/* Specifications List */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Category</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{template.categoryName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Sales</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{template.sales}+</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Last Update</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{template.updatedAt}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Framework</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">React.js + Tailwind</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Related Templates */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">More in {template.categoryName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(item => (
                <TemplateCard key={item.id} template={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TemplateDetail;
