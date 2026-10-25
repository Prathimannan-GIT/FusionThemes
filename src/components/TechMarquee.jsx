import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Code2, 
  ShieldCheck, 
  Flame, 
  Layers, 
  Cpu 
} from 'lucide-react';

const techBadges = [
  { name: 'React 18 & Vite', icon: Code2, color: 'text-cyan-500' },
  { name: 'Next.js 14 Ready', icon: Zap, color: 'text-indigo-400' },
  { name: 'Tailwind CSS v3', icon: Sparkles, color: 'text-teal-400' },
  { name: 'TypeScript Strict', icon: Cpu, color: 'text-blue-400' },
  { name: 'Figma UI Kits', icon: Layers, color: 'text-purple-400' },
  { name: '60 FPS Animations', icon: Flame, color: 'text-rose-400' },
  { name: '100% Responsive', icon: CheckCircle2, color: 'text-emerald-400' },
  { name: 'W3C Validated Code', icon: ShieldCheck, color: 'text-amber-400' }
];

const TechMarquee = () => {
  return (
    <div className="relative w-full py-4 sm:py-5 bg-gradient-to-r from-purple-100/60 via-pink-50/70 via-sky-50/70 to-indigo-100/60 border-b border-purple-100 overflow-hidden select-none">
      {/* Side blur masks for smooth fade in/out */}
      <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-purple-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-indigo-50 to-transparent z-10 pointer-events-none" />

      {/* Infinite Scrolling Ticker */}
      <div className="animate-marquee flex items-center gap-6 sm:gap-8 text-xs font-bold text-gray-800">
        {[...techBadges, ...techBadges, ...techBadges].map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index} 
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/90 border border-purple-100/80 hover:border-purple-300 hover:bg-white shadow-xs transition-all duration-200 shrink-0"
            >
              <Icon className={`w-4 h-4 ${item.color}`} />
              <span className="tracking-wide text-slate-800 font-extrabold">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechMarquee;
