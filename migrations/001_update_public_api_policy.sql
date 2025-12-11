-- Migration: Update Public API RLS Policy to Only Allow Published Configs
-- Date: 2024
-- Description: Updates the public API RLS policy to only allow reading configs that have been published
--              (last_published_at IS NOT NULL). This ensures empty arrays are not returned for unpublished configs.

-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Public can read published configs via API" ON app_configs;

-- Create the updated policy that checks for published configs
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

-- Verify the policy was created
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'app_configs' 
    AND policyname = 'Public can read published configs via API'
  ) THEN
    RAISE NOTICE 'Policy "Public can read published configs via API" has been successfully updated.';
  ELSE
    RAISE WARNING 'Policy creation may have failed. Please verify manually.';
  END IF;
END $$;

