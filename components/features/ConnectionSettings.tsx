'use client';

import { useState, useEffect } from 'react';
import { Zap, Save, CheckCircle, XCircle, ExternalLink, Info } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { useToast } from '@/lib/hooks/useToast';
import { storage } from '@/lib/utils/storage';
import { createSupabaseClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/AuthService';
import { SupabaseService } from '@/lib/supabase/SupabaseService';

export function ConnectionSettingsCard() {
  const { success, error: showError } = useToast();
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUrl(storage.getSupabaseUrl() || '');
    setKey(storage.getSupabaseAnonKey() || '');
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const client = createSupabaseClient(url, key);
      const authService = new AuthService(client);
      const { error } = await authService.signInWithDefaultCredentials();

      if (error) {
        setTestResult('error');
        showError('Connection test failed. Please check your credentials.');
      } else {
        // Verify tables exist
        const supabaseService = new SupabaseService(client);
        try {
          await supabaseService.getTenants();
          setTestResult('success');
          success('Connection verified successfully');
        } catch {
          setTestResult('error');
          showError('Tables not found. Please run the SQL script.');
        }
      }
    } catch (err: any) {
      setTestResult('error');
      showError(err.message || 'Connection test failed');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setSaving(true);
    storage.setSupabaseUrl(url);
    storage.setSupabaseAnonKey(key);
    setHasChanges(false);
    setSaving(false);
    success('Connection settings saved successfully');
    // Reset client after a brief delay to show toast
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  useEffect(() => {
    const currentUrl = storage.getSupabaseUrl();
    const currentKey = storage.getSupabaseAnonKey();
    setHasChanges(url !== currentUrl || key !== currentKey);
  }, [url, key]);

  const handleOpenDocs = () => {
    window.open('https://supabase.com/docs/guides/getting-started/quickstarts/nextjs', '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
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
            value={url}
            onChange={(value) => {
              setUrl(value);
              setTestResult(null);
            }}
            placeholder="https://xxxxx.supabase.co"
          />
          <Input
            label="Anon Key"
            value={key}
            onChange={(value) => {
              setKey(value);
              setTestResult(null);
            }}
            showPasswordToggle
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          />

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={handleTestConnection}
              disabled={testing || !url || !key}
              loading={testing}
              icon={Zap}
            >
              Test Connection
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!hasChanges || testResult !== 'success' || saving}
              loading={saving}
              icon={Save}
            >
              Save Changes
            </Button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                testResult === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {testResult === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Connection verified
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Connection failed. Please check your credentials.
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

