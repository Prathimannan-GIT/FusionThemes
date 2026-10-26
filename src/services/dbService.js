import { getSupabaseClient, getSupabaseCredentials } from '../lib/supabase';

/**
 * Fusion Themes Database Service
 * Bridges local state, server disk storage (src/data/live_db.json),
 * and live PostgreSQL tables via Supabase.
 */

// ==================== 1. SERVER DISK DATABASE API (npm run dev) ====================

export const fetchServerDiskDb = async () => {
  try {
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const urlsToTry = [
      `${cleanBase}api/db/sync`,
      '/api/db/sync'
    ];

    for (const url of urlsToTry) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json && (json.templates || json.data)) {
            return json.data || json;
          }
        }
      } catch {}
    }
    return null;
  } catch {
    return null;
  }
};

export const saveServerDiskDb = async (dbPayload) => {
  try {
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const urlsToTry = [
      `${cleanBase}api/db/sync`,
      '/api/db/sync'
    ];

    for (const url of urlsToTry) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dbPayload)
        });
        if (res.ok) return true;
      } catch {}
    }
    return false;
  } catch {
    return false;
  }
};

// ==================== 2. SUPABASE POSTGRESQL HEALTH & STATUS ====================

export const checkDbConnection = async () => {
  const { isConfigured, url } = getSupabaseCredentials();
  if (!isConfigured) {
    return {
      connected: false,
      mode: 'Local Relational Cache',
      message: 'No live PostgreSQL credentials configured. Using local relational tables schema and server file database.'
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      mode: 'Connection Failed',
      message: 'Could not initialize client. Check URL and API key.'
    };
  }

  try {
    const { data, error } = await client.from('categories').select('id').limit(1);
    if (error) {
      return {
        connected: false,
        mode: 'PostgreSQL Authenticated (Tables Pending)',
        message: `Database responded: ${error.message}. Run supabase_schema.sql in the Supabase SQL editor.`
      };
    }
    return {
      connected: true,
      mode: 'Live PostgreSQL (Connected)',
      endpoint: url,
      message: 'Connected to live PostgreSQL database tables.'
    };
  } catch (err) {
    return {
      connected: false,
      mode: 'Network Error',
      message: err.message
    };
  }
};

// ==================== 3. TEMPLATES TABLE OPERATIONS ====================

export const fetchTemplatesFromDb = async () => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('templates')
      .select('*, reviews(*), template_likes(user_id)');

    if (error || !data || data.length === 0) return null;

    return data.map((t) => ({
      id: t.id,
      title: t.title,
      subtitle: t.subtitle,
      category: t.category_id,
      categoryName: t.category_id ? (t.category_id.charAt(0).toUpperCase() + t.category_id.slice(1)) : 'Business',
      price: Number(t.price),
      image: t.image_url,
      bannerImage: t.image_url,
      demoUrl: t.demo_url,
      developerName: t.developer_name,
      developerId: t.developer_name ? t.developer_name.toLowerCase().replace(/\s+/g, '-') : 'empsf167it-tech',
      language: t.language || 'JavaScript (ES6+)',
      framework: t.framework || 'React 18 & Tailwind CSS',
      technologies: t.technologies || ['React 18', 'Tailwind CSS', 'Vite'],
      description: t.description || '',
      features: t.features || [],
      sales: t.sales_count || 0,
      isApproved: t.is_approved !== false,
      reviews: (t.reviews || []).map((r) => ({
        id: r.id,
        userName: r.user_name,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        date: r.created_at ? r.created_at.split('T')[0] : '2026-02-01'
      })),
      reviewsCount: t.reviews?.length || 0,
      rating: t.reviews?.length 
        ? Math.round((t.reviews.reduce((s, r) => s + Number(r.rating || 5), 0) / t.reviews.length) * 10) / 10 
        : null,
      likes: t.template_likes?.length || 0,
      likedBy: t.template_likes?.map((l) => l.user_id) || []
    }));
  } catch (e) {
    console.warn('Could not query templates from live DB:', e);
    return null;
  }
};

export const addTemplateToDb = async (template) => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      id: template.id,
      title: template.title,
      subtitle: template.subtitle || '',
      category_id: template.category || 'business',
      developer_name: template.developerName || 'Verified Author',
      price: Number(template.price) || 0,
      image_url: template.image || template.bannerImage || '',
      demo_url: template.demoUrl || '',
      language: template.language || 'JavaScript (ES6+)',
      framework: template.framework || 'React 18 & Tailwind CSS',
      technologies: Array.isArray(template.technologies) ? template.technologies : [],
      description: template.description || '',
      features: Array.isArray(template.features) ? template.features : [],
      sales_count: Number(template.sales) || 0,
      is_approved: template.isApproved !== false
    };

    const { error } = await client.from('templates').upsert(payload);
    if (error) console.warn('Supabase template insert warning:', error);
    return !error;
  } catch (e) {
    console.warn('Error inserting template into DB:', e);
    return false;
  }
};

export const updateTemplateInDb = async (templateId, updatedFields) => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const patch = {};
    if (updatedFields.title) patch.title = updatedFields.title;
    if (updatedFields.subtitle) patch.subtitle = updatedFields.subtitle;
    if (updatedFields.category) patch.category_id = updatedFields.category;
    if (updatedFields.price !== undefined) patch.price = Number(updatedFields.price);
    if (updatedFields.image) patch.image_url = updatedFields.image;
    if (updatedFields.demoUrl) patch.demo_url = updatedFields.demoUrl;
    if (updatedFields.description) patch.description = updatedFields.description;
    patch.updated_at = new Date().toISOString();

    const { error } = await client.from('templates').update(patch).eq('id', templateId);
    return !error;
  } catch (e) {
    return false;
  }
};

export const deleteTemplateFromDb = async (templateId) => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('templates').delete().eq('id', templateId);
    return !error;
  } catch (e) {
    return false;
  }
};

// ==================== 4. ORDERS & PAYMENTS TABLE OPERATIONS ====================

export const fetchOrdersFromDb = async () => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('orders')
      .select('*, order_items(*), payment_transactions(*)');

    if (error || !data) return null;

    return data.map((o) => ({
      id: o.id,
      transactionId: o.payment_transactions?.[0]?.transaction_reference || `txn_${o.id}`,
      date: o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      items: (o.order_items || []).map((it) => ({
        id: it.template_id,
        price: Number(it.price)
      })),
      total: Number(o.total_amount),
      customerName: o.customer_name,
      customerEmail: o.customer_email,
      status: o.status,
      verified: true
    }));
  } catch (e) {
    return null;
  }
};

export const recordOrderInDb = async (order, paymentDetails) => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    // A. Insert Order
    const { error: orderErr } = await client.from('orders').insert({
      id: order.id,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      total_amount: order.total,
      status: 'Completed'
    });

    if (orderErr) {
      console.error('Database Error inserting order:', orderErr);
      return false;
    }

    // B. Insert Order Items
    if (Array.isArray(order.items) && order.items.length > 0) {
      const itemsPayload = order.items.map((it) => ({
        order_id: order.id,
        template_id: it.id,
        price: it.price
      }));
      await client.from('order_items').insert(itemsPayload);
    }

    // C. Insert Payment Transaction Record
    await client.from('payment_transactions').insert({
      order_id: order.id,
      transaction_reference: paymentDetails.transactionId,
      gateway: paymentDetails.gateway || 'Stripe',
      amount: order.total,
      currency: paymentDetails.currency || 'USD',
      payment_status: 'succeeded',
      card_brand: paymentDetails.cardBrand,
      card_last4: paymentDetails.last4,
      verified_by_server: true
    });

    // D. Increment Sales Count in DB
    for (const it of order.items) {
      try {
        await client.rpc('increment_template_sales', { target_template_id: it.id });
      } catch {
        const { data: current } = await client.from('templates').select('sales_count').eq('id', it.id).single();
        if (current) {
          await client.from('templates').update({ sales_count: (current.sales_count || 0) + 1 }).eq('id', it.id);
        }
      }
    }

    return true;
  } catch (e) {
    console.error('Error committing verified transaction to DB:', e);
    return false;
  }
};

// ==================== 5. REVIEWS & RATINGS ====================

export const submitReviewToDb = async ({ templateId, userId, userName, rating, comment, title }) => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('reviews').insert({
      template_id: templateId,
      user_id: userId || null,
      user_name: userName,
      rating: Number(rating),
      title: title || 'Verified Purchase Review',
      comment
    });
    return !error;
  } catch (e) {
    return false;
  }
};

// ==================== 6. LIKES ====================

export const toggleLikeInDb = async (templateId, userId) => {
  const client = getSupabaseClient();
  if (!client || !userId) return false;

  try {
    const { data: existing } = await client
      .from('template_likes')
      .select('*')
      .eq('template_id', templateId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      await client.from('template_likes').delete().eq('template_id', templateId).eq('user_id', userId);
      return { isLiked: false };
    } else {
      await client.from('template_likes').insert({ template_id: templateId, user_id: userId });
      return { isLiked: true };
    }
  } catch (e) {
    return false;
  }
};

// ==================== 7. CLIENT CUSTOM PROJECT BRIEFS ====================

export const fetchClientRequestsFromDb = async () => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('client_requests').select('*');
    if (error || !data) return null;
    return data.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category_id || 'business',
      categoryName: (r.category_id || 'Business').charAt(0).toUpperCase() + (r.category_id || 'business').slice(1),
      description: r.description,
      budget: r.budget || '$500 - $1,500',
      timeline: r.timeline || '1-2 weeks',
      status: r.status || 'Pending Review',
      date: r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      clientName: 'Valued Client'
    }));
  } catch (e) {
    return null;
  }
};

export const addClientRequestToDb = async (req) => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('client_requests').insert({
      id: req.id,
      category_id: req.category || 'business',
      title: req.title,
      description: req.description,
      budget: req.budget,
      timeline: req.timeline,
      status: req.status || 'Pending Review'
    });
    return !error;
  } catch (e) {
    return false;
  }
};
