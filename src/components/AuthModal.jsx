import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Github, Chrome, Briefcase, Code, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, showNotification, loginUser } = useCart();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer'); // 'customer', 'client', 'developer', 'admin'

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAuthModalOpen(false);
    
    // Log the user in with selected details
    loginUser({
      name: name || email.split('@')[0],
      email: email,
      role: role
    });

    showNotification(
      authMode === 'login' ? 'Successfully logged in!' : `Account created successfully! Welcome to Fusion Themes as a ${role}.`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="small" showSubtitle={false} />
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {authMode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {authMode === 'login' 
              ? 'Access your website templates, updates, and dashboard' 
              : 'Join 50,000+ creators & developers on Fusion Themes'}
          </p>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            type="button"
            onClick={() => { 
              setIsAuthModalOpen(false); 
              loginUser({ name: 'Google User', email: 'google@fusion.com', role: 'customer' });
              showNotification('Signed in with Google', 'success'); 
            }}
            className="py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-950 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Chrome className="w-4 h-4 text-rose-500" />
            Google
          </button>

          <button 
            type="button"
            onClick={() => { 
              setIsAuthModalOpen(false); 
              loginUser({ name: 'Github Developer', email: 'github@fusion.com', role: 'developer' });
              showNotification('Signed in with GitHub as Developer', 'success'); 
            }}
            className="py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-950 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Github className="w-4 h-4 text-gray-900 dark:text-white" />
            GitHub
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400 uppercase">Or continue with</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Role Card Selector on Sign Up */}
          {authMode === 'signup' && (
            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Select Your Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'customer', name: 'Customer', desc: 'Browse & buy themes', icon: User, color: 'border-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20' },
                  { id: 'client', name: 'Client', desc: 'Post design requests', icon: Briefcase, color: 'border-purple-500 text-purple-600 bg-purple-50/50 dark:bg-purple-950/20' },
                  { id: 'developer', name: 'Developer', desc: 'Sell website templates', icon: Code, color: 'border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20' },
                  { id: 'admin', name: 'Admin', desc: 'Moderate & manage', icon: ShieldCheck, color: 'border-rose-500 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20' }
                ].map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                        isSelected 
                          ? `${r.color} ring-2 ring-offset-2 ring-purple-500 dark:ring-offset-navy-900 border-transparent` 
                          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-navy-950 hover:border-purple-300 dark:hover:border-purple-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <Icon className={`w-4.5 h-4.5 ${isSelected ? '' : 'text-gray-400'}`} />
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{r.name}</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-400 leading-tight mt-0.5">{r.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Login for testing in Login Mode */}
        {authMode === 'login' && (
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-2">Quick Dev Login for Testing</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Customer Account', role: 'customer', email: 'customer@fusion.com', name: 'Alex Customer', hover: 'hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400' },
                { label: 'Client (Design Jobs)', role: 'client', email: 'client@fusion.com', name: 'Sarah Client', hover: 'hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400' },
                { label: 'Developer (Uploads)', role: 'developer', email: 'developer@fusion.com', name: 'Dave Developer', hover: 'hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400' },
                { label: 'Admin (Moderation)', role: 'admin', email: 'admin@fusion.com', name: 'Chief Admin', hover: 'hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400' }
              ].map((u) => (
                <button
                  key={u.role}
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    loginUser({ name: u.name, email: u.email, role: u.role });
                    showNotification(`Logged in as ${u.name} (${u.role})`, 'success');
                  }}
                  className={`py-2 px-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-navy-950 text-[10px] font-bold text-gray-500 dark:text-gray-400 text-left transition-all truncate flex items-center gap-1.5 ${u.hover}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  <span>{u.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toggle Mode Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthMode('signup')}
                className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Log in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
