import { getSupabaseClient, getSupabaseCredentials } from '../lib/supabase';

/**
 * Fusion Themes Database Service
 * Bridges local state and live PostgreSQL tables via Supabase
 */

// 1. Connection Health Check
export const checkDbConnection = async () => {
  const { isConfigured, url } = getSupabaseCredentials();
  if (!isConfigured) {
    return {
      connected: false,
      mode: 'Local Relational Cache',
      message: 'No live PostgreSQL credentials configured. Using local relational tables schema.'
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

// 2. Fetch Templates from Database
export const fetchTemplatesFromDb = async () => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('templates')
      .select('*, reviews(*), template_likes(user_id)');

    if (error || !data) return null;

    return data.map((t) => ({
      ...t,
      reviews: t.reviews || [],
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

// 3. Record Verified Order and Payment Transaction in Database
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
      } catch (rpcErr) {
        // Fallback update
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

// 4. Submit Rating & Review to DB
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

// 5. Toggle Like in DB
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
