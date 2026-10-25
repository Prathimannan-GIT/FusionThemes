import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'normal', showSubtitle = true, variant = 'auto' }) => {
  const isDark = variant === 'dark';
  const isLight = variant === 'light';

  const titleClass = isDark
    ? 'text-white'
    : isLight
    ? 'text-gray-900'
    : 'text-gray-950 dark:text-white';

  const subtitleClass = isDark
    ? 'text-gray-300'
    : isLight
    ? 'text-gray-500'
    : 'text-gray-500 dark:text-gray-400';

  return (
    <Link to="/" className="flex items-center gap-3 group focus:outline-none select-none">
      {/* Dynamic F Emblem matching screenshot */}
      <div className={`relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0 ${
        size === 'small' ? 'w-8 h-8' : size === 'large' ? 'w-12 h-12' : 'w-10 h-10'
      }`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="fGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
            <linearGradient id="fGradSub" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>

          {/* Top Bar of F */}
          <path d="M 20 10 L 85 10 C 85 10 60 38 60 38 L 46 38 L 46 48 L 75 48 C 75 48 55 72 55 72 L 46 72 L 46 90 L 20 90 Z" fill="url(#fGradMain)" />
          {/* Inner Accent geometry */}
          <path d="M 52 38 L 85 10 L 68 10 Z" fill="#9333EA" opacity="0.8" />
        </svg>
      </div>

      {/* Brand Text with high-contrast typography */}
      <div className="flex flex-col leading-none">
        <div className="flex flex-col">
          <span className={`font-black tracking-tight transition-colors duration-200 ${titleClass} ${
            size === 'small' ? 'text-lg' : size === 'large' ? 'text-2xl' : 'text-xl'
          }`}>
            FUSION
          </span>
          <span className={`font-extrabold tracking-[0.25em] text-purple-600 dark:text-purple-400 ${
            size === 'small' ? 'text-[11px]' : size === 'large' ? 'text-sm' : 'text-xs'
          }`}>
            THEMES
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-[9.5px] font-bold tracking-wider uppercase mt-0.5 transition-colors duration-200 ${subtitleClass}`}>
            Premium Website Templates
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
