import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Star, Bookmark, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const TemplateCard = ({ template }) => {
  const { addToCart, bookmarks, toggleBookmark } = useCart();
  const { formatPrice } = useCurrency();
  const isBookmarked = bookmarks.includes(template.id);
  // Only treat as a live URL if it exists and is NOT a placeholder
  const isLiveUrl = template.demoUrl && !template.demoUrl.includes('example.com');

  return (
    <div className="group bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 hover:border-purple-200 dark:hover:border-purple-800/60 flex flex-col justify-between">
      
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={template.image}
          alt={template.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4 backdrop-blur-xs">
          
          {isLiveUrl ? (
            <a
              href={template.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white text-navy-900 font-bold text-xs rounded-xl shadow-lg hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5 transform hover:scale-105 active:scale-95"
            >
              <Eye className="w-4 h-4" />
              Live Demo
            </a>
          ) : (
            <span className="px-4 py-2.5 bg-white/30 text-white/60 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-not-allowed select-none">
              <Eye className="w-4 h-4" />
              Coming Soon
            </span>
          )}

          <Link
            to={`/template/${template.id}`}
            className="px-4 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-purple-700 transition-all flex items-center gap-1.5 transform hover:scale-105 active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            Details
          </Link>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => toggleBookmark(template.id)}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors ${
            isBookmarked 
              ? 'bg-purple-600 text-white' 
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
          title="Save template"
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Category Pill */}
        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide">
          {template.categoryName}
        </span>
      </div>

      {/* Card Info Content matching screenshot */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <Link
              to={`/template/${template.id}`}
              className="text-base font-bold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-1"
            >
              {template.title}
            </Link>
            <span className="text-base font-extrabold text-purple-600 dark:text-purple-400 shrink-0">
              {formatPrice(template.price)}
            </span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {template.subtitle}
          </p>
        </div>

        {/* Card Footer: Rating & Cart Action */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {template.rating}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              ({template.reviewsCount})
            </span>
          </div>

          <button
            onClick={() => addToCart(template)}
            className="p-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors"
            title="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default TemplateCard;
