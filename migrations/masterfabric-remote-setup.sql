-- MasterFabric Remote Setup
-- Run this in Supabase SQL Editor

-- 1. Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_app_configs_tenant_id ON app_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_app_configs_key_name ON app_configs(key_name);

-- 4. Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_configs ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for tenants
DROP POLICY IF EXISTS "Authenticated users can read tenants" ON tenants;
CREATE POLICY "Authenticated users can read tenants"
  ON tenants FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can insert tenants" ON tenants;
CREATE POLICY "Authenticated users can insert tenants"
  ON tenants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update tenants" ON tenants;
CREATE POLICY "Authenticated users can update tenants"
  ON tenants FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete tenants" ON tenants;
CREATE POLICY "Authenticated users can delete tenants"
  ON tenants FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- 6. Create RLS policies for app_configs
DROP POLICY IF EXISTS "Authenticated users can read configs" ON app_configs;
CREATE POLICY "Authenticated users can read configs"
  ON app_configs FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can insert configs" ON app_configs;
CREATE POLICY "Authenticated users can insert configs"
  ON app_configs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update configs" ON app_configs;
CREATE POLICY "Authenticated users can update configs"
  ON app_configs FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete configs" ON app_configs;
CREATE POLICY "Authenticated users can delete configs"
  ON app_configs FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- 7. Public read access for published configs via API
-- This policy ensures only published configs (last_published_at IS NOT NULL) are accessible
-- via public API, preventing empty arrays for unpublished configs
DROP POLICY IF EXISTS "Public can read published configs via API" ON app_configs;
CREATE POLICY "Public can read published configs via API"
  ON app_configs FOR SELECT
  TO anon
  USING (
    -- Only allow reading configs that have been published
    last_published_at IS NOT NULL
    -- Ensure the tenant exists
    AND EXISTS (
      SELECT 1 FROM tenants 
      WHERE tenants.id = app_configs.tenant_id
    )
  );

-- 8. Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 9. Create PostgREST function to get published config JSON directly
-- This function returns just the published_json content, not wrapped in an array
-- Also increments request_count for tracking API usage
CREATE OR REPLACE FUNCTION get_published_config(
  p_key_name TEXT,
  p_tenant_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_published_json JSONB;
  v_config_id UUID;
BEGIN
  -- Get published_json and config id for the given key_name and tenant_id
  -- Only return if config is published (last_published_at IS NOT NULL)
  SELECT id, published_json INTO v_config_id, v_published_json
  FROM app_configs
  WHERE key_name = p_key_name
    AND tenant_id = p_tenant_id
    AND last_published_at IS NOT NULL
  LIMIT 1;
  
  -- If config found and published, increment request_count
  IF v_config_id IS NOT NULL THEN
    UPDATE app_configs
    SET request_count = request_count + 1,
        updated_at = NOW()
    WHERE id = v_config_id;
  END IF;
  
  -- Return published_json or empty object if not found or not published
  RETURN COALESCE(v_published_json, '{}'::JSONB);
END;
$$;

-- Grant execute permission to anon role for public API access
GRANT EXECUTE ON FUNCTION get_published_config(TEXT, UUID) TO anon;

-- 10. Create default admin user
-- Note: You can also create this user manually via Supabase Dashboard > Authentication > Users
DO $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  -- Check if user already exists
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'masterfabric-developer@masterfabric.co'
  ) INTO user_exists;
  
  -- Only create if user doesn't exist
  IF NOT user_exists THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'masterfabric-developer@masterfabric.co',
      crypt('masterfabric-developer', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If user creation fails, it's okay - user can create manually
    RAISE NOTICE 'Could not create user automatically. Please create manually via Supabase Dashboard > Authentication > Users';
END $$;
