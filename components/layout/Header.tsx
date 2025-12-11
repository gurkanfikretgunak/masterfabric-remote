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
      storage.clearCredentials();
      info('Signed out successfully');
      setTimeout(() => {
        router.push('/onboarding');
      }, 500);
    } catch (err) {
      // Even if sign out fails, clear storage and redirect
      storage.clearCredentials();
      info('Signed out');
      setTimeout(() => {
        router.push('/onboarding');
      }, 500);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            MasterFabric Remote
          </h1>
          <p className="text-xs text-gray-500">
            Remote configuration manager for feature flags, A/B tests, and app settings with real-time updates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push('/settings')}
            icon={Settings}
          >
            Settings
          </Button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

