import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import TemplateDetail from './pages/TemplateDetail';
import AllTemplatesPage from './pages/AllTemplatesPage';
import PricingPage from './pages/PricingPage';
import HelpPage from './pages/HelpPage';
import LivePreviewModal from './components/LivePreviewModal';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import NotificationToast from './components/NotificationToast';

// Scroll to top on route change
function ScrollRestoration() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollRestoration />
      <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#070a12] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
        <Navbar />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/template/:id" element={<TemplateDetail />} />
            <Route path="/templates" element={<AllTemplatesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </div>

        <Footer />

        {/* Global Drawers & Modals */}
        <LivePreviewModal />
        <CartDrawer />
        <AuthModal />
        <NotificationToast />
      </div>
    </Router>
  );
}

export default App;
