import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';

export function ConfigEditorSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              icon={ArrowLeft}
              disabled
              className="flex-shrink-0"
            >
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <Skeleton height="1rem" width="12rem" className="sm:h-5" />
          </div>
          <Skeleton height="2rem" width="8rem" className="rounded-lg hidden sm:block" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6 flex-1">
        {/* Editor Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Draft Panel Skeleton */}
          <div className="space-y-4">
            <Card>
              <CardHeader
                title="Draft"
                action={
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Skeleton height="2rem" width="4rem" className="rounded-md" />
                    <Skeleton height="2rem" width="5rem" className="rounded-md" />
                  </div>
                }
              />
              <CardContent>
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Skeleton height="16rem" className="w-full" />
                </div>
              </CardContent>
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <Skeleton height="2.5rem" width="6rem" className="rounded-lg" />
                <Skeleton height="2.5rem" width="5rem" className="rounded-lg" />
              </div>
            </Card>
          </div>

          {/* Published Panel Skeleton */}
          <div className="space-y-4">
            <Card className="border-green-200 bg-green-50/20">
              <CardHeader
                title="Published"
                titleColor="text-green-700"
                borderColor="border-green-200"
                action={<Skeleton height="0.875rem" width="8rem" />}
              />
              <div className="px-6 py-2 border-b border-green-200 bg-green-50/30">
                <Skeleton height="0.75rem" width="full" />
              </div>
              <CardContent>
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Skeleton height="16rem" className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Integration Section Skeleton */}
        <Card>
          <CardHeader title="API Integration" />
          <CardContent className="space-y-6">
            {/* Description */}
            <div className="pb-4 border-b border-gray-200">
              <SkeletonText lines={2} className="mb-2" />
            </div>

            {/* API Examples */}
            <div className="space-y-4">
              {/* Method 1: RPC Function */}
              <div>
                <Skeleton height="0.75rem" width="20rem" className="mb-2" />
                <Skeleton height="8rem" className="rounded-lg mb-2" />
                <div className="p-2 bg-green-50 border border-green-200 rounded">
                  <Skeleton height="0.75rem" width="16rem" />
                </div>
                <div className="mt-2">
                  <Skeleton height="0.75rem" width="6rem" className="mb-1" />
                  <Skeleton height="6rem" className="rounded-lg" />
                </div>
              </div>

              {/* Method 2: Table Endpoint */}
              <div>
                <Skeleton height="0.75rem" width="20rem" className="mb-2" />
                <Skeleton height="6rem" className="rounded-lg mb-2" />
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <Skeleton height="0.75rem" width="16rem" />
                </div>
                <div className="mt-2">
                  <Skeleton height="0.75rem" width="6rem" className="mb-1" />
                  <Skeleton height="6rem" className="rounded-lg" />
                </div>
              </div>
            </div>

            {/* API Key Information */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Skeleton height="0.75rem" width="10rem" className="mb-2" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton height="0.75rem" width="6rem" />
                  <Skeleton height="2rem" className="flex-1 rounded" />
                  <Skeleton height="1.75rem" width="1.75rem" className="rounded" />
                  <Skeleton height="1.75rem" width="1.75rem" className="rounded" />
                </div>
                <Skeleton height="0.75rem" width="full" />
              </div>
            </div>

            {/* Statistics */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Skeleton width="1rem" height="1rem" className="rounded" />
                <Skeleton height="1rem" width="6rem" />
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <Skeleton width="1rem" height="1rem" className="rounded" />
                <Skeleton height="1rem" width="8rem" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
