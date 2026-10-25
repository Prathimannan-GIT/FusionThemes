import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
  Edit3,
  X,
  FileText,
  RotateCcw,
  Layers,
  ShoppingBag,
  Send,
  Mail,
  Heart,
  Settings,
  Activity,
  Search,
  Database
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTemplates } from '../context/TemplateContext';
import { DEVELOPERS } from '../data/developers';
import TemplateCard from '../components/TemplateCard';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const { currentUser, openAuth, showNotification, bookmarks, setLivePreviewTemplate } = useCart();
  const { formatPrice } = useCurrency();
  const { 
    templates, 
    categories, 
    purchasedTemplates, 
    customerOrders, 
    clientRequests, 
    conversations,
    messages,
    emailNotifications,
    systemSettings,
    activityLogs,
    registeredClients,
    addTemplate, 
    updateTemplate, 
    deleteTemplate, 
    downloadSourceCode, 
    addClientRequest, 
    deleteClientRequest, 
    sendMessage,
    markMessagesRead,
    updateSystemSettings,
    getDeveloperStats,
    getAdminStats,
    resetDatabase,
    dbStatus,
    refreshDbStatus,
    initSupabaseClient,
    getSupabaseCredentials
  } = useTemplates();

  const navigate = useNavigate();

  // Tab State
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Chat conversation active selection
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [chatInput, setChatInput] = useState('');

  // Edit Template Modal State
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Email & Payment Gateway Config State (for Admin)
  const [emailConfigInput, setEmailConfigInput] = useState(systemSettings.centralDeveloperEmail);
  const [paymentModeInput, setPaymentModeInput] = useState(systemSettings?.paymentConfig?.mode || 'test');
  const [stripeSecretKeyInput, setStripeSecretKeyInput] = useState(systemSettings?.paymentConfig?.stripeSecretKey || '');
  const [stripePubKeyInput, setStripePubKeyInput] = useState(systemSettings?.paymentConfig?.stripePublishableKey || '');

  // Supabase Database Config State
  const initialDbCreds = getSupabaseCredentials ? getSupabaseCredentials() : {};
  const [dbUrlInput, setDbUrlInput] = useState(initialDbCreds.url || '');
  const [dbKeyInput, setDbKeyInput] = useState(initialDbCreds.key || '');
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // New Client Request State
  const [newRequest, setNewRequest] = useState({
    title: '',
    category: 'business',
    description: '',
    budget: '$500 - $1,500',
    timeline: '1-2 weeks',
    templateRef: ''
  });

  // New Developer Template State
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    subtitle: '',
    category: 'business',
    price: 29,
    image: '',
    demoUrl: '',
    language: 'JavaScript (ES6+)',
    framework: 'React 18 & Tailwind CSS',
    technologies: 'React 18, Tailwind CSS 3, Vite 5, Lucide Icons',
    description: '',
    featuresText: 'Fully Responsive Mobile & Desktop Layouts\nClean Modular Component Architecture\nTailwind CSS Token System\nSEO Optimized with Google Lighthouse 95+\nDetailed Setup Documentation',
    tagsText: 'React, Tailwind, Responsive, Modern'
  });

  // Preset sample images for quick upload
  const PRESET_IMAGES = [
    { label: 'SaaS / AI App', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' },
    { label: 'Business / Finance', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
    { label: 'Portfolio / Creative', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80' },
    { label: 'eCommerce Store', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Tech & Dashboard', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80' }
  ];

  // Set default active tab from query param if changed
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // If user is guest, show login prompt
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex items-center justify-center py-20 px-4 transition-colors">
        <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-navy-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Account Authentication Required</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Sign in with your Developer credentials (e.g. <code>empsf167it-tech</code>), Client account, or Admin portal to access your workspace.
            </p>
          </div>
          <button
            onClick={() => openAuth('developer')}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Sign In / Open Access Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Normalize role: treat 'customer' as 'client'
  const role = currentUser.role === 'customer' ? 'client' : (currentUser.role || 'client');

  // Developer specific calculations
  const devId = currentUser.loginId || currentUser.developerId || currentUser.id || 'empsf167it-tech';
  const devStats = getDeveloperStats(devId);
  const myDeveloperTemplates = devStats.devTemplates;

  // Filter conversations for the active user
  const userConversations = conversations.filter((c) => {
    if (role === 'developer') {
      return c.developerId?.toLowerCase() === devId?.toLowerCase();
    }
    if (role === 'client') {
      const userKey = currentUser.id || currentUser.email;
      return c.clientId === userKey || c.clientEmail === currentUser.email;
    }
    return true; // Admin sees all
  });

  const activeConversation = selectedConvId 
    ? conversations.find((c) => c.id === selectedConvId) 
    : userConversations[0] || null;

  const activeMessages = activeConversation 
    ? messages.filter((m) => m.conversationId === activeConversation.id)
    : [];

  // Mark as read when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      markMessagesRead(activeConversation.id, role);
    }
  }, [activeConversation?.id, activeMessages.length]);

  // Handlers
  const handleClientRequestSubmit = (e) => {
    e.preventDefault();
    addClientRequest(newRequest, currentUser);
    setNewRequest({
      title: '',
      category: 'business',
      description: '',
      budget: '$500 - $1,500',
      timeline: '1-2 weeks',
      templateRef: ''
    });
    showNotification('Project brief broadcast to marketplace developers!', 'success');
    setActiveTab('requests');
  };

  const handleDevTemplateSubmit = (e) => {
    e.preventDefault();
    if (!newTemplate.title.trim()) return;

    const created = addTemplate(newTemplate, currentUser);
    setNewTemplate({
      title: '',
      subtitle: '',
      category: 'business',
      price: 29,
      image: '',
      demoUrl: '',
      language: 'JavaScript (ES6+)',
      framework: 'React 18 & Tailwind CSS',
      technologies: 'React 18, Tailwind CSS 3, Vite 5, Lucide Icons',
      description: '',
      featuresText: 'Fully Responsive Mobile & Desktop Layouts\nClean Modular Component Architecture\nTailwind CSS Token System\nSEO Optimized with Google Lighthouse 95+\nDetailed Setup Documentation',
      tagsText: 'React, Tailwind, Responsive, Modern'
    });

    showNotification(`Template "${created.title}" published with zero hardcoded stats to ${created.categoryName}!`, 'success');
    setActiveTab('overview');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTemplate) return;

    updateTemplate(editingTemplate.id, editingTemplate);
    setEditingTemplate(null);
    showNotification('Template updated successfully!', 'success');
  };

  const handleDeleteTemplate = (tempId, title) => {
    if (window.confirm(`Are you sure you want to delete template "${title}" from the marketplace?`)) {
      deleteTemplate(tempId);
      showNotification(`Template "${title}" removed from marketplace.`, 'info');
    }
  };

  const handleSaveEmailConfig = (e) => {
    e.preventDefault();
    updateSystemSettings({
      centralDeveloperEmail: emailConfigInput,
      paymentConfig: {
        ...(systemSettings?.paymentConfig || {}),
        mode: paymentModeInput,
        stripeSecretKey: stripeSecretKeyInput,
        stripePublishableKey: stripePubKeyInput
      }
    });
    showNotification('Payment gateway and developer email settings saved successfully!', 'success');
  };

  const handleConnectDatabase = async (e) => {
    e.preventDefault();
    if (!dbUrlInput.trim() || !dbKeyInput.trim()) {
      showNotification('Please enter both Supabase Project URL and Anon API Key.', 'error');
      return;
    }
    setIsTestingDb(true);
    initSupabaseClient(dbUrlInput.trim(), dbKeyInput.trim());
    const res = await refreshDbStatus();
    setIsTestingDb(false);
    if (res.connected) {
      showNotification('Successfully connected to live PostgreSQL tables!', 'success');
    } else {
      showNotification(res.message || 'Saved database credentials.', 'info');
    }
  };

  const handleCopySqlSchema = () => {
    const sqlText = `-- FUSION THEMES POSTGRESQL TABLES
CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), login_id TEXT UNIQUE, email TEXT UNIQUE NOT NULL, full_name TEXT NOT NULL, role TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, icon TEXT);
CREATE TABLE IF NOT EXISTS templates (id TEXT PRIMARY KEY, title TEXT NOT NULL, subtitle TEXT, category_id TEXT REFERENCES categories(id), developer_id UUID REFERENCES users(id), price NUMERIC(10, 2) NOT NULL DEFAULT 0, image_url TEXT NOT NULL, demo_url TEXT NOT NULL, source_zip_url TEXT, language TEXT, framework TEXT, technologies TEXT[], sales_count INTEGER DEFAULT 0, is_approved BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, customer_id UUID REFERENCES users(id), customer_name TEXT NOT NULL, customer_email TEXT NOT NULL, total_amount NUMERIC(10, 2) NOT NULL, status TEXT DEFAULT 'Completed', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS order_items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_id TEXT REFERENCES orders(id) ON DELETE CASCADE, template_id TEXT REFERENCES templates(id), price NUMERIC(10, 2) NOT NULL);
CREATE TABLE IF NOT EXISTS payment_transactions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_id TEXT REFERENCES orders(id) ON DELETE CASCADE, transaction_reference TEXT UNIQUE NOT NULL, gateway TEXT NOT NULL, amount NUMERIC(10, 2) NOT NULL, currency TEXT DEFAULT 'USD', payment_status TEXT NOT NULL, card_brand TEXT, card_last4 TEXT, verified_by_server BOOLEAN DEFAULT TRUE, verified_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS reviews (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), template_id TEXT REFERENCES templates(id) ON DELETE CASCADE, user_id UUID REFERENCES users(id), user_name TEXT NOT NULL, rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL, title TEXT, comment TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS template_likes (template_id TEXT REFERENCES templates(id) ON DELETE CASCADE, user_id UUID REFERENCES users(id) ON DELETE CASCADE, created_at TIMESTAMPTZ DEFAULT NOW(), PRIMARY KEY (template_id, user_id));
CREATE TABLE IF NOT EXISTS conversations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), client_id UUID REFERENCES users(id), developer_id UUID REFERENCES users(id), template_id TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS messages (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE, sender_id UUID REFERENCES users(id), sender_role TEXT NOT NULL, sender_name TEXT NOT NULL, text TEXT NOT NULL, is_read BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS client_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), client_id UUID REFERENCES users(id), template_ref_id TEXT, category_id TEXT, title TEXT NOT NULL, description TEXT NOT NULL, budget TEXT, timeline TEXT, status TEXT DEFAULT 'Open', created_at TIMESTAMPTZ DEFAULT NOW());`;
    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    showNotification('SQL Table Schema copied to clipboard! Paste into Supabase SQL Editor.', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeConversation) return;

    sendMessage(activeConversation.id, {
      text: chatInput,
      senderId: currentUser.id || currentUser.loginId || currentUser.email,
      senderRole: role,
      senderName: currentUser.name || (role === 'developer' ? 'Author' : 'Client')
    });

    setChatInput('');
    showNotification('Message sent! Notification alert dispatched.', 'success');
  };

  // Header Banner
  const renderHeader = () => {
    const roleBadges = {
      developer: 'Verified Developer Partner',
      client: 'Verified Marketplace Client',
      admin: 'Platform Administrator'
    };

    return (
      <div className="relative bg-[#0A0D18] text-white py-12 border-b border-gray-800 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-xl shadow-purple-500/20">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {roleBadges[role] || 'Account Member'}
                  </span>
                  {role === 'developer' && (
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      ID: {currentUser.loginId || currentUser.developerId}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome Back, {currentUser.name}
                </h1>
                <p className="text-xs text-gray-400">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {role === 'developer' && (
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload New Template</span>
                </button>
              )}

              {role === 'client' && (
                <Link
                  to="/templates"
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Templates</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ==================== CHAT PANEL COMPONENT ==================== */
  const renderChatPanel = () => {
    return (
      <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        
        {/* Left Column: Conversations List */}
        <div className="md:col-span-4 border-r border-gray-100 dark:border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span>Direct Conversations</span>
            </h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600">
              {userConversations.length}
            </span>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-gray-100 dark:divide-gray-800 max-h-[500px]">
            {userConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                <Mail className="w-8 h-8 text-gray-300 mx-auto" />
                <p>No active conversations yet.</p>
                {role === 'client' && (
                  <p className="text-[11px] text-gray-500">
                    Click <strong>"Contact Developer"</strong> on any template to start a direct message thread!
                  </p>
                )}
              </div>
            ) : (
              userConversations.map((c) => {
                const isSelected = activeConversation?.id === c.id;
                const unread = role === 'developer' ? c.unreadByDev : c.unreadByClient;
                const otherPartyName = role === 'developer' ? c.clientName : c.developerName;

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConvId(c.id)}
                    className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                      isSelected 
                        ? 'bg-purple-50/70 dark:bg-purple-950/40 border-l-4 border-purple-600' 
                        : 'hover:bg-gray-50 dark:hover:bg-navy-950'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                      {otherPartyName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
                          {otherPartyName}
                        </span>
                        {unread > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                            {unread} new
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-semibold text-purple-600 truncate">{c.templateTitle}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{c.lastMessage}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Chat Thread */}
        <div className="md:col-span-8 flex flex-col justify-between">
          {activeConversation ? (
            <>
              {/* Conversation Top Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-navy-950/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-sm flex items-center justify-center">
                    {(role === 'developer' ? activeConversation.clientName : activeConversation.developerName)?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                      <span>{role === 'developer' ? activeConversation.clientName : activeConversation.developerName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200">
                        {role === 'developer' ? 'Client' : 'Author'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Concerning: <strong className="text-purple-600">{activeConversation.templateTitle}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-purple-600" />
                    <span>Email alerts active</span>
                  </span>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1 max-h-[420px] bg-slate-50/40 dark:bg-navy-950/20">
                {activeMessages.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-10">Start the conversation below...</p>
                ) : (
                  activeMessages.map((m) => {
                    const isMe = m.senderRole === role;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-gray-400">
                          <span className="font-bold">{m.senderName}</span>
                          <span>•</span>
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                            isMe
                              ? 'bg-purple-600 text-white rounded-tr-none shadow-md'
                              : 'bg-white dark:bg-navy-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-tl-none shadow-xs'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                <input
                  type="text"
                  required
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Reply as ${role === 'developer' ? 'Developer' : 'Client'}...`}
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center p-12 text-center text-xs text-gray-400">
              Select a conversation on the left to start messaging.
            </div>
          )}
        </div>

      </div>
    );
  };

  /* ==================== 1. DEVELOPER DASHBOARD ==================== */
  const renderDeveloperDashboard = () => {
    return (
      <div className="space-y-8">
        
        {/* Real Dynamic Developer Analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Authored Templates</span>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{devStats.totalTemplates}</h3>
            <p className="text-[10px] font-bold text-purple-600">Active in catalog</p>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Verified Sales</span>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{devStats.totalSales}</h3>
            <p className="text-[10px] font-bold text-blue-600">Actual units purchased</p>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Author Net (85%)</span>
            <h3 className="text-2xl font-black text-emerald-600">{formatPrice(devStats.netEarnings)}</h3>
            <p className="text-[10px] font-bold text-emerald-600">Actual earnings</p>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Ratings</span>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{devStats.avgRating}</h3>
            <p className="text-[10px] font-bold text-amber-500">
              {devStats.allReviews?.length ? `${devStats.allReviews.length} client reviews` : 'No ratings yet'}
            </p>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Total Likes</span>
            <h3 className="text-2xl font-black text-rose-500">{devStats.totalLikes}</h3>
            <p className="text-[10px] font-bold text-rose-500">Genuine likes</p>
          </div>
        </div>

        {/* Developer Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 flex gap-6 text-sm overflow-x-auto scrollbar-none">
          <button 
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'overview' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            My Uploaded Templates ({myDeveloperTemplates.length})
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Client Chat & Messages</span>
            {devStats.unreadMessagesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-extrabold">
                {devStats.unreadMessagesCount}
              </span>
            )}
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Template</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'jobs' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Client Custom Job Briefs ({clientRequests.length})
          </button>
        </div>

        {/* TAB 1: MY UPLOADED TEMPLATES */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Marketplace Portfolio</h2>
                <p className="text-xs text-gray-400">Templates authored by {currentUser.name} ({devId})</p>
              </div>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
            </div>

            {myDeveloperTemplates.length === 0 ? (
              <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-12 text-center space-y-3">
                <Code className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">No templates uploaded yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Publish your first website template with live demo link and source code files.
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-5 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl"
                >
                  Upload Template Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myDeveloperTemplates.map((t) => (
                  <div key={t.id} className="relative group">
                    <TemplateCard template={t} />
                    
                    {/* Developer Edit/Delete Quick Actions */}
                    <div className="mt-2 flex items-center justify-between px-2 text-xs">
                      <span className="font-bold text-gray-400">
                        {t.sales || 0} sales • {t.likes || 0} likes
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingTemplate(t)}
                          className="px-2.5 py-1 bg-gray-100 dark:bg-navy-800 hover:bg-purple-100 text-gray-700 dark:text-gray-300 hover:text-purple-600 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(t.id, t.title)}
                          className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CHAT WITH CLIENTS */}
        {activeTab === 'chat' && renderChatPanel()}

        {/* TAB 3: UPLOAD TEMPLATE FORM */}
        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload New Website Template</h2>
              <p className="text-xs text-gray-400">
                Author: <strong>{currentUser.name}</strong> ({devId}) • Enter full template details to publish instantly
              </p>
            </div>

            <form onSubmit={handleDevTemplateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Website / Template Name *</label>
                  <input
                    type="text"
                    required
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                    placeholder="e.g. Nexus - Modern AI SaaS Web App"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Subtitle / Short Hook</label>
                  <input
                    type="text"
                    value={newTemplate.subtitle}
                    onChange={(e) => setNewTemplate({ ...newTemplate, subtitle: e.target.value })}
                    placeholder="e.g. Production-ready Tailwind & React enterprise template"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Price (USD $) *</label>
                  <input
                    type="number"
                    min="5"
                    max="199"
                    required
                    value={newTemplate.price}
                    onChange={(e) => setNewTemplate({ ...newTemplate, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Programming Language *</label>
                  <input
                    type="text"
                    required
                    value={newTemplate.language}
                    onChange={(e) => setNewTemplate({ ...newTemplate, language: e.target.value })}
                    placeholder="e.g. JavaScript (ES6+) or TypeScript"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Framework Used *</label>
                  <input
                    type="text"
                    required
                    value={newTemplate.framework}
                    onChange={(e) => setNewTemplate({ ...newTemplate, framework: e.target.value })}
                    placeholder="e.g. React 18 & Tailwind CSS 3"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Source Code / Technologies *</label>
                  <input
                    type="text"
                    required
                    value={newTemplate.technologies}
                    onChange={(e) => setNewTemplate({ ...newTemplate, technologies: e.target.value })}
                    placeholder="e.g. React 18, Tailwind CSS, Vite, Lucide Icons, Framer Motion"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Live Demo Link (GitHub Pages / Vercel) *</label>
                  <input
                    type="url"
                    required
                    value={newTemplate.demoUrl}
                    onChange={(e) => setNewTemplate({ ...newTemplate, demoUrl: e.target.value })}
                    placeholder={`https://${devId}.github.io/my-template/`}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Card Image / Preview URL *</label>
                  <input
                    type="url"
                    value={newTemplate.image}
                    onChange={(e) => setNewTemplate({ ...newTemplate, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-gray-400 font-bold self-center">Or pick preset:</span>
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewTemplate({ ...newTemplate, image: preset.url })}
                        className="px-2 py-0.5 rounded bg-purple-50 dark:bg-navy-800 text-[10px] text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-100 cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Full Description *</label>
                <textarea
                  rows="3"
                  required
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Detail what makes this template unique, its target audience, and key benefits..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Features (One per line)</label>
                <textarea
                  rows="3"
                  value={newTemplate.featuresText}
                  onChange={(e) => setNewTemplate({ ...newTemplate, featuresText: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Template Dynamically</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: CLIENT CUSTOM JOB BRIEFS */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Client Custom Project Requests</h2>
              <p className="text-xs text-gray-400">Clients looking for customization or new websites based on templates</p>
            </div>

            {clientRequests.length === 0 ? (
              <p className="text-xs text-gray-400">No project briefs submitted by clients yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientRequests.map((req) => (
                  <div key={req.id} className="p-5 bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-600 uppercase">{req.categoryName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600">
                        {req.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{req.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{req.description}</p>
                    <div className="flex items-center justify-between pt-2 text-xs border-t border-gray-100 dark:border-gray-800">
                      <span className="font-bold text-emerald-600">Budget: {req.budget}</span>
                      <span className="text-gray-400">{req.clientName} ({req.clientEmail})</span>
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

  /* ==================== 2. CLIENT DASHBOARD ==================== */
  const renderClientDashboard = () => {
    const purchasedList = templates.filter((t) => purchasedTemplates.includes(t.id));
    const savedList = templates.filter((t) => bookmarks.includes(t.id) || (Array.isArray(t.likedBy) && t.likedBy.includes(currentUser.id || currentUser.email)));
    const totalSpent = customerOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    return (
      <div className="space-y-8">
        
        {/* Client Top Analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Purchased Templates</span>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{purchasedList.length}</h3>
            <p className="text-[10px] font-bold text-purple-600">Full source code unlocked</p>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Total Spent</span>
            <h3 className="text-2xl font-black text-emerald-600">{formatPrice(totalSpent)}</h3>
            <p className="text-[10px] font-bold text-emerald-600">{customerOrders.length} verified orders</p>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Active Chats</span>
            <h3 className="text-2xl font-black text-blue-600">{userConversations.length}</h3>
            <p className="text-[10px] font-bold text-blue-600">Direct developer threads</p>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Liked & Saved</span>
            <h3 className="text-2xl font-black text-rose-500">{savedList.length}</h3>
            <p className="text-[10px] font-bold text-rose-500">Bookmarked designs</p>
          </div>
        </div>

        {/* Client Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 flex gap-6 text-sm overflow-x-auto scrollbar-none">
          <button 
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>My Downloads & Source Code ({purchasedList.length})</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Developer Chat & Messages ({userConversations.length})</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('request-website')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'request-website' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Request Custom Website</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'saved' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Liked & Saved ({savedList.length})</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Orders & Receipts ({customerOrders.length})</span>
          </button>
        </div>

        {/* TAB 1: MY DOWNLOADS & SOURCE CODE */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Purchased Source Code Files</h2>
              <p className="text-xs text-gray-400">Download commercial archives for templates you have purchased</p>
            </div>

            {purchasedList.length === 0 ? (
              <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-12 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">No purchased templates yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Browse our catalog of 90+ verified website templates and complete a checkout to unlock source code files.
                </p>
                <Link
                  to="/templates"
                  className="inline-block px-5 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl"
                >
                  Explore Templates
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedList.map((t) => (
                  <div key={t.id} className="p-5 bg-white dark:bg-navy-900 border border-emerald-200 dark:border-emerald-800 rounded-3xl space-y-3 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          Commercial License Active
                        </span>
                        <span className="text-xs font-bold text-purple-600">{formatPrice(t.price)}</span>
                      </div>
                      <img src={t.image} alt={t.title} className="w-full h-36 object-cover rounded-2xl mb-3" />
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{t.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{t.subtitle}</p>
                    </div>

                    <button
                      onClick={() => {
                        downloadSourceCode(t);
                        showNotification(`Downloading source code for ${t.title}...`, 'success');
                      }}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Source Code (.zip)</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DEVELOPER CHAT */}
        {activeTab === 'chat' && renderChatPanel()}

        {/* TAB 3: REQUEST CUSTOM WEBSITE */}
        {activeTab === 'request-website' && (
          <div className="p-6 sm:p-8 bg-white dark:bg-navy-900 border border-purple-200 dark:border-purple-800 rounded-3xl space-y-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request a Custom Website Based on Existing Template</h2>
              <p className="text-xs text-gray-400">
                Post your custom project brief directly to verified marketplace developers
              </p>
            </div>

            <form onSubmit={handleClientRequestSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                    placeholder="e.g. Fintech Staking Dashboard Adaptation"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Select Reference Template</label>
                  <select
                    value={newRequest.templateRef}
                    onChange={(e) => setNewRequest({ ...newRequest, templateRef: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="">None / Custom from scratch</option>
                    {templates.slice(0, 30).map((t) => (
                      <option key={t.id} value={t.id}>{t.title} ({t.developerName})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={newRequest.category}
                    onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Budget</label>
                  <select
                    value={newRequest.budget}
                    onChange={(e) => setNewRequest({ ...newRequest, budget: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="$300 - $800">$300 - $800</option>
                    <option value="$800 - $2,000">$800 - $2,000</option>
                    <option value="$2,000 - $5,000">$2,000 - $5,000</option>
                    <option value="$5,000+">$5,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Target Timeline</label>
                  <select
                    value={newRequest.timeline}
                    onChange={(e) => setNewRequest({ ...newRequest, timeline: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Urgent (< 1 week)">Urgent (&lt; 1 week)</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="1+ month">1+ month</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Project Specifications & Integration Needs *</label>
                <textarea
                  rows="4"
                  required
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  placeholder="Describe your design specifications, required integrations (e.g. Supabase, Stripe, Auth), branding guidelines, or target deliverables..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Custom Project Brief</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: LIKED & SAVED */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Liked & Saved Templates</h2>
            {savedList.length === 0 ? (
              <p className="text-xs text-gray-400">You haven't liked or saved any templates yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedList.map((t) => (
                  <TemplateCard key={t.id} template={t} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ORDERS & RECEIPTS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Purchase Orders & Invoices</h2>
            {customerOrders.length === 0 ? (
              <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-10 text-center">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No verified purchase records found in database.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-navy-950 border-b border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-wider text-gray-400">
                      <th className="p-4">Order Reference</th>
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Items Purchased</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4">Total Paid</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {customerOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="p-4 font-mono font-bold text-purple-600">{ord.id}</td>
                        <td className="p-4 font-mono text-[11px] text-gray-600 dark:text-gray-300 truncate max-w-[150px]" title={ord.transactionId}>
                          {ord.transactionId || 'TXN-VERIFIED'}
                        </td>
                        <td className="p-4 text-gray-500">{ord.date}</td>
                        <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                          {ord.items?.map((i) => i.title).join(', ') || 'Template Package'}
                        </td>
                        <td className="p-4 text-gray-500">{ord.paymentMethod || 'Stripe Gateway'}</td>
                        <td className="p-4 font-extrabold text-gray-900 dark:text-white">{formatPrice(ord.total)}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck className="w-3 h-3" />
                            {ord.status || 'Completed'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {ord.items && ord.items.length > 0 && (
                            <button
                              onClick={() => {
                                const targetTemplate = templates.find((t) => t.id === ord.items[0].id) || ord.items[0];
                                downloadSourceCode(targetTemplate);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-bold text-[11px] hover:bg-purple-600 hover:text-white transition cursor-pointer"
                              title="Download verified source code archive"
                            >
                              Download ZIP
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    );
  };

  /* ==================== 3. ADMIN DASHBOARD ==================== */
  const renderAdminDashboard = () => {
    const adminStats = getAdminStats();

    return (
      <div className="space-y-8">
        
        {/* Dynamic Platform Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-2">
            <span className="text-[10px] font-black uppercase text-gray-400">Catalog Templates</span>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{adminStats.totalTemplates}</h3>
            <p className="text-[10px] font-bold text-purple-600">Dynamic items</p>
          </div>

          <div className="p-5 bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-2">
            <span className="text-[10px] font-black uppercase text-gray-400">Verified Developers</span>
            <h3 className="text-2xl font-black text-purple-600">{adminStats.totalDevelopers}</h3>
            <p className="text-[10px] font-bold text-purple-600">Registered authors</p>
          </div>

          <div className="p-5 bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-2">
            <span className="text-[10px] font-black uppercase text-gray-400">Total Purchases</span>
            <h3 className="text-2xl font-black text-emerald-600">{adminStats.totalPurchases}</h3>
            <p className="text-[10px] font-bold text-emerald-600">{adminStats.totalUnitsSold} units sold</p>
          </div>

          <div className="p-5 bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-2">
            <span className="text-[10px] font-black uppercase text-gray-400">Gross Platform Revenue</span>
            <h3 className="text-2xl font-black text-emerald-600">{formatPrice(adminStats.grossRevenue)}</h3>
            <p className="text-[10px] font-bold text-emerald-600">15% platform split: {formatPrice(adminStats.platformCommissionRevenue)}</p>
          </div>
        </div>

        {/* Secondary Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-gray-100 dark:bg-navy-800 text-center">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Client Reviews</span>
            <span className="font-extrabold text-gray-900 dark:text-white text-base">{adminStats.totalReviews}</span>
          </div>
          <div className="p-3 rounded-2xl bg-gray-100 dark:bg-navy-800 text-center">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Likes</span>
            <span className="font-extrabold text-rose-500 text-base">{adminStats.totalLikes}</span>
          </div>
          <div className="p-3 rounded-2xl bg-gray-100 dark:bg-navy-800 text-center">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Chat Conversations</span>
            <span className="font-extrabold text-blue-600 text-base">{adminStats.totalConversations}</span>
          </div>
          <div className="p-3 rounded-2xl bg-gray-100 dark:bg-navy-800 text-center">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Emails Dispatched</span>
            <span className="font-extrabold text-purple-600 text-base">{adminStats.totalEmailsSent}</span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 flex gap-6 text-sm overflow-x-auto scrollbar-none">
          <button 
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'overview' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Activity Feed & Logs
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('developers')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'developers' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            13 Verified Developers
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'templates' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Manage Templates ({templates.length})
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('email-config')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'email-config' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Payment Gateway & Email Config</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'transactions' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Transactions ({customerOrders.length})
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('database')}
            className={`pb-4 font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'database' 
                ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>PostgreSQL Database & Tables</span>
          </button>
        </div>

        {/* TAB 1: ACTIVITY LOG */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Real System Activity Logs</h3>
                <p className="text-xs text-gray-400">Live feed of template uploads, client orders, chat messages, and ratings</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Reset database to clean zero-state (0 sales, 0 ratings, 0 orders)?')) {
                    resetDatabase();
                    showNotification('Database reset to clean zero-state!', 'info');
                  }
                }}
                className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Database to Zero-State</span>
              </button>
            </div>

            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 shadow-sm max-h-96 overflow-y-auto space-y-2">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 dark:bg-navy-950 rounded-2xl flex items-center justify-between text-xs border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 font-bold">
                      <Activity className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{log.action}</div>
                      <div className="text-[11px] text-gray-500">{log.description}</div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-gray-400">
                    <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                    <div className="font-medium text-purple-600">{log.actor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: 13 DEVELOPERS DIRECTORY */}
        {activeTab === 'developers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">13 Verified Developers Directory</h3>
              <span className="text-xs text-gray-400">Password = Login ID</span>
            </div>

            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-navy-950 border-b border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    <th className="p-3">S. No.</th>
                    <th className="p-3">Developer Name</th>
                    <th className="p-3">Login ID</th>
                    <th className="p-3">Password</th>
                    <th className="p-3">Templates</th>
                    <th className="p-3">Sales</th>
                    <th className="p-3">Notification Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {DEVELOPERS.map((dev, idx) => {
                    const devTemplateCount = templates.filter(t => t.developerId === dev.id).length;
                    const devSalesCount = templates.filter(t => t.developerId === dev.id).reduce((sum, t) => sum + (t.sales || 0), 0);
                    return (
                      <tr key={dev.id}>
                        <td className="p-3 font-mono font-bold">{idx + 1}</td>
                        <td className="p-3 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <img src={dev.avatar} alt={dev.name} className="w-6 h-6 rounded-full object-cover" />
                          <span>{dev.name}</span>
                        </td>
                        <td className="p-3 font-mono text-purple-600 font-bold">{dev.loginId}</td>
                        <td className="p-3 font-mono text-gray-500">{dev.password}</td>
                        <td className="p-3 font-bold">{devTemplateCount} items</td>
                        <td className="p-3 font-bold text-emerald-600">{devSalesCount} sales</td>
                        <td className="p-3 font-mono text-gray-400">{dev.email || systemSettings.centralDeveloperEmail}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Marketplace Catalog Management</h3>
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-navy-950 border-b border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    <th className="p-3">Template Title</th>
                    <th className="p-3">Author</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Sales</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Likes</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {templates.map((t) => (
                    <tr key={t.id}>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">{t.title}</td>
                      <td className="p-3 text-purple-600 font-semibold">{t.developerName}</td>
                      <td className="p-3 text-gray-500">{t.categoryName}</td>
                      <td className="p-3 font-extrabold text-gray-900 dark:text-white">${t.price}</td>
                      <td className="p-3 font-bold text-emerald-600">{t.sales || 0}</td>
                      <td className="p-3 text-amber-500 font-bold">{t.rating ? `${t.rating} ★` : 'Unrated'}</td>
                      <td className="p-3 text-rose-500 font-bold">{t.likes || 0}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setEditingTemplate(t)}
                          className="px-2 py-1 bg-purple-50 text-purple-600 rounded font-bold hover:bg-purple-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(t.id, t.title)}
                          className="px-2 py-1 bg-rose-50 text-rose-600 rounded font-bold hover:bg-rose-100"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: DEVELOPER EMAIL & PAYMENT GATEWAY CONFIGURATION */}
        {activeTab === 'email-config' && (
          <div className="space-y-6">
            
            {/* Real Payment Gateway Configuration Box */}
            <div className="p-6 bg-white dark:bg-navy-900 border border-purple-200 dark:border-purple-800 rounded-3xl shadow-sm space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Real Payment Gateway Integration</h3>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    paymentModeInput === 'live' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' 
                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
                  }`}>
                    {paymentModeInput === 'live' ? 'Live Production Mode' : 'Sandbox Test Mode'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Test the complete payment flow using gateway test mode, then configure live mode with valid merchant credentials.
                </p>
              </div>

              <form onSubmit={handleSaveEmailConfig} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">
                      Gateway Operational Mode
                    </label>
                    <select
                      value={paymentModeInput}
                      onChange={(e) => setPaymentModeInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="test">Sandbox Test Mode (Stripe Test Cards & Decline Validation)</option>
                      <option value="live">Live Mode (Production Merchant Account)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">
                      Stripe Publishable Key
                    </label>
                    <input
                      type="text"
                      value={stripePubKeyInput}
                      onChange={(e) => setStripePubKeyInput(e.target.value)}
                      placeholder="Enter publishable key"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {paymentModeInput === 'live' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">
                      Stripe Merchant Secret Key (Live Server-Side Auth)
                    </label>
                    <input
                      type="password"
                      value={stripeSecretKeyInput}
                      onChange={(e) => setStripeSecretKeyInput(e.target.value)}
                      placeholder="Enter merchant secret key"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      In live mode, payments are authenticated directly against Stripe API endpoints before issuing order tokens.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">
                    Central Developer & Admin Notification Email
                  </label>
                  <input
                    type="email"
                    required
                    value={emailConfigInput}
                    onChange={(e) => setEmailConfigInput(e.target.value)}
                    placeholder="dev-notifications@fusionthemes.com"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition"
                >
                  Save Gateway & Email Settings
                </button>
              </form>
            </div>

            {/* Email Notification Dispatch Records */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Dispatched Email Notification Logs</h4>
                <span className="text-xs text-gray-400">{emailNotifications.length} alerts logged</span>
              </div>

              <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm max-h-96 overflow-y-auto">
                {emailNotifications.length === 0 ? (
                  <p className="p-8 text-center text-xs text-gray-400">No email notifications sent yet.</p>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-navy-950 border-b border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-wider text-gray-400">
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Recipient Email</th>
                        <th className="p-3">Client Sender</th>
                        <th className="p-3">Template Reference</th>
                        <th className="p-3">Subject / Preview</th>
                        <th className="p-3">Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {emailNotifications.map((notif) => (
                        <tr key={notif.id}>
                          <td className="p-3 text-gray-400">{new Date(notif.timestamp).toLocaleTimeString()}</td>
                          <td className="p-3 font-mono font-bold text-purple-600">{notif.toEmail}</td>
                          <td className="p-3 font-medium text-gray-900 dark:text-white">{notif.clientName}</td>
                          <td className="p-3 font-semibold text-gray-700 dark:text-gray-300">{notif.templateTitle}</td>
                          <td className="p-3 text-gray-500 max-w-xs truncate">{notif.subject}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200">
                              {notif.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Actual Platform Purchase Records</h3>
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
              {customerOrders.length === 0 ? (
                <p className="p-8 text-center text-xs text-gray-400">No transactions recorded yet.</p>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-navy-950 border-b border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-wider text-gray-400">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Transaction ID</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {customerOrders.map((o) => (
                      <tr key={o.id}>
                        <td className="p-3 font-mono font-bold text-purple-600">{o.id}</td>
                        <td className="p-3 font-mono text-[11px] text-gray-600 dark:text-gray-300 truncate max-w-[140px]" title={o.transactionId}>
                          {o.transactionId || 'TXN-VERIFIED'}
                        </td>
                        <td className="p-3 text-gray-500">{o.date}</td>
                        <td className="p-3 font-bold text-gray-900 dark:text-white">{o.customerName} ({o.customerEmail})</td>
                        <td className="p-3 text-gray-700 dark:text-gray-300">{o.items?.map((i) => i.title).join(', ')}</td>
                        <td className="p-3 text-gray-500">{o.paymentMethod || 'Stripe Verified'}</td>
                        <td className="p-3 font-black text-emerald-600">{formatPrice(o.total)}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                            <ShieldCheck className="w-3 h-3" />
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: POSTGRESQL DATABASE & TABLES */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            
            {/* Database Connection Status Card */}
            <div className="p-6 bg-white dark:bg-navy-900 border border-purple-200 dark:border-purple-800 rounded-3xl shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    dbStatus?.connected 
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' 
                      : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                  }`}>
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                      <span>PostgreSQL Database Connectivity</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        dbStatus?.connected 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' 
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {dbStatus?.mode || 'Local Relational Cache'}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {dbStatus?.message || 'Ready to connect live cloud PostgreSQL tables.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={refreshDbStatus}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-navy-800 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl transition cursor-pointer self-start sm:self-center"
                >
                  Ping Database
                </button>
              </div>

              {/* Supabase Connection Form */}
              <form onSubmit={handleConnectDatabase} className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">
                      Supabase Project URL
                    </label>
                    <input
                      type="url"
                      value={dbUrlInput}
                      onChange={(e) => setDbUrlInput(e.target.value)}
                      placeholder="https://your-project-id.supabase.co"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">
                      Supabase Anon / Public API Key
                    </label>
                    <input
                      type="password"
                      value={dbKeyInput}
                      onChange={(e) => setDbKeyInput(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isTestingDb}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isTestingDb ? 'Verifying Connection...' : 'Connect to Live PostgreSQL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopySqlSchema}
                    className="px-4 py-2.5 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs rounded-xl hover:bg-purple-100 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <FileCode className="w-4 h-4" />
                    <span>{copiedSql ? '✓ SQL Copied to Clipboard!' : 'Copy SQL Schema (All 10 Tables)'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Live Database Tables Overview Grid */}
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Database Tables & Relational Records</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-center space-y-1 shadow-xs">
                  <span className="text-[10px] font-black uppercase text-gray-400 block font-mono">templates</span>
                  <span className="text-xl font-black text-purple-600">{templates.length}</span>
                  <span className="text-[10px] text-gray-400 block">Catalog items</span>
                </div>

                <div className="p-4 bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-center space-y-1 shadow-xs">
                  <span className="text-[10px] font-black uppercase text-gray-400 block font-mono">users</span>
                  <span className="text-xl font-black text-blue-600">{DEVELOPERS.length + registeredClients.length + 1}</span>
                  <span className="text-[10px] text-gray-400 block">Authors & clients</span>
                </div>

                <div className="p-4 bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-center space-y-1 shadow-xs">
                  <span className="text-[10px] font-black uppercase text-gray-400 block font-mono">orders</span>
                  <span className="text-xl font-black text-emerald-600">{customerOrders.length}</span>
                  <span className="text-[10px] text-gray-400 block">Real purchases</span>
                </div>

                <div className="p-4 bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-center space-y-1 shadow-xs">
                  <span className="text-[10px] font-black uppercase text-gray-400 block font-mono">transactions</span>
                  <span className="text-xl font-black text-emerald-600">{customerOrders.filter((o) => o.transactionId).length}</span>
                  <span className="text-[10px] text-gray-400 block">Gateway tokens</span>
                </div>

                <div className="p-4 bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-center space-y-1 shadow-xs">
                  <span className="text-[10px] font-black uppercase text-gray-400 block font-mono">messages</span>
                  <span className="text-xl font-black text-indigo-600">{messages.length}</span>
                  <span className="text-[10px] text-gray-400 block">Client chats</span>
                </div>

                <div className="p-4 bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-center space-y-1 shadow-xs">
                  <span className="text-[10px] font-black uppercase text-gray-400 block font-mono">requests</span>
                  <span className="text-xl font-black text-amber-600">{clientRequests.length}</span>
                  <span className="text-[10px] text-gray-400 block">Project briefs</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step SQL Deployment Guide */}
            <div className="p-6 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-3xl space-y-3">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-600" />
                <span>How to Setup Your Database in 3 Steps</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 dark:text-gray-400">
                <div className="p-3 bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                  <span className="font-bold text-purple-600 block">1. Open Supabase / Neon</span>
                  <p>Create a free PostgreSQL database project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-purple-600 underline">supabase.com</a>.</p>
                </div>
                <div className="p-3 bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                  <span className="font-bold text-purple-600 block">2. Execute SQL Schema</span>
                  <p>Click <strong>SQL Editor</strong> in Supabase, paste the contents of <code>supabase_schema.sql</code>, and click <strong>Run</strong>.</p>
                </div>
                <div className="p-3 bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1">
                  <span className="font-bold text-purple-600 block">3. Connect & Sync</span>
                  <p>Copy your Project URL and Anon Key from <strong>Settings &gt; API</strong> and paste them into the form above.</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pb-20 transition-colors">
      {renderHeader()}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {role === 'developer' && renderDeveloperDashboard()}
        {role === 'client' && renderClientDashboard()}
        {role === 'admin' && renderAdminDashboard()}
      </div>

      {/* ==================== EDIT TEMPLATE MODAL ==================== */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Edit Template: {editingTemplate.title}</h3>
              <button onClick={() => setEditingTemplate(null)} className="p-1 rounded-lg text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingTemplate.title}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingTemplate.subtitle}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={editingTemplate.category}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={editingTemplate.price}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={editingTemplate.demoUrl}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, demoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Language</label>
                <input
                  type="text"
                  value={editingTemplate.language || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, language: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Framework</label>
                <input
                  type="text"
                  value={editingTemplate.framework || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, framework: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
