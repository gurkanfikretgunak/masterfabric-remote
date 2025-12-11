const STORAGE_KEYS = {
  SUPABASE_URL: 'supabase_url',
  SUPABASE_ANON_KEY: 'supabase_anon_key',
  SIGNED_OUT: 'mfr_signed_out',
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

  isSignedOut(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.SIGNED_OUT) === '1';
  },

  setSignedOut(value: boolean): void {
    if (typeof window === 'undefined') return;
    if (value) localStorage.setItem(STORAGE_KEYS.SIGNED_OUT, '1');
    else localStorage.removeItem(STORAGE_KEYS.SIGNED_OUT);
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

/**
 * Generates a random tenant name with common prefixes
 * @returns A randomly generated tenant name
 */
export function generateTenantName(): string {
  const prefixes = ['Production', 'Staging', 'Development', 'Mobile', 'Web', 'API', 'Backend', 'Frontend'];
  const suffixes = ['App', 'Service', 'Platform', 'System', 'Client', 'Server'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix} ${suffix}`;
}

/**
 * Generates a random config key name with common patterns
 * @returns A randomly generated config key name
 */
export function generateConfigName(): string {
  const prefixes = ['homepage', 'app', 'feature', 'api', 'ui', 'mobile', 'web', 'settings', 'config', 'flags'];
  const suffixes = ['flags', 'config', 'settings', 'params', 'options', 'prefs', 'data'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  // Avoid duplicate (e.g., "flags_flags")
  if (prefix === suffix) {
    return prefix;
  }
  
  return `${prefix}_${suffix}`;
}

