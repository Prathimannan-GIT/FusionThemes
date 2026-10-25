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
  Bookmark,
  Code,
  Layers,
  Sparkles,
  MessageSquare,
  Send,
  Heart,
  UserCheck,
  CheckCircle2,
  FileCode2,
  Cpu,
  Mail
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTemplates } from '../context/TemplateContext';
import { resolveDeveloperForTemplate } from '../data/developers';
import TemplateCard from '../components/TemplateCard';
import ContactDeveloperModal from '../components/ContactDeveloperModal';

const TemplateDetail = () => {
  const { id } = useParams();
  const { templates, addReview, purchasedTemplates, downloadSourceCode, toggleLikeTemplate } = useTemplates();
  const { addToCart, setLivePreviewTemplate, bookmarks, toggleBookmark, currentUser, openAuth, showNotification } = useCart();
  const { formatPrice } = useCurrency();

  // Find template dynamically from central context
  const template = templates.find((t) => t.id === id) || templates[0];
  const developer = template ? resolveDeveloperForTemplate(template) : null;
  const isPurchased = template ? purchasedTemplates.includes(template.id) : false;
  const isBookmarked = template ? bookmarks.includes(template.id) : false;
  const isLiveUrl = template?.demoUrl && !template.demoUrl.includes('example.com');

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews' | 'developer'
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState(currentUser?.name || '');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const userKey = currentUser?.id || currentUser?.email || currentUser?.loginId || null;
  const isLiked = userKey && Array.isArray(template?.likedBy) ? template.likedBy.includes(userKey) : false;

  const related = templates
    .filter((t) => t.category === template?.category && t.id !== template?.id)
    .slice(0, 4);

  const handleLikeClick = () => {
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

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview(template.id, {
      rating: reviewRating,
      userName: reviewName.trim() || currentUser?.name || 'Verified Client',
      userRole: currentUser?.company ? `${currentUser.company} Client` : 'Verified Client',
      userEmail: currentUser?.email || '',
      title: reviewTitle.trim() || 'Website Feedback',
      comment: reviewComment.trim()
    });

    setReviewSubmitted(true);
    setReviewTitle('');
    setReviewComment('');
    showNotification('Thank you! Your rating and review have been published to the database.', 'success');
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-gray-500">Loading template details...</p>
      </div>
    );
  }

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
            <span className="text-gray-900 dark:text-white truncate max-w-xs">{template.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-xs border border-purple-200 dark:border-purple-800">
                  {template.categoryName}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-medium">
                  Developed by <strong className="text-purple-600 dark:text-purple-400">{developer?.name || template.developerName}</strong> ({developer?.loginId || template.developerId})
                </span>
                <span className="text-xs text-gray-400">•</span>
                {template.rating && template.reviewsCount > 0 ? (
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{typeof template.rating === 'number' ? template.rating.toFixed(1) : template.rating}</span>
                    <span className="text-gray-400 font-normal">({template.reviewsCount} reviews)</span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-gray-400">No ratings yet</span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {template.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-3xl">
                {template.subtitle}
              </p>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Like Button */}
              <button
                onClick={handleLikeClick}
                className={`p-3 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLiked 
                    ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 text-rose-600 shadow-sm' 
                    : 'bg-white dark:bg-navy-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-rose-300 hover:text-rose-600'
                }`}
                title="Like template"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs font-bold">{template.likes || 0}</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={() => toggleBookmark(template.id)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isBookmarked 
                    ? 'bg-purple-50 dark:bg-purple-950 border-purple-300 text-purple-600' 
                    : 'bg-white dark:bg-navy-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-purple-300'
                }`}
                title="Save template"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              {/* Contact Developer Button */}
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-4 py-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title={`Chat with ${developer?.name || 'Developer'}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Developer</span>
              </button>

              {/* Responsive Live Demo */}
              {isLiveUrl ? (
                <button
                  onClick={() => setLivePreviewTemplate(template)}
                  className="px-4 py-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold text-xs rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Open Responsive Preview (368px, 768px, 1024px, 1440px)"
                >
                  <Eye className="w-4 h-4" />
                  <span>Live Demo</span>
                </button>
              ) : (
                <span className="px-4 py-3 bg-gray-100 dark:bg-navy-800 text-gray-400 dark:text-gray-500 font-bold text-xs rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 cursor-not-allowed select-none">
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
          
          {/* Left Column: Image Showcase, Content Tabs, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Showcase Banner Image */}
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-lg group relative">
              <img 
                src={template.bannerImage || template.image} 
                alt={template.title}
                className="w-full h-[440px] object-cover object-top"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setLivePreviewTemplate(template)}
                  className="px-4 py-2 rounded-xl bg-black/75 hover:bg-purple-600 text-white font-bold text-xs backdrop-blur-md flex items-center gap-2 transition-colors cursor-pointer shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview 368px - 1440px Views</span>
                </button>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex border-b border-gray-100 dark:border-gray-800 space-x-6 mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'overview'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Overview & Tech Stack
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'reviews'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span>Client Reviews</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 font-bold">
                    {template.reviewsCount || (template.reviews ? template.reviews.length : 0)}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('developer')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'developer'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span>Author Details</span>
                </button>
              </div>

              {/* TAB 1: OVERVIEW & TECH STACK */}
              {activeTab === 'overview' && (
                <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p className="text-base text-gray-700 dark:text-gray-200">{template.description}</p>
                  
                  {/* Dynamic Programming Language & Framework Badges */}
                  <div className="p-4 bg-purple-50/50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-800/60">
                    <h4 className="text-xs font-black uppercase tracking-wider text-purple-800 dark:text-purple-300 mb-3">
                      Development Specifications
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-white dark:bg-navy-900 rounded-xl border border-purple-100 dark:border-purple-900">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Language Used</span>
                        <span className="text-xs font-extrabold text-gray-900 dark:text-white">{template.language || 'JavaScript (ES6+)'}</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-navy-900 rounded-xl border border-purple-100 dark:border-purple-900">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Framework</span>
                        <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">{template.framework || 'React 18 & Tailwind'}</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-navy-900 rounded-xl border border-purple-100 dark:border-purple-900">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Build Tool</span>
                        <span className="text-xs font-extrabold text-gray-900 dark:text-white">Vite 5 (Hot Module Reload)</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Features & Highlights */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Key Features & Highlights</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {template.features?.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-3.5 bg-gray-50 dark:bg-navy-950 rounded-xl border border-gray-100 dark:border-gray-800">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Included Technologies */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Technologies & Libraries</h3>
                    <div className="flex flex-wrap gap-2">
                      {template.technologies?.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-navy-800 text-gray-800 dark:text-gray-200 text-xs font-bold border border-gray-200 dark:border-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CLIENT REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  
                  {/* Reviews Summary */}
                  <div className="p-5 bg-purple-50/50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center sm:text-left">
                        <div className="text-3xl font-black text-gray-900 dark:text-white">
                          {template.rating ? Number(template.rating).toFixed(1) : '0.0'}
                        </div>
                        <div className="flex text-amber-400 my-1 justify-center sm:justify-start">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-4 h-4 ${s <= Math.round(Number(template.rating) || 0) ? 'fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {template.reviewsCount || 0} client reviews
                        </div>
                      </div>
                    </div>

                    <a 
                      href="#write-review"
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                    >
                      Write a Review
                    </a>
                  </div>

                  {/* Dynamic Reviews List */}
                  <div className="space-y-4">
                    {template.reviews && template.reviews.length > 0 ? (
                      template.reviews.map((rev) => (
                        <div key={rev.id} className="p-4 sm:p-5 bg-gray-50 dark:bg-navy-950 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-gray-900 dark:text-white">{rev.userName}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                                {rev.userRole || 'Verified Client'}
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-400">{rev.date}</span>
                          </div>

                          <div className="flex text-amber-400">
                            {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>

                          <h5 className="font-bold text-xs text-gray-900 dark:text-white">{rev.title}</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-gray-50 dark:bg-navy-950 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
                        <Star className="w-8 h-8 text-gray-300 mx-auto" />
                        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">No ratings yet</h4>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto">
                          Be the first client to test, rate, and review this template! Ratings are calculated dynamically from authentic user feedback.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Customer Review Submission Form */}
                  <div id="write-review" className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-purple-200 dark:border-purple-800 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">Submit Genuine Client Review & Rating</h4>
                    </div>

                    <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                      {/* Rating Stars Selector */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Your Rating</label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-1 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star className={`w-5 h-5 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-400 ml-2">{reviewRating} of 5 Stars</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Review Headline</label>
                          <input
                            type="text"
                            required
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            placeholder="e.g. Clean React code & smooth animations"
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Your Experience / Feedback</label>
                        <textarea
                          rows="3"
                          required
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="How did this template perform? Share thoughts on layout responsiveness, component structure, or Lighthouse speed..."
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Review</span>
                      </button>
                    </form>
                  </div>

                </div>
              )}

              {/* TAB 3: DEVELOPER PROFILE & VERIFIED CREDENTIALS */}
              {activeTab === 'developer' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800">
                    <div className="flex items-start gap-4">
                      <img 
                        src={developer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                        alt={developer?.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-300 shadow-sm"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-extrabold text-gray-900 dark:text-white">{developer?.name || template.developerName}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                            Verified Author
                          </span>
                        </div>
                        <p className="text-xs text-purple-600 font-mono font-bold">Login ID: {developer?.loginId || template.developerId}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{developer?.title || 'Senior Full-Stack & UI Architect'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message Developer</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-navy-950 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Specialties</span>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate block">React & Tailwind</span>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-navy-950 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Verified Sales</span>
                      <span className="text-xs font-bold text-emerald-600 block">{template.sales || 0} units</span>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-navy-950 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Support Policy</span>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">&lt; 24h Turnaround</span>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-navy-950 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Royalty Split</span>
                      <span className="text-xs font-bold text-purple-600 block">Tier-1 (85%)</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Dynamic Pricing Box & Source Code Access */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl sticky top-28 space-y-6">
              
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">License Fee</span>
                  <span className="text-xs text-emerald-600 font-semibold">100% One-Time Payment</span>
                </div>
                <span className="text-3xl font-extrabold text-purple-600">{formatPrice(template.price)}</span>
              </div>

              {/* Already Purchased Status or License Benefits */}
              {isPurchased ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Commercial License Active</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-200">
                    You have purchased this template. Download the full unminified source code archive below.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300 border-t border-b border-gray-100 dark:border-gray-800 py-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Commercial deployment & client handoff</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Instant unminified source code download</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Lifetime updates & author direct support</span>
                  </div>
                </div>
              )}

              {/* Primary Action Button (Add to Cart vs Download Source Code) */}
              {isPurchased ? (
                <button
                  onClick={() => {
                    downloadSourceCode(template);
                    showNotification(`Downloading source code archive for ${template.title}...`, 'success');
                  }}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Source Code (.zip)</span>
                </button>
              ) : (
                <button
                  onClick={() => addToCart(template)}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart — {formatPrice(template.price)}</span>
                </button>
              )}

              {/* Contact Developer Direct Button */}
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full py-3 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact {developer?.name || 'Developer'}</span>
              </button>

              {/* Live Demo Trigger Button */}
              {isLiveUrl && (
                <button
                  onClick={() => setLivePreviewTemplate(template)}
                  className="w-full py-3 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                  title="Open Responsive Preview (368px, 768px, 1024px, 1440px)"
                >
                  <Eye className="w-4 h-4" />
                  <span>Responsive Live Demo</span>
                </button>
              )}

              {/* Specifications List */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Developer</span>
                  <span className="font-bold text-purple-600">{developer?.name || template.developerName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Developer ID</span>
                  <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{developer?.loginId || template.developerId}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Category</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{template.categoryName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Language</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{template.language || 'JavaScript (ES6+)'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Framework</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{template.framework || 'React 18 & Tailwind'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Verified Sales</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{template.sales || 0} downloads</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Likes</span>
                  <span className="font-bold text-rose-500">{template.likes || 0} likes</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Related Templates Grid */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              More Templates in {template.categoryName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <TemplateCard key={item.id} template={item} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Direct Contact Developer Modal */}
      <ContactDeveloperModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        template={template}
        developer={developer}
      />

    </div>
  );
};

export default TemplateDetail;
