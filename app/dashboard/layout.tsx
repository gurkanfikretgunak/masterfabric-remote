import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Dashboard - MasterFabric Remote',
  description: 'Manage your remote configurations, tenants, and settings from the dashboard. View statistics, create new configurations, and monitor API usage.',
  path: '/dashboard',
  keywords: ['dashboard', 'configurations', 'tenants', 'statistics'],
  noindex: true, // Dashboard is typically private
  nofollow: true,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
