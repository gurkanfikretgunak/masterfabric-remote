'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Tenant } from '@/types';

interface TenantTableProps {
  tenants: Tenant[];
  configs: { tenant_id: string }[];
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
}

export function TenantTable({ tenants, configs, onEdit, onDelete }: TenantTableProps) {
  const getConfigCount = (tenantId: string) => {
    return configs.filter((c) => c.tenant_id === tenantId).length;
  };

  return (
    <Table>
      <TableHeader columns={['Tenant Name', 'Configs', 'Actions']} />
      <tbody className="divide-y divide-gray-200">
        {tenants.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-gray-500 py-8">
              No tenants found. Create your first tenant to get started.
            </TableCell>
          </TableRow>
        ) : (
          tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell className="text-gray-900 font-medium">
                {tenant.name}
              </TableCell>
              <TableCell className="text-gray-600">
                {getConfigCount(tenant.id)}
              </TableCell>
              <TableCell align="right">
                <div className="flex items-center justify-end gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(tenant);
                    }}
                    icon={Edit2}
                    className="px-2 sm:px-4"
                  >
                    <span className="hidden sm:inline">Edit</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(tenant);
                    }}
                    icon={Trash2}
                    className="px-2 sm:px-4"
                  >
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Del</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </tbody>
    </Table>
  );
}

