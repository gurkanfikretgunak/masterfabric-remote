'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button, DangerButtonSolid } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useToast } from '@/lib/hooks/useToast';
import { getSupabaseClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/AuthService';
import { storage } from '@/lib/utils/storage';

export function DangerZoneCard() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const { warning } = useToast();

  const handleReset = async () => {
    try {
      const client = getSupabaseClient();
      const authService = new AuthService(client);
      await authService.signOut();
    } catch (err) {
      // Ignore errors
    }
    storage.clearAll();
    warning('Application reset. All local data cleared.');
    setTimeout(() => {
      router.push('/onboarding');
    }, 1000);
  };

  return (
    <Card className="border-red-200 bg-red-50/20">
      <div className="px-6 py-4 border-b border-red-200 flex items-center justify-between">
        <h2 className="text-sm font-medium text-red-700">Danger Zone</h2>
      </div>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Clear all local data and reset the application.
        </p>

        {confirming ? (
          <div className="flex items-center gap-3">
            <DangerButtonSolid onClick={handleReset} icon={Trash2}>
              Confirm Reset
            </DangerButtonSolid>
            <button
              onClick={() => setConfirming(false)}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-900 text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <Button
            variant="danger"
            onClick={() => setConfirming(true)}
            icon={Trash2}
          >
            Reset Application
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

