'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ToastContainer } from '@/components/ui/Toast';
import { Footer } from '@/components/layout/Footer';
import { useToast } from '@/lib/hooks/useToast';
import { ConnectionSettingsCard } from '@/components/features/ConnectionSettings';
import { SessionCard } from '@/components/features/SessionCard';
import { DangerZoneCard } from '@/components/features/DangerZone';

export default function SettingsPage() {
  const router = useRouter();
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-4">
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
          <h1 className="text-base sm:text-lg font-semibold text-gray-900">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <ConnectionSettingsCard />
        <SessionCard />
        <DangerZoneCard />
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

