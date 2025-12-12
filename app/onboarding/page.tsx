'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Copy, Zap, ExternalLink, Info, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Alert } from '@/components/ui/Alert';
import { ToastContainer } from '@/components/ui/Toast';
import { Footer } from '@/components/layout/Footer';
import { useToast } from '@/lib/hooks/useToast';
import { storage } from '@/lib/utils/storage';
import { createSupabaseClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/AuthService';
import { SupabaseService } from '@/lib/supabase/SupabaseService';

export default function OnboardingPage() {
  const router = useRouter();
  const { toasts, removeToast, success, error: showError, info } = useToast();
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sqlScript, setSqlScript] = useState('');
  const [sqlScriptLoading, setSqlScriptLoading] = useState(true);
  const [savedConnectionLabel, setSavedConnectionLabel] = useState<string | null>(null);

  useEffect(() => {
    const savedUrl = storage.getSupabaseUrl();
    const savedAnonKey = storage.getSupabaseAnonKey();

    if (savedUrl) setSupabaseUrl(savedUrl);
    if (savedAnonKey) setAnonKey(savedAnonKey);

    if (savedUrl && savedAnonKey) {
      try {
        setSavedConnectionLabel(new URL(savedUrl).host);
      } catch {
        setSavedConnectionLabel(savedUrl);
      }
    } else {
      setSavedConnectionLabel(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSql() {
      try {
        setSqlScriptLoading(true);
        const res = await fetch('/api/setup-sql', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load SQL script');
        const text = await res.text();
        if (!cancelled) setSqlScript(text);
      } catch {
        if (!cancelled) setSqlScript('');
      } finally {
        if (!cancelled) setSqlScriptLoading(false);
      }
    }

    void loadSql();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopyScript = async () => {
    if (!sqlScript) {
      showError('SQL script is not loaded yet. Please try again in a moment.');
      return;
    }

    try {
      await navigator.clipboard.writeText(sqlScript);
      setCopied(true);
      info('SQL script copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showError('Failed to copy SQL script. Please copy manually.');
    }
  };

  const handleOpenDocs = () => {
    window.open('https://supabase.com/docs/guides/getting-started/quickstarts/nextjs', '_blank', 'noopener,noreferrer');
  };

  const handleForgetConnection = () => {
    storage.clearCredentials();
    storage.setSignedOut(true);
    setSupabaseUrl('');
    setAnonKey('');
    setSavedConnectionLabel(null);
    info('Saved connection cleared');
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
          '2. The default user exists (email: masterfabric-developer@masterfabric.co)\n' +
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
      storage.setSignedOut(false);

      try {
        setSavedConnectionLabel(new URL(supabaseUrl).host);
      } catch {
        setSavedConnectionLabel(supabaseUrl);
      }

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
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
          MasterFabric Remote
        </h1>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto py-8 sm:py-12 px-4">
        {/* Welcome Card */}
        <Card className="mb-6">
          <CardContent>
            <h2 
              className="font-medium mb-2 text-left leading-8"
              style={{
                fontSize: '28px',
                lineHeight: '32px',
                color: 'rgba(16, 24, 40, 1)',
                verticalAlign: 'middle',
                backgroundClip: 'unset',
                WebkitBackgroundClip: 'unset'
              }}
            >
              Welcome to MasterFabric Remote
            </h2>
            <p className="text-gray-600 text-sm">
              Configure your Supabase connection to get started. We’ll save it locally so you don’t have to paste it again.
            </p>

            {savedConnectionLabel && (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <p className="text-xs text-gray-600 truncate">
                  Saved connection: <span className="font-medium text-gray-900">{savedConnectionLabel}</span>
                </p>
                <Button variant="ghost" onClick={handleForgetConnection} className="shrink-0">
                  Forget
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tech Stack Card */}
        <Card className="mb-6">
          <CardHeader title="Tech Stack" />
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap text-sm text-gray-600">
                <span>Built with</span>
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/cursot-logo-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">Cursor</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/nextjs-logo-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  <span>Next.js</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/supabase-logo-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  <span>Supabase</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/ts-logo-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  <span>TypeScript</span>
                </div>
              </div>
              
              {/* Hosting Suggestion */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/vercel-logotype-icon.svg"
                      alt="Vercel"
                      width={80}
                      height={20}
                      className="h-5 w-auto"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Recommended Hosting</p>
                      <p className="text-xs text-gray-500">Deploy seamlessly on Vercel</p>
                    </div>
                  </div>
                  <a
                    href="https://vercel.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span>Deploy</span>
                    <ExternalLinkIcon className="w-3 h-3" />
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
            <CodeBlock
              code={
                sqlScriptLoading
                  ? '-- Loading setup SQL script...'
                  : sqlScript || '-- Failed to load setup SQL script. Please refresh the page.'
              }
              language="sql"
              copyable={false}
              className="mb-4"
            />
            <Button
              variant="secondary"
              onClick={handleCopyScript}
              icon={Copy}
              disabled={sqlScriptLoading || !sqlScript}
            >
              {sqlScriptLoading ? 'Loading…' : copied ? 'Copied!' : 'Copy Script'}
            </Button>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> If the default user is not created automatically, create it manually via{' '}
                <strong>Supabase Dashboard → Authentication → Users → Add User</strong>
                <br />
                Email: <code className="text-xs font-bold bg-yellow-100 px-1.5 py-0.5 rounded border border-yellow-300 text-yellow-900">masterfabric-developer@masterfabric.co</code>
                <br />
                Password: <code className="text-xs font-bold bg-yellow-100 px-1.5 py-0.5 rounded border border-yellow-300 text-yellow-900">masterfabric-developer</code>
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

      <Footer />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

