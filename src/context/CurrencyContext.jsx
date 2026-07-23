import React, { createContext, useContext, useState } from 'react';

export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', country: 'United States', rate: 1.0 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', country: 'India', rate: 83.5 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', country: 'Europe', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', country: 'United Kingdom', rate: 0.79 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', country: 'Australia', rate: 1.52 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', country: 'Canada', rate: 1.36 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', country: 'Japan', rate: 149.5 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', country: 'Singapore', rate: 1.34 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪', country: 'UAE', rate: 3.67 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', country: 'Brazil', rate: 4.97 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', country: 'China', rate: 7.24 },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', flag: '🇲🇽', country: 'Mexico', rate: 17.5 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', country: 'Switzerland', rate: 0.89 },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷', country: 'South Korea', rate: 1325 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦', country: 'South Africa', rate: 18.6 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾', country: 'Malaysia', rate: 4.72 },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩', country: 'Indonesia', rate: 15700 },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', flag: '🇵🇭', country: 'Philippines', rate: 56.4 },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿', country: 'New Zealand', rate: 1.63 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦', country: 'Saudi Arabia', rate: 3.75 },
];

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const saved = localStorage.getItem('fusion-currency');
    if (saved) {
      const found = currencies.find(c => c.code === saved);
      if (found) return found;
    }
    return currencies[0]; // Default: USD
  });

  const changeCurrency = (currencyCode) => {
    const found = currencies.find(c => c.code === currencyCode);
    if (found) {
      setSelectedCurrency(found);
      localStorage.setItem('fusion-currency', found.code);
    }
  };

  /**
   * Convert a USD base price to the selected currency
   * Formats the number with appropriate decimal places
   */
  const formatPrice = (usdPrice) => {
    const converted = usdPrice * selectedCurrency.rate;
    const { symbol, code } = selectedCurrency;

    // For currencies with large values (JPY, KRW, IDR), show no decimals
    const noDecimalCurrencies = ['JPY', 'KRW', 'IDR'];
    const decimals = noDecimalCurrencies.includes(code) ? 0 : 2;

    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return `${symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, changeCurrency, formatPrice, currencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
