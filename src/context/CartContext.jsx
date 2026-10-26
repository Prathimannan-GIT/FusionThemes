import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchServerDiskDb, saveServerDiskDb } from '../services/dbService';

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
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [notification, setNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Restore session, cart, bookmarks from server disk database if Chrome data was deleted
  useEffect(() => {
    let isMounted = true;
    const restoreDiskSession = async () => {
      try {
        const diskDb = await fetchServerDiskDb();
        if (isMounted && diskDb) {
          if (!currentUser && diskDb.lastActiveUser) {
            setCurrentUser(diskDb.lastActiveUser);
            try {
              localStorage.setItem('fusion-user', JSON.stringify(diskDb.lastActiveUser));
            } catch {}
          }
          if (cartItems.length === 0 && Array.isArray(diskDb.cartItems) && diskDb.cartItems.length > 0) {
            setCartItems(diskDb.cartItems);
          }
          if (bookmarks.length === 0 && Array.isArray(diskDb.bookmarks) && diskDb.bookmarks.length > 0) {
            setBookmarks(diskDb.bookmarks);
          }
        }
      } catch {}
    };
    restoreDiskSession();
    return () => { isMounted = false; };
  }, []);

  const loginUser = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('fusion-user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user:', e);
    }
    // Also persist session to server disk database
    saveServerDiskDb({ lastActiveUser: user }).catch(() => {});
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('fusion-user');
    } catch {}
    saveServerDiskDb({ lastActiveUser: null }).catch(() => {});
  };

  useEffect(() => {
    try {
      localStorage.setItem('fusion-cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
    // Save to disk database
    if (cartItems.length > 0) {
      saveServerDiskDb({ cartItems }).catch(() => {});
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('fusion-bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }, [bookmarks]);

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
