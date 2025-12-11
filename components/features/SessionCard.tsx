'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useToast } from '@/lib/hooks/useToast';
import { getSupabaseClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/AuthService';
import { storage } from '@/lib/utils/storage';

export function SessionCard() {
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
    <Card>
      <CardHeader title="Session" />
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Logged in as:{' '}
          <span className="font-medium text-gray-900">
            masterfabric-developer@masterfabric.io
          </span>
        </p>
        <Button variant="secondary" onClick={handleSignOut} icon={LogOut}>
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}

