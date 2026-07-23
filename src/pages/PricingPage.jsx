import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { openAuth } = useCart();
  const { formatPrice, selectedCurrency } = useCurrency();

  // Base prices in USD
  const prices = {
    single: 19,
    proMonthly: 29,
    proYearly: 19,
    agencyMonthly: 69,
    agencyYearly: 49,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-600 font-bold text-xs">
            Unlimited Downloads Pass
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Simple, Transparent Pricing Plans
          </h1>
          <p className="text-base text-gray-500">
            Get unlimited access to over 1,000+ website templates, React kits, and premium support.
          </p>

          {/* Currency indicator badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 rounded-full shadow-sm">
            <span className="text-lg">{selectedCurrency.flag}</span>
            <span className="text-xs font-bold text-purple-700">
              Prices in {selectedCurrency.name} ({selectedCurrency.code})
            </span>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-3 pt-2">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-purple-600' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-12 h-6 bg-purple-600 rounded-full p-1 transition-colors"
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1 ${billingCycle === 'yearly' ? 'text-purple-600' : 'text-gray-400'}`}>
              Yearly <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">Save 35%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Single Template */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Single Template</h3>
              <p className="text-xs text-gray-400 mt-1">Pay per template as you need.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-gray-900">{formatPrice(prices.single)}</span>
                <span className="text-xs text-gray-400"> / template</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> 1 Website License</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Full Source Code & Assets</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> 6 Months Support</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Lifetime Updates</li>
              </ul>
            </div>
            <button onClick={() => openAuth('signup')} className="mt-8 w-full py-3 bg-gray-100 text-gray-900 font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors">
              Browse Catalog
            </button>
          </div>

          {/* Pro Unlimited — Featured */}
          <div className="bg-[#0f172a] border-2 border-purple-500 rounded-3xl p-8 shadow-2xl relative text-white flex flex-col justify-between transform md:-translate-y-4">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-600 text-white text-[11px] font-extrabold uppercase rounded-full shadow-md">
              Most Popular
            </span>
            <div>
              <h3 className="text-lg font-bold">Pro All-Access Pass</h3>
              <p className="text-xs text-purple-300 mt-1">Unlimited access to 1000+ templates.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">
                  {formatPrice(billingCycle === 'yearly' ? prices.proYearly : prices.proMonthly)}
                </span>
                <span className="text-xs text-purple-300"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-200">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> <strong>Unlimited</strong> Downloads</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Access to 1,000+ Templates & UI Kits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Commercial Usage Rights</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Priority 24/7 Support</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> New Weekly Releases</li>
              </ul>
            </div>
            <button onClick={() => openAuth('signup')} className="mt-8 w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/30 transition-all">
              Start Free Trial
            </button>
          </div>

          {/* Agency Plan */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Agency License</h3>
              <p className="text-xs text-gray-400 mt-1">For development teams & clients.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  {formatPrice(billingCycle === 'yearly' ? prices.agencyYearly : prices.agencyMonthly)}
                </span>
                <span className="text-xs text-gray-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Up to 10 Team Seats</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Unlimited Client Projects</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Figma & Source Files</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Dedicated Account Manager</li>
              </ul>
            </div>
            <button onClick={() => openAuth('signup')} className="mt-8 w-full py-3 bg-gray-100 text-gray-900 font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors">
              Get Agency Plan
            </button>
          </div>

        </div>

        {/* Currency note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          * All prices converted from USD base prices. Actual billing may vary based on payment processor rates.
        </p>

      </div>
    </div>
  );
};

export default PricingPage;
