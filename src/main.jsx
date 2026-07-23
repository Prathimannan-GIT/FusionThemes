import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CurrencyProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </CurrencyProvider>
  </React.StrictMode>,
);
