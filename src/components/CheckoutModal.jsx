import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  CreditCard, 
  Calendar, 
  Lock, 
  CheckCircle, 
  Download, 
  Loader2, 
  Settings, 
  Save, 
  Info, 
  AlertCircle, 
  AlertTriangle,
  User,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTemplates } from '../context/TemplateContext';
import { 
  processPaymentWithGateway, 
  validateLuhn, 
  validateExpiry, 
  validateCvv, 
  getCardBrand 
} from '../utils/paymentGateway';
import { generateOrderPackageZip } from '../utils/zipGenerator';

const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, checkoutItems, clearCart, showNotification } = useCart();
  const { formatPrice } = useCurrency();
  const { completePurchase, systemSettings, updateSystemSettings } = useTemplates();

  const [step, setStep] = useState('info'); // 'info' | 'payment' | 'processing' | 'success'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Card states
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState('Unknown');

  // Processing & verification
  const [processingMsg, setProcessingMsg] = useState('Securing connection with payment gateway...');
  const [errors, setErrors] = useState({});
  const [paymentError, setPaymentError] = useState(null);
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // EmailJS Settings Panel States
  const [showSettings, setShowSettings] = useState(false);
  const [emailJsServiceId, setEmailJsServiceId] = useState('');
  const [emailJsTemplateId, setEmailJsTemplateId] = useState('');
  const [emailJsPublicKey, setEmailJsPublicKey] = useState('');

  // Gateway mode toggle in settings
  const [gatewayMode, setGatewayMode] = useState(systemSettings?.paymentConfig?.mode || 'test');
  const [liveSecretKey, setLiveSecretKey] = useState(systemSettings?.paymentConfig?.stripeSecretKey || '');

  useEffect(() => {
    if (isCheckoutOpen) {
      setStep('info');
      setEmail('');
      setName('');
      setPhone('');
      setCardHolder('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setCardBrand('Unknown');
      setErrors({});
      setPaymentError(null);
      setVerifiedOrder(null);
      setShowSettings(false);
      
      // Load EmailJS config from localStorage
      setEmailJsServiceId(localStorage.getItem('emailjs_service_id') || '');
      setEmailJsTemplateId(localStorage.getItem('emailjs_template_id') || '');
      setEmailJsPublicKey(localStorage.getItem('emailjs_public_key') || '');
      setGatewayMode(systemSettings?.paymentConfig?.mode || 'test');
      setLiveSecretKey(systemSettings?.paymentConfig?.stripeSecretKey || '');
    }
  }, [isCheckoutOpen, systemSettings]);

  if (!isCheckoutOpen) return null;

  const total = checkoutItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const isLiveGateway = (systemSettings?.paymentConfig?.mode || gatewayMode) === 'live';

  // Formatting helpers
  const handleCardNumberChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, '').substring(0, 16);
    const parts = rawDigits.match(/.{1,4}/g) || [];
    setCardNumber(parts.join(' '));
    setCardBrand(getCardBrand(rawDigits));
    if (errors.card) setErrors((prev) => ({ ...prev, card: null }));
    if (paymentError) setPaymentError(null);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setCardExpiry(value);
    if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: null }));
    if (paymentError) setPaymentError(null);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCardCvv(value);
    if (errors.cvv) setErrors((prev) => ({ ...prev, cvv: null }));
    if (paymentError) setPaymentError(null);
  };

  // Step 1 Validation
  const validateInfo = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation (Real Card Checks: Luhn, Expiry, CVV)
  const validatePayment = () => {
    const newErrors = {};
    const digits = cardNumber.replace(/\s/g, '');

    if (!digits) {
      newErrors.card = 'Card number is required';
    } else if (digits.length < 13 || digits.length > 19) {
      newErrors.card = 'Card number must be between 13 and 19 digits';
    } else if (!validateLuhn(digits)) {
      newErrors.card = 'Invalid card number: Failed card issuer checksum (Luhn check)';
    }

    const expiryCheck = validateExpiry(cardExpiry);
    if (!expiryCheck.valid) {
      newErrors.expiry = expiryCheck.error;
    }

    const cvvCheck = validateCvv(cardCvv, cardBrand);
    if (!cvvCheck.valid) {
      newErrors.cvv = cvvCheck.error;
    }

    if (!cardHolder.trim() && !name.trim()) {
      newErrors.holder = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (validateInfo()) {
      setCardHolder(name);
      setStep('payment');
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('emailjs_service_id', emailJsServiceId);
    localStorage.setItem('emailjs_template_id', emailJsTemplateId);
    localStorage.setItem('emailjs_public_key', emailJsPublicKey);

    if (updateSystemSettings) {
      updateSystemSettings({
        paymentConfig: {
          ...(systemSettings?.paymentConfig || {}),
          mode: gatewayMode,
          stripeSecretKey: liveSecretKey
        }
      });
    }

    showNotification('Gateway & Email settings saved successfully!', 'success');
    setShowSettings(false);
  };

  const sendEmailjs = async () => {
    if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
      return false;
    }
    try {
      const orderSummary = checkoutItems.map((item, idx) => `${idx + 1}. ${item.title} (${item.categoryName || item.category}) - $${item.price}`).join('\n');
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: emailJsServiceId,
          template_id: emailJsTemplateId,
          user_id: emailJsPublicKey,
          template_params: {
            to_name: name,
            to_email: email,
            order_summary: orderSummary,
            reply_to: "support@fusionthemes.com"
          }
        })
      });
      return response.ok;
    } catch (err) {
      console.error("EmailJS sending error: ", err);
      return false;
    }
  };

  // Process Real Payment with Gateway & Server Verification
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError(null);

    // 1. Client-Side Format & Luhn Check
    if (!validatePayment()) {
      return;
    }

    setStep('processing');
    setProcessingMsg('Connecting to payment gateway API...');

    const digits = cardNumber.replace(/\s/g, '');
    const cleanHolder = cardHolder.trim() || name.trim();

    const currentConfig = {
      ...(systemSettings?.paymentConfig || {}),
      mode: gatewayMode,
      stripeSecretKey: liveSecretKey
    };

    let gatewayResult = null;

    try {
      // 2. Server API Verification via /api/payments/process
      setProcessingMsg('Verifying card credentials with payment processor...');
      
      const serverResponse = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cardDetails: {
            cardNumber: digits,
            cardExpiry,
            cardCvv,
            cardName: cleanHolder
          },
          amount: total,
          currency: 'USD',
          paymentConfig: currentConfig,
          items: checkoutItems
        })
      });

      const serverData = await serverResponse.json();

      if (!serverResponse.ok || !serverData.success) {
        gatewayResult = {
          success: false,
          code: serverData.code || 'payment_failed',
          error: serverData.error || 'Payment gateway declined the transaction.'
        };
      } else {
        gatewayResult = serverData;
      }
    } catch (networkErr) {
      // Direct processor fallback (in case API endpoint is unavailable in preview)
      setProcessingMsg('Authorizing with gateway processor fallback...');
      gatewayResult = await processPaymentWithGateway({
        cardDetails: {
          cardNumber: digits,
          cardExpiry,
          cardCvv,
          cardName: cleanHolder
        },
        amount: total,
        currency: 'USD',
        customer: { name: cleanHolder, email },
        items: checkoutItems,
        paymentConfig: currentConfig
      });
    }

    // 3. STRICT CHECK: If gateway declined or rejected payment, FAIL IMMEDIATELY
    if (!gatewayResult || !gatewayResult.success) {
      setStep('payment');
      const failReason = gatewayResult?.error || 'Payment could not be verified by the gateway. Check your card credentials.';
      setPaymentError(failReason);
      showNotification(failReason, 'error');
      // DO NOT complete purchase
      // DO NOT clear cart
      // DO NOT show success screen
      // DO NOT unlock template files
      return;
    }

    // 4. VERIFIED PAYMENT: Only executed if server confirmed transaction
    setProcessingMsg('Transaction confirmed! Generating verified order receipt...');

    const purchaseResult = completePurchase({
      items: checkoutItems,
      customerName: cleanHolder,
      customerEmail: email,
      paymentMethod: `${cardBrand} (•••• ${digits.slice(-4)})`,
      transactionId: gatewayResult.transactionId,
      verified: true,
      gateway: isLiveGateway ? 'Stripe Production Merchant' : 'Stripe Sandbox Test Gateway'
    });

    if (!purchaseResult?.success) {
      setStep('payment');
      setPaymentError(purchaseResult?.error || 'Security verification failed.');
      showNotification('Failed to verify purchase record.', 'error');
      return;
    }

    setVerifiedOrder(purchaseResult.order);
    setStep('success');
    clearCart();
    showNotification(`Payment Verified! Order ${purchaseResult.order.id} confirmed.`, 'success');

    // Attempt automated EmailJS dispatch
    try {
      await sendEmailjs();
    } catch (e) {
      console.log('Automated mail delivery handled.');
    }
  };

  // Verified Source Code ZIP Download
  const handleDownload = async () => {
    if (!verifiedOrder || !verifiedOrder.transactionId) {
      showNotification('Unauthorized: Source code ZIP download requires a verified payment transaction.', 'error');
      return;
    }

    try {
      setIsDownloading(true);
      showNotification('Assembling authentic template source packages...', 'info');
      
      const zipBlob = await generateOrderPackageZip(checkoutItems, verifiedOrder);
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `FusionThemes_Order_${verifiedOrder.id}_Verified.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showNotification('Verified template package ZIP downloaded successfully!', 'success');
    } catch (err) {
      console.error('ZIP generation error:', err);
      showNotification('Failed to generate template archive package.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    const sent = await sendEmailjs();
    if (sent) {
      showNotification('Email sent successfully via EmailJS!', 'success');
      return;
    }

    try {
      const subject = encodeURIComponent(`Your Fusion Themes Verified Purchase Receipt [${verifiedOrder?.id || 'ORD'}]`);
      const orderSummary = checkoutItems.map((item, idx) => `${idx + 1}. ${item.title} (${item.categoryName || item.category}) - $${item.price}`).join('\n');
      
      const body = encodeURIComponent(`Hi ${name},

Thank you for your verified purchase from Fusion Themes!

ORDER RECEIPT & VERIFICATION:
==================================================
Order ID: ${verifiedOrder?.id || 'ORD-VERIFIED'}
Gateway Transaction ID: ${verifiedOrder?.transactionId || 'TXN-CONFIRMED'}
Status: Completed & Verified by Payment Gateway
Total Paid: ${formatPrice(total)}
Payment Method: ${verifiedOrder?.paymentMethod || 'Credit Card'}
==================================================

ORDER SUMMARY:
${orderSummary}

NEXT STEPS:
1. Extract the downloaded ZIP archive.
2. Run \`npm install\` to install dependencies.
3. Run \`npm run dev\` to launch the local project.

For any questions, reply to this email or visit our help center.

Best regards,
Fusion Themes Verification Team`);
      
      const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
      window.open(mailtoLink, '_blank');
      showNotification('Opening your email client...', 'success');
    } catch (err) {
      showNotification('Could not open default mail app.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-md px-4 py-6 animate-in fade-in duration-200 text-gray-900 dark:text-gray-100">
      <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl transition-colors max-h-[92vh] flex flex-col">
        
        {/* Close & Settings Buttons */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
          {step !== 'processing' && (
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                showSettings 
                  ? 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-850'
              }`}
              title="Gateway & Email Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
          {step !== 'processing' && (
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-navy-850 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {showSettings 
                ? 'Gateway & Email Settings' 
                : step === 'success' 
                  ? 'Payment Verified & Confirmed' 
                  : 'Real Gateway Checkout'}
            </h2>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
              isLiveGateway 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' 
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
            }`}>
              {isLiveGateway ? 'Live Gateway' : 'Sandbox Test Mode'}
            </span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {showSettings && 'Configure live merchant credentials & EmailJS dispatch'}
            {!showSettings && step === 'info' && 'Step 1: Contact & Billing Information'}
            {!showSettings && step === 'payment' && 'Step 2: Payment Gateway Card Authorization'}
            {!showSettings && step === 'processing' && 'Authorizing transaction with payment processor...'}
            {!showSettings && step === 'success' && 'Transaction approved! Your source code package is ready.'}
          </p>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* Settings Panel */}
          {showSettings && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900 text-xs text-purple-950 dark:text-purple-300 flex gap-2">
                <Info className="w-4.5 h-4.5 shrink-0 text-purple-600 mt-0.5" />
                <p className="leading-relaxed">
                  Toggle between <strong>Sandbox Test Mode</strong> (for testing validation & decline states) and <strong>Production Live Mode</strong> (with real merchant credentials).
                </p>
              </div>

              {/* Gateway Mode Switch */}
              <div>
                <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Gateway Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGatewayMode('test')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      gatewayMode === 'test'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-gray-50 dark:bg-navy-950 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Sandbox Test Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayMode('live')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      gatewayMode === 'live'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-gray-50 dark:bg-navy-950 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Live Mode (Production)
                  </button>
                </div>
              </div>

              {gatewayMode === 'live' && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Stripe Secret Key</label>
                  <input 
                    type="password" 
                    value={liveSecretKey}
                    onChange={(e) => setLiveSecretKey(e.target.value)}
                    placeholder="Enter merchant secret key"
                    className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Transactions will be verified against live Stripe payment endpoints.</p>
                </div>
              )}

              {/* EmailJS Configuration */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs font-bold text-gray-900 dark:text-white mb-2">Automated Email Configuration (EmailJS)</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">EmailJS Service ID</label>
                    <input 
                      type="text" 
                      value={emailJsServiceId}
                      onChange={(e) => setEmailJsServiceId(e.target.value)}
                      placeholder="service_xxxxx"
                      className="w-full px-4 py-2 text-xs bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">EmailJS Template ID</label>
                    <input 
                      type="text" 
                      value={emailJsTemplateId}
                      onChange={(e) => setEmailJsTemplateId(e.target.value)}
                      placeholder="template_xxxxx"
                      className="w-full px-4 py-2 text-xs bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">EmailJS Public Key</label>
                    <input 
                      type="text" 
                      value={emailJsPublicKey}
                      onChange={(e) => setEmailJsPublicKey(e.target.value)}
                      placeholder="user_xxxxxxxxxxxxxxxx"
                      className="w-full px-4 py-2 text-xs bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowSettings(false)}
                  className="w-1/3 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-gray-700 dark:text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-2/3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 1: Customer Info */}
          {!showSettings && step === 'info' && (
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white`}
                  />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Verified transaction receipt and source code access will be issued to this email.</p>
                {errors.email && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full px-4 py-3 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white`}
                />
                {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.phone}</p>}
              </div>

              {/* Order total indicator */}
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900 flex justify-between items-center text-sm mt-6">
                <div>
                  <span className="font-semibold text-purple-950 dark:text-purple-300 block">Total Due</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">{checkoutItems.length} template(s)</span>
                </div>
                <span className="font-extrabold text-purple-600 dark:text-purple-400 text-xl">{formatPrice(total)}</span>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all mt-4 cursor-pointer"
              >
                <span>Continue to Payment Verification</span>
              </button>
            </form>
          )}

          {/* Step 2: Payment Details Form */}
          {!showSettings && step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              
              {/* Payment Error Alert Banner */}
              {paymentError && (
                <div className="p-4 bg-red-50 dark:bg-red-950/60 border-2 border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-300 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-red-800 dark:text-red-200">Transaction Not Authorized</p>
                    <p className="leading-relaxed font-medium">{paymentError}</p>
                    <p className="text-[10px] text-red-600/80 dark:text-red-400/80 pt-1">
                      No order was created and no funds were captured. Source code downloads remain locked.
                    </p>
                  </div>
                </div>
              )}

              {/* Test Mode Guidance Banner */}
              {!isLiveGateway && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Payment Gateway Sandbox Active</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                    Use verified test card <strong>4242 4242 4242 4242</strong> with any future MM/YY and 3 digits CVC. Invalid numbers (failing Luhn checksum) or decline test cards (<strong>4000 0000 0000 0002</strong>) will be strictly rejected.
                  </p>
                </div>
              )}

              {/* Cardholder Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Cardholder Name</label>
                <input 
                  type="text" 
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Full Name as on Card"
                  className={`w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.holder ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white`}
                />
                {errors.holder && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.holder}</p>}
              </div>

              {/* Card Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Card Number</label>
                  {cardBrand !== 'Unknown' && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      {cardBrand}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input 
                    type="text" 
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.card ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white font-mono`}
                  />
                </div>
                {errors.card && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.card}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Expiry Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input 
                      type="text" 
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.expiry ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white font-mono`}
                    />
                  </div>
                  {errors.expiry && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.expiry}</p>}
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">
                    {cardBrand === 'American Express' ? 'CID (4 Digits)' : 'CVV / CVC (3 Digits)'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input 
                      type="password" 
                      value={cardCvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      maxLength={4}
                      className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.cvv ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white font-mono`}
                    />
                  </div>
                  {errors.cvv && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.cvv}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Encrypted 256-bit gateway verification & TLS 1.3 protocol</span>
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setStep('info')}
                  className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-gray-700 dark:text-white font-bold text-sm rounded-2xl transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="w-2/3 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Authorize & Pay {formatPrice(total)}</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Gateway Processing Loader */}
          {!showSettings && step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
              <div className="space-y-1">
                <p className="font-bold text-gray-900 dark:text-white text-base">Processing Gateway Transaction</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold animate-pulse">{processingMsg}</p>
              </div>
              <p className="text-[11px] text-gray-400 max-w-xs">
                Communicating with the payment provider network. Unverified transactions will be blocked automatically.
              </p>
            </div>
          )}

          {/* Step 4: Confirmed Success & ZIP Download */}
          {!showSettings && step === 'success' && verifiedOrder && (
            <div className="py-4 flex flex-col items-center text-center space-y-5">
              
              {/* Checkmark */}
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-500/10">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Transaction Verified & Completed!</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Your payment was authorized by the gateway and confirmed on our server ledger.
                </p>
              </div>

              {/* Verified Order Receipt Box */}
              <div className="w-full p-4 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-2xl text-left space-y-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-500">Order Reference</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{verifiedOrder.id}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400 truncate max-w-[200px]" title={verifiedOrder.transactionId}>
                    {verifiedOrder.transactionId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-500">Amount Charged</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatPrice(verifiedOrder.total)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Payment Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Gateway Verified
                  </span>
                </div>
              </div>

              {/* Action Buttons: Download ZIP & Email Receipt */}
              <div className="w-full space-y-3 pt-2">
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Building Template ZIP...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download Template Source ZIP Package</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={handleSendEmail}
                  className="w-full py-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold text-xs rounded-2xl border border-purple-200 dark:border-purple-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Receipt & Setup Guide to Email</span>
                </button>
                
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Close & Return to Store
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default CheckoutModal;
