'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Database, Code, Palette, Shield, Zap, Layers } from 'lucide-react';
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

  const handleContinue = async () => {
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
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        {!showContent ? (
          // Initial splash (3 seconds)
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
              MasterFabric Remote
            </h1>
          </div>
        ) : (
          // Content after 3 seconds
          <div className="w-full max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                MasterFabric Remote
              </h1>
              
              {/* Low opacity information */}
              <div className="space-y-2 opacity-40 max-w-2xl mx-auto">
                <p className="text-sm text-gray-600">
                  Manage feature flags, A/B tests, and application configurations across multiple tenants.
                </p>
                <p className="text-sm text-gray-600">
                  Built with Next.js, Supabase, and TypeScript for secure, real-time configuration management.
                </p>
              </div>
            </div>

            {/* Tech Stack Grid */}
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                Tech Stack
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Next.js Card */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src="/nextjs-logo-icon.svg"
                      alt="Next.js"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <h3 className="font-semibold text-gray-900">Next.js</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    React framework with server-side rendering and API routes.
                  </p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Server Components</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>App Router</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Optimized Performance</span>
                    </li>
                  </ul>
                </div>

                {/* Supabase Card */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src="/supabase-logo-icon.svg"
                      alt="Supabase"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <h3 className="font-semibold text-gray-900">Supabase</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Backend-as-a-Service with PostgreSQL database and authentication.
                  </p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>PostgreSQL Database</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Row Level Security</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Real-time Updates</span>
                    </li>
                  </ul>
                </div>

                {/* TypeScript Card */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src="/ts-logo-icon.svg"
                      alt="TypeScript"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <h3 className="font-semibold text-gray-900">TypeScript</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Type-safe JavaScript for better developer experience and reliability.
                  </p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Type Safety</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Better IDE Support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Compile-time Checks</span>
                    </li>
                  </ul>
                </div>

                {/* Tailwind CSS Card */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Palette className="w-6 h-6 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">Tailwind CSS</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Utility-first CSS framework for rapid UI development.
                  </p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Utility Classes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Responsive Design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Customizable Theme</span>
                    </li>
                  </ul>
                </div>

                {/* PostgreSQL Card */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="w-6 h-6 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">PostgreSQL</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Powerful open-source relational database with JSON support.
                  </p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>JSONB Support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>ACID Compliance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Scalable Architecture</span>
                    </li>
                  </ul>
                </div>

                {/* React Card */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Layers className="w-6 h-6 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">React</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Modern UI library for building interactive user interfaces.
                  </p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Component-Based</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Hooks & Context</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Server Components</span>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 opacity-60">
                Use one or all. Best of breed products. Integrated as a platform.
              </p>
            </div>

            {/* Button */}
            <div className="mb-8 text-center">
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
            <div className="flex items-center justify-center gap-2 flex-wrap text-sm text-gray-600">
              <span>Built with</span>
              <div className="flex items-center gap-1.5">
                <Image
                  src="/cursot-logo-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                <span className="font-medium">Cursor</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Image
                  src="/nextjs-logo-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                <span>Next.js</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Image
                  src="/supabase-logo-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                <span>Supabase</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Image
                  src="/ts-logo-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                <span>TypeScript</span>
              </div>
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

