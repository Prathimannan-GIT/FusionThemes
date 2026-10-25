// vite.config.js
import { defineConfig } from "file:///C:/Users/prath/OneDrive/Desktop/Websites/Fusion%20Themes/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/prath/OneDrive/Desktop/Websites/Fusion%20Themes/node_modules/@vitejs/plugin-react/dist/index.js";
var paymentApiPlugin = () => ({
  name: "payment-api-plugin",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === "/api/payments/process" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          try {
            const data = JSON.parse(body);
            const { cardNumber, cardExpiry, cardCvv } = data.cardDetails || {};
            const digits = String(cardNumber || "").replace(/\D/g, "");
            if (digits.length < 13 || digits.length > 19) {
              res.statusCode = 422;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, code: "invalid_number", error: "Invalid card number length." }));
              return;
            }
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
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, code: "invalid_number", error: "Your card number is invalid (Luhn checksum failed)." }));
              return;
            }
            const match = String(cardExpiry || "").match(/^(\d{2})\/(\d{2})$/);
            if (!match) {
              res.statusCode = 422;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, code: "invalid_expiry", error: "Expiry must be MM/YY." }));
              return;
            }
            const month = parseInt(match[1], 10);
            const year = parseInt(`20${match[2]}`, 10);
            const now = /* @__PURE__ */ new Date();
            if (month < 1 || month > 12 || year < now.getFullYear() || year === now.getFullYear() && month < now.getMonth() + 1) {
              res.statusCode = 422;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, code: "expired_card", error: "Your card has expired." }));
              return;
            }
            if (!/^\d{3,4}$/.test(String(cardCvv || "").trim())) {
              res.statusCode = 422;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, code: "invalid_cvc", error: "CVV security code must be 3 or 4 digits." }));
              return;
            }
            const declinedCards = {
              "4000000000000002": "Payment Declined: Card was declined by the issuing bank.",
              "4000000000000069": "Payment Blocked: High risk / suspected fraudulent card.",
              "4000000000000085": "Payment Declined: Insufficient funds in account.",
              "4000000000000117": "Payment Declined: The card has expired."
            };
            if (declinedCards[digits]) {
              res.statusCode = 402;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, code: "card_declined", error: declinedCards[digits] }));
              return;
            }
            const validTestCards = ["4242424242424242", "5555555555554444", "378282246310005", "4000000000000041"];
            if (!validTestCards.includes(digits) && data.paymentConfig?.mode !== "live") {
              res.statusCode = 402;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({
                success: false,
                code: "card_declined",
                error: `Payment Declined: Card ${digits.slice(0, 4)}\u2022\u2022\u2022\u2022${digits.slice(-4)} declined by payment gateway. In sandbox test mode, use the standard test card 4242 4242 4242 4242 with any future MM/YY and valid CVC.`
              }));
              return;
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              success: true,
              transactionId: `txn_stripe_srv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
              status: "succeeded",
              amount: data.amount,
              verifiedAt: (/* @__PURE__ */ new Date()).toISOString()
            }));
          } catch (e) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: false, error: "Malformed payment request payload." }));
          }
        });
        return;
      }
      next();
    });
  }
});
var vite_config_default = defineConfig({
  plugins: [react(), paymentApiPlugin()],
  base: "/FusionThemes/",
  server: {
    port: 3e3,
    open: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwcmF0aFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFdlYnNpdGVzXFxcXEZ1c2lvbiBUaGVtZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHByYXRoXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcV2Vic2l0ZXNcXFxcRnVzaW9uIFRoZW1lc1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcHJhdGgvT25lRHJpdmUvRGVza3RvcC9XZWJzaXRlcy9GdXNpb24lMjBUaGVtZXMvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIEN1c3RvbSBiYWNrZW5kIHBheW1lbnQgcHJvY2Vzc29yIHBsdWdpbiBmb3IgVml0ZSBkZXYgc2VydmVyXG5jb25zdCBwYXltZW50QXBpUGx1Z2luID0gKCkgPT4gKHtcbiAgbmFtZTogJ3BheW1lbnQtYXBpLXBsdWdpbicsXG4gIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgaWYgKHJlcS51cmwgPT09ICcvYXBpL3BheW1lbnRzL3Byb2Nlc3MnICYmIHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuICAgICAgICByZXEub24oJ2RhdGEnLCBjaHVuayA9PiB7IGJvZHkgKz0gY2h1bms7IH0pO1xuICAgICAgICByZXEub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICAgICAgICBjb25zdCB7IGNhcmROdW1iZXIsIGNhcmRFeHBpcnksIGNhcmRDdnYgfSA9IGRhdGEuY2FyZERldGFpbHMgfHwge307XG4gICAgICAgICAgICBjb25zdCBkaWdpdHMgPSBTdHJpbmcoY2FyZE51bWJlciB8fCAnJykucmVwbGFjZSgvXFxEL2csICcnKTtcblxuICAgICAgICAgICAgLy8gMS4gQ2hlY2sgbGVuZ3RoXG4gICAgICAgICAgICBpZiAoZGlnaXRzLmxlbmd0aCA8IDEzIHx8IGRpZ2l0cy5sZW5ndGggPiAxOSkge1xuICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQyMjtcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IGZhbHNlLCBjb2RlOiAnaW52YWxpZF9udW1iZXInLCBlcnJvcjogJ0ludmFsaWQgY2FyZCBudW1iZXIgbGVuZ3RoLicgfSkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDIuIENoZWNrIEx1aG4gYWxnb3JpdGhtXG4gICAgICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgICAgIGxldCBzaG91bGREb3VibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBkaWdpdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgbGV0IGRpZ2l0ID0gcGFyc2VJbnQoZGlnaXRzLmNoYXJBdChpKSwgMTApO1xuICAgICAgICAgICAgICBpZiAoc2hvdWxkRG91YmxlKSB7XG4gICAgICAgICAgICAgICAgZGlnaXQgKj0gMjtcbiAgICAgICAgICAgICAgICBpZiAoZGlnaXQgPiA5KSBkaWdpdCAtPSA5O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN1bSArPSBkaWdpdDtcbiAgICAgICAgICAgICAgc2hvdWxkRG91YmxlID0gIXNob3VsZERvdWJsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdW0gJSAxMCAhPT0gMCkge1xuICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQyMjtcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IGZhbHNlLCBjb2RlOiAnaW52YWxpZF9udW1iZXInLCBlcnJvcjogJ1lvdXIgY2FyZCBudW1iZXIgaXMgaW52YWxpZCAoTHVobiBjaGVja3N1bSBmYWlsZWQpLicgfSkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDMuIEV4cGlyeSBjaGVja1xuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBTdHJpbmcoY2FyZEV4cGlyeSB8fCAnJykubWF0Y2goL14oXFxkezJ9KVxcLyhcXGR7Mn0pJC8pO1xuICAgICAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQyMjtcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IGZhbHNlLCBjb2RlOiAnaW52YWxpZF9leHBpcnknLCBlcnJvcjogJ0V4cGlyeSBtdXN0IGJlIE1NL1lZLicgfSkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtb250aCA9IHBhcnNlSW50KG1hdGNoWzFdLCAxMCk7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0gcGFyc2VJbnQoYDIwJHttYXRjaFsyXX1gLCAxMCk7XG4gICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgaWYgKG1vbnRoIDwgMSB8fCBtb250aCA+IDEyIHx8IHllYXIgPCBub3cuZ2V0RnVsbFllYXIoKSB8fCAoeWVhciA9PT0gbm93LmdldEZ1bGxZZWFyKCkgJiYgbW9udGggPCBub3cuZ2V0TW9udGgoKSArIDEpKSB7XG4gICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDIyO1xuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgc3VjY2VzczogZmFsc2UsIGNvZGU6ICdleHBpcmVkX2NhcmQnLCBlcnJvcjogJ1lvdXIgY2FyZCBoYXMgZXhwaXJlZC4nIH0pKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyA0LiBDVlYgY2hlY2tcbiAgICAgICAgICAgIGlmICghL15cXGR7Myw0fSQvLnRlc3QoU3RyaW5nKGNhcmRDdnYgfHwgJycpLnRyaW0oKSkpIHtcbiAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MjI7XG4gICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBzdWNjZXNzOiBmYWxzZSwgY29kZTogJ2ludmFsaWRfY3ZjJywgZXJyb3I6ICdDVlYgc2VjdXJpdHkgY29kZSBtdXN0IGJlIDMgb3IgNCBkaWdpdHMuJyB9KSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gNS4gVGVzdCBjYXJkIGRlY2xpbmVzXG4gICAgICAgICAgICBjb25zdCBkZWNsaW5lZENhcmRzID0ge1xuICAgICAgICAgICAgICAnNDAwMDAwMDAwMDAwMDAwMic6ICdQYXltZW50IERlY2xpbmVkOiBDYXJkIHdhcyBkZWNsaW5lZCBieSB0aGUgaXNzdWluZyBiYW5rLicsXG4gICAgICAgICAgICAgICc0MDAwMDAwMDAwMDAwMDY5JzogJ1BheW1lbnQgQmxvY2tlZDogSGlnaCByaXNrIC8gc3VzcGVjdGVkIGZyYXVkdWxlbnQgY2FyZC4nLFxuICAgICAgICAgICAgICAnNDAwMDAwMDAwMDAwMDA4NSc6ICdQYXltZW50IERlY2xpbmVkOiBJbnN1ZmZpY2llbnQgZnVuZHMgaW4gYWNjb3VudC4nLFxuICAgICAgICAgICAgICAnNDAwMDAwMDAwMDAwMDExNyc6ICdQYXltZW50IERlY2xpbmVkOiBUaGUgY2FyZCBoYXMgZXhwaXJlZC4nXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGRlY2xpbmVkQ2FyZHNbZGlnaXRzXSkge1xuICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMjtcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IGZhbHNlLCBjb2RlOiAnY2FyZF9kZWNsaW5lZCcsIGVycm9yOiBkZWNsaW5lZENhcmRzW2RpZ2l0c10gfSkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEluIHNhbmRib3ggdGVzdCBtb2RlLCBvbmx5IHZlcmlmaWVkIHRlc3QgY2FyZHMgcGFzc1xuICAgICAgICAgICAgY29uc3QgdmFsaWRUZXN0Q2FyZHMgPSBbJzQyNDI0MjQyNDI0MjQyNDInLCAnNTU1NTU1NTU1NTU1NDQ0NCcsICczNzgyODIyNDYzMTAwMDUnLCAnNDAwMDAwMDAwMDAwMDA0MSddO1xuICAgICAgICAgICAgaWYgKCF2YWxpZFRlc3RDYXJkcy5pbmNsdWRlcyhkaWdpdHMpICYmIGRhdGEucGF5bWVudENvbmZpZz8ubW9kZSAhPT0gJ2xpdmUnKSB7XG4gICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAyO1xuICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb2RlOiAnY2FyZF9kZWNsaW5lZCcsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGBQYXltZW50IERlY2xpbmVkOiBDYXJkICR7ZGlnaXRzLnNsaWNlKDAsIDQpfVx1MjAyMlx1MjAyMlx1MjAyMlx1MjAyMiR7ZGlnaXRzLnNsaWNlKC00KX0gZGVjbGluZWQgYnkgcGF5bWVudCBnYXRld2F5LiBJbiBzYW5kYm94IHRlc3QgbW9kZSwgdXNlIHRoZSBzdGFuZGFyZCB0ZXN0IGNhcmQgNDI0MiA0MjQyIDQyNDIgNDI0MiB3aXRoIGFueSBmdXR1cmUgTU0vWVkgYW5kIHZhbGlkIENWQy5gXG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTdWNjZXNzIHJlc3BvbnNlIHdpdGggc2VydmVyLXZlcmlmaWVkIHRyYW5zYWN0aW9uIElEXG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgdHJhbnNhY3Rpb25JZDogYHR4bl9zdHJpcGVfc3J2XyR7RGF0ZS5ub3coKX1fJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgOCl9YCxcbiAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VlZGVkJyxcbiAgICAgICAgICAgICAgYW1vdW50OiBkYXRhLmFtb3VudCxcbiAgICAgICAgICAgICAgdmVyaWZpZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ01hbGZvcm1lZCBwYXltZW50IHJlcXVlc3QgcGF5bG9hZC4nIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBuZXh0KCk7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIHBheW1lbnRBcGlQbHVnaW4oKV0sXG4gIGJhc2U6ICcvRnVzaW9uVGhlbWVzLycsXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgb3BlbjogdHJ1ZVxuICB9XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1csU0FBUyxvQkFBb0I7QUFDalksT0FBTyxXQUFXO0FBR2xCLElBQU0sbUJBQW1CLE9BQU87QUFBQSxFQUM5QixNQUFNO0FBQUEsRUFDTixnQkFBZ0IsUUFBUTtBQUN0QixXQUFPLFlBQVksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO0FBQ3pDLFVBQUksSUFBSSxRQUFRLDJCQUEy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
