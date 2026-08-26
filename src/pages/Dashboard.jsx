import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  Code, 
  ShieldCheck, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Download, 
  ExternalLink, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  MessageSquare, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Clock, 
  Users, 
  FileCode,
  Eye,
  Sliders,
  Check,
  Percent
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { templates as staticTemplates } from '../data/templates';
import { categories } from '../data/categories';
import TemplateCard from '../components/TemplateCard';

const Dashboard = () => {
  const { currentUser, openAuth, showNotification, bookmarks } = useCart();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // Client State (Design Requests)
  const [clientRequests, setClientRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-client-requests');
      return saved ? JSON.parse(saved) : [
        {
          id: 'req-1',
          title: 'SaaS Platform Redesign',
          category: 'saas',
          categoryName: 'SaaS & App',
          description: 'We need a complete redesign of our AI marketing platform homepage. Needs to include a pricing switcher, responsive navigation, and beautiful interactive dashboard previews.',
          budget: '$1,200',
          timeline: '2-4 weeks',
          status: 'In Progress',
          date: '2026-08-25'
        },
        {
          id: 'req-2',
          title: 'E-commerce Theme Integration',
          category: 'ecommerce',
          categoryName: 'eCommerce',
          description: 'Need a customized fashion shopfront template matching our brand book. Required integration with Stripe checkout elements on the frontend.',
          budget: '$850',
          timeline: '1-2 weeks',
          status: 'Pending Review',
          date: '2026-08-26'
        }
      ];
    } catch {
      return [];
    }
  });

  const [newRequest, setNewRequest] = useState({
    title: '',
    category: 'business',
    description: '',
    budget: '$500 - $1,000',
    timeline: '1-2 weeks',
    referenceUrl: '',
    templateRef: '' // selected template reference
  });

  // Developer State (Submitted Templates)
  const [devTemplates, setDevTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-dev-templates');
      return saved ? JSON.parse(saved) : [
        {
          id: 'dev-temp-1',
          title: 'Apex - Dashboard Kit',
          subtitle: 'Clean dashboard React template with dark mode',
          category: 'saas',
          categoryName: 'SaaS & App',
          price: 24,
          rating: 4.8,
          sales: 42,
          isApproved: true,
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          demoUrl: 'https://example.com/demo/apex',
          features: ['React 18 & Vite', 'Tailwind CSS', '50+ UI Components'],
          tags: ['React', 'Dashboard', 'Tailwind'],
          description: 'Premium dashboard layout built for data-heavy applications.'
        }
      ];
    } catch {
      return [];
    }
  });

  const [newTemplate, setNewTemplate] = useState({
    title: '',
    subtitle: '',
    category: 'business',
    price: 19,
    image: '',
    demoUrl: '',
    description: '',
    featuresText: '',
    tagsText: ''
  });

  // Persist Client Requests
  useEffect(() => {
    localStorage.setItem('fusion-client-requests', JSON.stringify(clientRequests));
  }, [clientRequests]);

  // Persist Developer Templates
  useEffect(() => {
    localStorage.setItem('fusion-dev-templates', JSON.stringify(devTemplates));
  }, [devTemplates]);

  // If user is guest, show login prompt
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex items-center justify-center py-20 px-4 transition-colors">
        <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-navy-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Access Your Dashboard</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please sign in or create an account to view downloads, customize requests, upload templates, or oversee the marketplace.
            </p>
          </div>
          <button
            onClick={() => openAuth('login')}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>Sign In Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const role = currentUser.role || 'customer';

  // Client Request Handlers
  const handleClientRequestSubmit = (e) => {
    e.preventDefault();
    const cat = categories.find(c => c.slug === newRequest.category) || categories[0];
    const newReqItem = {
      id: `req-${Date.now()}`,
      title: newRequest.title,
      category: newRequest.category,
      categoryName: cat.name,
      description: newRequest.description,
      budget: newRequest.budget,
      timeline: newRequest.timeline,
      referenceUrl: newRequest.referenceUrl,
      templateRef: newRequest.templateRef,
      status: 'Pending Review',
      date: new Date().toISOString().split('T')[0]
    };
    setClientRequests([newReqItem, ...clientRequests]);
    setNewRequest({
      title: '',
      category: 'business',
      description: '',
      budget: '$500 - $1,000',
      timeline: '1-2 weeks',
      referenceUrl: '',
      templateRef: ''
    });
    showNotification('Design update request submitted successfully!', 'success');
    setActiveTab('requests');
  };

  // Developer Template Handlers
  const handleDevTemplateSubmit = (e) => {
    e.preventDefault();
    const cat = categories.find(c => c.slug === newTemplate.category) || categories[0];
    
    // Split features and tags
    const features = newTemplate.featuresText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
      
    const tags = newTemplate.tagsText
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const defaultImage = newTemplate.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

    const newTempItem = {
      id: `dev-temp-${Date.now()}`,
      title: newTemplate.title,
      subtitle: newTemplate.subtitle,
      category: newTemplate.category,
      categoryName: cat.name,
      price: Number(newTemplate.price) || 19,
      rating: 5.0,
      sales: 0,
      isApproved: false, // requires Admin moderation
      image: defaultImage,
      demoUrl: newTemplate.demoUrl || 'https://example.com/demo',
      features: features.length ? features : ['Responsive layout', 'Clean code structure'],
      tags: tags.length ? tags : [cat.name, 'HTML5'],
      description: newTemplate.description || 'No description provided.'
    };

    setDevTemplates([newTempItem, ...devTemplates]);
    setNewTemplate({
      title: '',
      subtitle: '',
      category: 'business',
      price: 19,
      image: '',
      demoUrl: '',
      description: '',
      featuresText: '',
      tagsText: ''
    });
    showNotification('Template submitted for admin review!', 'success');
    setActiveTab('templates');
  };

  // Admin approval handler
  const handleApproveTemplate = (tempId) => {
    setDevTemplates(prev => 
      prev.map(t => t.id === tempId ? { ...t, isApproved: true } : t)
    );
    showNotification('Template approved and published!', 'success');
  };

  // Admin reject handler
  const handleRejectTemplate = (tempId) => {
    setDevTemplates(prev => prev.filter(t => t.id !== tempId));
    showNotification('Template request declined and removed.', 'info');
  };

  // Admin assign request handler
  const handleAssignRequest = (reqId) => {
    setClientRequests(prev => 
      prev.map(r => r.id === reqId ? { ...r, status: 'In Progress' } : r)
    );
    showNotification('Developer assigned to client project!', 'success');
  };

  // Render Helpers for Roles
  const getRoleHeader = () => {
    const roleColors = {
      customer: 'from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
      client: 'from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/50',
      developer: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
      admin: 'from-rose-500/10 to-red-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50'
    };

    const roleBadges = {
      customer: 'Customer Member',
      client: 'Client Business Partner',
      developer: 'Verified Developer',
      admin: 'Marketplace Administrator'
    };

    return (
      <div className="relative bg-[#0A0D18] text-white py-14 border-b border-gray-800 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-xl shadow-purple-500/10">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left space-y-2">
              <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${roleColors[role]}`}>
                {roleBadges[role]}
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome Back, {currentUser.name}
              </h1>
              <p className="text-xs text-gray-400">{currentUser.email}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ==================== CUSTOMER DASHBOARD ==================== */
  const renderCustomerDashboard = () => {
    // Mock purchased items
    const purchased = [
      staticTemplates[2], // Nova Portfolio
      staticTemplates[0], // Consultix Business
    ].filter(Boolean);

    // Bookmarked items
    const savedTemplates = staticTemplates.filter(t => bookmarks.includes(t.id));

    return (
      <div className="space-y-10">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 flex gap-6 text-sm">
          <button 
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-4 font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            My Downloads ({purchased.length})
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`pb-4 font-bold border-b-2 transition-colors ${activeTab === 'saved' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Saved Templates ({savedTemplates.length})
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`pb-4 font-bold border-b-2 transition-colors ${activeTab === 'billing' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Purchase History
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Purchased Web Templates</h2>
            {purchased.length === 0 ? (
              <p className="text-xs text-gray-450">You haven't bought any templates yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchased.map((t) => (
                  <div key={t.id} className="bg-white dark:bg-navy-900 border border-gray-105 dark:border-gray-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                    <img src={t.image} alt={t.title} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">{t.categoryName}</span>
                        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white truncate">{t.title}</h3>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{t.subtitle}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => showNotification(`Downloading Source Package for "${t.title}"...`, 'success')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download files</span>
                        </button>
                        <a 
                          href={t.demoUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold text-xs text-gray-700 dark:text-gray-300 rounded-xl transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bookmarks</h2>
            {savedTemplates.length === 0 ? (
              <div className="bg-white dark:bg-navy-900 border border-dashed border-gray-200 dark:border-gray-800 p-8 rounded-3xl text-center">
                <p className="text-xs text-gray-400">No bookmarks saved yet. Click the bookmark star on templates to save them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedTemplates.map((t) => (
                  <TemplateCard key={t.id} template={t} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-navy-950 border-b border-gray-100 dark:border-gray-800 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  <th className="p-4">Invoice ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Template</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr className="border-b border-gray-50 dark:border-gray-850">
                  <td className="p-4 font-mono">INV-2026-9481</td>
                  <td className="p-4">Aug 26, 2026</td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">Nova - Portfolio</td>
                  <td className="p-4 font-bold text-purple-600">$19.00</td>
                  <td className="p-4"><span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 text-[10px] font-bold">Paid</span></td>
                </tr>
                <tr>
                  <td className="p-4 font-mono">INV-2026-8273</td>
                  <td className="p-4">Aug 15, 2026</td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">Consultix - Business</td>
                  <td className="p-4 font-bold text-purple-600">$19.00</td>
                  <td className="p-4"><span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 text-[10px] font-bold">Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  /* ==================== CLIENT DASHBOARD ==================== */
  const renderClientDashboard = () => {
    return (
      <div className="space-y-10">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 flex gap-6 text-sm">
          <button 
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-4 font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Submit Request
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`pb-4 font-bold border-b-2 transition-colors ${activeTab === 'requests' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            My Custom Jobs ({clientRequests.length})
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`pb-4 font-bold border-b-2 transition-colors ${activeTab === 'messages' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Developer Messages
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-8 bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                  <span>Request Custom Website Design or Update</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Need a developer to configure, adjust, or build a theme? Submit your scope here.</p>
              </div>

              <form onSubmit={handleClientRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-450">Project Title</label>
                    <input 
                      type="text"
                      required
                      value={newRequest.title}
                      onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                      placeholder="e.g. Construction Business Page Redesign"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-455">Industry Category</label>
                    <select
                      value={newRequest.category}
                      onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Estimated Budget</label>
                    <select
                      value={newRequest.budget}
                      onChange={(e) => setNewRequest({ ...newRequest, budget: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                    >
                      <option value="$200 - $500">$200 - $500</option>
                      <option value="$500 - $1,000">$500 - $1,000</option>
                      <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                      <option value="$2,500+">$2,500+</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Required Timeline</label>
                    <select
                      value={newRequest.timeline}
                      onChange={(e) => setNewRequest({ ...newRequest, timeline: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-955 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                    >
                      <option value="1 week">1 week</option>
                      <option value="2-4 weeks">2-4 weeks</option>
                      <option value="1-2 months">1-2 months</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-405">Describe What You Need Done</label>
                  <textarea
                    required
                    rows={4}
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                    placeholder="Provide details on styling adjustments, specific integration needs (e.g. booking calendars, forms), page links, or design layouts."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Example Website / Template Ref</label>
                    <select
                      value={newRequest.templateRef}
                      onChange={(e) => setNewRequest({ ...newRequest, templateRef: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                    >
                      <option value="">None - Custom Requirements</option>
                      {staticTemplates.map((temp, idx) => (
                        <option key={temp.id} value={`#${idx + 1} - ${temp.title}`}>
                          #{idx + 1} - {temp.title} ({temp.categoryName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Reference Link (Optional)</label>
                    <input 
                      type="url"
                      value={newRequest.referenceUrl}
                      onChange={(e) => setNewRequest({ ...newRequest, referenceUrl: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit Project Offer</span>
                </button>
              </form>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-4 bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/10 rounded-3xl p-6 h-fit space-y-6">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-purple-500" />
                <span>How Custom Jobs Work</span>
              </h3>
              <ul className="space-y-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Your request is broadcasted to verified template developers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Developers check your scope and submit design bids/estimates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>You choose a developer, pay securely in escrow, and watch progress.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Hires & Design Updates</h2>
            {clientRequests.length === 0 ? (
              <p className="text-xs text-gray-405">No project requests submitted. Use the submit tab to create one.</p>
            ) : (
              <div className="space-y-4">
                {clientRequests.map((req) => (
                  <div key={req.id} className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 text-[10px] font-bold uppercase">{req.categoryName}</span>
                        <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {req.date}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{req.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-2xl">{req.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-xs pt-1">
                        <span className="text-gray-500">Budget: <strong className="text-gray-950 dark:text-white font-extrabold">{req.budget}</strong></span>
                        <span className="text-gray-500">Timeline: <strong className="text-gray-950 dark:text-white font-extrabold">{req.timeline}</strong></span>
                      </div>
                      {req.templateRef && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-lg border border-purple-100/50 dark:border-purple-900/40 mt-2 w-fit">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Example Website Reference: {req.templateRef}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        req.status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                          : req.status === 'In Progress'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm max-w-3xl mx-auto space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              <span>Inbox - Bids & Conversations</span>
            </h2>
            <div className="divide-y divide-gray-100 dark:divide-gray-850">
              <div className="py-4 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center flex-shrink-0">
                  DD
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-extrabold text-gray-900 dark:text-white">Dave Developer</span>
                    <span className="text-[10px] text-gray-400">10 mins ago</span>
                  </div>
                  <p className="text-xs text-purple-600 font-semibold">Subject: SaaS Platform Redesign Proposal</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">"Hey Sarah! I looked at your requirement details for the SaaS landing page redesign. I can easily do this using React & Framer Motion. I'm ready to match your $1,200 budget and finish within 3 weeks."</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ==================== DEVELOPER DASHBOARD ==================== */
  const renderDeveloperDashboard = () => {
    return (
      <div className="space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Sales Revenue', value: '$1,008.00', change: '+24%', icon: DollarSign, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
            { label: 'Templates Sold', value: '42 units', change: '+12%', icon: TrendingUp, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
            { label: 'Average Product Rating', value: '4.85 / 5', change: 'Outstanding', icon: Star, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/40' },
            { label: 'Active Uploads', value: `${devTemplates.length} Items`, change: 'Live catalog', icon: FileCode, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">{stat.label}</span>
                  <div className={`p-2 rounded-xl ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
                  <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mt-1">{stat.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 flex gap-6 text-sm">
          <button 
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-4 font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            My Templates ({devTemplates.length})
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`pb-4 font-bold border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Client Requests Board ({clientRequests.length})
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-4 font-bold border-b-2 transition-colors ${activeTab === 'upload' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Upload Template File
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Uploaded Marketplace Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {devTemplates.map((t) => (
                <div key={t.id} className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-fit gap-4">
                  <div className="flex gap-4">
                    <img src={t.image} alt={t.title} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 border border-gray-100 dark:border-gray-800" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">{t.categoryName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${t.isApproved ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 animate-pulse'}`}>
                          {t.isApproved ? 'Approved & Live' : 'Awaiting Review'}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white truncate mt-1">{t.title}</h3>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{t.subtitle}</p>
                      
                      <div className="flex gap-4 text-xs font-bold text-gray-600 dark:text-gray-450 mt-2">
                        <span>Price: ${t.price}</span>
                        <span>Sales: {t.sales} units</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-50 dark:border-gray-850 flex flex-col gap-2.5">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">Developer Export Block (JS Code)</p>
                    <pre className="p-3 bg-gray-50 dark:bg-navy-950 rounded-xl text-[9px] font-mono text-gray-600 dark:text-gray-400 overflow-x-auto max-h-32 border border-gray-200/50 dark:border-gray-800">
{`{
  id: '${t.id}',
  title: '${t.title}',
  subtitle: '${t.subtitle}',
  category: '${t.category}',
  price: ${t.price},
  image: '${t.image}',
  demoUrl: '${t.demoUrl}',
  tags: ${JSON.stringify(t.tags)},
  description: '${t.description}'
}`}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-500" />
                <span>Upload New Website Template</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">Fill out the template registry details. This item will undergo developer validation and administration vetting before listed in the main index.</p>
            </div>

            <form onSubmit={handleDevTemplateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Template Title</label>
                  <input 
                    type="text"
                    required
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                    placeholder="e.g. Constructo - Build Theme"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Short Subtitle</label>
                  <input 
                    type="text"
                    required
                    value={newTemplate.subtitle}
                    onChange={(e) => setNewTemplate({ ...newTemplate, subtitle: e.target.value })}
                    placeholder="e.g. Premium React Builder Layout for Contractors"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Marketplace Category</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-405">Base Price (USD)</label>
                  <input 
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newTemplate.price}
                    onChange={(e) => setNewTemplate({ ...newTemplate, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Demo URL</label>
                  <input 
                    type="url"
                    value={newTemplate.demoUrl}
                    onChange={(e) => setNewTemplate({ ...newTemplate, demoUrl: e.target.value })}
                    placeholder="https://example.com/demo"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Main Preview Image URL</label>
                  <input 
                    type="url"
                    value={newTemplate.image}
                    onChange={(e) => setNewTemplate({ ...newTemplate, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Tags (comma-separated)</label>
                  <input 
                    type="text"
                    value={newTemplate.tagsText}
                    onChange={(e) => setNewTemplate({ ...newTemplate, tagsText: e.target.value })}
                    placeholder="React, Construction, Tailwind, Builder"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Template Description</label>
                <textarea 
                  rows={3}
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Detailed summary of the theme features, frameworks, responsive targets, and what it covers."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Key Features List (one feature per line)</label>
                <textarea 
                  rows={3}
                  value={newTemplate.featuresText}
                  onChange={(e) => setNewTemplate({ ...newTemplate, featuresText: e.target.value })}
                  placeholder="e.g.&#10;Built with React 18 & Vite&#10;Includes 10 Page Layouts&#10;Framer Motion Animations"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Upload Design Item</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Open Client Projects & Requests</h2>
            {clientRequests.length === 0 ? (
              <p className="text-xs text-gray-400">No client requests available at the moment.</p>
            ) : (
              <div className="space-y-4">
                {clientRequests.map((req) => (
                  <div key={req.id} className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-955/60 text-purple-600 text-[10px] font-bold uppercase">{req.categoryName}</span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {req.date}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">{req.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-405 max-w-2xl">{req.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-xs pt-1 font-semibold text-gray-500">
                        <span>Budget: <strong className="text-gray-950 dark:text-white font-extrabold">{req.budget}</strong></span>
                        <span>Timeline: <strong className="text-gray-950 dark:text-white font-extrabold">{req.timeline}</strong></span>
                      </div>
                      {req.templateRef && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-lg border border-purple-100/50 dark:border-purple-900/40 mt-2 w-fit">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Example Website Reference: {req.templateRef}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        req.status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                          : req.status === 'In Progress'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                      }`}>
                        {req.status}
                      </span>
                      {req.status === 'Pending Review' && (
                        <button
                          type="button"
                          onClick={() => {
                            setClientRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'In Progress' } : r));
                            showNotification('You have applied for this job! Status changed to In Progress.', 'success');
                          }}
                          className="py-1.5 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                        >
                          Accept Custom Job
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ==================== ADMIN DASHBOARD ==================== */
  const renderAdminDashboard = () => {
    // Audit active submissions awaiting review
    const pendingTemplates = devTemplates.filter(t => !t.isApproved);
    const approvedTemplates = devTemplates.filter(t => t.isApproved);

    return (
      <div className="space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Global Revenue Volume', value: '$8,242.00', icon: DollarSign, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
            { label: 'Active Users', value: '184 Accounts', icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
            { label: 'Moderate Queue', value: `${pendingTemplates.length} Items`, icon: AlertCircle, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
            { label: 'Total Catalog Products', value: `${staticTemplates.length + approvedTemplates.length} Themes`, icon: FileCode, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/40' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">{stat.label}</span>
                  <div className={`p-2 rounded-xl ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 flex gap-6 text-sm">
          <button 
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-4 font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Moderate Templates ({pendingTemplates.length})
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`pb-4 font-bold border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Client Requests Queue ({clientRequests.length})
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`pb-4 font-bold border-b-2 transition-colors ${activeTab === 'categories' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Register Database & Categories
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Moderate New Developer Submissions</h2>
            {pendingTemplates.length === 0 ? (
              <div className="bg-white dark:bg-navy-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Approve queue is clean! No templates waiting for review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingTemplates.map((t) => (
                  <div key={t.id} className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex gap-4">
                      <img src={t.image} alt={t.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-955/40 px-2 py-0.5 rounded-md uppercase">{t.categoryName}</span>
                        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1 truncate">{t.title}</h3>
                        <p className="text-[11px] text-gray-400 truncate">{t.subtitle}</p>
                        <p className="text-xs font-bold text-purple-600 mt-1">${t.price}</p>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-50 dark:border-gray-850 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleApproveTemplate(t.id)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors text-center"
                      >
                        Approve & Publish
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectTemplate(t.id)}
                        className="px-4 py-2 border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 font-bold text-xs rounded-xl transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Client-Side Hires</h2>
            {clientRequests.length === 0 ? (
              <p className="text-xs text-gray-400">No client project requests submitted.</p>
            ) : (
              <div className="space-y-4">
                {clientRequests.map((req) => (
                  <div key={req.id} className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-955/60 text-purple-600 text-[10px] font-bold uppercase">{req.categoryName}</span>
                        <span className="text-[10px] text-gray-400">Date: {req.date}</span>
                      </div>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">{req.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-405 max-w-xl">{req.description}</p>
                      <div className="flex gap-4 text-xs pt-1 font-semibold text-gray-500">
                        <span>Budget: <strong className="text-gray-900 dark:text-white">{req.budget}</strong></span>
                        <span>Timeline: <strong className="text-gray-900 dark:text-white">{req.timeline}</strong></span>
                      </div>
                      {req.templateRef && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-lg border border-purple-100/50 dark:border-purple-900/40 mt-2 w-fit">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Example Website Reference: {req.templateRef}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        req.status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                          : req.status === 'In Progress'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                      }`}>
                        {req.status}
                      </span>
                      {req.status === 'Pending Review' && (
                        <button
                          type="button"
                          onClick={() => handleAssignRequest(req.id)}
                          className="py-1.5 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                        >
                          Match Developer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-navy-950 border-b border-gray-100 dark:border-gray-800 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Icon Name</th>
                  <th className="p-4">Indexed Count</th>
                  <th className="p-4">Database Description</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {categories.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 dark:border-gray-850">
                    <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-purple-500`} />
                      {c.name}
                    </td>
                    <td className="p-4 font-mono text-gray-500">{c.slug}</td>
                    <td className="p-4 font-mono text-purple-600">{c.icon}</td>
                    <td className="p-4 font-bold text-gray-800 dark:text-gray-200">{c.count}</td>
                    <td className="p-4 text-gray-400 max-w-[200px] truncate">{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-955 pb-20 transition-colors">
      {/* Header with profile info */}
      {getRoleHeader()}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Dynamic sub-dashboards */}
        {role === 'customer' && renderCustomerDashboard()}
        {role === 'client' && renderClientDashboard()}
        {role === 'developer' && renderDeveloperDashboard()}
        {role === 'admin' && renderAdminDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
