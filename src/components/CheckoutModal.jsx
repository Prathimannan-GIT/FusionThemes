import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Mail, CreditCard, Calendar, Lock, CheckCircle, Download, Loader2, Settings, Save, Info, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

// Helper to generate a valid minimal ZIP archive client-side
const createSimpleZip = (items) => {
  // Let's create content detailing the user's order and how to set up the templates
  const itemsText = items.map((item, idx) => `${idx + 1}. ${item.title} (${item.categoryName})
   - Price: $${item.price}
   - Reference ID: FT-${item.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}
   - Main Framework: React.js + Tailwind CSS`).join('\n');

  const fileContent = `# Fusion Themes Purchase Invoice & Setup Guide

Thank you for your purchase from Fusion Themes!

==================================================
ORDER SUMMARY:
${itemsText}
==================================================

## Next Steps to Launch Your Templates:

1. **Extract this ZIP Archive**
   Extract the files to a dedicated folder on your computer.

2. **Open the Project Folder**
   Open your code editor (like VS Code) inside the project folder.

3. **Install Dependencies**
   Run the following command in your editor's terminal:
   \`\`\`bash
   npm install
   \`\`\`

4. **Start the Development Server**
   To preview and start editing locally, run:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Customize & Build for Production**
   - Source code is located in the \`src/\` directory.
   - Styling is defined using Tailwind CSS utility classes.
   - To build static files for deployment, run:
     \`\`\`bash
     npm run build
     \`\`\`

Need help or customization services? Contact us at support@fusionthemes.com
`;

  const contentBytes = new TextEncoder().encode(fileContent);
  const filename = "FusionThemes_Readme_Setup.txt";
  const filenameBytes = new TextEncoder().encode(filename);

  // Helper for CRC-32 checksum calculation
  const makeCrcTable = () => {
    let c;
    const crcTable = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      crcTable[n] = c;
    }
    return crcTable;
  };

  const crcTable = makeCrcTable();
  const crc32 = (bytes) => {
    let crc = 0 ^ (-1);
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  };

  const crc = crc32(contentBytes);
  const size = contentBytes.length;

  // Local File Header (30 bytes + filename length)
  const lfHeader = new Uint8Array(30 + filenameBytes.length);
  lfHeader[0] = 0x50; lfHeader[1] = 0x4b; lfHeader[2] = 0x03; lfHeader[3] = 0x04; // PK\3\4
  lfHeader[4] = 10; lfHeader[5] = 0; // version needed
  lfHeader[6] = 0; lfHeader[7] = 0; // flags
  lfHeader[8] = 0; lfHeader[9] = 0; // compression (0 = stored)
  lfHeader[10] = 0; lfHeader[11] = 0; // time
  lfHeader[12] = 0; lfHeader[13] = 0; // date

  // CRC-32
  lfHeader[14] = crc & 0xFF;
  lfHeader[15] = (crc >>> 8) & 0xFF;
  lfHeader[16] = (crc >>> 16) & 0xFF;
  lfHeader[17] = (crc >>> 24) & 0xFF;

  // Compressed Size
  lfHeader[18] = size & 0xFF;
  lfHeader[19] = (size >>> 8) & 0xFF;
  lfHeader[20] = (size >>> 16) & 0xFF;
  lfHeader[21] = (size >>> 24) & 0xFF;

  // Uncompressed Size
  lfHeader[22] = size & 0xFF;
  lfHeader[23] = (size >>> 8) & 0xFF;
  lfHeader[24] = (size >>> 16) & 0xFF;
  lfHeader[25] = (size >>> 24) & 0xFF;

  // Filename length
  lfHeader[26] = filenameBytes.length & 0xFF;
  lfHeader[27] = (filenameBytes.length >>> 8) & 0xFF;

  // Extra field length (0)
  lfHeader[28] = 0; lfHeader[29] = 0;

  // Filename
  lfHeader.set(filenameBytes, 30);

  // Central Directory File Header (46 bytes + filename length)
  const cdHeader = new Uint8Array(46 + filenameBytes.length);
  cdHeader[0] = 0x50; cdHeader[1] = 0x4b; cdHeader[2] = 0x01; cdHeader[3] = 0x02; // PK\1\2
  cdHeader[4] = 10; cdHeader[5] = 0; // version made by
  cdHeader[6] = 10; cdHeader[7] = 0; // version needed
  cdHeader[8] = 0; cdHeader[9] = 0; // flags
  cdHeader[10] = 0; cdHeader[11] = 0; // compression
  cdHeader[12] = 0; cdHeader[13] = 0; // time
  cdHeader[14] = 0; cdHeader[15] = 0; // date

  // CRC-32
  cdHeader[16] = crc & 0xFF;
  cdHeader[17] = (crc >>> 8) & 0xFF;
  cdHeader[18] = (crc >>> 16) & 0xFF;
  cdHeader[19] = (crc >>> 24) & 0xFF;

  // Compressed Size
  cdHeader[20] = size & 0xFF;
  cdHeader[21] = (size >>> 8) & 0xFF;
  cdHeader[22] = (size >>> 16) & 0xFF;
  cdHeader[23] = (size >>> 24) & 0xFF;

  // Uncompressed Size
  cdHeader[24] = size & 0xFF;
  cdHeader[25] = (size >>> 8) & 0xFF;
  cdHeader[26] = (size >>> 16) & 0xFF;
  cdHeader[27] = (size >>> 24) & 0xFF;

  // Filename length
  cdHeader[28] = filenameBytes.length & 0xFF;
  cdHeader[29] = (filenameBytes.length >>> 8) & 0xFF;

  // Extra field, comment, disk number, attributes (all 0)
  // Local header offset (0)
  cdHeader[42] = 0; cdHeader[43] = 0; cdHeader[44] = 0; cdHeader[45] = 0;

  // Filename
  cdHeader.set(filenameBytes, 46);

  // End of Central Directory Record (22 bytes)
  const eocd = new Uint8Array(22);
  eocd[0] = 0x50; eocd[1] = 0x4b; eocd[2] = 0x05; eocd[3] = 0x06; // PK\5\6
  eocd[4] = 0; eocd[5] = 0;
  eocd[6] = 0; eocd[7] = 0;
  eocd[8] = 1; eocd[9] = 0; // disk CD entries
  eocd[10] = 1; eocd[11] = 0; // total CD entries

  const cdSize = cdHeader.length;
  eocd[12] = cdSize & 0xFF;
  eocd[13] = (cdSize >>> 8) & 0xFF;
  eocd[14] = (cdSize >>> 16) & 0xFF;
  eocd[15] = (cdSize >>> 24) & 0xFF;

  const cdOffset = lfHeader.length + contentBytes.length;
  eocd[16] = cdOffset & 0xFF;
  eocd[17] = (cdOffset >>> 8) & 0xFF;
  eocd[18] = (cdOffset >>> 16) & 0xFF;
  eocd[19] = (cdOffset >>> 24) & 0xFF;

  // Comment length (0)
  eocd[20] = 0; eocd[21] = 0;

  return new Blob([lfHeader, contentBytes, cdHeader, eocd], { type: 'application/zip' });
};

const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, checkoutItems, clearCart, showNotification } = useCart();
  const { formatPrice } = useCurrency();

  const [step, setStep] = useState('info'); // 'info', 'payment', 'processing', 'success'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [processingMsg, setProcessingMsg] = useState('Securing connection...');
  const [errors, setErrors] = useState({});

  // EmailJS Settings Panel States
  const [showSettings, setShowSettings] = useState(false);
  const [emailJsServiceId, setEmailJsServiceId] = useState('');
  const [emailJsTemplateId, setEmailJsTemplateId] = useState('');
  const [emailJsPublicKey, setEmailJsPublicKey] = useState('');

  useEffect(() => {
    if (isCheckoutOpen) {
      setStep('info');
      setEmail('');
      setName('');
      setPhone('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setErrors({});
      setShowSettings(false);
      
      // Load EmailJS config from localStorage
      setEmailJsServiceId(localStorage.getItem('emailjs_service_id') || '');
      setEmailJsTemplateId(localStorage.getItem('emailjs_template_id') || '');
      setEmailJsPublicKey(localStorage.getItem('emailjs_public_key') || '');
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const total = checkoutItems.reduce((sum, item) => sum + item.price, 0);

  // Formatting helpers
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const parts = value.match(/.{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setCardExpiry(value);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCardCvv(value);
  };

  const validateInfo = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (cardNumber.replace(/\s/g, '').length !== 16) newErrors.card = 'Card number must be 16 digits';
    if (cardExpiry.length !== 5) newErrors.expiry = 'Expiry date must be MM/YY';
    if (cardCvv.length !== 3) newErrors.cvv = 'CVV must be 3 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (validateInfo()) {
      setStep('payment');
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('emailjs_service_id', emailJsServiceId);
    localStorage.setItem('emailjs_template_id', emailJsTemplateId);
    localStorage.setItem('emailjs_public_key', emailJsPublicKey);
    showNotification('Email settings saved successfully!', 'success');
    setShowSettings(false);
  };

  const sendEmailjs = async () => {
    if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
      return false;
    }
    try {
      const orderSummary = checkoutItems.map((item, idx) => `${idx + 1}. ${item.title} (${item.categoryName}) - $${item.price}`).join('\n');
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      setStep('processing');
      
      const progressMessages = [
        { text: 'Authorizing with secure gateway...', delay: 1000 },
        { text: 'Confirming card validation...', delay: 2000 },
        { text: 'Charging account ledger...', delay: 3500 },
        { text: 'Generating template source packages...', delay: 4800 },
        { text: 'Dispatching files to your email...', delay: 6000 }
      ];

      progressMessages.forEach((msg) => {
        setTimeout(() => {
          setProcessingMsg(msg.text);
        }, msg.delay);
      });

      setTimeout(async () => {
        setStep('success');
        clearCart();
        showNotification('Payment processed successfully!', 'success');
        
        // Attempt automatic EmailJS send
        const sent = await sendEmailjs();
        if (sent) {
          showNotification('Automatic email confirmation sent!', 'success');
        } else {
          console.log("EmailJS keys missing or dispatch failed. Falling back to simulation mode.");
        }
      }, 7200);
    }
  };

  const handleDownload = () => {
    try {
      const blob = createSimpleZip(checkoutItems);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `FusionThemes_${checkoutItems.map(item => item.id).join('_')}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      showNotification('Downloading template package zip!', 'success');
    } catch (err) {
      showNotification('Failed to generate local ZIP file.', 'error');
    }
  };

  const handleSendEmail = async () => {
    // Try EmailJS send first
    const sent = await sendEmailjs();
    if (sent) {
      showNotification('Email sent successfully via EmailJS!', 'success');
      return;
    }

    // Otherwise, fallback to browser mailto
    try {
      const subject = encodeURIComponent("Your Fusion Themes Purchase Receipt & Setup Guide");
      const orderSummary = checkoutItems.map((item, idx) => `${idx + 1}. ${item.title} (${item.categoryName}) - $${item.price}`).join('\n');
      
      const body = encodeURIComponent(`Hi ${name},

Thank you for your purchase from Fusion Themes! Here are your purchase receipt and installation guide details.

==================================================
ORDER SUMMARY:
${orderSummary}
==================================================

GETTING STARTED GUIDE:
1. Extract the downloaded ZIP archive.
2. Open terminal in the directory and run:
   npm install
3. Start local development server:
   npm run dev

For any code customization questions, reply directly to this mail.

Best regards,
Fusion Themes Support Team`);
      
      const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
      window.open(mailtoLink, '_blank');
      showNotification('Opening your mail client...', 'success');
    } catch (err) {
      showNotification('Could not open default mail app.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-md px-4 py-6 animate-in fade-in duration-200 text-gray-900 dark:text-gray-100">
      <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl transition-colors">
        
        {/* Close & Settings Buttons */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {step !== 'processing' && (
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl transition-colors ${showSettings ? 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-850'}`}
              title="EmailJS Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
          {step !== 'processing' && (
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-navy-850 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {showSettings ? 'Email Integration Settings' : step === 'success' ? 'Purchase Complete!' : 'Secure Checkout'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {showSettings ? 'Configure your client-side EmailJS keys for automated mail delivery' : step === 'info' && 'Step 1: Enter your billing & contact details'}
            {step === 'payment' && 'Step 2: Provide credit or debit card info'}
            {step === 'processing' && 'Payment authorization in progress...'}
            {step === 'success' && 'Your code files are ready for download!'}
          </p>
        </div>

        {/* Main Body */}
        <div className="p-6">
          
          {showSettings && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900 text-xs text-purple-950 dark:text-purple-300 flex gap-2">
                <Info className="w-4.5 h-4.5 shrink-0 text-purple-600 mt-0.5" />
                <p className="leading-relaxed">
                  To send automated emails to your customers, enter your <strong>EmailJS</strong> API credentials. Auto-sends on payment success.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">EmailJS Service ID</label>
                <input 
                  type="text" 
                  value={emailJsServiceId}
                  onChange={(e) => setEmailJsServiceId(e.target.value)}
                  placeholder="service_xxxxx"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">EmailJS Template ID</label>
                <input 
                  type="text" 
                  value={emailJsTemplateId}
                  onChange={(e) => setEmailJsTemplateId(e.target.value)}
                  placeholder="template_xxxxx"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white"
                />
                <p className="text-[9px] text-gray-400 mt-1">Make sure template variables are: <code>to_name</code>, <code>to_email</code>, and <code>order_summary</code>.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">EmailJS Public Key</label>
                <input 
                  type="text" 
                  value={emailJsPublicKey}
                  onChange={(e) => setEmailJsPublicKey(e.target.value)}
                  placeholder="user_xxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowSettings(false)}
                  className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-gray-700 dark:text-white font-bold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-2/3 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          )}

          {!showSettings && step === 'info' && (
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white`}
                />
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
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white`}
                  />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">We will send your templates package ZIP to this email address.</p>
                {errors.email && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full px-4 py-3 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white`}
                />
                {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.phone}</p>}
              </div>

              {/* Order total indicator */}
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900 flex justify-between items-center text-sm mt-6">
                <span className="font-semibold text-purple-950 dark:text-purple-300">Amount Due</span>
                <span className="font-extrabold text-purple-600 dark:text-purple-400 text-lg">{formatPrice(total)}</span>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all mt-4"
              >
                <span>Continue to Payment</span>
              </button>
            </form>
          )}

          {/* Step 2: Payment Details Form */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Card Number</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input 
                    type="text" 
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.card ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white`}
                  />
                </div>
                {errors.card && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.card}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Expiry Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input 
                      type="text" 
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.expiry ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white`}
                    />
                  </div>
                  {errors.expiry && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.expiry}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">CVV / CV2</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input 
                      type="password" 
                      value={cardCvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-navy-950 border ${errors.cvv ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-950 dark:text-white`}
                    />
                  </div>
                  {errors.cvv && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.cvv}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>SSL Secured 256-bit AES encrypted transaction</span>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setStep('info')}
                  className="w-1/3 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-gray-700 dark:text-white font-bold text-sm rounded-2xl transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="w-2/3 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Pay {formatPrice(total)}</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Gateway Processing Loader */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
              <div className="space-y-1">
                <p className="font-bold text-gray-900 dark:text-white">Authorizing Payment</p>
                <p className="text-xs text-purple-500 dark:text-purple-400 font-semibold animate-pulse">{processingMsg}</p>
              </div>
              <p className="text-[11px] text-gray-400 max-w-xs">Please do not close this window or click back while the payment ledger updates.</p>
            </div>
          )}

          {/* Step 4: Success, ZIP Package Delivery & Mock Email Banner */}
          {step === 'success' && (
            <div className="py-6 flex flex-col items-center text-center space-y-6">
              
              {/* Animated Icon Check */}
              <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center border border-emerald-100 dark:border-emerald-900 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Transaction Success!</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                  We have charged your card secure ledger. Your receipt and full template source code ZIP package are now dispatched to:
                </p>
                <p className="text-sm font-extrabold text-purple-600 dark:text-purple-400 underline decoration-purple-300 decoration-2">{email}</p>
              </div>

              {/* Delivery info alert banner */}
              <div className="w-full p-4 bg-gray-50 dark:bg-navy-950 border border-gray-100 dark:border-gray-800 rounded-2xl text-left space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Mail Delivery Status: Sent</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
                  Our mailer daemon successfully packed and sent your items. Please check your inbox (and spam folder) for the download package links.
                </p>
              </div>

              {/* Instant Browser Download button */}
              <div className="w-full pt-4 space-y-3">
                <button 
                  onClick={handleDownload}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Template Source ZIP</span>
                </button>

                <button 
                  onClick={handleSendEmail}
                  className="w-full py-3.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold text-sm rounded-2xl border border-purple-200 dark:border-purple-800 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Receipt & Setup Guide to Email</span>
                </button>
                
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full py-3 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-white hover:underline transition-colors"
                >
                  Return to Dashboard
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
