import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  HelpCircle,
  ChevronDown,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  FileCode,
  DollarSign,
  RefreshCw,
  Users,
  Send,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Download,
  Layers,
  LifeBuoy,
  Mail,
  Terminal,
  X,
  Zap,
  CreditCard,
  Lock,
  Headphones,
  Code,
  Briefcase,
  User,
  Star,
  Filter,
  LogIn,
  LogOut,
  Settings,
  Award
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// ==================== ROLE CONFIGURATIONS ====================
const ROLES = [
  {
    id: 'developer',
    name: 'Developer',
    icon: Code,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800',
    activeTabColor: 'bg-emerald-600 text-white shadow-emerald-500/25',
    title: 'Developer Help & Documentation',
    subtitle: 'Source code architecture, Vite/React recipes, Author Hub submissions, royalties & CLI tools.'
  },
  {
    id: 'customer',
    name: 'Customer',
    icon: User,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800',
    activeTabColor: 'bg-blue-600 text-white shadow-blue-500/25',
    title: 'Customer & Buyer Knowledge Base',
    subtitle: 'Template downloads, zip extraction, billing receipts, 30-day refunds & getting started.'
  },
  {
    id: 'client',
    name: 'Client / Agency',
    icon: Briefcase,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800',
    activeTabColor: 'bg-purple-600 text-white shadow-purple-500/25',
    title: 'Client & Agency Resource Portal',
    subtitle: 'Commercial deployment, client handoff, corporate VAT/GST invoices & custom requests.'
  },
  {
    id: 'admin',
    name: 'Admin',
    icon: ShieldCheck,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800',
    activeTabColor: 'bg-rose-600 text-white shadow-rose-500/25',
    title: 'Admin & Operations Manual',
    subtitle: 'Template curation & review pipeline, author payout approvals, dispute handling & uptime ops.'
  }
];

// ==================== TOPIC CATEGORIES PER ROLE ====================
const ALL_CATEGORIES = [
  // --- DEVELOPER CATEGORIES ---
  {
    id: 'dev-setup',
    role: 'developer',
    name: 'Source Code & Local Setup',
    shortName: 'Local Setup',
    icon: Terminal,
    color: 'from-emerald-500 to-teal-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    description: 'Vite scripts, React 18 component structure, Tailwind config, and npm dependency workflows.'
  },
  {
    id: 'dev-submissions',
    role: 'developer',
    name: 'Author Hub & Submissions',
    shortName: 'Submissions',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    lightBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    border: 'hover:border-blue-300 dark:hover:border-blue-700',
    description: 'Submitting templates, curation standards, review turnaround times, and repository setup.'
  },
  {
    id: 'dev-payouts',
    role: 'developer',
    name: 'Author Royalties & Earnings',
    shortName: 'Royalties',
    icon: DollarSign,
    color: 'from-purple-500 to-indigo-600',
    lightBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    border: 'hover:border-purple-300 dark:hover:border-purple-700',
    description: '70% to 85% revenue share, Stripe Connect integration, wire transfers, and monthly payouts.'
  },
  {
    id: 'dev-quality',
    role: 'developer',
    name: 'Code Quality & Lighthouse 95+',
    shortName: 'Quality Standards',
    icon: Sparkles,
    color: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    border: 'hover:border-amber-300 dark:hover:border-amber-700',
    description: 'Passing marketplace review, semantic markup, zero console warnings, and responsive styling.'
  },
  {
    id: 'dev-licensing',
    role: 'developer',
    name: 'Developer Licensing Rules',
    shortName: 'Dev Licensing',
    icon: ShieldCheck,
    color: 'from-violet-500 to-fuchsia-500',
    lightBg: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
    border: 'hover:border-violet-300 dark:hover:border-violet-700',
    description: 'Commercial deployment boundaries, open-source dependency limits, and client redistribution.'
  },
  {
    id: 'dev-api',
    role: 'developer',
    name: 'API, CI/CD & GitHub Deploy',
    shortName: 'Deploy & CI/CD',
    icon: Layers,
    color: 'from-pink-500 to-rose-500',
    lightBg: 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400',
    border: 'hover:border-pink-300 dark:hover:border-pink-700',
    description: 'Automated GitHub Pages, Vercel, Netlify deployments, and live demo sandbox embeds.'
  },

  // --- CUSTOMER CATEGORIES ---
  {
    id: 'cust-downloads',
    role: 'customer',
    name: 'Downloads & Zip Bundles',
    shortName: 'Downloads',
    icon: Download,
    color: 'from-blue-500 to-cyan-500',
    lightBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    border: 'hover:border-blue-300 dark:hover:border-blue-700',
    description: 'Instant zip archive access, lifetime updates, and dashboard download management.'
  },
  {
    id: 'cust-setup',
    role: 'customer',
    name: 'Getting Started Without Coding',
    shortName: 'Getting Started',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    description: 'Unzipping files, replacing images and text, and previewing in your browser.'
  },
  {
    id: 'cust-billing',
    role: 'customer',
    name: 'Billing, Receipts & Currency',
    shortName: 'Billing & Currency',
    icon: CreditCard,
    color: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    border: 'hover:border-amber-300 dark:hover:border-amber-700',
    description: 'Multi-currency checkout, Stripe processing, invoice PDF receipts, and tax calculations.'
  },
  {
    id: 'cust-refunds',
    role: 'customer',
    name: '30-Day Guarantee & Refunds',
    shortName: 'Refund Policy',
    icon: RefreshCw,
    color: 'from-rose-500 to-pink-500',
    lightBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
    border: 'hover:border-rose-300 dark:hover:border-rose-700',
    description: 'Our 100% money-back guarantee, technical defect remedies, and rapid claim processing.'
  },
  {
    id: 'cust-license',
    role: 'customer',
    name: 'License & Personal Projects',
    shortName: 'License Rights',
    icon: ShieldCheck,
    color: 'from-purple-500 to-indigo-600',
    lightBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    border: 'hover:border-purple-300 dark:hover:border-purple-700',
    description: 'Single website rights, lifetime ownership, and personal project terms.'
  },
  {
    id: 'cust-support',
    role: 'customer',
    name: 'Customer Support Desk',
    shortName: 'Customer Support',
    icon: Headphones,
    color: 'from-violet-500 to-purple-500',
    lightBg: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
    border: 'hover:border-violet-300 dark:hover:border-violet-700',
    description: 'Direct author inquiry, troubleshooting questions, and general guidance.'
  },

  // --- CLIENT / AGENCY CATEGORIES ---
  {
    id: 'client-handoff',
    role: 'client',
    name: 'Client Delivery & License Handoff',
    shortName: 'Client Handoff',
    icon: Users,
    color: 'from-purple-500 to-indigo-600',
    lightBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    border: 'hover:border-purple-300 dark:hover:border-purple-700',
    description: 'Transferring website ownership, white-label end products, and client maintenance rights.'
  },
  {
    id: 'client-commercial',
    role: 'client',
    name: 'Agency & Commercial Licensing',
    shortName: 'Agency License',
    icon: ShieldCheck,
    color: 'from-blue-500 to-cyan-500',
    lightBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    border: 'hover:border-blue-300 dark:hover:border-blue-700',
    description: 'Unlimited client deployments, agency extended rights, and client billing freedom.'
  },
  {
    id: 'client-custom',
    role: 'client',
    name: 'Hiring Authors & Custom Requests',
    shortName: 'Custom Projects',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    description: 'Commissioning verified marketplace authors, custom milestones, and turnaround guarantees.'
  },
  {
    id: 'client-corporate-billing',
    role: 'client',
    name: 'Corporate Billing & VAT/GST',
    shortName: 'Corporate Invoices',
    icon: CreditCard,
    color: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    border: 'hover:border-amber-300 dark:hover:border-amber-700',
    description: 'Formal company invoices, VAT/GST registration IDs, and centralized expense receipts.'
  },
  {
    id: 'client-sla',
    role: 'client',
    name: 'Quality SLA & Enterprise Security',
    shortName: 'SLA & Security',
    icon: Lock,
    color: 'from-rose-500 to-pink-500',
    lightBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
    border: 'hover:border-rose-300 dark:hover:border-rose-700',
    description: 'Security audits, cross-browser compatibility, WCAG 2.1 AA accessibility, and code warranty.'
  },

  // --- ADMIN CATEGORIES ---
  {
    id: 'admin-review',
    role: 'admin',
    name: 'Template Review & Curation SOP',
    shortName: 'Curation SOP',
    icon: Sparkles,
    color: 'from-rose-500 to-red-600',
    lightBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
    border: 'hover:border-rose-300 dark:hover:border-rose-700',
    description: 'Author submission checklist, automated code linting, demo review, and approval workflow.'
  },
  {
    id: 'admin-payouts',
    role: 'admin',
    name: 'Payout Processing & Accounting',
    shortName: 'Payout Ops',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    description: 'Approving monthly author payouts, Stripe Connect balance validation, and tax records.'
  },
  {
    id: 'admin-moderation',
    role: 'admin',
    name: 'Account & Content Moderation',
    shortName: 'User Moderation',
    icon: Users,
    color: 'from-purple-500 to-indigo-600',
    lightBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    border: 'hover:border-purple-300 dark:hover:border-purple-700',
    description: 'Managing account roles, user suspensions, policy enforcement, and dispute arbitration.'
  },
  {
    id: 'admin-refunds',
    role: 'admin',
    name: 'Refund Disputes & Fraud Checks',
    shortName: 'Refund Disputes',
    icon: RefreshCw,
    color: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    border: 'hover:border-amber-300 dark:hover:border-amber-700',
    description: 'Auditing 30-day refund tickets, checking chargebacks, and initiating Stripe refunds.'
  },
  {
    id: 'admin-system',
    role: 'admin',
    name: 'System Health & Edge CDN Uptime',
    shortName: 'System Health',
    icon: ShieldCheck,
    color: 'from-blue-500 to-cyan-500',
    lightBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    border: 'hover:border-blue-300 dark:hover:border-blue-700',
    description: 'Edge node status, demo preview sandbox health, database backups, and incident protocols.'
  }
];

// ==================== COMPREHENSIVE FAQS BY ROLE ====================
const ALL_FAQS = [
  // ---------------- DEVELOPER FAQS ----------------
  {
    id: 'faq-dev-1',
    role: 'developer',
    category: 'dev-setup',
    categoryName: 'Source Code & Local Setup',
    q: 'How do I install dependencies and start the local dev server?',
    a: 'Unzip your downloaded template folder. Open your terminal inside the root project directory and run "npm install" (or "pnpm install"). Once installation completes, run "npm run dev" to start the local Vite development server with Hot Module Replacement (HMR) at http://localhost:5173.',
    command: 'npm install && npm run dev',
    tags: ['vite', 'npm install', 'terminal', 'dev server'],
    tip: 'All Fusion Themes templates use modern Vite 5+ and React 18 for sub-second build times.'
  },
  {
    id: 'faq-dev-2',
    role: 'developer',
    category: 'dev-setup',
    categoryName: 'Source Code & Local Setup',
    q: 'How do I toggle or customize Tailwind CSS dark mode styling?',
    a: 'All templates feature built-in Tailwind class-based dark mode. Styles use standard "dark:" utility prefixes across JSX components. You can trigger dark mode dynamically by adding or removing the "dark" class on the documentElement.',
    command: "document.documentElement.classList.toggle('dark')",
    tags: ['tailwind', 'dark mode', 'css', 'theming']
  },
  {
    id: 'faq-dev-3',
    role: 'developer',
    category: 'dev-setup',
    categoryName: 'Source Code & Local Setup',
    q: 'Can I convert these React components to Next.js (App Router) or Astro?',
    a: 'Yes! Because our templates use clean, modular ES modules with standard JSX and utility Tailwind classes, migrating into Next.js App Router or Astro takes minimal effort. Simply add "use client" at the top of components that use React hooks.',
    tags: ['nextjs', 'astro', 'remix', 'migration'],
    tip: 'Figma tokens and Tailwind classes map directly into Next.js tailwind.config.js.'
  },
  {
    id: 'faq-dev-4',
    role: 'developer',
    category: 'dev-submissions',
    categoryName: 'Author Hub & Submissions',
    q: 'How do I submit my custom template to sell on the marketplace?',
    a: 'Navigate to your Dashboard and open the "Submit Template" tab. Provide your title, category, live demo URL, unminified source code archive or repository link, documentation markdown, and desired price. Our review team audits submissions within 48 business hours.',
    tags: ['author hub', 'sell templates', 'submission', 'marketplace']
  },
  {
    id: 'faq-dev-5',
    role: 'developer',
    category: 'dev-submissions',
    categoryName: 'Author Hub & Submissions',
    q: 'What assets and documentation must be included in an author zip?',
    a: 'Submissions must include a functional package.json, clean README.md with setup instructions, production assets in /public, Tailwind config, and optional Figma design token links. Packages with console errors will be sent back for revision.',
    tags: ['package structure', 'readme', 'figma', 'assets']
  },
  {
    id: 'faq-dev-6',
    role: 'developer',
    category: 'dev-payouts',
    categoryName: 'Author Royalties & Earnings',
    q: 'What is the developer royalty split and payout schedule?',
    a: 'Developers receive an industry-leading 70% to 85% revenue split per sale with zero exclusivity lock-in. Earnings are deposited automatically on the 1st of every month via Stripe Connect, PayPal, or Direct Bank Wire for balances over $50.',
    tags: ['royalties', 'earnings', 'stripe connect', 'payout schedule'],
    tip: 'High-volume authors with over 100 sales per month unlock Tier-1 85% revenue split.'
  },
  {
    id: 'faq-dev-7',
    role: 'developer',
    category: 'dev-payouts',
    categoryName: 'Author Royalties & Earnings',
    q: 'How do I link my bank account or Stripe Connect for payouts?',
    a: 'Visit your Dashboard > Author Earnings section and click "Connect Payout Method". You can onboard via Stripe Connect in under 3 minutes to enable direct bank deposits across 45+ supported countries.',
    tags: ['stripe connect', 'bank transfer', 'payout settings']
  },
  {
    id: 'faq-dev-8',
    role: 'developer',
    category: 'dev-quality',
    categoryName: 'Code Quality & Lighthouse 95+',
    q: 'What quality benchmarks must templates meet to pass review?',
    a: 'All templates are tested against Google Lighthouse and must score 95+ in Performance, Accessibility, Best Practices, and SEO. Additionally, templates must be responsive down to 320px mobile screens and pass automated ESLint and npm security audits.',
    command: 'npm run lint && npm audit',
    tags: ['lighthouse', 'accessibility', 'audit', 'performance']
  },
  {
    id: 'faq-dev-9',
    role: 'developer',
    category: 'dev-licensing',
    categoryName: 'Developer Licensing Rules',
    q: 'What are the restrictions on redistributing template source files?',
    a: 'You cannot resell, redistribute, or share the raw source code files on open-source repositories, competitor marketplaces, or torrent sites. Templates can only be distributed as customized end-products where the raw code is bundled.',
    tags: ['redistribution', 'license boundaries', 'copyright']
  },
  {
    id: 'faq-dev-10',
    role: 'developer',
    category: 'dev-api',
    categoryName: 'API, CI/CD & GitHub Deploy',
    q: 'How do I deploy my finished template to GitHub Pages or Vercel?',
    a: 'Run "npm run build" to create the optimized production bundle in the /dist folder. For GitHub Pages, run "npm run deploy" (via gh-pages). For Vercel or Netlify, simply link your Git repository and set the build command to "npm run build" with output directory "dist".',
    command: 'npm run build && npm run deploy',
    tags: ['github pages', 'vercel', 'deploy', 'production']
  },

  // ---------------- CUSTOMER FAQS ----------------
  {
    id: 'faq-cust-1',
    role: 'customer',
    category: 'cust-downloads',
    categoryName: 'Downloads & Zip Bundles',
    q: 'Where do I find and download my purchased templates?',
    a: 'Immediately after checkout, you can download your template package from the order confirmation screen. You can also re-download your files anytime by signing into your account and heading to your Dashboard > Downloads tab.',
    tags: ['download', 'zip', 'dashboard', 'access'],
    tip: 'All purchases grant lifetime access to future version updates and patches for free.'
  },
  {
    id: 'faq-cust-2',
    role: 'customer',
    category: 'cust-downloads',
    categoryName: 'Downloads & Zip Bundles',
    q: 'What files are included inside the downloaded zip package?',
    a: 'Your download contains the complete unminified source code, full asset images and fonts, responsive components, Tailwind and Vite configuration files, a starter README guide, and Figma design tokens.',
    tags: ['zip contents', 'figma', 'source files']
  },
  {
    id: 'faq-cust-3',
    role: 'customer',
    category: 'cust-setup',
    categoryName: 'Getting Started Without Coding',
    q: 'How do I get started if I do not have a strong coding background?',
    a: 'Double-click the downloaded zip file to extract it. Open the folder and review the "README.html" or "quickstart.md" file. For minor text and image changes, you can open the files in any free code editor like VS Code or use our live preview customization tools.',
    tags: ['beginner', 'no code', 'quick start', 'extract']
  },
  {
    id: 'faq-cust-4',
    role: 'customer',
    category: 'cust-billing',
    categoryName: 'Billing, Receipts & Currency',
    q: 'How do I download my official payment receipt or tax invoice?',
    a: 'A confirmation email with an attached invoice receipt is sent immediately upon purchase. You can also generate and download official PDF receipts with your billing details from your Dashboard Billing tab.',
    tags: ['invoice', 'receipt', 'pdf', 'tax']
  },
  {
    id: 'faq-cust-5',
    role: 'customer',
    category: 'cust-billing',
    categoryName: 'Billing, Receipts & Currency',
    q: 'Is my template purchase a one-time fee or a recurring subscription?',
    a: 'All individual templates and UI kits are 100% one-time payments with no hidden recurring subscription fees or surprise renewals. You own the license forever with lifetime update rights.',
    tags: ['one time payment', 'no subscription', 'lifetime']
  },
  {
    id: 'faq-cust-6',
    role: 'customer',
    category: 'cust-billing',
    categoryName: 'Billing, Receipts & Currency',
    q: 'How do I change my currency to pay in my local money?',
    a: 'Click the country flag dropdown in the top-right navigation bar to choose from 10+ global currencies including USD, EUR, GBP, INR, CAD, AUD, and JPY. Prices update dynamically across the entire marketplace.',
    tags: ['currency', 'flag picker', 'exchange rate']
  },
  {
    id: 'faq-cust-7',
    role: 'customer',
    category: 'cust-refunds',
    categoryName: '30-Day Guarantee & Refunds',
    q: 'What is the Fusion Themes 30-Day Money-Back Guarantee?',
    a: 'We guarantee that all templates match their live preview and function without technical defects. If you run into an unresolved defect, our support team will resolve it within 48 hours or issue a prompt, 100% full refund within 30 days of purchase.',
    tags: ['refund', 'money back guarantee', 'warranty', '30 days']
  },
  {
    id: 'faq-cust-8',
    role: 'customer',
    category: 'cust-refunds',
    categoryName: '30-Day Guarantee & Refunds',
    q: 'How do I submit a refund request?',
    a: 'Click the "Submit Support Ticket" button below or email support@fusionthemes.com with your Order Reference ID. Our customer support desk will process your request within 24 hours.',
    tags: ['request refund', 'claim', 'support desk']
  },
  {
    id: 'faq-cust-9',
    role: 'customer',
    category: 'cust-license',
    categoryName: 'License & Personal Projects',
    q: 'Can I use one purchased template for my own personal website?',
    a: 'Yes! The standard Regular License grants you the right to create one complete personal or commercial end-product website. You can customize all colors, texts, and images as needed.',
    tags: ['regular license', 'personal site', 'commercial']
  },
  {
    id: 'faq-cust-10',
    role: 'customer',
    category: 'cust-support',
    categoryName: 'Customer Support Desk',
    q: 'How can I get technical help if a component looks broken?',
    a: 'Open a support ticket using the contact form at the bottom of this page. Include your template name and a brief description of the issue. Our technical team responds within 2 hours during business hours.',
    tags: ['help desk', 'ticket', 'troubleshooting']
  },

  // ---------------- CLIENT / AGENCY FAQS ----------------
  {
    id: 'faq-client-1',
    role: 'client',
    category: 'client-handoff',
    categoryName: 'Client Delivery & License Handoff',
    q: 'How does client handover work when delivering a completed site?',
    a: 'Agencies can build the customized website and transfer license ownership directly to their client upon final project signoff. The client then becomes the registered licensee of that specific domain installation.',
    tags: ['client handoff', 'transfer license', 'agency delivery'],
    tip: 'You can charge your clients any design or development fee for your customized end product.'
  },
  {
    id: 'faq-client-2',
    role: 'client',
    category: 'client-handoff',
    categoryName: 'Client Delivery & License Handoff',
    q: 'Can we remove Fusion Themes branding and 100% white-label the site?',
    a: 'Yes! All commercial and extended licenses permit full white-labeling. You can replace all logos, meta titles, favicons, and copyright notices with your client branding.',
    tags: ['white label', 'branding', 'custom domain']
  },
  {
    id: 'faq-client-3',
    role: 'client',
    category: 'client-commercial',
    categoryName: 'Agency & Commercial Licensing',
    q: 'What is the difference between Regular and Agency Extended licenses?',
    a: 'A Regular License covers one single client project installation. The Agency Extended License permits your agency to deploy the template across unlimited client websites and projects without buying separate licenses.',
    tags: ['agency license', 'unlimited sites', 'commercial use']
  },
  {
    id: 'faq-client-4',
    role: 'client',
    category: 'client-custom',
    categoryName: 'Hiring Authors & Custom Requests',
    q: 'Can we hire the original template author to build custom features for us?',
    a: 'Yes! Through the Client Portal in your Dashboard, you can submit bespoke customization requests to verified marketplace authors for fast turnaround custom integrations.',
    tags: ['custom design', 'hire author', 'turnkey']
  },
  {
    id: 'faq-client-5',
    role: 'client',
    category: 'client-corporate-billing',
    categoryName: 'Corporate Billing & VAT/GST',
    q: 'Can we generate formal business invoices with company VAT/GST registration?',
    a: 'Yes. Enter your company legal entity name and tax registration number (VAT/GST/EIN) at checkout or in your Client Profile. Official PDF tax invoices are generated automatically with line-item breakdowns.',
    tags: ['vat', 'gst', 'corporate invoice', 'business expense']
  },
  {
    id: 'faq-client-6',
    role: 'client',
    category: 'client-sla',
    categoryName: 'Quality SLA & Enterprise Security',
    q: 'Do templates comply with accessibility and security compliance standards?',
    a: 'Every template is engineered to meet WCAG 2.1 AA accessibility guidelines, scores 95+ on Google Lighthouse, includes zero tracking malware, and features modern clean code suitable for enterprise audits.',
    tags: ['accessibility', 'wcag', 'enterprise security', 'sla']
  },

  // ---------------- ADMIN FAQS ----------------
  {
    id: 'faq-admin-1',
    role: 'admin',
    category: 'admin-review',
    categoryName: 'Template Review & Curation SOP',
    q: 'What is the step-by-step SOP for reviewing template submissions?',
    a: '1. Download author package and inspect folder hierarchy. 2. Execute automated dependency security scan. 3. Run production build (npm run build) to ensure zero warnings. 4. Run Lighthouse performance audit (must be 95+). 5. Verify live demo matches source. 6. Approve or provide feedback in Admin Review Queue.',
    command: 'npm audit && npm run build',
    tags: ['review sop', 'curation', 'audit', 'admin pipeline']
  },
  {
    id: 'faq-admin-2',
    role: 'admin',
    category: 'admin-payouts',
    categoryName: 'Payout Processing & Accounting',
    q: 'How are monthly author payouts validated and disbursed?',
    a: 'On the 28th of every month, automated payout batches are calculated for all authors with balances exceeding $50. Admins review net commission splits in the Admin Finance portal before triggering Stripe Connect automated transfers on the 1st.',
    tags: ['author payouts', 'stripe settlement', 'accounting', 'finance']
  },
  {
    id: 'faq-admin-3',
    role: 'admin',
    category: 'admin-moderation',
    categoryName: 'Account & Content Moderation',
    q: 'How do administrators manage user roles and elevated privileges?',
    a: 'In the Dashboard Admin tab, navigate to the User Directory. Select any user to upgrade or change their role between Customer, Client, Developer, and Administrator, or revoke access in cases of copyright infringement.',
    tags: ['user roles', 'privileges', 'moderation', 'security']
  },
  {
    id: 'faq-admin-4',
    role: 'admin',
    category: 'admin-refunds',
    categoryName: 'Refund Disputes & Fraud Checks',
    q: 'What is the protocol for approving 30-day customer refunds?',
    a: 'Review customer ticket details and order timestamp. Verify that the request is within 30 days and check if technical support was offered. Approved refunds are executed via Stripe API with automated license deactivation.',
    tags: ['refund arbitration', 'stripe refund', 'disputes']
  },
  {
    id: 'faq-admin-5',
    role: 'admin',
    category: 'admin-system',
    categoryName: 'System Health & Edge CDN Uptime',
    q: 'How are demo sandbox availability and global CDN endpoints monitored?',
    a: 'All template live demos are continuously pinged across 8 global edge nodes. Any demo showing response latency over 1500ms or HTTP errors automatically alerts the on-call DevOps channel for immediate failover.',
    tags: ['uptime', 'cdn', 'monitoring', 'devops']
  }
];

// ==================== INTERACTIVE QUICK WIDGET DATA BY ROLE ====================
const DEVELOPER_COMMANDS = [
  { id: 'install', label: '1. Install Dependencies', cmd: 'npm install' },
  { id: 'dev', label: '2. Start Dev Server', cmd: 'npm run dev' },
  { id: 'build', label: '3. Production Build', cmd: 'npm run build' },
  { id: 'preview', label: '4. Preview Build', cmd: 'npm run preview' },
  { id: 'deploy', label: '5. Deploy to GitHub Pages', cmd: 'npm run deploy' }
];

const CUSTOMER_STEPS = [
  { step: '01', title: 'Download Zip Package', desc: 'Grab your production-ready archive from Dashboard > Downloads tab.' },
  { step: '02', title: 'Extract Files', desc: 'Double click to unzip into your desired website folder.' },
  { step: '03', title: 'Customize Content', desc: 'Replace placeholder texts, logos, and images with your own.' },
  { step: '04', title: 'Publish to the Web', desc: 'Upload to your web hosting provider or connect with Vercel / Netlify.' }
];

const CLIENT_CHECKLIST = [
  { step: '01', title: 'Select Commercial License', desc: 'Ensure your project is covered by Regular or Extended Commercial rights.' },
  { step: '02', title: 'Custom Development', desc: 'Customize themes in-house or commission verified marketplace authors.' },
  { step: '03', title: 'Quality & Audit Signoff', desc: 'Confirm cross-browser mobile responsiveness and WCAG AA standards.' },
  { step: '04', title: 'Client Domain Handoff', desc: 'Transfer license registration to client email with white-label delivery.' }
];

const ADMIN_SOP = [
  { step: '01', title: 'Security & Dependency Scan', desc: 'Run automated npm audit and check license compliance on author assets.' },
  { step: '02', title: 'Lighthouse 95+ Audit', desc: 'Validate sub-second performance, SEO metrics, and clean console logs.' },
  { step: '03', title: 'Live Demo Link Verification', desc: 'Verify responsive iframe rendering across mobile, tablet, and desktop.' },
  { step: '04', title: 'Publish to Marketplace', desc: 'Approve template listing and notify author via automated webhook.' }
];

const POPULAR_SEARCHES = {
  developer: ['npm run dev', 'Author Hub', 'Royalty split', 'Vite React', 'Tailwind dark mode', 'GitHub deploy'],
  customer: ['Download zip', '30-Day refund', 'Invoice PDF', 'Change currency', 'One-time payment', 'Setup guide'],
  client: ['Client handoff', 'Commercial license', 'VAT invoice', 'Hire author', 'White-label rights'],
  admin: ['Submission review', 'Monthly payouts', 'Refund dispute', 'User roles', 'CDN health'],
  all: ['Commercial license', 'Download zip', 'npm install', '30-Day refund', 'Author royalties', 'Client handoff']
};

const HelpPage = () => {
  const { currentUser, loginUser, logoutUser, openAuth } = useCart();

  // Active role filter: defaults to signed-in user's role! If not signed in, defaults to 'all' or active selection
  const [selectedRole, setSelectedRole] = useState(() => {
    return currentUser?.role || 'all';
  });

  // Keep selectedRole synchronized whenever currentUser changes (e.g. on login/logout)
  useEffect(() => {
    if (currentUser?.role) {
      setSelectedRole(currentUser.role);
    } else {
      setSelectedRole('all');
    }
  }, [currentUser]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaqId, setOpenFaqId] = useState(null);
  const [activeCommandIdx, setActiveCommandIdx] = useState(0);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [copiedFaqId, setCopiedFaqId] = useState(null);
  const [faqFeedback, setFaqFeedback] = useState({});

  // Ticket modal state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    category: currentUser?.role === 'developer' ? 'Developer / Author Question' : 'General Support',
    priority: 'Normal',
    subject: '',
    message: ''
  });

  // Filter Categories matching active role
  const roleCategories = useMemo(() => {
    if (selectedRole === 'all') {
      return ALL_CATEGORIES;
    }
    return ALL_CATEGORIES.filter((c) => c.role === selectedRole);
  }, [selectedRole]);

  // Filter FAQs based on active role
  const roleFaqs = useMemo(() => {
    if (selectedRole === 'all') {
      return ALL_FAQS;
    }
    return ALL_FAQS.filter((f) => f.role === selectedRole);
  }, [selectedRole]);

  // Dynamic exact article count per category for current role
  const categoryCounts = useMemo(() => {
    const counts = {};
    roleFaqs.forEach((faq) => {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    });
    return counts;
  }, [roleFaqs]);

  // Set default open FAQ when role or category changes
  useEffect(() => {
    if (roleFaqs.length > 0) {
      setOpenFaqId(roleFaqs[0].id);
    } else {
      setOpenFaqId(null);
    }
    setSelectedCategory('all');
  }, [selectedRole]);

  // Filter FAQs based on active category and search query
  const filteredFaqs = useMemo(() => {
    return roleFaqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'all' || faq.category === selectedCategory;

      if (!searchQuery.trim()) return matchesCategory;

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        faq.q.toLowerCase().includes(q) ||
        faq.a.toLowerCase().includes(q) ||
        faq.categoryName.toLowerCase().includes(q) ||
        (faq.tags && faq.tags.some((t) => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [roleFaqs, selectedCategory, searchQuery]);

  const handleCopyCommand = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleCopyFaq = (faq) => {
    const textToCopy = `${faq.q}\n\n${faq.a}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedFaqId(faq.id);
    setTimeout(() => setCopiedFaqId(null), 2000);
  };

  const handleFeedback = (faqId, type) => {
    setFaqFeedback((prev) => ({ ...prev, [faqId]: type }));
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const ticketId = `FUS-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketSuccess(ticketId);
    setTicketForm({
      name: '',
      email: '',
      category: 'Technical Question',
      priority: 'Normal',
      subject: '',
      message: ''
    });
  };

  const currentRoleMeta = ROLES.find((r) => r.id === selectedRole);
  const activePopularSearches = POPULAR_SEARCHES[selectedRole] || POPULAR_SEARCHES.all;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      {/* ==================== ROLE STATUS & SELECTOR HEADER ==================== */}
      <div className="bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-30 shadow-xs backdrop-blur-md bg-white/95 dark:bg-navy-900/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Left Status: Sign-in info */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {currentUser.name}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        ROLES.find(r => r.id === currentUser.role)?.badgeColor || 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        {currentUser.role} Account
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Help center tailored for your signed-in <span className="font-semibold text-purple-600 dark:text-purple-400">{currentUser.role}</span> role.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="font-medium">
                    Guest View • Sign in to automatically lock to your account role, or filter below:
                  </span>
                </div>
              )}
            </div>

            {/* Right: Role Navigation Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
                View Role:
              </span>
              
              <button
                onClick={() => setSelectedRole('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  selectedRole === 'all'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-700'
                }`}
              >
                <span>All Roles</span>
                <span className="text-[10px] opacity-80 font-mono">({ALL_FAQS.length})</span>
              </button>

              {ROLES.map((r) => {
                const IconComponent = r.icon;
                const isSelected = selectedRole === r.id;
                const countForThisRole = ALL_FAQS.filter(f => f.role === r.id).length;

                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                      isSelected
                        ? `${r.activeTabColor} shadow-md`
                        : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-700'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{r.name}</span>
                    <span className="text-[10px] opacity-80 font-mono">({countForThisRole})</span>
                  </button>
                );
              })}

              {/* Quick Auth Trigger if not signed in */}
              {!currentUser ? (
                <button
                  onClick={() => openAuth('login')}
                  className="ml-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              ) : (
                <button
                  onClick={logoutUser}
                  className="ml-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exit</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-purple-100/50 via-white to-slate-50 dark:from-navy-900 dark:via-navy-950 dark:to-navy-950 border-b border-gray-100 dark:border-gray-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-purple-500/20 via-indigo-500/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Active Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
            <span>
              {currentRoleMeta
                ? `${currentRoleMeta.name} Dedicated Help Center`
                : 'Fusion Themes Comprehensive Knowledge Base'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            {currentRoleMeta ? currentRoleMeta.title : 'How can we assist you today?'}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            {currentRoleMeta
              ? currentRoleMeta.subtitle
              : 'Find step-by-step guides, license rules, tech stack recipes, and instant answers tailored for Developers, Customers, Clients, and Admins.'}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${selectedRole !== 'all' ? selectedRole : 'all'} topics, FAQs, terminal commands, or keywords...`}
                className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-navy-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm sm:text-base font-medium shadow-xl shadow-purple-500/5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Popular Search Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-600 dark:text-gray-300">Popular:</span>
              {activePopularSearches.map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setSearchQuery(chip);
                    setSelectedCategory('all');
                  }}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400 transition-colors shadow-xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Status Ribbon */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-white/80 dark:bg-navy-900/80 border border-gray-200/80 dark:border-gray-800/80 backdrop-blur-md text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>All Systems Operational (99.98% Uptime)</span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <span className="text-purple-600 dark:text-purple-400">
                {selectedRole === 'developer' ? 'Core Dev Desk Response: < 30m' : 'Support Response: < 15m'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== CATEGORIES GRID ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Browse by Topic {selectedRole !== 'all' ? `(${currentRoleMeta?.name} Focus)` : ''}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select any category card below to filter answered questions and step-by-step guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roleCategories.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const exactCount = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(isSelected ? 'all' : cat.id);
                  const faqSection = document.getElementById('faq-accordion-section');
                  if (faqSection) {
                    faqSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`text-left p-6 rounded-3xl transition-all duration-200 border bg-white dark:bg-navy-900 shadow-sm hover:shadow-xl group relative overflow-hidden ${
                  isSelected
                    ? 'border-purple-500 ring-2 ring-purple-400/30 dark:ring-purple-500/20 bg-purple-50/20 dark:bg-purple-950/20'
                    : 'border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800'
                }`}
              >
                {/* Top Row: Icon & Dynamic Exact Count */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-sm ${cat.lightBg}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300">
                    {exactCount} {exactCount === 1 ? 'article' : 'articles'}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                  {cat.description}
                </p>

                {/* Link Arrow */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                  <span>{isSelected ? 'Viewing topic' : 'Explore FAQs'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ==================== FAQ ACCORDION SECTION ==================== */}
      <section id="faq-accordion-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-28">
        
        {/* Category Filter Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-white dark:bg-navy-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 border border-gray-200 dark:border-gray-800'
            }`}
          >
            All Questions ({roleFaqs.length})
          </button>
          
          {roleCategories.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'bg-white dark:bg-navy-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 border border-gray-200 dark:border-gray-800'
                }`}
              >
                {cat.shortName} ({count})
              </button>
            );
          })}
        </div>

        {/* Filter Feedback Bar */}
        {(searchQuery || selectedCategory !== 'all' || selectedRole !== 'all') && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 mb-6 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800 text-xs font-medium text-purple-900 dark:text-purple-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold">Active filters:</span>
              {selectedRole !== 'all' && (
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-navy-900 font-semibold border border-purple-200 dark:border-purple-700 capitalize">
                  Role: {selectedRole}
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-navy-900 font-semibold border border-purple-200 dark:border-purple-700">
                  Topic: {roleCategories.find((c) => c.id === selectedCategory)?.name}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-navy-900 font-semibold border border-purple-200 dark:border-purple-700">
                  Query: "{searchQuery}"
                </span>
              )}
              <span className="font-bold">({filteredFaqs.length} results)</span>
            </div>
            
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-purple-700 dark:text-purple-300 hover:underline font-bold"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-navy-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-500 flex items-center justify-center mx-auto">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No matching answers found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              We couldn't find any articles matching your search in the {selectedRole !== 'all' ? selectedRole : ''} section.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedRole('all');
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl"
              >
                Ask Support Desk
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`bg-white dark:bg-navy-900 border rounded-2xl transition-all duration-200 overflow-hidden shadow-xs ${
                    isOpen
                      ? 'border-purple-300 dark:border-purple-700 shadow-md ring-1 ring-purple-400/20'
                      : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  {/* Header / Question Toggle Button */}
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-start justify-between gap-4 group"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800">
                          {faq.categoryName}
                        </span>
                        {selectedRole === 'all' && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                            ROLES.find(r => r.id === faq.role)?.badgeColor || ''
                          }`}>
                            {faq.role}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {faq.q}
                      </h4>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'rotate-180 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                          : 'bg-gray-100 dark:bg-navy-800 text-gray-500 group-hover:bg-purple-50 group-hover:text-purple-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Body */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-50 dark:border-gray-800/60 space-y-3.5">
                      <p>{faq.a}</p>

                      {/* Optional Terminal Command Snippet */}
                      {faq.command && (
                        <div className="p-3 bg-gray-900 text-gray-100 rounded-xl font-mono text-xs flex items-center justify-between border border-gray-800">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-400">$</span>
                            <span>{faq.command}</span>
                          </div>
                          <button
                            onClick={() => handleCopyCommand(faq.command)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="Copy command"
                          >
                            {copiedCommand ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Optional Pro Tip Callout */}
                      {faq.tip && (
                        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                          <span><strong>Pro Tip:</strong> {faq.tip}</span>
                        </div>
                      )}

                      {/* Tags & Action Row */}
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {faq.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-navy-800 text-gray-500 dark:text-gray-400"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>

                        {/* Interactive Feedback + Copy Answer */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCopyFaq(faq)}
                            className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-purple-600 transition-colors"
                          >
                            {copiedFaqId === faq.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Answer</span>
                              </>
                            )}
                          </button>

                          <span className="text-gray-300 dark:text-gray-700">|</span>

                          {faqFeedback[faq.id] ? (
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              ✓ Thanks for your feedback!
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                              <span>Helpful?</span>
                              <button
                                onClick={() => handleFeedback(faq.id, 'yes')}
                                className="p-1 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
                                title="Yes, helpful"
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleFeedback(faq.id, 'no')}
                                className="p-1 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                                title="Not helpful"
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* ==================== ROLE-SPECIFIC INTERACTIVE WIDGET ==================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* DEVELOPER: Terminal Cheatsheet */}
        {(selectedRole === 'developer' || selectedRole === 'all') && (
          <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-2xl relative overflow-hidden mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-wide">Developer Quick Start Terminal</h3>
                  <p className="text-xs text-gray-400">Essential build and dev commands for React 18 + Vite Fusion templates</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
            </div>

            {/* Terminal Command Selector */}
            <div className="flex flex-wrap gap-2 pt-6 pb-4">
              {DEVELOPER_COMMANDS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCommandIdx(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                    activeCommandIdx === idx
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'bg-navy-900 text-gray-400 hover:text-white hover:bg-navy-800 border border-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Code Line Display */}
            <div className="p-4 bg-navy-900 rounded-2xl border border-gray-800 font-mono text-xs sm:text-sm flex items-center justify-between">
              <div className="flex items-center gap-3 text-emerald-300 overflow-x-auto">
                <span className="text-gray-500 select-none">$</span>
                <span className="text-emerald-400">{DEVELOPER_COMMANDS[activeCommandIdx]?.cmd || 'npm run dev'}</span>
              </div>
              <button
                onClick={() => handleCopyCommand(DEVELOPER_COMMANDS[activeCommandIdx]?.cmd || 'npm run dev')}
                className="ml-4 px-3 py-1.5 bg-gray-800 hover:bg-emerald-600 text-gray-300 hover:text-white rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedCommand ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-gray-400 mt-3">
              Standard scripts configured in package.json. Fully supports Node.js 18+ and latest npm/yarn/pnpm/bun.
            </p>
          </div>
        )}

        {/* CUSTOMER: 4-Step Checklist */}
        {selectedRole === 'customer' && (
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Customer Setup Walkthrough</h3>
                <p className="text-xs text-gray-400">Launch your new website in 4 simple steps without headache</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CUSTOMER_STEPS.map((s) => (
                <div key={s.step} className="p-4 rounded-2xl bg-gray-50 dark:bg-navy-950 border border-gray-100 dark:border-gray-800 space-y-2">
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">{s.step}</span>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{s.title}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLIENT: Agency Delivery Protocol */}
        {selectedRole === 'client' && (
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Agency & Client Delivery Protocol</h3>
                <p className="text-xs text-gray-400">Best practices for client handoff, corporate invoicing, and white-labeling</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CLIENT_CHECKLIST.map((s) => (
                <div key={s.step} className="p-4 rounded-2xl bg-gray-50 dark:bg-navy-950 border border-gray-100 dark:border-gray-800 space-y-2">
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400 font-mono">{s.step}</span>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{s.title}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN: Curation & Review Protocol */}
        {selectedRole === 'admin' && (
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Admin Moderation & Quality Checklist</h3>
                <p className="text-xs text-gray-400">Review guidelines for approving submissions and monthly payout reconciliations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ADMIN_SOP.map((s) => (
                <div key={s.step} className="p-4 rounded-2xl bg-gray-50 dark:bg-navy-950 border border-gray-100 dark:border-gray-800 space-y-2">
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono">{s.step}</span>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{s.title}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

      {/* ==================== 24/7 SUPPORT CHANNELS ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-xs font-bold">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Still Need Personal Support?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            We're Here Around the Clock
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Reach out directly to our engineering desk, author community, or enterprise client coordinators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Ticket Desk */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Submit Support Ticket</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Open a direct technical ticket with our core engineers for bugs, template customizations, or billing inquiries.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Response in &lt; 2 hours</span>
              </div>
            </div>

            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Open Support Ticket</span>
            </button>
          </div>

          {/* Card 2: Discord Community */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Developer Discord</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Join 18,000+ developers, template authors, and designers sharing tips, feedback, and code snippets in real-time.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Community Voice & Chat</span>
              </div>
            </div>

            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/25 transition-all active:scale-98 flex items-center justify-center gap-2 text-center"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Join Discord Server</span>
            </a>
          </div>

          {/* Card 3: Direct Email */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Direct Email Support</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Send your inquiry directly to our engineering desk for enterprise SLA contracts, refunds, or author partnerships.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>support@fusionthemes.com</span>
              </div>
            </div>

            <a
              href="mailto:support@fusionthemes.com"
              className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl transition-all active:scale-98 flex items-center justify-center gap-2 text-center"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Direct Email</span>
            </a>
          </div>

        </div>
      </section>

      {/* ==================== TICKET SUBMISSION MODAL ==================== */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => {
                setIsTicketModalOpen(false);
                setTicketSuccess(null);
              }}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            {ticketSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Ticket Submitted!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Your ticket reference is <strong className="text-purple-600 font-mono text-sm">{ticketSuccess}</strong>. Our engineering team will reply to your email within 2 hours.
                </p>
                <button
                  onClick={() => {
                    setIsTicketModalOpen(false);
                    setTicketSuccess(null);
                  }}
                  className="px-6 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6 space-y-1">
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                    Submit Technical Support Ticket
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Provide relevant details about your question, setup issue, or template inquiry.
                  </p>
                </div>

                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketForm.name}
                      onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                      placeholder="e.g. Dave Developer"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                      placeholder="e.g. developer@fusion.com"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Topic Category
                      </label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Technical Question">Technical / Dev Question</option>
                        <option value="Author Submission">Author Hub Submission</option>
                        <option value="Download Issue">Download / Extraction Issue</option>
                        <option value="Commercial License">Commercial License Inquiry</option>
                        <option value="Billing / Refund">Billing or Refund Claim</option>
                        <option value="Other">Other Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Urgency Priority
                      </label>
                      <select
                        value={ticketForm.priority}
                        onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Normal">Normal (&lt; 2 hrs)</option>
                        <option value="High">High Urgency (&lt; 1 hr)</option>
                        <option value="Critical">Production Broken</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      placeholder="Brief summary of your question"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Detailed Message
                    </label>
                    <textarea
                      rows="4"
                      required
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                      placeholder="Describe the issue, include terminal error logs, template name, or order ID..."
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Ticket to Engineers</span>
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default HelpPage;
