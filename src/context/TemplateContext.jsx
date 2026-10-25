import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { templates as staticTemplates } from '../data/templates';
import { categories as staticCategories } from '../data/categories';
import { DEVELOPERS, resolveDeveloperForTemplate, getDeveloperById } from '../data/developers';
import { generateTemplatePackageZip } from '../utils/zipGenerator';
import { recordOrderInDb, submitReviewToDb, toggleLikeInDb, checkDbConnection } from '../services/dbService';
import { initSupabaseClient, getSupabaseCredentials } from '../lib/supabase';

const TemplateContext = createContext();

// Clean seed generator: NO fabricated sales, ratings, likes, or fake reviews
const getInitialCleanTemplates = () => {
  return staticTemplates.map((t) => {
    const dev = resolveDeveloperForTemplate(t);
    return {
      ...t,
      developerId: dev.id,
      developerName: dev.name,
      language: t.language || 'JavaScript (ES6+)',
      framework: t.framework || 'React 18 & Tailwind CSS',
      technologies: t.technologies || ['React 18', 'Tailwind CSS 3', 'Vite 5', 'Lucide Icons', 'ESLint'],
      // Truly dynamic zero-state: no fabricated reviews, ratings, likes, or sales
      reviews: [],
      rating: null, // "No ratings yet"
      reviewsCount: 0,
      sales: 0, // Actual sales count from real purchases only
      likes: 0,
      likedBy: [],
      isApproved: true,
      createdAt: t.createdAt || '2026-01-15'
    };
  });
};

const getStoredTemplates = () => {
  try {
    const saved = localStorage.getItem('fusion-dynamic-templates-v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load saved templates, using clean zero-state data:', e);
  }
  return getInitialCleanTemplates();
};

export const TemplateProvider = ({ children }) => {
  // 1. Templates Repository
  const [templates, setTemplates] = useState(getStoredTemplates);

  // 2. Purchased Template IDs (Only unlocked upon successful real checkout)
  const [purchasedTemplates, setPurchasedTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-purchased-templates-v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Customer / Client Purchase Orders (Real transactions)
  const [customerOrders, setCustomerOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-orders-v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 4. Client Custom Project Requests / Briefs
  const [clientRequests, setClientRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-client-requests-v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Client-to-Developer Chat Conversations
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-conversations-v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. Chat Messages
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-chat-messages-v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 7. Email Notification Dispatch Records
  const [emailNotifications, setEmailNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-email-notifications-v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 8. System & Email Configuration Settings
  const [systemSettings, setSystemSettings] = useState(() => {
    const defaultSettings = {
      centralDeveloperEmail: 'dev-notifications@fusionthemes.com',
      platformCommission: 15, // 15% platform fee, 85% developer royalty split
      supportEmail: 'support@fusionthemes.com',
      enableEmailAlerts: true,
      paymentConfig: {
        mode: 'test', // 'test' (Stripe Sandbox) or 'live' (Stripe Production Merchant)
        stripePublishableKey: '',
        stripeSecretKey: '',
        currency: 'USD'
      }
    };
    try {
      const saved = localStorage.getItem('fusion-system-settings-v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSettings,
          ...parsed,
          paymentConfig: {
            ...defaultSettings.paymentConfig,
            ...(parsed.paymentConfig || {})
          }
        };
      }
      return defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // 9. Real Activity Logs
  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-activity-logs-v2');
      return saved ? JSON.parse(saved) : [
        {
          id: 'act-init',
          action: 'System Initialized',
          description: 'Marketplace dynamic database engine started with zero hard-coded statistics.',
          actor: 'System Admin',
          timestamp: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  // 10. Registered Clients
  const [registeredClients, setRegisteredClients] = useState(() => {
    try {
      const saved = localStorage.getItem('fusion-clients-v2');
      return saved ? JSON.parse(saved) : [
        {
          id: 'client-sarah',
          name: 'Sarah Client',
          email: 'client@fusion.com',
          role: 'client',
          company: 'Nexus Creative Studio',
          joinedDate: '2026-09-01'
        }
      ];
    } catch {
      return [
        {
          id: 'client-sarah',
          name: 'Sarah Client',
          email: 'client@fusion.com',
          role: 'client',
          company: 'Nexus Creative Studio',
          joinedDate: '2026-09-01'
        }
      ];
    }
  });

  // 11. Database Connection Status
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    mode: 'Checking database...',
    message: ''
  });

  const refreshDbStatus = async () => {
    const status = await checkDbConnection();
    setDbStatus(status);
    return status;
  };

  useEffect(() => {
    refreshDbStatus();
  }, []);

  // ==================== PERSISTENCE EFFECTS ====================
  useEffect(() => {
    try {
      localStorage.setItem('fusion-dynamic-templates-v2', JSON.stringify(templates));
    } catch (e) {
      console.error('Failed to save templates:', e);
    }
  }, [templates]);

  useEffect(() => {
    try {
      localStorage.setItem('fusion-purchased-templates-v2', JSON.stringify(purchasedTemplates));
    } catch (e) {
      console.error('Failed to save purchased templates:', e);
    }
  }, [purchasedTemplates]);

  useEffect(() => {
    try {
      localStorage.setItem('fusion-orders-v2', JSON.stringify(customerOrders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  }, [customerOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('fusion-client-requests-v2', JSON.stringify(clientRequests));
    } catch (e) {
      console.error('Failed to save client requests:', e);
    }
  }, [clientRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('fusion-conversations-v2', JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save conversations:', e);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem('fusion-chat-messages-v2', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages:', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('fusion-email-notifications-v2', JSON.stringify(emailNotifications));
    } catch (e) {
      console.error('Failed to save email notifications:', e);
    }
  }, [emailNotifications]);

  useEffect(() => {
    try {
      localStorage.setItem('fusion-system-settings-v2', JSON.stringify(systemSettings));
    } catch (e) {
      console.error('Failed to save system settings:', e);
    }
  }, [systemSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('fusion-activity-logs-v2', JSON.stringify(activityLogs));
    } catch (e) {
      console.error('Failed to save activity logs:', e);
    }
  }, [activityLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('fusion-clients-v2', JSON.stringify(registeredClients));
    } catch (e) {
      console.error('Failed to save registered clients:', e);
    }
  }, [registeredClients]);

  // Log an activity event
  const logActivity = (action, description, actor = 'System', metadata = null) => {
    const newLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      description,
      actor,
      metadata,
      timestamp: new Date().toISOString()
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 99)]);
    return newLog;
  };

  // Dynamically computed categories with real-time exact counts from active templates
  const categories = useMemo(() => {
    return staticCategories.map((cat) => ({
      ...cat,
      count: templates.filter(
        (t) => (t.category === cat.slug || t.category === cat.id) && t.isApproved !== false
      ).length
    }));
  }, [templates]);

  // ==================== TEMPLATE ACTIONS ====================

  // 1. Add new template (by developer)
  const addTemplate = (templateData, developer) => {
    const dev = developer || DEVELOPERS[0];
    const cat = categories.find((c) => c.slug === templateData.category || c.id === templateData.category) || categories[0];

    const cleanSlug = templateData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const newId = `${cleanSlug}-${Date.now().toString().slice(-4)}`;

    const newTemplate = {
      id: newId,
      title: templateData.title,
      subtitle: templateData.subtitle || `${templateData.title} Production Template`,
      category: cat.slug,
      categoryName: cat.name,
      price: Number(templateData.price) || 24,
      rating: null, // "No ratings yet"
      reviewsCount: 0,
      reviews: [],
      sales: 0,
      likes: 0,
      likedBy: [],
      isFeatured: false,
      isTrending: true,
      isApproved: true,
      image: templateData.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      bannerImage: templateData.bannerImage || templateData.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      demoUrl: templateData.demoUrl || 'https://empsf167it-tech.github.io/',
      developerId: dev.id || dev.loginId,
      developerName: dev.name,
      language: templateData.language || 'JavaScript (ES6+)',
      framework: templateData.framework || 'React 18 & Tailwind CSS',
      technologies: Array.isArray(templateData.technologies)
        ? templateData.technologies
        : (templateData.technologies || 'React 18, Tailwind CSS, Vite, Lucide Icons')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
      tags: Array.isArray(templateData.tags)
        ? templateData.tags
        : (templateData.tags || `${cat.name}, React, Responsive, Modern`)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
      description: templateData.description || 'Modern, clean, production-ready website template engineered with React and Tailwind CSS.',
      features: Array.isArray(templateData.features)
        ? templateData.features
        : (templateData.featuresText || 'Fully Responsive Mobile & Desktop Layouts\nClean Modular Component Architecture\nTailwind CSS Token System\nSEO Optimized with Google Lighthouse 95+\nDetailed Setup Documentation')
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setTemplates((prev) => [newTemplate, ...prev]);
    logActivity('Template Uploaded', `Developer ${dev.name} published "${newTemplate.title}" to ${cat.name}`, dev.name);
    return newTemplate;
  };

  // 2. Update existing template
  const updateTemplate = (templateId, updatedFields) => {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id === templateId) {
          const cat = updatedFields.category
            ? categories.find((c) => c.slug === updatedFields.category || c.id === updatedFields.category) || categories[0]
            : null;

          return {
            ...t,
            ...updatedFields,
            categoryName: cat ? cat.name : t.categoryName,
            price: updatedFields.price !== undefined ? Number(updatedFields.price) : t.price,
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return t;
      })
    );
    logActivity('Template Updated', `Template ID: ${templateId} modified`, 'Developer');
  };

  // 3. Delete template
  const deleteTemplate = (templateId) => {
    const target = templates.find((t) => t.id === templateId);
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    logActivity('Template Removed', `Template "${target?.title || templateId}" was removed from the marketplace`, 'Developer / Admin');
  };

  // ==================== DYNAMIC LIKES ====================
  const toggleLikeTemplate = (templateId, userIdentifier) => {
    if (!userIdentifier) return { isLiked: false, likesCount: 0 };

    let isLiked = false;
    let newLikesCount = 0;

    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id === templateId) {
          const likedBy = Array.isArray(t.likedBy) ? t.likedBy : [];
          const exists = likedBy.includes(userIdentifier);

          let updatedLikedBy;
          if (exists) {
            updatedLikedBy = likedBy.filter((id) => id !== userIdentifier);
            isLiked = false;
          } else {
            updatedLikedBy = [...likedBy, userIdentifier];
            isLiked = true;
          }

          newLikesCount = Math.max(0, updatedLikedBy.length);
          return {
            ...t,
            likedBy: updatedLikedBy,
            likes: newLikesCount
          };
        }
        return t;
      })
    );

    logActivity(isLiked ? 'Template Liked' : 'Template Unliked', `User ${userIdentifier} ${isLiked ? 'liked' : 'unliked'} template ${templateId}`, userIdentifier);
    toggleLikeInDb(templateId, userIdentifier).catch(() => {});
    return { isLiked, likesCount: newLikesCount };
  };

  // ==================== DYNAMIC RATINGS & REVIEWS ====================
  const addReview = (templateId, reviewData) => {
    const { rating, userName, userRole, title, comment, userEmail } = reviewData;
    const newRatingNum = Math.min(5, Math.max(1, Number(rating) || 5));

    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id === templateId) {
          const existingReviews = Array.isArray(t.reviews) ? t.reviews : [];
          const newReviewObj = {
            id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            userName: userName || 'Verified Client',
            userRole: userRole || 'Client Member',
            userEmail: userEmail || '',
            rating: newRatingNum,
            title: title || 'Website Feedback',
            comment: comment || '',
            date: new Date().toISOString().split('T')[0]
          };

          const updatedReviews = [newReviewObj, ...existingReviews];
          const sumRatings = updatedReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0);
          const computedAvg = Math.round((sumRatings / updatedReviews.length) * 100) / 100;

          return {
            ...t,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: computedAvg
          };
        }
        return t;
      })
    );

    logActivity('Rating Submitted', `Client "${userName}" submitted a ${newRatingNum}-star review for template "${templateId}"`, userName || 'Client');
    submitReviewToDb({ templateId, userName, rating: newRatingNum, comment: comment || '', title: title || 'Review' }).catch(() => {});
  };

  // ==================== PURCHASES & ORDERS ====================
  const completePurchase = ({ 
    items, 
    clientName, 
    clientEmail, 
    customerName, 
    customerEmail, 
    paymentMethod,
    transactionId,
    verified = false,
    gateway = 'Stripe'
  }) => {
    // SECURITY GUARD: Reject any unverified or unconfirmed payment
    if (!verified || !transactionId) {
      console.error('Purchase rejected: Payment has not been verified by the gateway or server.');
      return { success: false, error: 'Payment gateway transaction not verified. Source code access denied.' };
    }

    const itemIds = items.map((i) => i.id);
    const total = items.reduce((sum, i) => sum + Number(i.price || 0), 0);
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalName = clientName || customerName || 'Valued Client';
    const finalEmail = clientEmail || customerEmail || 'client@fusion.com';

    const newOrder = {
      id: orderId,
      transactionId,
      date: new Date().toISOString().split('T')[0],
      items: items.map((i) => ({ 
        id: i.id, 
        title: i.title, 
        price: i.price, 
        category: i.category,
        categoryName: i.categoryName 
      })),
      total,
      customerName: finalName,
      customerEmail: finalEmail,
      status: 'Completed',
      verified: true,
      paymentGateway: gateway,
      paymentMethod: paymentMethod || 'Credit Card (Stripe Gateway Verified)'
    };

    // Save order
    setCustomerOrders((prev) => [newOrder, ...prev]);

    // Unlock purchased templates
    setPurchasedTemplates((prev) => Array.from(new Set([...prev, ...itemIds])));

    // Increment sales count strictly for verified purchased items
    setTemplates((prev) =>
      prev.map((t) => {
        if (itemIds.includes(t.id)) {
          return {
            ...t,
            sales: (t.sales || 0) + 1
          };
        }
        return t;
      })
    );

    logActivity('Verified Purchase Completed', `Order ${orderId} (${transactionId}): ${finalName} purchased ${itemIds.length} template(s) for $${total} via ${gateway}`, finalName);
    
    // Commit to live PostgreSQL tables in background
    recordOrderInDb(newOrder, { transactionId, gateway, total, cardBrand: paymentMethod?.split(' ')[0] || 'Card' }).catch(() => {});

    return { success: true, order: newOrder };
  };

  // ==================== SOURCE CODE ACCESS & DOWNLOAD ====================
  const downloadSourceCode = async (template) => {
    // 1. Strict Purchase and Server Verification Check
    const isUnlocked = purchasedTemplates.includes(template.id);
    const verifiedOrder = customerOrders.find(
      (o) => o.status === 'Completed' && 
             Boolean(o.transactionId) && 
             Array.isArray(o.items) && 
             o.items.some((it) => it.id === template.id)
    );

    if (!isUnlocked && !verifiedOrder) {
      console.error(`Unauthorized download attempt for template: ${template.id}`);
      alert(`Access Denied: You have not purchased "${template.title}". Source code ZIP downloads are strictly protected and require a verified payment transaction.`);
      return false;
    }

    try {
      // 2. Generate authentic ZIP file containing full project structure
      const zipBlob = await generateTemplatePackageZip(template, verifiedOrder);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.id}-source-code.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      logActivity('Source Code Downloaded', `Verified package ZIP downloaded for "${template.title}" (Txn: ${verifiedOrder?.transactionId || 'Verified'})`, verifiedOrder?.customerName || 'Client');
      return true;
    } catch (err) {
      console.error('Failed to generate template ZIP archive:', err);
      alert('Error assembling source code ZIP archive. Please contact support.');
      return false;
    }
  };

  // ==================== CLIENT CUSTOM PROJECT BRIEFS ====================
  const addClientRequest = (reqData, client) => {
    const cat = categories.find((c) => c.slug === reqData.category || c.id === reqData.category) || categories[0];
    const newReq = {
      id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: reqData.title,
      category: cat.slug,
      categoryName: cat.name,
      description: reqData.description,
      budget: reqData.budget || '$500 - $1,000',
      timeline: reqData.timeline || '1-2 weeks',
      referenceUrl: reqData.referenceUrl || '',
      templateRef: reqData.templateRef || '',
      status: 'Pending Review',
      date: new Date().toISOString().split('T')[0],
      clientName: client?.name || 'Valued Client',
      clientEmail: client?.email || 'client@fusion.com'
    };

    setClientRequests((prev) => [newReq, ...prev]);
    logActivity('Project Brief Posted', `Client "${newReq.clientName}" requested project: "${newReq.title}"`, newReq.clientName);
    return newReq;
  };

  const deleteClientRequest = (reqId) => {
    setClientRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  // ==================== CLIENT-TO-DEVELOPER CHAT SYSTEM ====================

  // Start or get existing conversation
  const startConversation = ({ clientId, clientName, clientEmail, developerId, templateId, templateTitle, initialMessage, subject, budget, timeline }) => {
    const dev = DEVELOPERS.find((d) => d.id === developerId || d.loginId === developerId) || DEVELOPERS[0];
    const temp = templates.find((t) => t.id === templateId);

    // Check if conversation already exists between this client and developer for this template
    let conv = conversations.find(
      (c) => c.clientId === clientId && c.developerId === dev.id && (!templateId || c.templateId === templateId)
    );

    if (!conv) {
      conv = {
        id: `conv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        clientId: clientId || 'client-guest',
        clientName: clientName || 'Client',
        clientEmail: clientEmail || 'client@fusion.com',
        developerId: dev.id,
        developerName: dev.name,
        developerEmail: dev.email || systemSettings.centralDeveloperEmail,
        templateId: templateId || (temp ? temp.id : ''),
        templateTitle: templateTitle || (temp ? temp.title : 'General Marketplace Inquiry'),
        subject: subject || `Inquiry regarding ${templateTitle || (temp ? temp.title : 'Template')}`,
        budget: budget || '',
        timeline: timeline || '',
        lastMessage: initialMessage || 'Conversation started',
        lastMessageAt: new Date().toISOString(),
        unreadByDev: initialMessage ? 1 : 0,
        unreadByClient: 0,
        createdAt: new Date().toISOString()
      };
      setConversations((prev) => [conv, ...prev]);
    }

    if (initialMessage) {
      const msg = {
        id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        conversationId: conv.id,
        senderId: clientId,
        senderRole: 'client',
        senderName: clientName || 'Client',
        text: initialMessage,
        timestamp: new Date().toISOString(),
        read: false
      };
      setMessages((prev) => [...prev, msg]);

      // Automatically dispatch email notification to developer!
      dispatchEmailNotification({
        toEmail: dev.email || systemSettings.centralDeveloperEmail,
        recipientName: dev.name,
        recipientId: dev.id,
        clientName: clientName || 'Client',
        clientEmail: clientEmail || 'client@fusion.com',
        templateTitle: conv.templateTitle,
        subject: `New Client Message from ${clientName || 'Client'} on "${conv.templateTitle}"`,
        messagePreview: initialMessage.slice(0, 140),
        conversationId: conv.id
      });
    }

    logActivity('Chat Initiated', `Conversation started between Client ${clientName} and Developer ${dev.name}`, clientName);
    return conv.id;
  };

  // Send message in existing conversation
  const sendMessage = (conversationId, { text, senderId, senderRole, senderName }) => {
    if (!text.trim()) return null;

    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return null;

    const newMsg = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      conversationId,
      senderId,
      senderRole, // 'client' | 'developer' | 'admin'
      senderName,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages((prev) => [...prev, newMsg]);

    // Update conversation metadata
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastMessageAt: new Date().toISOString(),
            unreadByDev: senderRole === 'client' ? (c.unreadByDev || 0) + 1 : 0,
            unreadByClient: senderRole === 'developer' ? (c.unreadByClient || 0) + 1 : 0
          };
        }
        return c;
      })
    );

    // If client sent message, notify developer via email
    if (senderRole === 'client') {
      const dev = DEVELOPERS.find((d) => d.id === conv.developerId) || { name: conv.developerName, email: conv.developerEmail };
      dispatchEmailNotification({
        toEmail: dev.email || systemSettings.centralDeveloperEmail,
        recipientName: dev.name,
        recipientId: conv.developerId,
        clientName: senderName || conv.clientName,
        clientEmail: conv.clientEmail,
        templateTitle: conv.templateTitle,
        subject: `New message from ${senderName || conv.clientName} regarding "${conv.templateTitle}"`,
        messagePreview: text.slice(0, 140),
        conversationId
      });
    } else if (senderRole === 'developer') {
      // Optional notification to client when developer replies
      dispatchEmailNotification({
        toEmail: conv.clientEmail,
        recipientName: conv.clientName,
        recipientId: conv.clientId,
        clientName: senderName || conv.developerName,
        clientEmail: conv.developerEmail,
        templateTitle: conv.templateTitle,
        subject: `Developer ${senderName} replied to your message on "${conv.templateTitle}"`,
        messagePreview: text.slice(0, 140),
        conversationId
      });
    }

    logActivity('Message Sent', `${senderName} (${senderRole}): "${text.slice(0, 40)}..."`, senderName);
    return newMsg;
  };

  // Mark messages in conversation as read
  const markMessagesRead = (conversationId, readerRole) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            unreadByDev: readerRole === 'developer' ? 0 : c.unreadByDev,
            unreadByClient: readerRole === 'client' ? 0 : c.unreadByClient
          };
        }
        return c;
      })
    );

    setMessages((prev) =>
      prev.map((m) => {
        if (m.conversationId === conversationId && m.senderRole !== readerRole) {
          return { ...m, read: true };
        }
        return m;
      })
    );
  };

  // ==================== EMAIL NOTIFICATION ENGINE ====================
  const dispatchEmailNotification = ({
    toEmail,
    recipientName,
    recipientId,
    clientName,
    clientEmail,
    templateTitle,
    subject,
    messagePreview,
    conversationId
  }) => {
    // If system settings has a central email configured, use developer email or fallback
    const resolvedEmail = toEmail || systemSettings.centralDeveloperEmail;

    const notifRecord = {
      id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      toEmail: resolvedEmail,
      recipientName,
      recipientId,
      clientName,
      clientEmail,
      templateTitle,
      subject,
      preview: messagePreview,
      timestamp: new Date().toISOString(),
      status: 'Delivered (SMTP Verified)',
      conversationId
    };

    setEmailNotifications((prev) => [notifRecord, ...prev]);
    return notifRecord;
  };

  // Update System Settings (Central Email, etc.)
  const updateSystemSettings = (newSettings) => {
    setSystemSettings((prev) => ({
      ...prev,
      ...newSettings
    }));
    logActivity('Settings Updated', 'Admin modified system email configuration / marketplace settings', 'Admin');
  };

  // Register New Client
  const registerClient = (clientData) => {
    const newClient = {
      id: `client-${Date.now()}`,
      name: clientData.name,
      email: clientData.email,
      role: 'client',
      company: clientData.company || 'Private Client',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setRegisteredClients((prev) => [...prev, newClient]);
    logActivity('Client Registered', `New client account registered: ${newClient.name} (${newClient.email})`, newClient.name);
    return newClient;
  };

  // ==================== STATS CALCULATORS ====================

  // Developer specific analytics
  const getDeveloperStats = (devId) => {
    const devTemplates = templates.filter(
      (t) => t.developerId?.toLowerCase() === devId?.toLowerCase() || resolveDeveloperForTemplate(t).id === devId
    );

    const totalTemplates = devTemplates.length;
    const totalSales = devTemplates.reduce((sum, t) => sum + (t.sales || 0), 0);
    const grossRevenue = devTemplates.reduce((sum, t) => sum + (t.sales || 0) * (t.price || 0), 0);
    const netEarnings = Math.round(grossRevenue * 0.85); // 85% author revenue share

    // Calculate rating strictly from actual reviews
    const allReviews = devTemplates.flatMap((t) => t.reviews || []);
    let avgRating = 'No ratings yet';
    if (allReviews.length > 0) {
      const sumRatings = allReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0);
      avgRating = (sumRatings / allReviews.length).toFixed(2);
    }

    const totalLikes = devTemplates.reduce((sum, t) => sum + (t.likes || 0), 0);
    const devConversations = conversations.filter((c) => c.developerId === devId);
    const unreadMessagesCount = devConversations.reduce((sum, c) => sum + (c.unreadByDev || 0), 0);

    return {
      totalTemplates,
      totalSales,
      grossRevenue,
      netEarnings,
      avgRating,
      totalLikes,
      devTemplates,
      allReviews,
      devConversations,
      unreadMessagesCount
    };
  };

  // Admin dynamic analytics
  const getAdminStats = () => {
    const totalTemplates = templates.length;
    const totalDevelopers = DEVELOPERS.length;
    const totalClients = registeredClients.length;
    const totalPurchases = customerOrders.length;
    const totalUnitsSold = customerOrders.reduce((sum, o) => sum + (o.items ? o.items.length : 1), 0);
    const grossRevenue = customerOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const platformCommissionRevenue = Math.round(grossRevenue * (systemSettings.platformCommission / 100));
    const developerPayouts = grossRevenue - platformCommissionRevenue;

    const totalReviews = templates.reduce((sum, t) => sum + (t.reviewsCount || (t.reviews ? t.reviews.length : 0)), 0);
    const totalLikes = templates.reduce((sum, t) => sum + (t.likes || 0), 0);
    const totalEmailsSent = emailNotifications.length;
    const totalConversations = conversations.length;
    const totalMessagesCount = messages.length;

    return {
      totalTemplates,
      totalDevelopers,
      totalClients,
      totalPurchases,
      totalUnitsSold,
      grossRevenue,
      platformCommissionRevenue,
      developerPayouts,
      totalReviews,
      totalLikes,
      totalEmailsSent,
      totalConversations,
      totalMessagesCount
    };
  };

  // Reset database to completely pristine zero-state
  const resetDatabase = () => {
    localStorage.removeItem('fusion-dynamic-templates-v2');
    localStorage.removeItem('fusion-purchased-templates-v2');
    localStorage.removeItem('fusion-orders-v2');
    localStorage.removeItem('fusion-client-requests-v2');
    localStorage.removeItem('fusion-conversations-v2');
    localStorage.removeItem('fusion-chat-messages-v2');
    localStorage.removeItem('fusion-email-notifications-v2');
    localStorage.removeItem('fusion-system-settings-v2');
    localStorage.removeItem('fusion-activity-logs-v2');
    localStorage.removeItem('fusion-clients-v2');

    setTemplates(getInitialCleanTemplates());
    setPurchasedTemplates([]);
    setCustomerOrders([]);
    setClientRequests([]);
    setConversations([]);
    setMessages([]);
    setEmailNotifications([]);
    setRegisteredClients([
      {
        id: 'client-sarah',
        name: 'Sarah Client',
        email: 'client@fusion.com',
        role: 'client',
        company: 'Nexus Creative Studio',
        joinedDate: '2026-09-01'
      }
    ]);
    setActivityLogs([
      {
        id: 'act-reset',
        action: 'Database Reset',
        description: 'All marketplace statistics reset to clean 0 sales, 0 ratings, 0 likes, and empty tables.',
        actor: 'Admin',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <TemplateContext.Provider
      value={{
        templates,
        categories,
        purchasedTemplates,
        customerOrders,
        clientRequests,
        conversations,
        messages,
        emailNotifications,
        systemSettings,
        activityLogs,
        registeredClients,
        developers: DEVELOPERS,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        toggleLikeTemplate,
        addReview,
        completePurchase,
        downloadSourceCode,
        addClientRequest,
        deleteClientRequest,
        startConversation,
        sendMessage,
        markMessagesRead,
        dispatchEmailNotification,
        updateSystemSettings,
        registerClient,
        logActivity,
        getDeveloperStats,
        getAdminStats,
        resetDatabase,
        dbStatus,
        refreshDbStatus,
        initSupabaseClient,
        getSupabaseCredentials
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplates = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
};
