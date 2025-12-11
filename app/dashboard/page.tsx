'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileJson, Activity, Building2, Info, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/features/StatsCard';
import { ConfigTable } from '@/components/features/ConfigTable';
import { TenantTable } from '@/components/features/TenantTable';
import { NewConfigDialog } from '@/components/features/NewConfigDialog';
import { NewTenantDialog } from '@/components/features/NewTenantDialog';
import { EditTenantDialog } from '@/components/features/EditTenantDialog';
import { ConfirmDialog } from '@/components/ui/Dialog';
import { ToastContainer } from '@/components/ui/Toast';
import { DashboardSkeleton } from '@/components/ui/DashboardSkeleton';
import { Alert } from '@/components/ui/Alert';
import { Footer } from '@/components/layout/Footer';
import { useToast } from '@/lib/hooks/useToast';
import { getSupabaseClient } from '@/lib/supabase/client';
import { SupabaseService } from '@/lib/supabase/SupabaseService';
import { Tenant, AppConfigWithTenant, CreateTenantInput, CreateConfigInput, UpdateTenantInput } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { toasts, removeToast, success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [configs, setConfigs] = useState<AppConfigWithTenant[]>([]);
  const [stats, setStats] = useState({
    totalConfigs: 0,
    totalRequests: 0,
    activeTenants: 0,
  });
  const [showNewConfigDialog, setShowNewConfigDialog] = useState(false);
  const [showNewTenantDialog, setShowNewTenantDialog] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null);
  const [deletingConfig, setDeletingConfig] = useState<AppConfigWithTenant | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const client = getSupabaseClient();
      const service = new SupabaseService(client);

      const [tenantsData, configsData, statsData] = await Promise.all([
        service.getTenants(),
        service.getConfigs(),
        service.getStats(),
      ]);

      setTenants(tenantsData);
      setConfigs(configsData);
      setStats(statsData);
      
      if (isRefresh) {
        success('Data refreshed successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      if (err.message?.includes('credentials')) {
        router.push('/onboarding');
      }
      if (isRefresh) {
        showError('Failed to refresh data');
      }
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleCreateTenant = async (data: CreateTenantInput) => {
    try {
      const client = getSupabaseClient();
      const service = new SupabaseService(client);
      await service.createTenant(data);
      await loadData();
      success('Tenant created successfully');
    } catch (err: any) {
      showError(err.message || 'Failed to create tenant');
    }
  };

  const handleCreateConfig = async (data: CreateConfigInput) => {
    try {
      const client = getSupabaseClient();
      const service = new SupabaseService(client);
      await service.createConfig(data);
      await loadData();
      success('Configuration created successfully');
    } catch (err: any) {
      showError(err.message || 'Failed to create configuration');
    }
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
  };

  const handleUpdateTenant = async (id: string, data: UpdateTenantInput) => {
    try {
      const client = getSupabaseClient();
      const service = new SupabaseService(client);
      await service.updateTenant(id, data);
      await loadData();
      setEditingTenant(null);
      success('Tenant updated successfully');
    } catch (err: any) {
      showError(err.message || 'Failed to update tenant');
      throw err;
    }
  };

  const handleDeleteTenant = async () => {
    if (!deletingTenant) return;

    setDeleteLoading(true);
    try {
      const client = getSupabaseClient();
      const service = new SupabaseService(client);
      await service.deleteTenant(deletingTenant.id);
      await loadData();
      setDeletingTenant(null);
      success('Tenant deleted successfully');
    } catch (err: any) {
      showError(err.message || 'Failed to delete tenant');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteConfig = async () => {
    if (!deletingConfig) return;

    setDeleteLoading(true);
    try {
      const client = getSupabaseClient();
      const service = new SupabaseService(client);
      await service.deleteConfig(deletingConfig.id);
      await loadData();
      setDeletingConfig(null);
      success('Configuration deleted successfully');
    } catch (err: any) {
      showError(err.message || 'Failed to delete configuration');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 flex-1">
        <div className="flex items-start justify-end mb-6">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing || loading}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              refreshing 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {error && (
          <div className="mb-6">
            <Alert message={error} type="error" />
          </div>
        )}

        {/* Stats Cards */}
        <div className={refreshing ? 'opacity-60 transition-opacity duration-200' : 'opacity-100 transition-opacity duration-200'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <StatsCard
            title="Total Configs"
            value={stats.totalConfigs}
            icon={FileJson}
          />
          <StatsCard
            title="Total Requests"
            value={stats.totalRequests.toLocaleString()}
            icon={Activity}
          />
          <StatsCard
            title="Active Tenants"
            value={stats.activeTenants}
            icon={Building2}
          />
        </div>

        {/* Configurations Table */}
        <Card className="mb-8">
          <CardHeader
            title="Configurations"
            action={
              <Button
                variant="primary"
                onClick={() => setShowNewConfigDialog(true)}
                icon={Plus}
              >
                New Config
              </Button>
            }
            description={
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-blue-900 font-medium mb-1">
                    Remote Configuration Management
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Create and manage remote configurations stored in Supabase. Each configuration is tenant-specific and can be published to make it available via API. Use the API Integration section in each config to fetch published data in your applications using TypeScript, JavaScript, Go, or Dart.
                  </p>
                </div>
              </div>
            }
          />
          <CardContent className="p-0">
            <ConfigTable 
              configs={configs} 
              tenants={tenants}
              onDelete={(config) => setDeletingConfig(config)}
            />
          </CardContent>
        </Card>

        {/* Tenants Table */}
        <Card>
          <CardHeader
            title="Tenants"
            action={
              <Button
                variant="secondary"
                onClick={() => setShowNewTenantDialog(true)}
                icon={Plus}
              >
                New Tenant
              </Button>
            }
            description={
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-blue-900 font-medium mb-1">
                    Why Separate Tenants?
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Tenants allow you to organize configurations by organization, environment, or application. Each tenant has isolated configurations, enabling you to manage different projects, staging/production environments, or client-specific settings independently. This multi-tenancy approach provides better organization, security, and scalability for your remote configuration management.
                  </p>
                </div>
              </div>
            }
          />
          <CardContent className="p-0">
            <TenantTable
              tenants={tenants}
              configs={configs}
              onEdit={handleEditTenant}
              onDelete={(tenant) => setDeletingTenant(tenant)}
            />
          </CardContent>
        </Card>
        </div>

        {/* Dialogs */}
        <NewConfigDialog
          tenants={tenants}
          isOpen={showNewConfigDialog}
          onClose={() => setShowNewConfigDialog(false)}
          onSubmit={handleCreateConfig}
          onRequestNewTenant={() => {
            setShowNewConfigDialog(false);
            setShowNewTenantDialog(true);
          }}
        />
        <NewTenantDialog
          isOpen={showNewTenantDialog}
          onClose={() => setShowNewTenantDialog(false)}
          onSubmit={handleCreateTenant}
        />
        <EditTenantDialog
          tenant={editingTenant}
          isOpen={!!editingTenant}
          onClose={() => setEditingTenant(null)}
          onSubmit={handleUpdateTenant}
        />
        <ConfirmDialog
          isOpen={!!deletingTenant}
          onClose={() => setDeletingTenant(null)}
          onConfirm={handleDeleteTenant}
          title="Delete Tenant"
          message={`Are you sure you want to delete "${deletingTenant?.name}"? This will also delete all associated configurations. This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={deleteLoading}
        />
        <ConfirmDialog
          isOpen={!!deletingConfig}
          onClose={() => setDeletingConfig(null)}
          onConfirm={handleDeleteConfig}
          title="Delete Configuration"
          message={`Are you sure you want to delete "${deletingConfig?.key_name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={deleteLoading}
        />
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

