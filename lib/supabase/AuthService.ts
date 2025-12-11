import { SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_EMAIL = 'masterfabric-developer@masterfabric.co';
const DEFAULT_PASSWORD = 'masterfabric-developer';

export class AuthService {
  constructor(private client: SupabaseClient) {}

  async signInWithDefaultCredentials(): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.client.auth.signInWithPassword({
        email: DEFAULT_EMAIL,
        password: DEFAULT_PASSWORD,
      });

      return { error: error ? new Error(error.message) : null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Authentication failed') };
    }
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this.client.auth.getUser();
    return { user, error };
  }
}

