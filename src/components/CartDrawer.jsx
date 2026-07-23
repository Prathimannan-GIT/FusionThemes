import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, clearCart, totalAmount, showNotification } = useCart();
  const { formatPrice, selectedCurrency } = useCurrency();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'FUSION20') {
      setDiscount(0.2);
      showNotification('20% Discount applied!', 'success');
    } else {
      showNotification('Invalid promo code. Try "FUSION20"', 'error');
    }
  };

  const finalTotal = totalAmount * (1 - discount);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      clearCart();
      setIsCartOpen(false);
      showNotification('Order completed successfully! Downloads available in account.', 'success');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">

        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-gray-100">

          {/* Cart Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Your Cart ({cartItems.length})</h2>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Currency indicator */}
          <div className="px-6 py-2.5 bg-purple-50 border-b border-purple-100 flex items-center gap-2">
            <span className="text-lg">{selectedCurrency.flag}</span>
            <span className="text-xs font-semibold text-purple-700">
              Prices shown in {selectedCurrency.name} ({selectedCurrency.code})
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-gray-700">Your cart is empty</p>
                <p className="text-xs text-gray-400">Explore 1000+ templates and add your favorites!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-3">
                  <img src={item.image} alt={item.title} className="w-16 h-12 object-cover rounded-lg border border-gray-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                    <span className="text-[11px] text-gray-400 block">{item.categoryName}</span>
                    <span className="text-xs font-extrabold text-purple-600">{formatPrice(item.price)}</span>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code (FUSION20)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button type="submit" className="px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors">
                  Apply
                </button>
              </form>

              {/* Pricing Breakdown — all in selected currency */}
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">{formatPrice(totalAmount)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount (20%)</span>
                    <span>-{formatPrice(totalAmount * discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-purple-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <span>Checkout ({formatPrice(finalTotal)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>30-Day Money Back Guarantee</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default CartDrawer;
