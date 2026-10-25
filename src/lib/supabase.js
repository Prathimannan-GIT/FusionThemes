import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables or admin configuration
export const getSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('fusion_supabase_url');
  const localKey = localStorage.getItem('fusion_supabase_key');

  const url = (envUrl || localUrl || '').trim();
  const key = (envKey || localKey || '').trim();

  const isConfigured = Boolean(
    url && 
    key && 
    url.startsWith('https://') && 
    !url.includes('placeholder')
  );

  return { url, key, isConfigured };
};

let clientInstance = null;

export const getSupabaseClient = () => {
  if (clientInstance) return clientInstance;

  const { url, key, isConfigured } = getSupabaseCredentials();

  if (isConfigured) {
    try {
      clientInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      return clientInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
    }
  }

  return null;
};

export const initSupabaseClient = (url, key) => {
  if (!url || !key) {
    clientInstance = null;
    localStorage.removeItem('fusion_supabase_url');
    localStorage.removeItem('fusion_supabase_key');
    return null;
  }

  localStorage.setItem('fusion_supabase_url', url.trim());
  localStorage.setItem('fusion_supabase_key', key.trim());

  try {
    clientInstance = createClient(url.trim(), key.trim(), {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    return clientInstance;
  } catch (err) {
    console.error('Failed to instantiate Supabase client with given credentials:', err);
    return null;
  }
};
