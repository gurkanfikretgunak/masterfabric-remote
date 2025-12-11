import { Metadata } from 'next';
import { SEO_CONFIG, getAbsoluteUrl, getOgImageUrl } from './constants';

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  image?: string;
  type?: 'website' | 'article' | 'profile';
}

export function generateMetadata({
  title,
  description,
  path = '',
  keywords,
  noindex = false,
  nofollow = false,
  image,
  type = 'website',
}: GenerateMetadataOptions): Metadata {
  const fullTitle = title
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.defaultTitle;
  
  const fullDescription = description || SEO_CONFIG.defaultDescription;
  const url = getAbsoluteUrl(path);
  const ogImage = image ? getAbsoluteUrl(image) : getOgImageUrl();
  
  const allKeywords = keywords
    ? [...SEO_CONFIG.keywords, ...keywords]
    : SEO_CONFIG.keywords;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords.join(', '),
    authors: [{ name: SEO_CONFIG.author }],
    creator: SEO_CONFIG.author,
    publisher: SEO_CONFIG.author,
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: SEO_CONFIG.locale,
      url,
      siteName: SEO_CONFIG.siteName,
      title: fullTitle,
      description: fullDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
      creator: SEO_CONFIG.twitterHandle,
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add verification codes here when available
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
    },
  };
}
