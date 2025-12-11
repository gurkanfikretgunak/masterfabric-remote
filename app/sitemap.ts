import { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SEO_CONFIG.siteUrl;
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/onboarding`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Dashboard and settings are private pages, so we exclude them from sitemap
    // Config pages are dynamic and private, so they're also excluded
  ];
}
