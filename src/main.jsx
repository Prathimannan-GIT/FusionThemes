import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { TemplateProvider } from './context/TemplateContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CurrencyProvider>
      <TemplateProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </TemplateProvider>
    </CurrencyProvider>
  </React.StrictMode>,
);
