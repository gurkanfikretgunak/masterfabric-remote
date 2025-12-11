'use client';

import { useRouter } from 'next/navigation';
import { Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/hooks/useToast';
import { getSupabaseClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/AuthService';
import { storage } from '@/lib/utils/storage';

export function Header() {
  const router = useRouter();
  const { info } = useToast();

  const handleSignOut = async () => {
    try {
      const client = getSupabaseClient();
      const authService = new AuthService(client);
      await authService.signOut();
      storage.setSignedOut(true);
      info('Signed out successfully');
      setTimeout(() => {
        router.push('/onboarding');
      }, 500);
    } catch (err) {
      // Even if sign out fails, mark signed out and redirect
      storage.setSignedOut(true);
      info('Signed out');
      setTimeout(() => {
        router.push('/onboarding');
      }, 500);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            MasterFabric Remote
          </h1>
          <p className="text-xs text-gray-500 hidden sm:block">
            Remote configuration manager for feature flags, A/B tests, and app settings with real-time updates.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            onClick={() => router.push('/settings')}
            icon={Settings}
            className="flex-1 sm:flex-initial"
          >
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
          </Button>
          <button
            onClick={handleSignOut}
            className="px-3 sm:px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

