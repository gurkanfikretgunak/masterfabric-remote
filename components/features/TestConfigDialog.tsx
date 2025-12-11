'use client';

import { useState } from 'react';
import { Send, CheckCircle, XCircle, AlertCircle, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Alert } from '@/components/ui/Alert';
import { useToast } from '@/lib/hooks/useToast';
import { AppConfigWithTenant, Tenant } from '@/types';
import { storage } from '@/lib/utils/storage';

interface TestConfigDialogProps {
  config: AppConfigWithTenant;
  tenant: Tenant;
  isOpen: boolean;
  onClose: () => void;
}

export function TestConfigDialog({ config, tenant, isOpen, onClose }: TestConfigDialogProps) {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const supabaseUrl = storage.getSupabaseUrl();
  const supabaseAnonKey = storage.getSupabaseAnonKey();
  
  // RLS policy ensures only published configs (last_published_at IS NOT NULL) are returned
  const endpoint = `${supabaseUrl}/rest/v1/app_configs?key_name=eq.${config.key_name}&tenant_id=eq.${config.tenant_id}&select=published_json`;

  const handleTest = async () => {
    // Check if config is published before testing
    if (!config.last_published_at) {
      setError('This config has not been published yet. Please publish the config first before testing.');
      showError('Config must be published before testing');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);
    setResponseTime(null);

    const startTime = Date.now();

    try {
      // For public API access (anon RLS policy), only apikey header is needed
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey || '',
          'Content-Type': 'application/json',
        },
      });

      const endTime = Date.now();
      setResponseTime(endTime - startTime);

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorData || res.statusText}`);
      }

      const data = await res.json();
      
      // Check if response is empty array
      if (Array.isArray(data) && data.length === 0) {
        setError('no-published-config');
        showError('Empty response: Check Supabase RLS policy and config status');
      } else {
        setResponse({
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries(res.headers.entries()),
          data,
        });
        success(`Request successful (${endTime - startTime}ms)`);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Request failed';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Test API Request" size="lg">
      <div className="space-y-6">
        {/* Warning if not published */}
        {!config.last_published_at && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900 mb-1">
                  Config Not Published
                </p>
                <p className="text-sm text-yellow-700 mb-3">
                  This config must be published before you can test it. The API only returns published configs (where last_published_at is not null).
                </p>
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    Go to the config editor and click <strong>"Publish"</strong> to publish your changes first.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-medium text-gray-500 uppercase">
              Request
            </label>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                GET
              </span>
              <Button
                variant="primary"
                onClick={handleTest}
                loading={loading}
                disabled={!config.last_published_at}
                icon={Send}
                className="text-xs"
              >
                Send Request
              </Button>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm text-gray-700 break-all">
            {endpoint}
          </div>
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-1">Headers:</p>
            <div className="text-xs text-blue-700 space-y-1 font-mono">
              <div>apikey: {supabaseAnonKey?.substring(0, 20)}...</div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Note: Public API access uses only the apikey header. The RLS policy allows anonymous access to published configs only.
              <br />
              <span className="text-orange-600 font-medium">If you get an empty array, make sure:</span>
              <br />
              1. The config has been published (check last_published_at)
              <br />
              2. The RLS policy has been updated to check last_published_at IS NOT NULL
            </p>
          </div>
        </div>

        {/* Response Section */}
        {(response || error) && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-medium text-gray-500 uppercase">
                Response
              </label>
              {responseTime !== null && (
                <span className="text-xs text-gray-500">
                  {responseTime}ms
                </span>
              )}
            </div>
            
            {error ? (
              <div className="space-y-3">
                <Alert message={error === 'no-published-config' ? 'No published config found' : error} type="error" />
                {(error === 'no-published-config' || error.includes('No published config found')) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-3">
                      Quick Fix:
                    </p>
                    <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                      <li>Make sure the config is <strong>published</strong> (click "Publish" in config editor)</li>
                      <li>Verify RLS policy exists: <strong>Supabase Dashboard → Authentication → Policies</strong></li>
                      <li>Check policy name: <code className="text-xs bg-white px-1 rounded">"Public can read published configs via API"</code></li>
                    </ol>
                  </div>
                )}
              </div>
            ) : response ? (
              <div className="space-y-3">
                {/* Status */}
                <div className="flex items-center gap-2">
                  {response.status >= 200 && response.status < 300 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    response.status >= 200 && response.status < 300 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {response.status} {response.statusText}
                  </span>
                </div>

                {/* Response Data */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                    Response Body
                  </label>
                  <CodeBlock code={formatJSON(response.data)} copyable={true} />
                </div>

                {/* Response Headers */}
                <details className="border border-gray-200 rounded-lg">
                  <summary className="px-4 py-2 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                    Response Headers
                  </summary>
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <CodeBlock code={formatJSON(response.headers)} copyable={true} />
                  </div>
                </details>
              </div>
            ) : null}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

