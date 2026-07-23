import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'normal', showSubtitle = true }) => {
  return (
    <Link to="/" className="flex items-center gap-3 group focus:outline-none">
      {/* Dynamic F Emblem matching screenshot */}
      <div className={`relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
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

      {/* Brand Text matching screenshot typography */}
      <div className="flex flex-col leading-none select-none">
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-gray-900 dark:text-white ${
            size === 'small' ? 'text-lg' : size === 'large' ? 'text-2xl' : 'text-xl'
          }`}>
            FUSION
          </span>
          <span className={`font-bold tracking-[0.25em] text-purple-600 dark:text-purple-400 ${
            size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-xs'
          }`}>
            THEMES
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[9px] font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase mt-0.5">
            Premium Website Templates
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
