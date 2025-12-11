import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { storage } from '@/lib/utils/storage';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const url = storage.getSupabaseUrl();
  const anonKey = storage.getSupabaseAnonKey();

  if (!url || !anonKey) {
    throw new Error('Supabase credentials not found. Please complete onboarding.');
  }

  supabaseClient = createClient(url, anonKey);
  return supabaseClient;
}

export function createSupabaseClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey);
}

export function resetSupabaseClient(): void {
  supabaseClient = null;
}

