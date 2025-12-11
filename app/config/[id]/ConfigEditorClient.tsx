'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EditorPanel } from '@/components/features/EditorPanel';
import { ApiIntegration } from '@/components/features/ApiIntegration';
import { ConfigEditorSkeleton } from '@/components/ui/ConfigEditorSkeleton';
import { Footer } from '@/components/layout/Footer';
import { Alert } from '@/components/ui/Alert';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/lib/hooks/useToast';
import { getSupabaseClient } from '@/lib/supabase/client';
import { SupabaseService } from '@/lib/supabase/SupabaseService';
import { AppConfigWithTenant, Tenant } from '@/types';

export function ConfigEditorClient({ configId }: { configId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<AppConfigWithTenant | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const { toasts, removeToast, success, error: showError } = useToast();

  useEffect(() => {
    void loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return <ConfigEditorSkeleton />;
  }

  if (error || !config || !tenant) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/dashboard')} icon={ArrowLeft}>
              Back to Dashboard
            </Button>
          </div>
        </header>
        <main className="max-w-5xl mx-auto py-8 px-6">
          <Alert message={error || 'Config not found'} type="error" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              icon={ArrowLeft}
              className="flex-shrink-0"
            >
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{config.key_name}</h1>
          </div>
          <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs sm:text-sm text-gray-600 whitespace-nowrap">
            Tenant: {tenant.name}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6 flex-1">
        {/* Editor Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Draft Panel with Save Error Alert */}
          <div className="space-y-4">
            {saveError && (
              <Alert message={saveError} type="error" />
            )}
            <EditorPanel
              title="Draft"
              json={config.draft_json}
              editable={true}
              onSave={handleSaveDraft}
              onPublish={handlePublish}
            />
          </div>

          {/* Published Panel with Publish Error Alert */}
          <div className="space-y-4">
            {publishError && (
              <Alert message={publishError} type="error" />
            )}
            <EditorPanel
              title="Published"
              json={config.published_json}
              editable={false}
              lastPublished={config.last_published_at}
            />
          </div>
        </div>

        {/* API Integration Section */}
        <ApiIntegration config={config} tenant={tenant} />
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

