'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Tenant, UpdateTenantInput } from '@/types';
import { generateApiKey } from '@/lib/utils/storage';

interface EditTenantDialogProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateTenantInput) => Promise<void>;
}

export function EditTenantDialog({ tenant, isOpen, onClose, onSubmit }: EditTenantDialogProps) {
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tenant) {
      setName(tenant.name);
      setApiKey(tenant.api_key);
      setError(null);
    }
  }, [tenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    setError(null);

    if (!name || !apiKey) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(tenant.id, { name, api_key: apiKey });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Edit Tenant" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tenant Name"
          value={name}
          onChange={setName}
          placeholder="e.g., Mobile App"
        />
        <Input
          label="API Key"
          value={apiKey}
          onChange={setApiKey}
          placeholder="e.g., mfr_xxxxxxxxxxxx"
          showGenerateButton
          onGenerate={generateApiKey}
        />
        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
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
            Save Changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

