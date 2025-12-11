export const SEO_CONFIG = {
  siteUrl: 'https://remote.masterfabric.co',
  siteName: 'MasterFabric Remote',
  defaultTitle: 'MasterFabric Remote - Multi-Tenant Remote Config Manager',
  defaultDescription: 'Manage feature flags, A/B tests, and application configurations across multiple tenants with a clean, intuitive interface. Built with Next.js and Supabase.',
  keywords: [
    'remote config',
    'feature flags',
    'configuration management',
    'multi-tenant',
    'A/B testing',
    'app configuration',
    'Supabase',
    'Next.js',
    'MasterFabric',
    'remote configuration manager',
  ],
  author: 'MasterFabric',
  ogImage: '/og-image.png',
  twitterHandle: '@masterfabric',
  locale: 'en_US',
  type: 'website',
} as const;

export const getAbsoluteUrl = (path: string = '') => {
  return `${SEO_CONFIG.siteUrl}${path}`;
};

export const getOgImageUrl = () => {
  return getAbsoluteUrl(SEO_CONFIG.ogImage);
};
