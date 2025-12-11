'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/hooks/useToast';
import { getSupabaseClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/AuthService';
import { storage } from '@/lib/utils/storage';

type HealthStatus = 'healthy' | 'unhealthy' | 'checking';

export function Header() {
  const router = useRouter();
  const { info } = useToast();
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('checking');
  const [showHealthTooltip, setShowHealthTooltip] = useState(false);

  useEffect(() => {
    // Check health status on mount
    checkHealth();
    // Set up periodic health checks every 30 seconds
    const healthInterval = setInterval(checkHealth, 30000);
    return () => clearInterval(healthInterval);
  }, []);

  const checkHealth = async () => {
    const supabaseUrl = storage.getSupabaseUrl();
    const supabaseAnonKey = storage.getSupabaseAnonKey();
    
    if (!supabaseUrl || !supabaseAnonKey) {
      setHealthStatus('unhealthy');
      return;
    }

    try {
      setHealthStatus('checking');
      const client = getSupabaseClient();
      // Simple health check: try to query tenants table
      const { error } = await client
        .from('tenants')
        .select('id')
        .limit(1);
      
      if (error) {
        setHealthStatus('unhealthy');
      } else {
        setHealthStatus('healthy');
      }
    } catch (error) {
      setHealthStatus('unhealthy');
    }
  };

  const getHealthStatusText = () => {
    switch (healthStatus) {
      case 'healthy':
        return 'Supabase connection healthy';
      case 'unhealthy':
        return 'Supabase connection unhealthy';
      case 'checking':
        return 'Checking connection...';
    }
  };

  const getHealthDotColor = () => {
    switch (healthStatus) {
      case 'healthy':
        return 'bg-green-500';
      case 'unhealthy':
        return 'bg-red-500';
      case 'checking':
        return 'bg-yellow-500';
    }
  };

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
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            MasterFabric Remote
          </h1>
          <p className="text-xs text-gray-500 hidden sm:block">
            Remote configuration manager for feature flags, A/B tests, and app settings with real-time updates.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Health Check Status */}
          <div
            className="relative inline-flex items-center cursor-help"
            onMouseEnter={() => setShowHealthTooltip(true)}
            onMouseLeave={() => setShowHealthTooltip(false)}
          >
            <div className={`w-2 h-2 rounded-full ${getHealthDotColor()} animate-pulse`}></div>
            {showHealthTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
                {getHealthStatusText()}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            onClick={() => router.push('/settings')}
            icon={Settings}
            className="flex-1 sm:flex-initial"
          >
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            icon={LogOut}
            className="flex-1 sm:flex-initial"
          >
            <span className="hidden sm:inline">Sign Out</span>
            <span className="sm:hidden">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

