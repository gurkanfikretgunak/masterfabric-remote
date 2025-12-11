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
        {/* Editor Panels Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {['Draft', 'Published'].map((title) => (
            <Card key={title}>
              <CardHeader
                title={title}
                action={
                  title === 'Draft' ? (
                    <div className="flex items-center gap-2">
                      <Skeleton height="2rem" width="4rem" className="rounded-md" />
                      <Skeleton height="2rem" width="5rem" className="rounded-md" />
                    </div>
                  ) : (
                    <Skeleton height="0.875rem" width="8rem" />
                  )
                }
              />
              <CardContent>
                <Skeleton height="16rem" className="rounded-lg border border-gray-200" />
              </CardContent>
              {title === 'Draft' && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-3">
                  <Skeleton height="2.5rem" width="6rem" className="rounded-lg" />
                  <Skeleton height="2.5rem" width="5rem" className="rounded-lg" />
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* API Integration Section Skeleton */}
        <Card>
          <CardHeader title="API Integration" />
          <CardContent className="space-y-6">
            {/* Description */}
            <div className="pb-4 border-b border-gray-200">
              <SkeletonText lines={2} />
            </div>

            {/* Endpoint URL */}
            <div>
              <Skeleton height="0.75rem" width="4rem" className="mb-2" />
              <Skeleton height="3rem" className="rounded-lg" />
            </div>

            {/* Code Example */}
            <div>
              <Skeleton height="0.75rem" width="6rem" className="mb-2" />
              <Skeleton height="10rem" className="rounded-lg" />
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Skeleton height="0.75rem" width="8rem" className="mb-2" />
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
            </div>

            {/* Statistics */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
              <Skeleton height="1rem" width="6rem" />
              <div className="h-4 w-px bg-gray-200" />
              <Skeleton height="1rem" width="8rem" />
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
