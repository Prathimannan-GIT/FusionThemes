import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageSquare, BookOpen, Mail } from 'lucide-react';

const faqs = [
  {
    q: "How do I download my purchased templates?",
    a: "Once your order is complete, all template zip files are available instantly under your account Downloads dashboard."
  },
  {
    q: "What framework and technologies are used in Fusion Themes?",
    a: "Our templates are built using React.js (Vite), HTML5, Tailwind CSS, and vanilla JS with modern responsive standards."
  },
  {
    q: "Can I use these templates for commercial client projects?",
    a: "Yes! Regular licenses cover single commercial projects, while our Pro All-Access and Agency plans allow unlimited client sites."
  },
  {
    q: "Do you offer refunds if a template doesn't work?",
    a: "We offer a 30-day money-back guarantee if a template has technical issues that cannot be resolved by support."
  },
  {
    q: "How do updates work for themes?",
    a: "You get free lifetime updates for any template you purchase or download with your membership."
  }
];

const HelpPage = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Help Center & FAQ</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Everything you need to know about Fusion Themes and licensing.</p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-3"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full py-3 flex items-center justify-between text-left font-bold text-sm text-gray-900 dark:text-white hover:text-purple-600"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openIdx === idx ? 'rotate-180 text-purple-600' : 'text-gray-400'}`} />
              </button>
              {openIdx === idx && (
                <p className="text-xs text-gray-600 dark:text-gray-300 pb-3 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="bg-purple-600 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-bold">Still have questions?</h3>
            <p className="text-xs text-purple-200 mt-1">Our technical support team is available 24/7 to assist you.</p>
          </div>
          <a
            href="mailto:support@fusionthemes.com"
            className="px-6 py-3 bg-white text-purple-600 font-bold text-xs rounded-xl hover:bg-purple-50 transition-colors shrink-0"
          >
            Contact 24/7 Support
          </a>
        </div>

      </div>
    </div>
  );
};

export default HelpPage;
