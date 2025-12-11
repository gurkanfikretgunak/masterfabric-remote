'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Play, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableCell } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TestConfigDialog } from '@/components/features/TestConfigDialog';
import { AppConfigWithTenant, Tenant } from '@/types';

interface ConfigTableProps {
  configs: AppConfigWithTenant[];
  tenants: Tenant[];
  onDelete?: (config: AppConfigWithTenant) => void;
}

export function ConfigTable({ configs, tenants, onDelete }: ConfigTableProps) {
  const router = useRouter();
  const [testingConfig, setTestingConfig] = useState<{ config: AppConfigWithTenant; tenant: Tenant } | null>(null);

  const getStatus = (config: AppConfigWithTenant): 'published' | 'draft' => {
    return config.last_published_at ? 'published' : 'draft';
  };

  const getTenantForConfig = (config: AppConfigWithTenant): Tenant | null => {
    return tenants.find((t) => t.id === config.tenant_id) || null;
  };

  const handleTest = (e: React.MouseEvent, config: AppConfigWithTenant) => {
    e.stopPropagation();
    const tenant = getTenantForConfig(config);
    if (tenant) {
      setTestingConfig({ config, tenant });
    }
  };

  return (
    <>
    <Table>
      <TableHeader columns={['Config Name', 'Tenant', 'Requests', 'Status', 'Actions']} />
      <tbody className="divide-y divide-gray-200">
        {configs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-gray-500 py-8">
              No configurations found. Create your first config to get started.
            </TableCell>
          </TableRow>
        ) : (
          configs.map((config) => (
            <TableRow
              key={config.id}
              onClick={() => router.push(`/config/${config.id}`)}
            >
              <TableCell className="text-gray-900 font-medium">
                {config.key_name}
              </TableCell>
              <TableCell className="text-gray-600">
                {config.tenant?.name || 'Unknown'}
              </TableCell>
              <TableCell className="text-gray-600">
                {config.request_count.toLocaleString()}
              </TableCell>
              <TableCell>
                <StatusBadge status={getStatus(config)} />
              </TableCell>
              <TableCell align="right">
                <div className="flex items-center justify-end gap-2">
                  {getStatus(config) === 'published' && (
                    <Button
                      variant="ghost"
                      onClick={(e) => handleTest(e, config)}
                      icon={Play}
                      className="text-xs"
                    >
                      Test
                    </Button>
                  )}
                  <button 
                    className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 transition-all duration-200 hover:gap-2 group"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/config/${config.id}`);
                    }}
                  >
                    Edit
                    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(config);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-all duration-200 hover:scale-110 active:scale-95 rounded-md hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </tbody>
    </Table>
    {testingConfig && (
      <TestConfigDialog
        config={testingConfig.config}
        tenant={testingConfig.tenant}
        isOpen={!!testingConfig}
        onClose={() => setTestingConfig(null)}
      />
    )}
  </>
  );
}

