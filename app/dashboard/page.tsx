'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileJson, Activity, Building2 } from 'lucide-react';
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
import { LoadingOverlay } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
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
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      if (err.message?.includes('credentials')) {
        router.push('/onboarding');
      }
    } finally {
      setLoading(false);
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
    return (
      <>
        <Header />
        <LoadingOverlay message="Loading dashboard..." />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-6">
        {error && (
          <div className="mb-6">
            <Alert message={error} type="error" />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
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
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

