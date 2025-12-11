import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Settings - MasterFabric Remote',
  description: 'Configure your MasterFabric Remote connection settings, manage your session, and update preferences.',
  path: '/settings',
  keywords: ['settings', 'configuration', 'preferences', 'connection'],
  noindex: true, // Settings page is typically private
  nofollow: true,
});
