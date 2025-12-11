# MasterFabric Remote - Database Schema Analysis

## Overview

The multi-tenant architecture requires three core tables with strict RLS policies.

---

## Tables

### 1. tenants (Kiracılar)

**Purpose**: Store identity and API access keys for each tenant/application.

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for API key lookups
CREATE INDEX idx_tenants_api_key ON tenants(api_key);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique tenant identifier |
| name | TEXT | NOT NULL | Tenant display name |
| api_key | TEXT | UNIQUE, NOT NULL | API access key for external calls |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

---

### 2. app_configs (Application Configurations)

**Purpose**: Store Remote Config data with version control and usage statistics.

```sql
CREATE TABLE app_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  draft_json JSONB NOT NULL DEFAULT '{}',
  published_json JSONB NOT NULL DEFAULT '{}',
  last_published_at TIMESTAMP WITH TIME ZONE,
  request_count BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(tenant_id, key_name)
);

-- Indexes for performance
CREATE INDEX idx_app_configs_tenant_id ON app_configs(tenant_id);
CREATE INDEX idx_app_configs_key_name ON app_configs(key_name);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique config identifier |
| tenant_id | UUID | FK, NOT NULL | Reference to tenant |
| key_name | TEXT | NOT NULL | Config key (e.g., `homepage_flags`) |
| draft_json | JSONB | NOT NULL | Unpublished draft data |
| published_json | JSONB | NOT NULL | Live published data |
| last_published_at | TIMESTAMP | - | Last publish timestamp |
| request_count | BIGINT | DEFAULT 0 | API call counter |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

---

### 3. auth.users (Management Users)

**Purpose**: Supabase Auth managed table for admin users.

Default user created via SQL script:
- Email: `masterfabric-developer@masterfabric.io`
- Password: `masterfabric-developer`

---

## Row-Level Security (RLS) Policies

### Enable RLS

```sql
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_configs ENABLE ROW LEVEL SECURITY;
```

### Tenants Table Policies

```sql
-- Authenticated users can read all tenants
CREATE POLICY "Authenticated users can read tenants"
  ON tenants FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Authenticated users can insert tenants
CREATE POLICY "Authenticated users can insert tenants"
  ON tenants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated users can update tenants
CREATE POLICY "Authenticated users can update tenants"
  ON tenants FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Authenticated users can delete tenants
CREATE POLICY "Authenticated users can delete tenants"
  ON tenants FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

### App Configs Table Policies

```sql
-- Authenticated users can read all configs
CREATE POLICY "Authenticated users can read configs"
  ON app_configs FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Authenticated users can insert configs
CREATE POLICY "Authenticated users can insert configs"
  ON app_configs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated users can update configs
CREATE POLICY "Authenticated users can update configs"
  ON app_configs FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Authenticated users can delete configs
CREATE POLICY "Authenticated users can delete configs"
  ON app_configs FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

---

## API Access (Public Read)

For Remote Config API access without authentication:

```sql
-- Public read access for published configs via API key
CREATE POLICY "Public can read published configs via API"
  ON app_configs FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM tenants 
      WHERE tenants.id = app_configs.tenant_id
    )
  );
```

---

## Complete Setup Script

```sql
-- Full initialization script for Onboarding
-- Run this in Supabase SQL Editor

-- 1. Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create app_configs table
CREATE TABLE IF NOT EXISTS app_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  draft_json JSONB NOT NULL DEFAULT '{}',
  published_json JSONB NOT NULL DEFAULT '{}',
  last_published_at TIMESTAMP WITH TIME ZONE,
  request_count BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, key_name)
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_tenants_api_key ON tenants(api_key);
CREATE INDEX IF NOT EXISTS idx_app_configs_tenant_id ON app_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_app_configs_key_name ON app_configs(key_name);

-- 4. Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_configs ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies (see above for full policy definitions)

-- 6. Create default admin user (handled by Supabase Auth)
```
