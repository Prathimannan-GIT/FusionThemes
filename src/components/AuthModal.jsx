import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Briefcase, 
  Code, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  Key
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTemplates } from '../context/TemplateContext';
import { DEVELOPERS, authenticateDeveloper } from '../data/developers';
import Logo from './Logo';

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, showNotification, loginUser } = useCart();
  const { registerClient } = useTemplates();
  
  // Tab type: 'developer' | 'client' | 'admin'
  const [activeTab, setActiveTab] = useState('developer');
  const [isClientSignUp, setIsClientSignUp] = useState(false);

  // Developer form state
  const [devLoginId, setDevLoginId] = useState('');
  const [devPassword, setDevPassword] = useState('');
  const [devError, setDevError] = useState('');

  // Client form state
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');

  // Admin form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isAuthModalOpen) return null;

  // Handle Developer Login
  const handleDeveloperLogin = (e) => {
    e.preventDefault();
    setDevError('');

    const developer = authenticateDeveloper(devLoginId, devPassword);
    if (!developer) {
      setDevError('Invalid developer credentials. Use your exact Login ID and matching password (e.g., empsf167it-tech / empsf167it-tech).');
      return;
    }

    loginUser({
      loginId: developer.loginId,
      developerId: developer.id,
      name: developer.name,
      email: developer.email,
      role: 'developer',
      avatar: developer.avatar,
      title: developer.title,
      specialties: developer.specialties
    });

    setIsAuthModalOpen(false);
    showNotification(`Welcome back, Developer ${developer.name}!`, 'success');
  };

  // Quick 1-Click Developer Login
  const handleQuickDevLogin = (dev) => {
    loginUser({
      loginId: dev.loginId,
      developerId: dev.id,
      name: dev.name,
      email: dev.email,
      role: 'developer',
      avatar: dev.avatar,
      title: dev.title,
      specialties: dev.specialties
    });

    setIsAuthModalOpen(false);
    showNotification(`Logged in as Developer ${dev.name} (${dev.loginId})`, 'success');
  };

  // Handle Client Sign In / Sign Up
  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (!clientEmail.trim()) return;

    if (isClientSignUp) {
      const newClient = registerClient({
        name: clientName.trim() || clientEmail.split('@')[0],
        email: clientEmail.trim(),
        company: clientCompany.trim()
      });
      loginUser({
        id: newClient.id,
        name: newClient.name,
        email: newClient.email,
        company: newClient.company,
        role: 'client'
      });
      showNotification(`Client account registered! Welcome ${newClient.name}`, 'success');
    } else {
      loginUser({
        id: `client-${clientEmail.split('@')[0]}`,
        name: clientName.trim() || clientEmail.split('@')[0],
        email: clientEmail.trim(),
        role: 'client'
      });
      showNotification(`Signed in as Client: ${clientEmail}`, 'success');
    }

    setIsAuthModalOpen(false);
  };

  // Handle Admin Login
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setAdminError('');

    if (adminEmail === 'admin@fusion.com' && adminPassword === 'admin123') {
      loginUser({
        name: 'Chief Admin',
        email: 'admin@fusion.com',
        role: 'admin'
      });
      setIsAuthModalOpen(false);
      showNotification('Signed in as Platform Administrator', 'success');
    } else {
      setAdminError('Invalid admin credentials. Use admin@fusion.com / admin123 or click the 1-Click button below.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5 space-y-1">
          <div className="flex justify-center mb-1">
            <Logo size="small" showSubtitle={false} />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            Marketplace Account Access
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sign in to access Developer Dashboard, Client Dashboard, or Admin Moderation
          </p>
        </div>

        {/* Tab Selection (Developer | Client | Admin) */}
        <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-navy-950 p-1.5 rounded-2xl mb-5 border border-gray-200/80 dark:border-gray-800">
          <button
            type="button"
            onClick={() => { setActiveTab('developer'); setDevError(''); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'developer'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Developer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('client')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'client'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Client</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setAdminError(''); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">

          {/* ==================== 1. DEVELOPER LOGIN FORM ==================== */}
          {activeTab === 'developer' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl text-xs text-purple-900 dark:text-purple-200">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Developer Portal Access:</span> Enter your assigned Login ID and matching password (e.g. <code>empsf167it-tech</code>).
                  </div>
                </div>
              </div>

              {devError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{devError}</span>
                </div>
              )}

              <form onSubmit={handleDeveloperLogin} className="space-y-3">
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={devLoginId}
                    onChange={(e) => setDevLoginId(e.target.value)}
                    placeholder="Developer Login ID (e.g. empsf167it-tech)"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={devPassword}
                    onChange={(e) => setDevPassword(e.target.value)}
                    placeholder="Password (same as Login ID)"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Code className="w-4 h-4" />
                  <span>Sign In as Developer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Verified Developer Directory (1-Click Test Access) */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    13 Verified Developers (1-Click Login)
                  </span>
                  <span className="text-[10px] text-purple-600 font-bold">Password = Login ID</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 bg-gray-50 dark:bg-navy-950 rounded-2xl border border-gray-200/80 dark:border-gray-800">
                  {DEVELOPERS.map((dev, idx) => (
                    <button
                      key={dev.id}
                      type="button"
                      onClick={() => handleQuickDevLogin(dev)}
                      className="p-2 rounded-xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-gray-800 hover:border-purple-400 text-left flex items-center gap-2 transition-all group cursor-pointer shadow-2xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-gray-900 dark:text-white truncate group-hover:text-purple-600">
                          {dev.name}
                        </div>
                        <div className="text-[9px] font-mono text-gray-400 truncate">
                          {dev.loginId}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 2. CLIENT LOGIN & REGISTER FORM ==================== */}
          {activeTab === 'client' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-1 bg-gray-100 dark:bg-navy-950 rounded-xl border border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsClientSignUp(false)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    !isClientSignUp ? 'bg-white dark:bg-navy-900 text-purple-600 shadow-xs' : 'text-gray-500'
                  }`}
                >
                  Client Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsClientSignUp(true)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    isClientSignUp ? 'bg-white dark:bg-navy-900 text-purple-600 shadow-xs' : 'text-gray-500'
                  }`}
                >
                  Register New Client
                </button>
              </div>

              <form onSubmit={handleClientSubmit} className="space-y-3">
                {isClientSignUp && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Client Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@company.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={clientPassword}
                      onChange={(e) => setClientPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {isClientSignUp && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Company / Studio (Optional)</label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        placeholder="e.g. Nexus Digital Agency"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>{isClientSignUp ? 'Create Client Account' : 'Sign In as Client'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Client Test Account */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                  1-Click Client Demo Login
                </p>
                <button
                  type="button"
                  onClick={() => {
                    loginUser({
                      id: 'client-sarah',
                      name: 'Sarah Client',
                      email: 'client@fusion.com',
                      company: 'Nexus Creative Studio',
                      role: 'client'
                    });
                    setIsAuthModalOpen(false);
                    showNotification('Logged in as Client: Sarah Client', 'success');
                  }}
                  className="w-full p-3 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/40 text-left hover:border-purple-400 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center">
                      SC
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">Sarah Client</div>
                      <div className="text-[10px] text-gray-400">client@fusion.com • Nexus Creative Studio</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded-full">
                    Demo Client
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ==================== 3. ADMIN PORTAL ==================== */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Platform Superadmin:</span> Full system access to templates, verified developers, clients, transaction logs, and email notification configurations.
                  </div>
                </div>
              </div>

              {adminError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <form onSubmit={handleAdminSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Admin Email (admin@fusion.com)"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Admin Password (admin123)"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Access Admin Control Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Admin Access */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                  1-Click Admin Demo Login
                </p>
                <button
                  type="button"
                  onClick={() => {
                    loginUser({
                      name: 'Chief Admin',
                      email: 'admin@fusion.com',
                      role: 'admin'
                    });
                    setIsAuthModalOpen(false);
                    showNotification('Logged in as Chief Admin', 'success');
                  }}
                  className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-navy-950 text-left hover:border-purple-500 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                      AD
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">Chief Admin</div>
                      <div className="text-[10px] text-gray-400">admin@fusion.com • Superadmin Access</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded-full">
                    1-Click Access
                  </span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AuthModal;
