import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [livePreviewTemplate, setLivePreviewTemplate] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [bookmarks, setBookmarks] = useState([]);
  const [notification, setNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const loginUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem('fusion-user', JSON.stringify(user));
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('fusion-user');
  };

  useEffect(() => {
    localStorage.setItem('fusion-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const addToCart = (template) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === template.id);
      if (exists) {
        showNotification(`"${template.title}" is already in your cart`, 'info');
        return prev;
      }
      showNotification(`Added "${template.title}" to your cart!`, 'success');
      return [...prev, template];
    });
  };

  const removeFromCart = (templateId) => {
    setCartItems(prev => prev.filter(item => item.id !== templateId));
    showNotification('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleBookmark = (templateId) => {
    setBookmarks(prev => {
      if (prev.includes(templateId)) {
        showNotification('Removed from saved templates', 'info');
        return prev.filter(id => id !== templateId);
      } else {
        showNotification('Saved to your bookmarks!', 'success');
        return [...prev, templateId];
      }
    });
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      checkoutItems,
      setCheckoutItems,
      totalAmount,
      searchQuery,
      setSearchQuery,
      livePreviewTemplate,
      setLivePreviewTemplate,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authMode,
      setAuthMode,
      openAuth,
      bookmarks,
      toggleBookmark,
      notification,
      showNotification,
      currentUser,
      loginUser,
      logoutUser
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
