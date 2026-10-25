import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Dribbble, Disc as Discord, Mail, Heart, Send } from 'lucide-react';
import Logo from './Logo';
import { useTemplates } from '../context/TemplateContext';

const Footer = () => {
  const { categories } = useTemplates();
  return (
    <footer className="w-full bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-sm text-gray-600 pt-16 pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-100">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-5">
            <Logo size="large" />
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              Fusion Themes is the premium website marketplace offering 1000+ handpicked website templates, UI Kits, and React components for developers & creators worldwide.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-300">
                Subscribe for new template releases
              </span>
              <form onSubmit={(e) => e.preventDefault()} className="flex max-w-sm">
                <input 
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-l-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-r-xl text-xs font-bold flex items-center gap-1 transition-colors shrink-0 shadow-sm hover:shadow-md"
                >
                  <span>Join</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link 
                    to={`/category/${cat.slug}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                  >
                    {cat.name} ({cat.count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">Home</Link>
              </li>
              <li>
                <Link to="/templates" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">All Templates</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">Creator Dashboard</Link>
              </li>
              <li>
                <Link to="/plugins" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">Plugins & Extensions</Link>
              </li>
              <li>
                <Link to="/ui-kits" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">UI Kits & Systems</Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">Help Center & FAQ</Link>
              </li>
            </ul>
          </div>

          {/* License & Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Licenses & Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors font-medium">Regular License</span></li>
              <li><span className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors font-medium">Extended Commercial</span></li>
              <li><span className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors font-medium">24/7 Author Support</span></li>
              <li><span className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors font-medium">Refund Policy</span></li>
              <li><span className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors font-medium">Privacy & Terms</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <span>© {new Date().getFullYear()} Fusion Themes. All rights reserved. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>for web creators.</span>
          </div>

          <div className="flex items-center space-x-3">
            <a href="#" className="p-2.5 rounded-xl bg-gray-100 hover:bg-purple-600 hover:text-white text-gray-600 dark:bg-navy-900 dark:text-gray-400 dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-200">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 rounded-xl bg-gray-100 hover:bg-purple-600 hover:text-white text-gray-600 dark:bg-navy-900 dark:text-gray-400 dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-200">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 rounded-xl bg-gray-100 hover:bg-purple-600 hover:text-white text-gray-600 dark:bg-navy-900 dark:text-gray-400 dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-200">
              <Dribbble className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 rounded-xl bg-gray-100 hover:bg-purple-600 hover:text-white text-gray-600 dark:bg-navy-900 dark:text-gray-400 dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-200">
              <Discord className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
