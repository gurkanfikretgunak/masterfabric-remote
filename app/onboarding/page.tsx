'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Zap, ExternalLink, Info } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Alert } from '@/components/ui/Alert';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/lib/hooks/useToast';
import { storage } from '@/lib/utils/storage';
import { createSupabaseClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/AuthService';
import { SupabaseService } from '@/lib/supabase/SupabaseService';

const SQL_SCRIPT = `-- MasterFabric Remote Setup
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
DROP POLICY IF EXISTS "Public can read published configs via API" ON app_configs;
CREATE POLICY "Public can read published configs via API"
  ON app_configs FOR SELECT
  TO anon
  USING (
    last_published_at IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM tenants 
      WHERE tenants.id = app_configs.tenant_id
    )
  );

-- 8. Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 9. Create default admin user
-- Note: You can also create this user manually via Supabase Dashboard > Authentication > Users
DO $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  -- Check if user already exists
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'masterfabric-developer@masterfabric.io'
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
      'masterfabric-developer@masterfabric.io',
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
END $$;`;

export default function OnboardingPage() {
  const router = useRouter();
  const { toasts, removeToast, success, error: showError, info } = useToast();
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopied(true);
    info('SQL script copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenDocs = () => {
    window.open('https://supabase.com/docs/guides/getting-started/quickstarts/nextjs', '_blank', 'noopener,noreferrer');
  };

  const handleLiveTest = async () => {
    if (!supabaseUrl || !anonKey) {
      setError('Please enter both Supabase URL and Anon Key');
      return;
    }

    setTesting(true);
    setError(null);

    try {
      // Initialize temporary client
      const client = createSupabaseClient(supabaseUrl, anonKey);
      const authService = new AuthService(client);

      // Attempt authentication
      const { error: authError } = await authService.signInWithDefaultCredentials();

      if (authError) {
        throw new Error(
          'Authentication failed. Please ensure:\n' +
          '1. The SQL script was executed completely\n' +
          '2. The default user exists (email: masterfabric-developer@masterfabric.io)\n' +
          '3. If the user was not created automatically, create it manually via:\n' +
          '   Supabase Dashboard > Authentication > Users > Add User'
        );
      }

      // Verify tables exist
      const supabaseService = new SupabaseService(client);
      try {
        await supabaseService.getTenants();
      } catch (tableError: any) {
        throw new Error('Tables not found. Please run the SQL script in your Supabase SQL Editor.');
      }

      // Save credentials
      storage.setSupabaseUrl(supabaseUrl);
      storage.setSupabaseAnonKey(anonKey);

      success('Connection successful! Redirecting to dashboard...');
      // Redirect to dashboard after showing success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      const errorMsg = err.message || 'Connection failed. Please check your credentials and ensure the SQL script was executed.';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">
          MasterFabric Remote
        </h1>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto py-12 px-4">
        {/* Welcome Card */}
        <Card className="mb-6">
          <CardContent>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to MasterFabric Remote
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Configure your Supabase connection to get started.
            </p>
            
            {/* Client Stack Information */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Image 
                    src="/nextjs-logo-icon.svg" 
                    alt="Next.js" 
                    width={16} 
                    height={16} 
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">Next.js</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image 
                    src="/supabase-logo-icon.svg" 
                    alt="Supabase" 
                    width={16} 
                    height={16} 
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">Supabase</span>
                </div>
              </div>
              
              {/* Hosting Recommendation */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Recommended for web hosting</p>
                <div className="flex items-center">
                  <a 
                    href="https://vercel.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Image 
                      src="/vercel-logotype-icon.svg" 
                      alt="Vercel" 
                      width={64} 
                      height={16} 
                      className="h-4"
                    />
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credentials Card */}
        <Card className="mb-6">
          <CardHeader title="Connection Settings" />
          <CardContent>
            <div className="space-y-4">
              {/* Information Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-blue-900 font-medium">
                      Supabase Connection Credentials
                    </p>
                    <p className="text-sm text-blue-700">
                      Connect to your Supabase project by providing your project URL and anonymous key. 
                      These credentials are stored locally in your browser and are required to manage your 
                      remote configurations and tenants.
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside ml-2">
                      <li>
                        <strong>Supabase URL:</strong> Your project's API URL (found in Project Settings → API)
                      </li>
                      <li>
                        <strong>Anon Key:</strong> Your project's anonymous/public key (safe to expose in client-side code)
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="pt-2 border-t border-blue-200">
                  <Button
                    variant="ghost"
                    onClick={handleOpenDocs}
                    icon={ExternalLink}
                    className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                  >
                    View Official Supabase Documentation
                  </Button>
                </div>
              </div>

              <Input
                label="Supabase URL"
                type="url"
                value={supabaseUrl}
                onChange={setSupabaseUrl}
                placeholder="https://xxxxx.supabase.co"
              />
              <Input
                label="Anon Key"
                value={anonKey}
                onChange={setAnonKey}
                showPasswordToggle
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC..."
              />
            </div>
          </CardContent>
        </Card>

        {/* SQL Script Card */}
        <Card className="mb-6">
          <CardHeader title="Database Setup" />
          <CardContent>
            <div className="space-y-3 mb-4">
              <p className="text-sm text-gray-600">
                This SQL script will set up the required database tables, indexes, and security policies for MasterFabric Remote.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium text-gray-900">How to run:</p>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside ml-2">
                  <li>Go to your Supabase Dashboard</li>
                  <li>Navigate to <strong>SQL Editor</strong> in the left sidebar</li>
                  <li>Click <strong>New Query</strong> to create a new SQL query</li>
                  <li>Paste the script below into the editor</li>
                  <li>Click <strong>Run</strong> or press <code className="text-xs bg-white px-1 py-0.5 rounded border">Ctrl+Enter</code> (Windows/Linux) or <code className="text-xs bg-white px-1 py-0.5 rounded border">Cmd+Enter</code> (macOS) to execute</li>
                </ol>
              </div>
              <p className="text-sm text-gray-600">
                The script will create tables for tenants and app configurations, set up Row Level Security (RLS) policies, and create a default admin user.
              </p>
            </div>
            <CodeBlock code={SQL_SCRIPT} copyable={false} className="mb-4" />
            <Button
              variant="secondary"
              onClick={handleCopyScript}
              icon={Copy}
            >
              {copied ? 'Copied!' : 'Copy Script'}
            </Button>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> If the default user is not created automatically, create it manually via{' '}
                <strong>Supabase Dashboard → Authentication → Users → Add User</strong>
                <br />
                Email: <code className="text-xs">masterfabric-developer@masterfabric.io</code>
                <br />
                Password: <code className="text-xs">masterfabric-developer</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert message={error} type="error" />
          </div>
        )}

        {/* Test Button */}
        <Button
          variant="primary"
          onClick={handleLiveTest}
          loading={testing}
          icon={Zap}
          className="w-full"
        >
          Live Test Connection
        </Button>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-6">
            <p className="text-xs text-gray-500">Powered by</p>
            <a 
              href="https://vercel.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image 
                src="/vercel-logotype-icon.svg" 
                alt="Vercel" 
                width={72} 
                height={18} 
                className="h-[18px]"
              />
            </a>
            <span className="text-gray-300">•</span>
            <a 
              href="https://supabase.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              <Image 
                src="/supabase-logo-icon.svg" 
                alt="Supabase" 
                width={16} 
                height={16} 
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Supabase</span>
            </a>
          </div>
        </div>
      </footer>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

