import { SupabaseClient } from '@supabase/supabase-js';
import {
  Tenant,
  AppConfig,
  AppConfigWithTenant,
  CreateTenantInput,
  UpdateTenantInput,
  CreateConfigInput,
  UpdateConfigInput,
} from '@/types';

export class SupabaseService {
  constructor(private client: SupabaseClient) {}

  // Tenant operations
  async getTenants(): Promise<Tenant[]> {
    const { data, error } = await this.client
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getTenant(id: string): Promise<Tenant | null> {
    const { data, error } = await this.client
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createTenant(input: CreateTenantInput): Promise<Tenant> {
    const { data, error } = await this.client
      .from('tenants')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTenant(id: string, input: UpdateTenantInput): Promise<Tenant> {
    const { data, error } = await this.client
      .from('tenants')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTenant(id: string): Promise<void> {
    const { error } = await this.client
      .from('tenants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Config operations
  async getConfigs(): Promise<AppConfigWithTenant[]> {
    const { data, error } = await this.client
      .from('app_configs')
      .select(`
        *,
        tenant:tenants(name)
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((config: any) => ({
      ...config,
      tenant: config.tenant || null,
    }));
  }

  async getConfig(id: string): Promise<AppConfigWithTenant | null> {
    const { data, error } = await this.client
      .from('app_configs')
      .select(`
        *,
        tenant:tenants(name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? {
      ...data,
      tenant: data.tenant || null,
    } : null;
  }

  async createConfig(input: CreateConfigInput): Promise<AppConfig> {
    const { data, error } = await this.client
      .from('app_configs')
      .insert({
        ...input,
        draft_json: input.draft_json || {},
        published_json: input.published_json || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateConfig(id: string, input: UpdateConfigInput): Promise<AppConfig> {
    const { data, error } = await this.client
      .from('app_configs')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async publishConfig(id: string): Promise<AppConfig> {
    // Get current draft
    const config = await this.getConfig(id);
    if (!config) {
      throw new Error('Config not found');
    }

    // Publish draft to published_json
    const { data, error } = await this.client
      .from('app_configs')
      .update({
        published_json: config.draft_json,
        last_published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteConfig(id: string): Promise<void> {
    const { error } = await this.client
      .from('app_configs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Statistics
  async getStats() {
    const configs = await this.getConfigs();
    const tenants = await this.getTenants();

    const totalConfigs = configs.length;
    const totalRequests = configs.reduce((sum, c) => sum + c.request_count, 0);
    const activeTenants = tenants.length;

    return {
      totalConfigs,
      totalRequests,
      activeTenants,
    };
  }
}

