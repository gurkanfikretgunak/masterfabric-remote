export interface Tenant {
  id: string;
  name: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}

export interface AppConfig {
  id: string;
  tenant_id: string;
  key_name: string;
  draft_json: Record<string, any>;
  published_json: Record<string, any>;
  last_published_at: string | null;
  request_count: number;
  created_at: string;
  updated_at: string;
}

export interface AppConfigWithTenant extends AppConfig {
  tenant?: {
    name: string;
  };
}

export interface CreateTenantInput {
  name: string;
  api_key: string;
}

export interface UpdateTenantInput {
  name?: string;
  api_key?: string;
}

export interface CreateConfigInput {
  tenant_id: string;
  key_name: string;
  draft_json?: Record<string, any>;
  published_json?: Record<string, any>;
}

export interface UpdateConfigInput {
  key_name?: string;
  draft_json?: Record<string, any>;
  published_json?: Record<string, any>;
}

export type ConfigStatus = 'published' | 'draft';

