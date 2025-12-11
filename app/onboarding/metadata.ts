import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Setup MasterFabric Remote - Configuration Manager',
  description: 'Get started with MasterFabric Remote. Connect your Supabase project and start managing remote configurations for feature flags, A/B tests, and app settings.',
  path: '/onboarding',
  keywords: ['setup', 'onboarding', 'configuration', 'Supabase setup'],
});
