import React from 'react';
import { ShieldCheck, Sliders, Users } from 'lucide-react';

const TrustBanner = () => {
  return (
    <section className="py-12 bg-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Soft Light Purple Tint Container with colorful accents */}
        <div className="bg-gradient-to-r from-violet-100/70 via-purple-50/70 to-pink-100/70 border-2 border-purple-200/80 rounded-3xl p-8 sm:p-10 shadow-lg shadow-purple-500/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="flex items-start space-x-4 p-2 rounded-2xl transition-transform duration-300 hover:-translate-y-1">
              <div className="p-3.5 rounded-2xl bg-white border border-purple-200 text-purple-700 shadow-xs shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-gray-950">
                  Made with Quality
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed font-medium">
                  Every template is crafted with clean code, validated structure, and modern design.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start space-x-4 p-2 rounded-2xl transition-transform duration-300 hover:-translate-y-1">
              <div className="p-3.5 rounded-2xl bg-white border border-blue-200 text-blue-700 shadow-xs shrink-0">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-gray-950">
                  Easy Customization
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed font-medium">
                  Fully responsive, modular components and easy to customize for your brand.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start space-x-4 p-2 rounded-2xl transition-transform duration-300 hover:-translate-y-1">
              <div className="p-3.5 rounded-2xl bg-white border border-pink-200 text-pink-700 shadow-xs shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-gray-950">
                  Trusted by Thousands
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed font-medium">
                  Join 15,000+ developers, agencies, and businesses building with our themes.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustBanner;
