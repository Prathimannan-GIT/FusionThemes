import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Star, Bookmark, ExternalLink, Code, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTemplates } from '../context/TemplateContext';
import { resolveDeveloperForTemplate } from '../data/developers';

const TemplateCard = ({ template }) => {
  const { addToCart, bookmarks, toggleBookmark, setLivePreviewTemplate, currentUser, openAuth, showNotification } = useCart();
  const { formatPrice } = useCurrency();
  const { toggleLikeTemplate } = useTemplates();

  const isBookmarked = bookmarks.includes(template.id);
  const isLiveUrl = template.demoUrl && !template.demoUrl.includes('example.com');
  const developer = template.developerName ? { name: template.developerName, loginId: template.developerId } : resolveDeveloperForTemplate(template);

  const userKey = currentUser?.id || currentUser?.email || currentUser?.loginId || null;
  const isLiked = userKey && Array.isArray(template.likedBy) ? template.likedBy.includes(userKey) : false;

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      showNotification('Please sign in as a Client to like templates', 'info');
      openAuth('client');
      return;
    }
    const res = toggleLikeTemplate(template.id, userKey);
    if (res.isLiked) {
      showNotification(`Liked "${template.title}"!`, 'success');
    } else {
      showNotification(`Removed like from "${template.title}".`, 'info');
    }
  };

  return (
    <div className="group bg-white border-2 border-purple-100/80 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/15 hover:-translate-y-1.5 hover:border-purple-300 flex flex-col justify-between">
      
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={template.image}
          alt={template.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-purple-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 p-3 backdrop-blur-xs">
          {isLiveUrl ? (
            <button
              onClick={() => setLivePreviewTemplate(template)}
              className="px-4 py-2.5 bg-white text-gray-950 font-bold text-xs rounded-xl shadow-lg hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5 transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Open Responsive Preview (368px, 768px, 1024px, 1440px)"
            >
              <Eye className="w-3.5 h-3.5" />
              Demo
            </button>
          ) : (
            <span className="px-4 py-2.5 bg-white/40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-not-allowed select-none">
              <Eye className="w-3.5 h-3.5" />
              Coming Soon
            </span>
          )}

          <Link
            to={`/template/${template.id}`}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-1.5 transform hover:scale-105 active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Details
          </Link>
        </div>

        {/* Top Floating Buttons: Bookmark + Likes */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleLikeClick}
            className={`p-2 rounded-xl backdrop-blur-md transition-all flex items-center gap-1 text-[11px] font-bold cursor-pointer ${
              isLiked 
                ? 'bg-rose-500 text-white shadow-md' 
                : 'bg-white/85 text-gray-700 hover:bg-white hover:text-rose-500 shadow-xs'
            }`}
            title="Like template"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{template.likes || 0}</span>
          </button>

          <button
            onClick={() => toggleBookmark(template.id)}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
              isBookmarked 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white/85 text-gray-700 hover:bg-white shadow-xs'
            }`}
            title="Save template"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category Pill */}
        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-purple-800 text-[11px] font-extrabold tracking-wide shadow-md border border-purple-200/80">
          {template.categoryName}
        </span>
      </div>

      {/* Card Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Developer Attribution Header */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-purple-600 mb-1.5">
            <div className="flex items-center gap-1.5 truncate">
              <Code className="w-3 h-3 shrink-0" />
              <span className="truncate">by {developer?.name || 'Verified Author'}</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400">
              {template.sales || 0} sales
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mb-1.5">
            <Link
              to={`/template/${template.id}`}
              className="text-base font-bold text-gray-900 hover:text-purple-600 transition-colors line-clamp-1"
            >
              {template.title}
            </Link>
            <span className="text-base font-black text-purple-700 shrink-0">
              {formatPrice(template.price)}
            </span>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 mb-3 font-medium">
            {template.subtitle}
          </p>
        </div>

        {/* Card Footer: Dynamic Rating & Cart Action */}
        <div className="pt-3 border-t border-purple-100 flex items-center justify-between">
          {template.rating && template.reviewsCount > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-gray-900">
                {typeof template.rating === 'number' ? template.rating.toFixed(1) : template.rating}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                ({template.reviewsCount})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
              <Star className="w-3.5 h-3.5 text-gray-300" />
              <span>No ratings yet</span>
            </div>
          )}

          <button
            onClick={() => addToCart(template)}
            className="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white transition-all shadow-xs cursor-pointer"
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
