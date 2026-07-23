import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, showNotification } = useCart();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAuthModalOpen(false);
    showNotification(
      authMode === 'login' ? 'Successfully logged in!' : 'Account created successfully! Welcome to Fusion Themes.',
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
              ? 'Access your purchased website templates and downloads' 
              : 'Join 50,000+ creators & developers on Fusion Themes'}
          </p>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            type="button"
            onClick={() => { setIsAuthModalOpen(false); showNotification('Signed in with Google', 'success'); }}
            className="py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-950 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Chrome className="w-4 h-4 text-rose-500" />
            Google
          </button>

          <button 
            type="button"
            onClick={() => { setIsAuthModalOpen(false); showNotification('Signed in with GitHub', 'success'); }}
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

          <button
            type="submit"
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

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
