'use client';

import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { AppConfig, UpdateConfigInput } from '@/types';
import { generateConfigName } from '@/lib/utils/storage';

interface EditConfigDialogProps {
  config: AppConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateConfigInput) => Promise<void>;
}

export function EditConfigDialog({ config, isOpen, onClose, onSubmit }: EditConfigDialogProps) {
  const [keyName, setKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (config) {
      setKeyName(config.key_name);
      setError(null);
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setError(null);

    if (!keyName.trim()) {
      setError('Please enter a config key name');
      return;
    }

    // Validate key name format (lowercase, underscores, no spaces)
    if (!/^[a-z0-9_]+$/.test(keyName.trim())) {
      setError('Config key name must contain only lowercase letters, numbers, and underscores');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(config.id, { key_name: keyName.trim() });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update config name');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Rename Configuration" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Information Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <p className="text-xs text-blue-900 font-medium">
                About Config Key Names
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Config key names are used to identify configurations in your API. 
                Use lowercase letters, numbers, and underscores only (e.g., homepage_flags, app_settings). 
                You can use the Generate button to create a random name based on common patterns.
              </p>
            </div>
          </div>
        </div>

        <Input
          label="Config Key Name"
          value={keyName}
          onChange={setKeyName}
          placeholder="e.g., homepage_flags"
          showGenerateButton={true}
          onGenerate={generateConfigName}
        />
        
        {/* Config Key Preview */}
        {keyName && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Preview:</span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-full border bg-gray-50 text-gray-700 border-gray-200 font-mono">
              {keyName.trim() || '...'}
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

