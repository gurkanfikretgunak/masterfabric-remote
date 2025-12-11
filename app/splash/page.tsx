'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { storage } from '@/lib/utils/storage';
import { createSupabaseClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/AuthService';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkConnection() {
      // Check for credentials in localStorage
      if (!storage.hasCredentials()) {
        router.replace('/onboarding');
        return;
      }

      const url = storage.getSupabaseUrl();
      const anonKey = storage.getSupabaseAnonKey();

      if (!url || !anonKey) {
        storage.clearCredentials();
        router.replace('/onboarding');
        return;
      }

      try {
        // Initialize temporary client
        const client = createSupabaseClient(url, anonKey);
        const authService = new AuthService(client);

        // Attempt authentication
        const { error } = await authService.signInWithDefaultCredentials();

        if (error) {
          // Auth failed - clear storage and redirect to onboarding
          storage.clearCredentials();
          router.replace('/onboarding');
          return;
        }

        // Success - redirect to dashboard
        router.replace('/dashboard');
      } catch (err) {
        // Any error - clear storage and redirect to onboarding
        storage.clearCredentials();
        router.replace('/onboarding');
      }
    }

    checkConnection();
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          MasterFabric Remote
        </h1>
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Checking connection...</span>
        </div>
      </div>
    </div>
  );
}

