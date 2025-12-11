import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'MasterFabric Remote - Loading',
  description: 'Initializing MasterFabric Remote configuration manager...',
  path: '/splash',
  noindex: true, // Splash page is a redirect page
  nofollow: true,
});
