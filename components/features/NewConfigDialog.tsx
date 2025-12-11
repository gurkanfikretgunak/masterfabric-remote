'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Tenant, CreateConfigInput } from '@/types';

interface NewConfigDialogProps {
  tenants: Tenant[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateConfigInput) => Promise<void>;
  onRequestNewTenant?: () => void;
}

export function NewConfigDialog({ tenants, isOpen, onClose, onSubmit, onRequestNewTenant }: NewConfigDialogProps) {
  const [tenantId, setTenantId] = useState('');
  const [keyName, setKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && tenants.length === 0 && onRequestNewTenant) {
      // Auto-close this dialog and open tenant dialog
      onClose();
      onRequestNewTenant();
    }
  }, [isOpen, tenants.length, onClose, onRequestNewTenant]);

  if (!isOpen) return null;

  // Show message if no tenants exist
  if (tenants.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md mx-4">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">New Configuration</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <Alert
              message="You need to create a tenant first before creating a configuration."
              type="warning"
            />
            <div className="mt-6 flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              {onRequestNewTenant && (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    onClose();
                    onRequestNewTenant();
                  }}
                  className="flex-1"
                >
                  Create Tenant First
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tenantId || !keyName) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        tenant_id: tenantId,
        key_name: keyName,
        draft_json: {},
        published_json: {},
      });
      setTenantId('');
      setKeyName('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create config');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">New Configuration</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 active:scale-95 p-1 rounded hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tenant
            </label>
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-400 cursor-pointer"
            >
              <option value="">Select a tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Config Key Name"
            value={keyName}
            onChange={setKeyName}
            placeholder="e.g., homepage_flags"
          />
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

