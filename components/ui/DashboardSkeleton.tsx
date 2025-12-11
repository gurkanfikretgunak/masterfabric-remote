import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6 flex-1">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton height="0.875rem" width="6rem" className="mb-2" />
                  <Skeleton height="2rem" width="4rem" />
                </div>
                <Skeleton width="2.5rem" height="2.5rem" className="rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Configurations Table Skeleton */}
        <Card className="mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <Skeleton height="0.875rem" width="6rem" />
            <Skeleton height="2.5rem" width="7rem" className="rounded-lg" />
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['Key Name', 'Tenant', 'Status', 'Requests', ''].map((_, i) => (
                      <th
                        key={i}
                        className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                          i === 4 ? 'text-right' : 'text-left'
                        }`}
                      >
                        <Skeleton height="0.75rem" width="4rem" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Skeleton height="1rem" width="8rem" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton height="1rem" width="6rem" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton height="1.5rem" width="5rem" className="rounded-full" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton height="1rem" width="4rem" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Skeleton height="1.5rem" width="1.5rem" className="rounded" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tenants Table Skeleton */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <Skeleton height="0.875rem" width="5rem" />
            <Skeleton height="2.5rem" width="7rem" className="rounded-lg" />
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['Tenant Name', 'Configs', 'Actions'].map((_, i) => (
                      <th
                        key={i}
                        className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                          i === 2 ? 'text-right' : 'text-left'
                        }`}
                      >
                        <Skeleton height="0.75rem" width="4rem" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((row) => (
                    <tr key={row} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Skeleton height="1rem" width="8rem" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton height="1rem" width="3rem" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Skeleton height="1.5rem" width="1.5rem" className="rounded" />
                          <Skeleton height="1.5rem" width="1.5rem" className="rounded" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
