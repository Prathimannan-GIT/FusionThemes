import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const CtaBanner = () => {
  return (
    <section className="py-16 sm:py-20 bg-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glowing Vibrant Gradient Container */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 p-8 sm:p-12 lg:p-16 text-white shadow-2xl shadow-purple-500/25 border-2 border-purple-400/50">
          
          {/* Background Ambient Orbs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-pink-300/25 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Instant Download · Commercial License Included</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
              Ready to Launch Your Next Web Project?
            </h2>

            <p className="text-base sm:text-lg text-purple-200/90 max-w-xl mx-auto leading-relaxed">
              Skip weeks of tedious frontend setup. Download vetted, responsive, production-ready website templates and go live today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <Link
                to="/templates"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-gray-950 font-black text-sm flex items-center justify-center gap-2 shadow-2xl hover:bg-purple-50 hover:shadow-purple-400/20 transition-all duration-200 hover:scale-105 active:scale-95 group"
              >
                <span>Browse All 1,000+ Templates</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Unlimited All-Access Pass</span>
              </Link>
            </div>

            {/* Badges footer */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-purple-200/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Free Lifetime Updates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Instant Code Access</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CtaBanner;
