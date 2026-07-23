import React from 'react';
import { ShieldCheck, Sliders, Users } from 'lucide-react';

const TrustBanner = () => {
  return (
    <section className="py-12 bg-white dark:bg-navy-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Soft Light Purple Tint Container matching screenshot */}
        <div className="bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="flex items-start space-x-4">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-900 border border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400 shadow-sm shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  Made with Quality
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  Every template is crafted with clean code and modern design.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start space-x-4">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-900 border border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400 shadow-sm shrink-0">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  Easy Customization
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  Fully responsive and easy to customize as per your need.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start space-x-4">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-900 border border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400 shadow-sm shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  Trusted by Thousands
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  Join thousands of developers and businesses using our templates.
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
