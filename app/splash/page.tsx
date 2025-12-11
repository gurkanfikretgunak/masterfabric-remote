'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { storage } from '@/lib/utils/storage';
import { createSupabaseClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/AuthService';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';

export default function SplashPage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Show logo for 3 seconds first
    const logoTimer = setTimeout(() => {
      setShowContent(true);
    }, 3000);

    return () => clearTimeout(logoTimer);
  }, []);

  useEffect(() => {
    if (!showContent) return;

    async function checkConnection() {
      setIsChecking(true);
      
      // Check for credentials in localStorage
      if (!storage.hasCredentials()) {
        router.replace('/onboarding');
        return;
      }

      // If the user explicitly signed out, keep the connection but don't auto-login.
      if (storage.isSignedOut()) {
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
          // Auth failed - keep connection so user can fix SQL/user, but stop auto-login.
          storage.setSignedOut(true);
          router.replace('/onboarding');
          return;
        }

        storage.setSignedOut(false);
        // Success - redirect to dashboard
        router.replace('/dashboard');
      } catch (err) {
        // Any error - keep connection so user can fix, but stop auto-login.
        storage.setSignedOut(true);
        router.replace('/onboarding');
      } finally {
        setIsChecking(false);
      }
    }

    checkConnection();
  }, [router, showContent]);

  const handleContinue = () => {
    if (storage.hasCredentials()) {
      router.replace('/dashboard');
    } else {
      router.replace('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        {!showContent ? (
          // Initial splash with logo (3 seconds)
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <Image
                src="/cursot-logo-icon.svg"
                alt="Cursor Logo"
                width={120}
                height={120}
                className="w-24 h-24 sm:w-32 sm:h-32"
                priority
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
              MasterFabric Remote
            </h1>
          </div>
        ) : (
          // Content after 3 seconds
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8">
              MasterFabric Remote
            </h1>
            
            {/* Low opacity information */}
            <div className="mb-8 space-y-2 opacity-40">
              <p className="text-sm text-gray-600">
                Manage feature flags, A/B tests, and application configurations across multiple tenants.
              </p>
              <p className="text-sm text-gray-600">
                Built with Next.js, Supabase, and TypeScript for secure, real-time configuration management.
              </p>
            </div>

            {/* Button */}
            <div className="mb-8">
              {isChecking ? (
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Checking connection...</span>
                </div>
              ) : (
                <Button onClick={handleContinue} variant="primary">
                  Continue
                </Button>
              )}
            </div>

            {/* Built with section */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>Built with</span>
              <Image
                src="/cursot-logo-icon.svg"
                alt=""
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span>Cursor</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      {showContent && (
        <Footer />
      )}
    </div>
  );
}

