import type { ModuleDetail } from '@/types';
import type { MediaListItem } from '@/services/media.service';

function cleanupMediaTitle(value: string | null | undefined) {
  const source = value?.trim();
  if (!source) {
    return 'Video lesson';
  }

  return source
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildMediaModules(mediaItems: MediaListItem[] | undefined): ModuleDetail[] {
  if (!mediaItems?.length) {
    return [];
  }

  const lessons = mediaItems.map((item, index) => ({
    id: `media-${item.assetId || item.publicId || index}`,
    title: cleanupMediaTitle(item.originalFilename ?? item.publicId),
    lessonType: 'video' as const,
    durationSeconds: item.duration ? Math.max(0, Math.round(item.duration)) : 0,
    orderIndex: index + 1,
    isPreview: index === 0,
    videoUrl: item.playbackUrl ?? item.secureUrl,
    contentText: null,
    resources: [
      {
        id: `media-resource-${item.assetId || item.publicId || index}`,
        fileName: cleanupMediaTitle(item.originalFilename ?? item.publicId),
        fileUrl: item.playbackUrl ?? item.secureUrl,
        resourceType: 'video',
        orderIndex: 1,
      },
    ],
  }));

  return [
    {
      id: 'media-module',
      title: 'Thư viện video',
      orderIndex: 1,
      lessons,
    },
  ];
}
