import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  Check
} from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../context/CartContext';
import { useCurrency, currencies } from '../context/CurrencyContext';
import { categories } from '../data/categories';

const Navbar = () => {
  const { cartItems, setIsCartOpen, openAuth } = useCart();
  const { selectedCurrency, changeCurrency } = useCurrency();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemesHovered, setIsThemesHovered] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const currencyRef = useRef(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Close currency dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setIsCurrencyOpen(false);
        setCurrencySearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCurrencies = currencies.filter(c =>
    c.country.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.name.toLowerCase().includes(currencySearch.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          <Link
            to="/"
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              isActive('/')
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
            }`}
          >
            Home
          </Link>

          {/* Themes Mega Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsThemesHovered(true)}
            onMouseLeave={() => setIsThemesHovered(false)}
          >
            <button
              className={`px-3 py-2 text-sm font-semibold rounded-lg inline-flex items-center gap-1 transition-colors ${
                location.pathname.startsWith('/category') || location.pathname.startsWith('/templates')
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              Themes
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isThemesHovered ? 'rotate-180 text-purple-600' : ''}`} />
            </button>

            {isThemesHovered && (
              <div className="absolute top-full left-0 w-[540px] p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 grid grid-cols-2 gap-2 z-50">
                <div className="col-span-2 px-3 py-1 mb-1 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Browse 12 Categories</span>
                  <Link to="/templates" className="text-xs font-semibold text-purple-600 hover:underline">View All 1000+ →</Link>
                </div>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="p-2.5 rounded-xl hover:bg-purple-50 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={`p-1.5 rounded-lg text-xs font-bold ${cat.color}`}>
                        {cat.name.charAt(0)}
                      </span>
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-purple-600">{cat.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 px-2 py-0.5 rounded-full bg-gray-100">{cat.count}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/blog"
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              isActive('/blog')
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
            }`}
          >
            Blog
          </Link>
          <Link
            to="/help"
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              isActive('/help')
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
            }`}
          >
            Help
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* ===== COUNTRY / CURRENCY FLAG PICKER ===== */}
          <div className="relative" ref={currencyRef}>
            <button
              onClick={() => { setIsCurrencyOpen(!isCurrencyOpen); setCurrencySearch(''); }}
              className={`flex items-center gap-2 px-3 py-2.5 bg-gray-50 border rounded-xl transition-all duration-200 font-semibold group ${
                isCurrencyOpen
                  ? 'border-purple-400 bg-purple-50 text-purple-600 shadow-md shadow-purple-100'
                  : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50 text-gray-700 hover:text-purple-600'
              }`}
              title="Select Currency"
            >
              {/* Selected country FLAG — replaces globe icon */}
              <span className="flag-lg text-2xl leading-none select-none" style={{ fontFamily: 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' }}>
                {selectedCurrency.flag}
              </span>
              {/* Currency code only — no country abbreviation */}
              <span className="hidden sm:inline text-sm font-extrabold tracking-wide">{selectedCurrency.code}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180 text-purple-500' : 'text-gray-400'}`} />
            </button>

            {/* Currency Dropdown Panel */}
            {isCurrencyOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">

                {/* Header */}
                <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flag-xl text-2xl leading-none" style={{ fontFamily: 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' }}>
                      {selectedCurrency.flag}
                    </span>
                    <span className="text-sm font-extrabold text-gray-900">Select Currency</span>
                  </div>
                  {/* Search Input */}
                  <input
                    type="text"
                    value={currencySearch}
                    onChange={(e) => setCurrencySearch(e.target.value)}
                    placeholder="Search country or currency..."
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                    autoFocus
                  />
                </div>

                {/* Currency List */}
                <div className="overflow-y-auto max-h-72 py-2">
                  {filteredCurrencies.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6">No results found</p>
                  ) : (
                    filteredCurrencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          changeCurrency(currency.code);
                          setIsCurrencyOpen(false);
                          setCurrencySearch('');
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-purple-50 transition-colors group ${
                          selectedCurrency.code === currency.code ? 'bg-purple-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* FLAG EMOJI — large, no text abbreviation */}
                          <span
                            className="flag-xl text-2xl leading-none select-none flex-shrink-0"
                            style={{ fontFamily: 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' }}
                          >
                            {currency.flag}
                          </span>
                          <div className="text-left">
                            <div className="text-xs font-bold text-gray-900 group-hover:text-purple-700 leading-tight">{currency.country}</div>
                            <div className="text-[11px] text-gray-400">{currency.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg border ${
                            selectedCurrency.code === currency.code
                              ? 'text-purple-700 bg-purple-100 border-purple-200'
                              : 'text-purple-600 bg-purple-50 border-purple-100'
                          }`}>
                            {currency.symbol}&nbsp;{currency.code}
                          </span>
                          {selectedCurrency.code === currency.code && (
                            <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Footer note */}
                <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                  <p className="text-[11px] text-gray-400 text-center">
                    All prices converted from USD base rate
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* ===== END CURRENCY PICKER ===== */}

          {/* Cart Icon with Counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Login Button */}
          <button
            onClick={() => openAuth('login')}
            className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 hover:border-purple-300"
          >
            Login
          </button>

          {/* Sign Up Pill */}
          <button
            onClick={() => openAuth('signup')}
            className="px-5 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-full shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 active:scale-95"
          >
            Sign Up
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-purple-50">Home</Link>
          <div className="space-y-1 pl-3 border-l-2 border-purple-500">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</span>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {categories.slice(0, 8).map((cat) => (
                <Link key={cat.id} to={`/category/${cat.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="text-xs py-1.5 px-2 text-gray-600 hover:text-purple-600 font-medium">{cat.name}</Link>
              ))}
            </div>
          </div>

          <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-purple-50">Blog</Link>
          <Link to="/help" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg font-semibold text-gray-800 hover:bg-purple-50">Help & FAQ</Link>
          <button onClick={() => { setIsMobileMenuOpen(false); openAuth('login'); }} className="w-full py-2 text-center text-sm font-semibold border border-gray-300 rounded-xl">Login</button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
