'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/lib/hooks/useToast';
import { ConnectionSettingsCard } from '@/components/features/ConnectionSettings';
import { SessionCard } from '@/components/features/SessionCard';
import { DangerZoneCard } from '@/components/features/DangerZone';

export default function SettingsPage() {
  const router = useRouter();
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            icon={ArrowLeft}
          >
            Back to Dashboard
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-8 px-6 space-y-6">
        <ConnectionSettingsCard />
        <SessionCard />
        <DangerZoneCard />
      </main>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

