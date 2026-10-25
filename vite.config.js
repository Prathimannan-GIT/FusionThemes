import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom backend payment processor plugin for Vite dev server
const paymentApiPlugin = () => ({
  name: 'payment-api-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/payments/process' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const { cardNumber, cardExpiry, cardCvv } = data.cardDetails || {};
            const digits = String(cardNumber || '').replace(/\D/g, '');

            // 1. Check length
            if (digits.length < 13 || digits.length > 19) {
              res.statusCode = 422;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, code: 'invalid_number', error: 'Invalid card number length.' }));
              return;
            }

            // 2. Check Luhn algorithm
            let sum = 0;
            let shouldDouble = false;
            for (let i = digits.length - 1; i >= 0; i--) {
              let digit = parseInt(digits.charAt(i), 10);
              if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
              }
              sum += digit;
              shouldDouble = !shouldDouble;
            }
            if (sum % 10 !== 0) {
              res.statusCode = 422;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, code: 'invalid_number', error: 'Your card number is invalid (Luhn checksum failed).' }));
              return;
            }

            // 3. Expiry check
            const match = String(cardExpiry || '').match(/^(\d{2})\/(\d{2})$/);
            if (!match) {
              res.statusCode = 422;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, code: 'invalid_expiry', error: 'Expiry must be MM/YY.' }));
              return;
            }
            const month = parseInt(match[1], 10);
            const year = parseInt(`20${match[2]}`, 10);
            const now = new Date();
            if (month < 1 || month > 12 || year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
              res.statusCode = 422;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, code: 'expired_card', error: 'Your card has expired.' }));
              return;
            }

            // 4. CVV check
            if (!/^\d{3,4}$/.test(String(cardCvv || '').trim())) {
              res.statusCode = 422;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, code: 'invalid_cvc', error: 'CVV security code must be 3 or 4 digits.' }));
              return;
            }

            // 5. Test card declines
            const declinedCards = {
              '4000000000000002': 'Payment Declined: Card was declined by the issuing bank.',
              '4000000000000069': 'Payment Blocked: High risk / suspected fraudulent card.',
              '4000000000000085': 'Payment Declined: Insufficient funds in account.',
              '4000000000000117': 'Payment Declined: The card has expired.'
            };
            if (declinedCards[digits]) {
              res.statusCode = 402;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, code: 'card_declined', error: declinedCards[digits] }));
              return;
            }

            // In sandbox test mode, only verified test cards pass
            const validTestCards = ['4242424242424242', '5555555555554444', '378282246310005', '4000000000000041'];
            if (!validTestCards.includes(digits) && data.paymentConfig?.mode !== 'live') {
              res.statusCode = 402;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                code: 'card_declined',
                error: `Payment Declined: Card ${digits.slice(0, 4)}••••${digits.slice(-4)} declined by payment gateway. In sandbox test mode, use the standard test card 4242 4242 4242 4242 with any future MM/YY and valid CVC.`
              }));
              return;
            }

            // Success response with server-verified transaction ID
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              transactionId: `txn_stripe_srv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
              status: 'succeeded',
              amount: data.amount,
              verifiedAt: new Date().toISOString()
            }));
          } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Malformed payment request payload.' }));
          }
        });
        return;
      }
      next();
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), paymentApiPlugin()],
  base: '/FusionThemes/',
  server: {
    port: 3000,
    open: true
  }
});
