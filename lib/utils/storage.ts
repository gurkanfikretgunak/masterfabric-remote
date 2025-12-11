const STORAGE_KEYS = {
  SUPABASE_URL: 'supabase_url',
  SUPABASE_ANON_KEY: 'supabase_anon_key',
} as const;

export const storage = {
  getSupabaseUrl(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.SUPABASE_URL);
  },

  getSupabaseAnonKey(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
  },

  setSupabaseUrl(url: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url);
  },

  setSupabaseAnonKey(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, key);
  },

  hasCredentials(): boolean {
    return !!(this.getSupabaseUrl() && this.getSupabaseAnonKey());
  },

  clearCredentials(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
  },

  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

/**
 * Generates a random API key in the format: mfr_xxxxxxxxxxxx
 * @param length - Length of the random part (default: 12)
 * @returns A randomly generated API key
 */
export function generateApiKey(length: number = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomPart = Array.from({ length }, () => 
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
  return `mfr_${randomPart}`;
}

