import React from 'react';
import { Star, Quote, CheckCircle2, Heart, Sparkles } from 'lucide-react';

const reviews = [
  {
    name: 'Alex Rivera',
    role: 'Lead Frontend Architect',
    company: 'HyperScale Agency',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    stars: 5,
    text: 'Fusion Themes cut our web build time from 3 weeks to under 4 days. The clean React architecture and strict TypeScript types made client handover totally seamless.'
  },
  {
    name: 'Elena Rostova',
    role: 'Design Director & Founder',
    company: 'Studio Nova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    stars: 5,
    text: 'The visual aesthetic here is unmatched. It does not feel like typical marketplace bloat—the animations are 60fps smooth and the typography hierarchy is world-class.'
  },
  {
    name: 'Marcus Chen',
    role: 'Fullstack Indie Creator',
    company: 'LaunchBot AI',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    stars: 5,
    text: 'Bought Synapse AI and launched our MVP landing page in a weekend. Already converted over 1,400 beta signups. The dark mode glassmorphism looks insane.'
  }
];

const stats = [
  { value: '15,000+', label: 'Creators Worldwide' },
  { value: '1,000+', label: 'Curated Templates' },
  { value: '4.95 / 5', label: 'Average User Rating' },
  { value: '99.9%', label: 'Satisfaction Rate' }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-purple-50/20 to-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100/70 border border-purple-200 text-purple-800 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Community Love & Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Loved by Developers, Agencies & Creators
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Hear why thousands of engineering teams choose Fusion Themes to build and launch modern web apps.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-white border-2 border-purple-100/80 rounded-3xl p-6 sm:p-7 shadow-xl shadow-purple-500/5 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/15 hover:-translate-y-1.5 hover:border-purple-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-purple-200" />
                </div>

                {/* Review Text */}
                <p className="text-sm text-gray-700 leading-relaxed italic mb-6 font-medium">
                  "{rev.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-purple-100">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-purple-300 shrink-0 shadow-xs"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-950 flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </h4>
                  <p className="text-xs text-gray-600">
                    {rev.role} · <span className="font-semibold text-purple-700">{rev.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Impact Stats Counter Bar */}
        <div className="bg-gradient-to-r from-violet-100/80 via-purple-100/60 to-pink-100/80 border-2 border-purple-200/80 rounded-3xl p-6 sm:p-8 shadow-lg shadow-purple-500/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-purple-700 tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-800">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
