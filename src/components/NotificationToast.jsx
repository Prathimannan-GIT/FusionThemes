import React from 'react';
import { CheckCircle, Info, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NotificationToast = () => {
  const { notification } = useCart();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-purple-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-navy-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-800 flex items-center gap-3 max-w-md">
        {icons[notification.type] || icons.info}
        <span className="text-xs font-semibold">{notification.message}</span>
      </div>
    </div>
  );
};

export default NotificationToast;
