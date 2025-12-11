import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { ConfigEditorClient } from './ConfigEditorClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // Since config pages require authentication and use client-side storage,
  // we'll use a generic metadata with the config ID
  return generateSEOMetadata({
    title: 'Configuration Editor - MasterFabric Remote',
    description: 'Edit and publish remote configurations for feature flags, A/B tests, and application settings.',
    path: `/config/${id}`,
    keywords: ['configuration editor', 'edit config', 'publish config'],
    noindex: true, // Config pages are typically private
    nofollow: true,
  });
}
export default async function ConfigEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ConfigEditorClient configId={id} />;
}

