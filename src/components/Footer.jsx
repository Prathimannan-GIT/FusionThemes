import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Dribbble, Disc as Discord, Mail, Heart, Send } from 'lucide-react';
import Logo from './Logo';
import { categories } from '../data/categories';

const Footer = () => {
  return (
    <footer className="bg-[#070A12] text-gray-400 border-t border-gray-800/80 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800/80">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-5">
            <Logo size="large" />
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Fusion Themes is the premium website marketplace offering 1000+ handpicked website templates, UI Kits, and React components for developers & creators worldwide.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Subscribe for new template releases
              </span>
              <form onSubmit={(e) => e.preventDefault()} className="flex max-w-sm">
                <input 
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 text-xs bg-gray-900 border border-gray-800 rounded-l-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-r-xl text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Join</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link 
                    to={`/category/${cat.slug}`}
                    className="hover:text-purple-400 transition-colors"
                  >
                    {cat.name} ({cat.count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-purple-400 transition-colors">All 1000+ Templates</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-purple-400 transition-colors">Pricing Plans</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-purple-400 transition-colors">Help Center & FAQ</Link>
              </li>
              <li>
                <Link to="/category/saas" className="hover:text-purple-400 transition-colors">SaaS & React Apps</Link>
              </li>
            </ul>
          </div>

          {/* License & Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Licenses & Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="hover:text-purple-400 cursor-pointer">Regular License</span></li>
              <li><span className="hover:text-purple-400 cursor-pointer">Extended Commercial License</span></li>
              <li><span className="hover:text-purple-400 cursor-pointer">24/7 Author Support</span></li>
              <li><span className="hover:text-purple-400 cursor-pointer">Refund Policy</span></li>
              <li><span className="hover:text-purple-400 cursor-pointer">Privacy & Terms</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-1">
            <span>© {new Date().getFullYear()} Fusion Themes. All rights reserved. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>for web creators.</span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#" className="p-2 rounded-lg bg-gray-900 hover:bg-purple-600 hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-gray-900 hover:bg-purple-600 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-gray-900 hover:bg-purple-600 hover:text-white transition-colors">
              <Dribbble className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-gray-900 hover:bg-purple-600 hover:text-white transition-colors">
              <Discord className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
