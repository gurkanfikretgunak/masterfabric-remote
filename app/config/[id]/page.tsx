'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EditorPanel } from '@/components/features/EditorPanel';
import { ApiIntegration } from '@/components/features/ApiIntegration';
import { LoadingOverlay } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/lib/hooks/useToast';
import { getSupabaseClient } from '@/lib/supabase/client';
import { SupabaseService } from '@/lib/supabase/SupabaseService';
import { AppConfigWithTenant, Tenant } from '@/types';

export default function ConfigEditorPage() {
  const router = useRouter();
  const params = useParams();
  const configId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<AppConfigWithTenant | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const { toasts, removeToast, success, error: showError } = useToast();

  useEffect(() => {
    loadConfig();
  }, [configId]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const client = getSupabaseClient();
      const service = new SupabaseService(client);

      const configData = await service.getConfig(configId);
      if (!configData) {
        setError('Config not found');
        return;
      }

      const tenantData = await service.getTenant(configData.tenant_id);
      if (!tenantData) {
        setError('Tenant not found');
        return;
      }

      setConfig(configData);
      setTenant(tenantData);
    } catch (err: any) {
      setError(err.message || 'Failed to load config');
      if (err.message?.includes('credentials')) {
        router.push('/onboarding');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async (draftJson: Record<string, any>) => {
    if (!config) return;

    setSaveError(null);
    try {
      const client = getSupabaseClient();
      const service = new SupabaseService(client);

      const updated = await service.updateConfig(config.id, {
        draft_json: draftJson,
      });

      setConfig(updated);
      success('Draft saved successfully');
      setSaveError(null);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to save draft';
      setSaveError(errorMsg);
      showError(errorMsg);
      throw err;
    }
  };

  const handlePublish = async () => {
    if (!config) return;

    setPublishError(null);
    try {
      const client = getSupabaseClient();
      const service = new SupabaseService(client);

      const updated = await service.publishConfig(config.id);
      setConfig(updated);
      success('Configuration published successfully');
      setPublishError(null);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to publish';
      setPublishError(errorMsg);
      showError(errorMsg);
      throw err;
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-white">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                icon={ArrowLeft}
              >
                Back to Dashboard
              </Button>
            </div>
          </header>
        </div>
        <LoadingOverlay message="Loading config..." />
      </>
    );
  }

  if (error || !config || !tenant) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              icon={ArrowLeft}
            >
              Back to Dashboard
            </Button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-8 px-6">
          <Alert message={error || 'Config not found'} type="error" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              icon={ArrowLeft}
            >
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <h1 className="text-lg font-semibold text-gray-900">{config.key_name}</h1>
          </div>
          <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600">
            Tenant: {tenant.name}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-6">
        {(saveError || publishError) && (
          <div className="mb-6">
            <Alert
              message={saveError || publishError || 'An error occurred'}
              type="error"
            />
          </div>
        )}

        {/* Editor Panels */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <EditorPanel
            title="Draft"
            json={config.draft_json}
            editable={true}
            onSave={handleSaveDraft}
            onPublish={handlePublish}
          />
          <EditorPanel
            title="Published"
            json={config.published_json}
            editable={false}
            lastPublished={config.last_published_at}
          />
        </div>

        {/* API Integration Section */}
        <ApiIntegration config={config} tenant={tenant} />
      </main>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

