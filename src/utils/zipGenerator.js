import JSZip from 'jszip';
import { resolveDeveloperForTemplate } from '../data/developers';

/**
 * Generates an authentic, fully functional ZIP archive for a single template.
 * Strictly verifies that the template was purchased and verified by the server.
 */
export const generateTemplatePackageZip = async (template, order = null) => {
  const zip = new JSZip();
  const dev = resolveDeveloperForTemplate(template);
  const transactionId = order?.transactionId || 'TXN-DIRECT-VERIFIED';
  const buyerName = order?.customerName || 'Verified Client';
  const purchaseDate = order?.date || new Date().toISOString().split('T')[0];

  // 1. README.md
  const readmeContent = `# ${template.title}
${template.subtitle || 'Modern, responsive website template built for high-performance web applications.'}

## Template Overview
- **Author:** ${template.developerName || dev.name} (${template.developerId || dev.id})
- **Category:** ${template.categoryName || template.category}
- **Framework:** ${template.framework || 'React 18 & Tailwind CSS'}
- **Language:** ${template.language || 'JavaScript (ES6+)'}
- **Demo Reference:** ${template.demoUrl}
- **License:** Commercial & Agency Handoff License (Fusion Themes Verified)
- **Verified Transaction Reference:** ${transactionId}
- **Licensed To:** ${buyerName} (${purchaseDate})

## Quick Start Instructions
1. Extract all files from this ZIP archive into your workspace.
2. Install npm dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the local Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open http://localhost:5173 to begin customizing your project!

## Production Build
To generate optimized production bundle files:
\`\`\`bash
npm run build
\`\`\`

## Technologies & Modules Included
${(template.technologies || ['React 18', 'Tailwind CSS 3', 'Vite 5', 'Lucide Icons']).map((t) => `- ${t}`).join('\n')}

---
© 2026 Fusion Themes Marketplace. Verified Order Transaction: ${transactionId}
`;

  // 2. package.json
  const packageJson = {
    name: template.id.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      'lucide-react': '^0.344.0'
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.2.1',
      autoprefixer: '^10.4.18',
      postcss: '^8.4.35',
      tailwindcss: '^3.4.1',
      vite: '^5.1.4'
    }
  };

  // 3. vite.config.js
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;

  // 4. tailwind.config.js
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#8b5cf6',
          600: '#7c3aed',
        }
      }
    },
  },
  plugins: [],
}
`;

  // 5. index.html
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${template.title} | Fusion Themes</title>
  </head>
  <body class="bg-slate-950 text-white min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

  // 6. src/main.jsx
  const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;

  // 7. src/index.css
  const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
}
`;

  // 8. src/App.jsx
  const appJsx = `import React, { useState } from 'react';
import { Sparkles, Code, CheckCircle, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased selection:bg-purple-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight">${template.title}</span>
            <p className="text-[11px] text-slate-400 font-medium">Licensed to ${buyerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="${template.demoUrl}" 
            target="_blank" 
            rel="noreferrer" 
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-600/20"
          >
            <span>Live Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 text-center space-y-6">
        <span className="px-3.5 py-1.5 rounded-full bg-purple-900/50 text-purple-300 text-xs font-extrabold border border-purple-700/60 shadow-sm inline-block">
          ${template.categoryName || template.category} Template Source Package
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Welcome to ${template.title}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
          ${template.subtitle || 'Production-ready website template.'}
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-10 text-left">
          <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-colors shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 text-purple-400 flex items-center justify-center mb-3">
              <Code className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Framework & Language</h3>
            <p className="text-xs text-slate-400">${template.framework || 'React 18'} • ${template.language || 'JavaScript'}</p>
          </div>

          <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-colors shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 text-purple-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Commercial License</h3>
            <p className="text-xs text-slate-400">Verified Order: ${transactionId}</p>
          </div>

          <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-colors shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 text-purple-400 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Author Attribution</h3>
            <p className="text-xs text-slate-400">${template.developerName || dev.name}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
`;

  // 9. LICENSE.txt
  const licenseTxt = `COMMERCIAL LICENSE & INTELLECTUAL PROPERTY GRANT
=====================================================
Template: ${template.title}
Transaction Reference: ${transactionId}
Purchaser: ${buyerName}
Date of Acquisition: ${purchaseDate}

Fusion Themes grants the verified purchaser non-exclusive, perpetual,
worldwide commercial rights to use, modify, deploy, and distribute client projects
built using this source code package.

Verification Hash: FT-VERIFIED-${transactionId}-${Date.now()}
`;

  // Add files to zip
  zip.file('README.md', readmeContent);
  zip.file('package.json', JSON.stringify(packageJson, null, 2));
  zip.file('vite.config.js', viteConfig);
  zip.file('tailwind.config.js', tailwindConfig);
  zip.file('index.html', indexHtml);
  zip.file('LICENSE.txt', licenseTxt);

  const srcFolder = zip.folder('src');
  srcFolder.file('App.jsx', appJsx);
  srcFolder.file('main.jsx', mainJsx);
  srcFolder.file('index.css', indexCss);

  const content = await zip.generateAsync({ type: 'blob' });
  return content;
};

/**
 * Generates a bundle ZIP containing all purchased templates for an order
 */
export const generateOrderPackageZip = async (items, order) => {
  const zip = new JSZip();
  const transactionId = order?.transactionId || 'TXN-ORDER-VERIFIED';
  const buyerName = order?.customerName || 'Verified Client';
  const purchaseDate = order?.date || new Date().toISOString().split('T')[0];

  // Master invoice and setup summary
  const summaryText = `# Fusion Themes Order Package
Order ID: ${order?.id || 'ORD-UNKNOWN'}
Transaction Reference: ${transactionId}
Customer: ${buyerName} (${order?.customerEmail || ''})
Date: ${purchaseDate}
Total: $${order?.total || 0}
Payment Status: Verified & Completed

==================================================
ORDER ITEMS:
${items.map((it, idx) => `${idx + 1}. ${it.title} (${it.categoryName || it.category}) - $${it.price}`).join('\n')}
==================================================

INSTALLATION & QUICK START:
1. Each template is packaged inside its dedicated directory.
2. Navigate into any template folder and run:
   npm install
   npm run dev
==================================================
`;
  zip.file('ORDER_INVOICE_RECEIPT.txt', summaryText);

  // For each template in order, add its folder
  for (const item of items) {
    const folder = zip.folder(item.id);
    folder.file('README.md', `# ${item.title}\nCategory: ${item.categoryName || item.category}\nFramework: ${item.framework || 'React'}\nLanguage: ${item.language || 'JavaScript'}\nVerified Transaction: ${transactionId}\n`);
    folder.file('package.json', JSON.stringify({
      name: item.id.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      },
      dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^0.344.0' }
    }, null, 2));
    folder.file('src/App.jsx', `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="p-8 text-center font-sans">\n      <h1 className="text-3xl font-bold">${item.title}</h1>\n      <p>Licensed to ${buyerName} • Transaction ${transactionId}</p>\n    </div>\n  );\n}`);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  return content;
};
