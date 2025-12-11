'use client';

import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Tenant, UpdateTenantInput } from '@/types';
import { generateTenantName } from '@/lib/utils/storage';

interface EditTenantDialogProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateTenantInput) => Promise<void>;
}

export function EditTenantDialog({ tenant, isOpen, onClose, onSubmit }: EditTenantDialogProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tenant) {
      setName(tenant.name);
      setError(null);
    }
  }, [tenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    setError(null);

    if (!name) {
      setError('Please enter a tenant name');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(tenant.id, { name });
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
        {/* Information Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <p className="text-xs text-blue-900 font-medium">
                About Tenant Names
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Tenant names help you organize configurations by organization, environment, or application. 
                Choose a descriptive name that clearly identifies the purpose of this tenant. 
                You can use the Generate button to create a random name based on common patterns.
              </p>
            </div>
          </div>
        </div>

        <Input
          label="Tenant Name"
          value={name}
          onChange={setName}
          placeholder="e.g., Mobile App"
          showGenerateButton={true}
          onGenerate={generateTenantName}
        />
        
        {/* Tenant Name Badge Preview */}
        {name && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Preview:</span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-full border bg-gray-50 text-gray-700 border-gray-200">
              {name}
            </span>
          </div>
        )}

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

